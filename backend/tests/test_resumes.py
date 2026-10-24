"""Integration and unit tests for PDF resume upload, validation, and extraction."""

import io
import uuid
from pypdf import PdfWriter
from starlette.testclient import TestClient

SAMPLE_RESUME_PDF = b"""%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 124 >>
stream
BT
/F1 12 Tf
72 720 Td
(Alex Mercer Senior Full Stack Software Engineer React TypeScript Python FastAPI Docker PostgreSQL Microservices AWS Architecture) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000234 00000 n 
0000000408 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
486
%%EOF"""


def generate_blank_pdf() -> bytes:
    """Generate a valid PDF page with zero text to simulate scanned document."""
    writer = PdfWriter()
    writer.add_blank_page(width=612, height=792)
    buf = io.BytesIO()
    writer.write(buf)
    return buf.getvalue()


def generate_encrypted_pdf() -> bytes:
    """Generate an encrypted password-protected PDF."""
    writer = PdfWriter()
    writer.add_blank_page(width=612, height=792)
    writer.encrypt("topsecret")
    buf = io.BytesIO()
    writer.write(buf)
    return buf.getvalue()


def test_valid_pdf_upload_and_extraction(client: TestClient) -> None:
    """Valid PDF resume uploads, extracts text, and returns 201 with metadata."""
    files = {"file": ("alex_mercer_resume.pdf", SAMPLE_RESUME_PDF, "application/pdf")}
    response = client.post("/api/v1/resumes", files=files)

    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["original_filename"] == "alex_mercer_resume.pdf"
    assert data["processing_status"] == "completed"
    assert data["page_count"] == 1
    assert data["word_count"] > 10
    assert "Alex Mercer" in data["extracted_text"]
    assert "Senior Full Stack" in data["extracted_text"]
    assert data["warning_message"] is None


def test_non_pdf_file_rejected(client: TestClient) -> None:
    """Uploading non-PDF documents returns 400 Bad Request."""
    files = {"file": ("resume.txt", b"plain text resume", "text/plain")}
    response = client.post("/api/v1/resumes", files=files)

    assert response.status_code == 400
    assert "Only PDF documents" in response.json()["detail"]


def test_empty_file_rejected(client: TestClient) -> None:
    """Uploading an empty 0-byte file returns 400 Bad Request."""
    files = {"file": ("empty_resume.pdf", b"", "application/pdf")}
    response = client.post("/api/v1/resumes", files=files)

    assert response.status_code == 400
    assert "empty (0 bytes)" in response.json()["detail"]


def test_corrupted_pdf_rejected(client: TestClient) -> None:
    """Uploading a corrupted file without PDF magic bytes returns 422 Unprocessable Entity."""
    files = {"file": ("corrupt.pdf", b"This is not a real PDF file header", "application/pdf")}
    response = client.post("/api/v1/resumes", files=files)

    assert response.status_code == 422
    assert "not have a valid PDF header" in response.json()["detail"]


def test_oversized_file_rejected(client: TestClient) -> None:
    """Uploading a file exceeding 5MB limit returns 413 Entity Too Large."""
    # 5MB + 1000 bytes
    large_payload = b"%PDF-1.4\n" + (b"0" * (5 * 1024 * 1024 + 1000))
    files = {"file": ("large_resume.pdf", large_payload, "application/pdf")}
    response = client.post("/api/v1/resumes", files=files)

    assert response.status_code == 413
    assert "maximum upload limit" in response.json()["detail"]


def test_scanned_pdf_handled_gracefully(client: TestClient) -> None:
    """A valid PDF with no extractable text returns status 'scanned_no_text' and warning."""
    blank_pdf = generate_blank_pdf()
    files = {"file": ("scanned_resume.pdf", blank_pdf, "application/pdf")}
    response = client.post("/api/v1/resumes", files=files)

    assert response.status_code == 201
    data = response.json()
    assert data["processing_status"] == "scanned_no_text"
    assert data["warning_message"] is not None
    assert "scanned document" in data["warning_message"].lower()


def test_encrypted_pdf_rejected(client: TestClient) -> None:
    """A password-protected PDF returns 422 with a clear explanation."""
    enc_pdf = generate_encrypted_pdf()
    files = {"file": ("encrypted_resume.pdf", enc_pdf, "application/pdf")}
    response = client.post("/api/v1/resumes", files=files)

    assert response.status_code == 422
    assert "password-protected" in response.json()["detail"].lower()


def test_resume_persistence_and_retrieval(client: TestClient) -> None:
    """Uploaded resume can be retrieved by UUID."""
    files = {"file": ("persisted_resume.pdf", SAMPLE_RESUME_PDF, "application/pdf")}
    upload_res = client.post("/api/v1/resumes", files=files)
    assert upload_res.status_code == 201
    resume_id = upload_res.json()["id"]

    # Retrieve by UUID
    get_res = client.get(f"/api/v1/resumes/{resume_id}")
    assert get_res.status_code == 200
    retrieved = get_res.json()
    assert retrieved["id"] == resume_id
    assert retrieved["original_filename"] == "persisted_resume.pdf"
    assert "Alex Mercer" in retrieved["extracted_text"]


def test_nonexistent_resume_returns_404(client: TestClient) -> None:
    """Querying non-existent resume ID returns 404."""
    random_id = str(uuid.uuid4())
    response = client.get(f"/api/v1/resumes/{random_id}")

    assert response.status_code == 404
    assert f"'{random_id}' not found" in response.json()["detail"]
