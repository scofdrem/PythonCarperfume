import logging
import os
from typing import Any

from pydantic_settings import BaseSettings

logger = logging.getLogger(__name__)


def _get_env_file_path() -> str:
    """Find .env file path based on project structure."""
    # backend/core/config.py -> backend -> app/ (project root)
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(os.path.dirname(current_dir))

    # Check for .env in project root first
    env_path = os.path.join(project_root, ".env")
    if os.path.exists(env_path):
        return env_path

    # Check for .env in current directory
    local_env = os.path.join(current_dir, ".env")
    if os.path.exists(local_env):
        return local_env

    # Return relative .env as fallback
    return ".env"


class Settings(BaseSettings):
    # Application
    app_name: str = "FastAPI Modular Template"
    debug: bool = False
    version: str = "1.0.0"

    # Server
    host: str = "0.0.0.0"
    port: int = 8000

    # Database
    database_url: str = "sqlite+aiosqlite:///./app.db"

    # JWT Auth
    jwt_secret_key: str = ""  # REQUIRED in .env — no default
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 30
    access_token_expire_minutes: int = 15

    # Security
    max_failed_login_attempts: int = 5
    lockout_duration_minutes: int = 30

    # CORS
    allowed_origins: str = "http://localhost:5173,http://localhost:3000"

    # Admin
    admin_user_id: str = ""
    admin_user_email: str = ""

    # AWS Lambda Configuration
    is_lambda: bool = False
    lambda_function_name: str = "fastapi-backend"
    aws_region: str = "us-east-1"

    @property
    def is_production(self) -> bool:
        env = os.getenv("ENVIRONMENT", "prod").lower()
        return env not in ("dev", "development", "staging")

    @property
    def cors_allow_origins(self) -> list[str]:
        if not self.allowed_origins:
            return ["http://localhost:5173"]
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    @property
    def backend_url(self) -> str:
        """Generate backend URL from host and port."""
        if self.is_lambda:
            return os.environ.get(
                "PYTHON_BACKEND_URL", f"https://{self.lambda_function_name}.execute-api.{self.aws_region}.amazonaws.com"
            )
        else:
            display_host = "127.0.0.1" if self.host == "0.0.0.0" else self.host
            return os.environ.get("PYTHON_BACKEND_URL", f"http://{display_host}:{self.port}")

    class Config:
        case_sensitive = False
        extra = "ignore"
        env_file = _get_env_file_path()
        env_file_encoding = "utf-8"

    def __getattr__(self, name: str) -> Any:
        """
        Dynamically read attributes from environment variables.
        """
        env_var_name = name.upper()
        if env_var_name in os.environ:
            value = os.environ[env_var_name]
            self.__dict__[name] = value
            logger.debug(f"Read dynamic attribute {name} from environment variable {env_var_name}")
            return value
        raise AttributeError(f"'{self.__class__.__name__}' object has no attribute '{name}'")


# Global settings instance
settings = Settings()