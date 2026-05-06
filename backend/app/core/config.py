import os
from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Delivery API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"

    DATABASE_URL: Optional[str] = os.getenv(
        "DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/delivery"
    )

    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    M_PESA_CONSUMER_KEY: str = os.getenv("M_PESA_CONSUMER_KEY", "")
    M_PESA_CONSUMER_SECRET: str = os.getenv("M_PESA_CONSUMER_SECRET", "")
    M_PESA_SHORTCODE: str = os.getenv("M_PESA_SHORTCODE", "")
    M_PESA_PASSKEY: str = os.getenv("M_PESA_PASSKEY", "")

    MAPBOX_ACCESS_TOKEN: str = os.getenv("MAPBOX_ACCESS_TOKEN", "")
    OPENCAGE_API_KEY: str = os.getenv("OPENCAGE_API_KEY", "")

    CLOUDINARY_CLOUD_NAME: str = os.getenv("CLOUDINARY_CLOUD_NAME", "")
    CLOUDINARY_API_KEY: str = os.getenv("CLOUDINARY_API_KEY", "")
    CLOUDINARY_API_SECRET: str = os.getenv("CLOUDINARY_API_SECRET", "")

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
