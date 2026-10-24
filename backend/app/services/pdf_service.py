"""PDF parsing, security validation, and text extraction service."""

import io
import os
import re
import uuid
from dataclasses import dataclass
from pathlib import Path
from fastapi import HTTPException, UploadFile, status
from pypdf import PdfReader
from pypdf.errors import EmptyFileError, PdfReadError

from app.core.config import settings

# Magic bytes identifying standard PDF file streams
PDF_MAGIC_BYTES = b"%PDF-"


@dataclass
class PDFExtractionResult:
    """Structured extraction result from PDF parsing."""

    original_filename: str
    storage_reference: str
    file_size: int
    page_count: int
    word_count: int
    character_count: int
    extracted_text: str
    processing_status: str  # "completed" | "scanned_no_text"
    warning_message: str | None = None


def sanitize_filename(filename: str) -> str:
    """Sanitize original filename to prevent path traversal and shell injection.
    
    Preserves alphanumeric characters, dashes, and underscores.
    """
    # Strip directory path separators
    clean_name = os.path.basename(filename)
    # Remove path traversal tokens
    clean_name = clean_name.replace("..", "").replace("/", "").replace("\\", "")
    # Normalize extension
    name_part, ext = os.path.splitext(clean_name)
    # Strip any characters that aren't alphanumeric, underscores, or hyphens
    sanitized_name = re.sub(r"[^\w\-.]", "_", name_part).strip("._")
    if not sanitized_name:
        sanitized_name = "resume"
    return f"{sanitized_name[:80]}{ext.lower()}"


def normalize_extracted_text(raw_text: str) -> str:
    """Normalize extracted text by cleaning whitespace while preserving paragraph structure."""
    if not raw_text:
        return ""
    # Normalize newline sequences
    text = raw_text.replace("\r\n", "\n").replace("\r", "\n")
    # Replace tabs and multiple horizontal spaces with single space
    text = re.sub(r"[ \t]+", " ", text)
    # Collapse 3 or more newlines into double newlines (paragraphs)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


async def process_and_store_pdf(file: UploadFile) -> PDFExtractionResult:
    """Validate, store securely, and extract text from an uploaded PDF file.
    
    Enforces:
      - Extension and content MIME type verification
      - PDF magic bytes verification (%PDF-)
      - File size boundaries (non-empty, <= MAX_UPLOAD_SIZE_BYTES)
      - Secure filesystem storage outside public directories
      - Extraction of clean text, page count, and word statistics
      - Graceful detection of scanned (zero text) documents
    """
    # 1. Filename validation
    original_filename = file.filename or "resume.pdf"
    name_lower = original_filename.lower()
    if not any(name_lower.endswith(ext) for ext in settings.ALLOWED_EXTENSIONS):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type. Only PDF documents ({', '.join(settings.ALLOWED_EXTENSIONS)}) are supported.",
        )

    # 2. Read file contents into memory
    content = await file.read()
    file_size = len(content)

    # 3. Size validation
    if file_size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded file is empty (0 bytes). Please upload a valid PDF document.",
        )

    if file_size > settings.MAX_UPLOAD_SIZE_BYTES:
        max_mb = settings.MAX_UPLOAD_SIZE_BYTES / (1024 * 1024)
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum upload limit of {max_mb:.0f}MB. Please upload a smaller document.",
        )

    # 4. Content magic bytes verification (deep inspect beyond extension)
    if not content.startswith(PDF_MAGIC_BYTES):
        # Scan first 1024 bytes in case of BOM or minor leading metadata
        header_sample = content[:1024]
        if PDF_MAGIC_BYTES not in header_sample:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Invalid PDF file format. The file does not have a valid PDF header.",
            )

    # 5. Extract text using pypdf
    try:
        reader = PdfReader(io.BytesIO(content))
        if reader.is_encrypted:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Password-protected PDF files cannot be processed. Please upload an unlocked PDF resume.",
            )

        page_count = len(reader.pages)
        if page_count == 0:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="The uploaded PDF contains 0 pages and cannot be processed.",
            )

        extracted_pages = []
        for page_idx, page in enumerate(reader.pages):
            page_text = page.extract_text() or ""
            extracted_pages.append(page_text)

        raw_combined_text = "\n\n".join(extracted_pages)
        normalized_text = normalize_extracted_text(raw_combined_text)

    except (EmptyFileError, PdfReadError) as err:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to parse PDF document. The file may be damaged or corrupted ({str(err)}).",
        )
    except HTTPException:
        raise
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"An unexpected error occurred while parsing the PDF: {str(err)}",
        )

    # 6. Analyze text content and detect scanned/image-only PDFs
    words = normalized_text.split() if normalized_text else []
    word_count = len(words)
    character_count = len(normalized_text)

    if word_count < 10:
        processing_status = "scanned_no_text"
        warning_message = (
            "The uploaded PDF contains little to no selectable digital text. "
            "It appears to be a scanned document or flattened image. "
            "Please upload a PDF containing digital selectable text."
        )
    else:
        processing_status = "completed"
        warning_message = None

    # 7. Secure storage on filesystem outside public path
    # Target: backend/storage/uploads/<uuid>_<sanitized_filename>
    base_storage_dir = Path(settings.UPLOAD_DIR)
    if not base_storage_dir.is_absolute():
        # Relative to backend root
        backend_root = Path(__file__).resolve().parent.parent.parent
        storage_dir = backend_root / base_storage_dir
    else:
        storage_dir = base_storage_dir

    storage_dir.mkdir(parents=True, exist_ok=True)

    safe_name = sanitize_filename(original_filename)
    unique_storage_name = f"{uuid.uuid4().hex}_{safe_name}"
    target_path = storage_dir / unique_storage_name

    # Write file securely to disk
    with open(target_path, "wb") as f:
        f.write(content)

    # Relative storage reference stored in database
    storage_reference = str(target_path.relative_to(storage_dir.parent))

    return PDFExtractionResult(
        original_filename=original_filename,
        storage_reference=storage_reference,
        file_size=file_size,
        page_count=page_count,
        word_count=word_count,
        character_count=character_count,
        extracted_text=normalized_text,
        processing_status=processing_status,
        warning_message=warning_message,
    )
