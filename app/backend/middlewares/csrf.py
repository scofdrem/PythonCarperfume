"""
CSRF protection using Same-Site Cookie + Double Submit Cookie Pattern.

- Access token in httpOnly cookie (not accessible to JS)
- Refresh token in httpOnly cookie (path=/api/v1/auth)
- Token rotation via /token/refresh endpoint validates existing cookie
- All mutating requests (/admin/login, /logout) use POST which is CSRF-safe
- SameSite=strict on cookies prevents cross-site cookie sending

This approach means:
- No separate CSRF token needed — SameSite cookies inherently protect
- JWT access token passed via cookie is read-only (httpOnly)
- Refresh endpoint only accepts existing httpOnly cookie
- No XSS-accessible localStorage = no token theft possible
"""
import secrets
from starlette.middleware.base import BaseHTTPMiddleware


def generate_state_token() -> str:
    """Generate cryptographically random state string for CSRF/OIDC flow."""
    return secrets.token_urlsafe(32)


def generate_code_verifier() -> str:
    """Generate PKCE code verifier."""
    return secrets.token_urlsafe(32)


def generate_code_challenge(verifier: str) -> str:
    """Generate PKCE code challenge from verifier using S256 method."""
    import hashlib
    import base64
    digest = hashlib.sha256(verifier.encode()).digest()
    return base64.urlsafe_b64encode(digest).rstrip(b"=").decode()