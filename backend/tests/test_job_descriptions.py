"""Integration tests for job description creation, normalization, and retrieval."""

import uuid
from starlette.testclient import TestClient


def test_valid_job_description_creation(client: TestClient) -> None:
    """Valid job description is normalized, stored, and returned with 201."""
    payload = {
        "title": "Staff Backend Engineer",
        "company_name": "Acme Corp",
        "description_text": (
            "We are seeking a Staff Backend Engineer to design and scale distributed microservices. "
            "You will be responsible for Python, PostgreSQL, Redis, Kubernetes, and high-throughput systems."
        ),
    }
    response = client.post("/api/v1/job-descriptions", json=payload)

    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["title"] == "Staff Backend Engineer"
    assert data["company_name"] == "Acme Corp"
    assert data["word_count"] > 15
    assert "distributed microservices" in data["description_text"]


def test_short_description_rejected(client: TestClient) -> None:
    """Job description with insufficient meaningful text (< 30 chars) is rejected."""
    payload = {
        "title": "Backend Dev",
        "company_name": "Test Co",
        "description_text": "Too short text.",
    }
    response = client.post("/api/v1/job-descriptions", json=payload)

    # Handled by Pydantic min_length or service validation
    assert response.status_code in (400, 422)


def test_whitespace_normalization(client: TestClient) -> None:
    """Excessive whitespace and redundant blank lines are cleaned."""
    payload = {
        "title": "  DevOps Engineer   ",
        "company_name": "  Cloud Inc  ",
        "description_text": (
            "Line 1 with extra spaces.   \n\n\n\n\n"
            "Line 2 with deep paragraphs.   \t\t\t\n"
            "Must have at least thirty characters of descriptive content."
        ),
    }
    response = client.post("/api/v1/job-descriptions", json=payload)

    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "DevOps Engineer"
    assert data["company_name"] == "Cloud Inc"
    assert "\n\n\n" not in data["description_text"]


def test_job_description_persistence_and_retrieval(client: TestClient) -> None:
    """Stored job description can be retrieved by UUID."""
    payload = {
        "title": "Lead Security Architect",
        "company_name": "Cyber Shield",
        "description_text": (
            "Lead our application security engineering team, enforce zero-trust architecture, "
            "and conduct penetration testing across cloud infrastructure."
        ),
    }
    create_res = client.post("/api/v1/job-descriptions", json=payload)
    assert create_res.status_code == 201
    jd_id = create_res.json()["id"]

    get_res = client.get(f"/api/v1/job-descriptions/{jd_id}")
    assert get_res.status_code == 200
    retrieved = get_res.json()
    assert retrieved["id"] == jd_id
    assert retrieved["title"] == "Lead Security Architect"
    assert retrieved["company_name"] == "Cyber Shield"


def test_nonexistent_job_description_returns_404(client: TestClient) -> None:
    """Retrieving a non-existent job description UUID returns 404."""
    random_id = str(uuid.uuid4())
    response = client.get(f"/api/v1/job-descriptions/{random_id}")

    assert response.status_code == 404
    assert f"'{random_id}' not found" in response.json()["detail"]
