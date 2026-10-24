"""Pydantic schemas for user profile and authentication endpoints."""

import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserResponse(BaseModel):
    """Public user profile schema."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: EmailStr
    name: str
    avatar_url: str | None = None
    role: str
    current_tier: str
    created_at: datetime
    last_login_at: datetime | None = None


class UserUpdate(BaseModel):
    """Schema for updating editable profile fields."""

    name: str | None = Field(None, min_length=1, max_length=100, description="Updated display name")


class TokenExchangeRequest(BaseModel):
    """Schema for exchanging authenticated Google identity claims for application JWT."""

    google_sub: str = Field(..., min_length=1, description="Google verified subject identifier")
    email: EmailStr = Field(..., description="Google verified email address")
    name: str = Field(..., min_length=1, max_length=255, description="User full name")
    avatar_url: str | None = Field(None, description="Google profile picture URL")


class TokenExchangeResponse(BaseModel):
    """Response containing signed application JWT and user profile."""

    access_token: str
    token_type: str = "bearer"
    user: UserResponse
