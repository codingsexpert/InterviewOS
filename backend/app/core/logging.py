"""Structured logging configuration for InterviewOS backend."""

import logging
import sys
from app.core.config import settings


def setup_logging() -> logging.Logger:
    """Configure structured console logging."""
    log_format = "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
    log_level = logging.DEBUG if settings.DEBUG else logging.INFO

    logging.basicConfig(
        level=log_level,
        format=log_format,
        handlers=[logging.StreamHandler(sys.stdout)],
        force=True,
    )

    logger = logging.getLogger(settings.SERVICE_NAME)
    logger.setLevel(log_level)
    return logger


logger = setup_logging()
