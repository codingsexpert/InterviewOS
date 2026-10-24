"""Authentication security, JWT generation, and cryptographic token verification."""

from datetime import datetime, timedelta, timezone
from typing import Any, Dict
import jwt
from jwt.exceptions import (
    ExpiredSignatureError,
    InvalidAudienceError,
    InvalidIssuerError,
    InvalidTokenError,
)
from app.core.config import settings
from app.core.logging import logger


class AuthenticationError(Exception):
    """Custom exception raised when token validation fails."""

    def __init__(self, message: str, code: str = "invalid_token"):
        self.message = message
        self.code = code
        super().__init__(self.message)


def create_access_token(
    subject: str,
    claims: Dict[str, Any] | None = None,
    expires_delta: timedelta | None = None,
) -> str:
    """Generate a cryptographically signed application JWT token."""
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    payload: Dict[str, Any] = {
        "sub": subject,
        "iss": settings.JWT_ISSUER,
        "aud": settings.JWT_AUDIENCE,
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
    }
    if claims:
        payload.update(claims)

    encoded_jwt = jwt.encode(
        payload,
        settings.AUTH_SECRET,
        algorithm=settings.JWT_ALGORITHM,
    )
    return encoded_jwt


def decode_access_token(token: str) -> Dict[str, Any]:
    """Decode and validate an application JWT token verifying signature, issuer, audience, and exp.
    
    Raises:
        AuthenticationError: If token is expired, has invalid signature, or wrong claims.
    """
    try:
        payload = jwt.decode(
            token,
            settings.AUTH_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
            audience=settings.JWT_AUDIENCE,
            issuer=settings.JWT_ISSUER,
        )
        return payload
    except ExpiredSignatureError:
        logger.warning("Token validation failed: Token has expired.")
        raise AuthenticationError("Token has expired.", code="token_expired")
    except InvalidAudienceError:
        logger.warning("Token validation failed: Invalid audience.")
        raise AuthenticationError("Invalid token audience.", code="invalid_audience")
    except InvalidIssuerError:
        logger.warning("Token validation failed: Invalid issuer.")
        raise AuthenticationError("Invalid token issuer.", code="invalid_issuer")
    except InvalidTokenError as exc:
        logger.warning(f"Token validation failed: {str(exc)}")
        raise AuthenticationError("Could not validate credentials.", code="invalid_token")
