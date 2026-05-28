class AppException(Exception):
    """Base application exception."""

    def __init__(self, detail: str = "An error occurred", status_code: int = 500):
        self.detail = detail
        self.status_code = status_code
        super().__init__(detail)


class UnauthorizedError(AppException):
    """Raised when user is not authorized."""

    def __init__(self, detail: str = "Unauthorized"):
        super().__init__(detail=detail, status_code=401)


class ForbiddenError(AppException):
    """Raised when user does not have permission."""

    def __init__(self, detail: str = "Forbidden"):
        super().__init__(detail=detail, status_code=403)


class NotFoundError(AppException):
    """Raised when a resource is not found."""

    def __init__(self, detail: str = "Not found"):
        super().__init__(detail=detail, status_code=404)


class BadRequestError(AppException):
    """Raised when request is invalid."""

    def __init__(self, detail: str = "Bad request"):
        super().__init__(detail=detail, status_code=400)