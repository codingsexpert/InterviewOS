"""Automated tests for Google OAuth token exchange, authentication, and profile endpoints."""

from datetime import datetime, timedelta, timezone
import uuid
import jwt
import pytest
from starlette.testclient import TestClient
from app.core.config import settings
from app.core.security import create_access_token


def test_unauthenticated_access_rejected(client: TestClient) -> None:
    """Verify that requests without token to protected endpoints return 401."""
    response = client.get("/api/v1/users/me")
    assert response.status_code == 401
    assert "credentials were not provided" in response.json()["detail"]


def test_invalid_token_signature_rejected(client: TestClient) -> None:
    """Verify that tokens signed with the wrong key return 401."""
    fake_token = jwt.encode(
        {"sub": str(uuid.uuid4()), "iss": settings.JWT_ISSUER, "aud": settings.JWT_AUDIENCE},
        "wrong-secret-key-that-does-not-match",
        algorithm="HS256",
    )
    response = client.get("/api/v1/users/me", headers={"Authorization": f"Bearer {fake_token}"})
    assert response.status_code == 401
    assert "Could not validate credentials" in response.json()["detail"]


def test_expired_token_rejected(client: TestClient) -> None:
    """Verify that expired tokens return 401."""
    expired_time = datetime.now(timezone.utc) - timedelta(minutes=10)
    expired_token = jwt.encode(
        {
            "sub": str(uuid.uuid4()),
            "iss": settings.JWT_ISSUER,
            "aud": settings.JWT_AUDIENCE,
            "iat": int((expired_time - timedelta(minutes=5)).timestamp()),
            "exp": int(expired_time.timestamp()),
        },
        settings.AUTH_SECRET,
        algorithm=settings.JWT_ALGORITHM,
    )
    response = client.get("/api/v1/users/me", headers={"Authorization": f"Bearer {expired_token}"})
    assert response.status_code == 401
    assert "Token has expired" in response.json()["detail"]


def test_invalid_issuer_or_audience_rejected(client: TestClient) -> None:
    """Verify that tokens with wrong issuer or audience return 401."""
    # Wrong issuer
    bad_issuer_token = jwt.encode(
        {"sub": str(uuid.uuid4()), "iss": "untrusted-issuer", "aud": settings.JWT_AUDIENCE},
        settings.AUTH_SECRET,
        algorithm=settings.JWT_ALGORITHM,
    )
    res1 = client.get("/api/v1/users/me", headers={"Authorization": f"Bearer {bad_issuer_token}"})
    assert res1.status_code == 401
    assert "Invalid token issuer" in res1.json()["detail"]

    # Wrong audience
    bad_aud_token = jwt.encode(
        {"sub": str(uuid.uuid4()), "iss": settings.JWT_ISSUER, "aud": "wrong-audience"},
        settings.AUTH_SECRET,
        algorithm=settings.JWT_ALGORITHM,
    )
    res2 = client.get("/api/v1/users/me", headers={"Authorization": f"Bearer {bad_aud_token}"})
    assert res2.status_code == 401
    assert "Invalid token audience" in res2.json()["detail"]


def test_first_login_provisions_user_and_repeat_login_idempotent(client: TestClient) -> None:
    """Verify first login creates exactly one user in DB, and repeat login updates without duplicates."""
    test_sub = f"google_test_sub_{uuid.uuid4().hex[:12]}"
    test_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
    payload = {
        "google_sub": test_sub,
        "email": test_email,
        "name": "Alex Candidate",
        "avatar_url": "https://example.com/avatar.png",
    }

    # 1. First login: creates new user
    res1 = client.post("/api/v1/auth/google", json=payload)
    assert res1.status_code == 200
    data1 = res1.json()
    assert "access_token" in data1
    user1 = data1["user"]
    assert user1["email"] == test_email
    assert user1["name"] == "Alex Candidate"
    user_id = user1["id"]

    # 2. Repeat login with updated name: must update existing user and NOT create duplicate
    payload_repeat = {
        "google_sub": test_sub,
        "email": test_email,
        "name": "Alex Candidate Senior",
        "avatar_url": "https://example.com/avatar_new.png",
    }
    res2 = client.post("/api/v1/auth/google", json=payload_repeat)
    assert res2.status_code == 200
    data2 = res2.json()
    user2 = data2["user"]
    assert user2["id"] == user_id  # Same unique ID!
    assert user2["name"] == "Alex Candidate Senior"


def test_authenticated_profile_access_and_patch(client: TestClient) -> None:
    """Verify GET /api/v1/users/me and PATCH /api/v1/users/me for the authenticated user."""
    test_sub = f"google_profile_sub_{uuid.uuid4().hex[:12]}"
    test_email = f"profile_{uuid.uuid4().hex[:8]}@example.com"

    # Provision user and obtain token
    auth_res = client.post(
        "/api/v1/auth/google",
        json={
            "google_sub": test_sub,
            "email": test_email,
            "name": "Taylor Engineer",
            "avatar_url": None,
        },
    )
    token = auth_res.json()["access_token"]
    auth_headers = {"Authorization": f"Bearer {token}"}

    # 1. GET /api/v1/users/me
    get_res = client.get("/api/v1/users/me", headers=auth_headers)
    assert get_res.status_code == 200
    profile = get_res.json()
    assert profile["email"] == test_email
    assert profile["name"] == "Taylor Engineer"
    assert profile["role"] == "candidate"

    # 2. PATCH /api/v1/users/me
    patch_res = client.patch(
        "/api/v1/users/me",
        headers=auth_headers,
        json={"name": "Taylor Staff Engineer"},
    )
    assert patch_res.status_code == 200
    updated_profile = patch_res.json()
    assert updated_profile["name"] == "Taylor Staff Engineer"

    # Verify update persisted
    verify_res = client.get("/api/v1/users/me", headers=auth_headers)
    assert verify_res.status_code == 200
    assert verify_res.json()["name"] == "Taylor Staff Engineer"
