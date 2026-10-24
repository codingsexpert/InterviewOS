"""Automated tests for health check and database readiness endpoints."""

from unittest.mock import patch
from starlette.testclient import TestClient


def test_health_check_endpoint(client: TestClient) -> None:
    """Verify that GET /api/v1/health returns 200 with status ok."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data == {
        "status": "ok",
        "service": "interviewos-api",
    }


def test_database_health_check_connected(client: TestClient) -> None:
    """Verify that GET /api/v1/health/db returns 200 and connected status with real database."""
    response = client.get("/api/v1/health/db")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "interviewos-api"
    assert data["database"] == "connected"
    assert "verified successfully" in data["message"]


def test_database_health_check_unreachable(client: TestClient) -> None:
    """Verify that GET /api/v1/health/db returns 503 when database is unreachable or error occurs."""
    with patch(
        "app.api.v1.endpoints.health.check_db_connectivity",
        return_value=(False, "Connection to database failed simulated error"),
    ):
        response = client.get("/api/v1/health/db")
        assert response.status_code == 503
        data = response.json()
        assert data["status"] == "error"
        assert data["service"] == "interviewos-api"
        assert data["database"] == "unreachable"
        assert "simulated error" in data["message"]


def test_root_endpoint(client: TestClient) -> None:
    """Verify root information endpoint returns service metadata."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "interviewos-api"
    assert data["api"] == "/api/v1"
