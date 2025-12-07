from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.database import engine, Base
from app.routes import projects

settings = get_settings()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
)

# CORS middleware
if settings.cors_enabled:
    origins = settings.allowed_origins.split(",")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=settings.cors_allow_credentials,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include routers
app.include_router(projects.router)


@app.get("/health")
def health_check():
    return {"status": "ok", "message": "API is running"}


@app.get("/")
def root():
    return {"message": "The Brain API", "version": "0.1.0"}
