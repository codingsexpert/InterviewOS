"""Integration contract defining data exchange between Phase 03 and Phase 04 AI Question Planner."""

import uuid
from pydantic import BaseModel, ConfigDict, Field


class InterviewSetupContract(BaseModel):
    """Normalized payload that feeds into the Phase 04 AI Question Planner.
    
    Data Flow:
      Resume Upload + Job Description
      -> Validation
      -> Text Extraction
      -> Database Storage
      -> AI Question Planner (Phase 04)
    """

    model_config = ConfigDict(from_attributes=True)

    resume_id: uuid.UUID = Field(..., description="Unique identifier of validated and stored resume")
    extracted_resume_text: str = Field(..., description="Clean, verified text extracted from resume")
    job_description_id: uuid.UUID = Field(..., description="Unique identifier of validated and stored job description")
    normalized_job_description_text: str = Field(..., description="Normalized target job description text")
    job_title: str = Field(..., description="Target job title")
    company_name: str | None = Field(None, description="Optional target company")
    readiness_status: str = Field(
        default="ready_for_planner",
        description="Status indicator verifying readiness for Phase 04 AI Question Planner",
    )
