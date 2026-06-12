"""Domain and infrastructure errors (mapped to HTTP in the API layer)."""


class AppError(Exception):
    """Base error with a stable machine-readable code."""

    code: str = "app_error"

    def __init__(self, code: str, message: str):
        self.code = code
        self.message = message
        super().__init__(message)


class CaptionError(AppError):
    pass


class GlossTranslationError(AppError):
    pass
