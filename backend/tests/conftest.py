"""Pytest configuration and HTTP client fixtures."""

import sys
import os
import pytest
from starlette.testclient import TestClient

# Set up python path for backend
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app


@pytest.fixture
def client() -> TestClient:
    """Provide a synchronous TestClient configured for ASGI testing."""
    with TestClient(app=app, base_url="http://testserver") as test_client:
        yield test_client
