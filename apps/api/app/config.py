from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Application
    app_name: str = "The Brain API"
    app_env: str = "development"
    debug: bool = True
    log_level: str = "info"
    
    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    allowed_origins: str = "http://localhost:3000"
    
    # Database
    database_url: str = "sqlite:///./local.db"
    
    # Authentication
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_expiration: int = 3600
    
    # CORS
    cors_enabled: bool = True
    cors_allow_credentials: bool = True
    
    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
