from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.project import Project, Chapter
from app.schemas.project import (
    ProjectCreate,
    ProjectResponse,
    ProjectListResponse,
    ProjectData,
    ProjectAttributes,
    ChapterCreate,
    ChapterListResponse,
    ChapterData,
    ChapterAttributes,
)

router = APIRouter(prefix="/api/v1", tags=["projects"])


def count_words(text: str) -> int:
    """Simple word counter"""
    return len(text.split())


@router.get("/projects", response_model=ProjectListResponse)
def get_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).all()
    
    data = []
    for project in projects:
        chapters = db.query(Chapter).filter(Chapter.project_id == project.id).all()
        chapter_count = len(chapters)
        word_count = sum(count_words(ch.content) for ch in chapters)
        
        data.append(
            ProjectData(
                id=str(project.id),
                type="project",
                attributes=ProjectAttributes(
                    title=project.title,
                    status=project.status,
                    chapter_count=chapter_count,
                    word_count=word_count,
                    created_at=project.created_at,
                    updated_at=project.updated_at,
                ),
            )
        )
    
    return ProjectListResponse(
        data=data,
        meta={
            "pagination": {
                "page": 1,
                "limit": 20,
                "total": len(data),
                "pages": 1,
            }
        },
    )


@router.post("/projects", response_model=ProjectResponse, status_code=201)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    db_project = Project(title=project.title, status=project.status)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    
    return ProjectResponse(
        data=ProjectData(
            id=str(db_project.id),
            type="project",
            attributes=ProjectAttributes(
                title=db_project.title,
                status=db_project.status,
                chapter_count=0,
                word_count=0,
                created_at=db_project.created_at,
                updated_at=db_project.updated_at,
            ),
        )
    )


@router.get("/projects/{project_id}", response_model=ProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    chapters = db.query(Chapter).filter(Chapter.project_id == project.id).all()
    chapter_count = len(chapters)
    word_count = sum(count_words(ch.content) for ch in chapters)
    
    return ProjectResponse(
        data=ProjectData(
            id=str(project.id),
            type="project",
            attributes=ProjectAttributes(
                title=project.title,
                status=project.status,
                chapter_count=chapter_count,
                word_count=word_count,
                created_at=project.created_at,
                updated_at=project.updated_at,
            ),
        )
    )


@router.get("/projects/{project_id}/chapters", response_model=ChapterListResponse)
def get_chapters(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    chapters = db.query(Chapter).filter(Chapter.project_id == project_id).order_by(Chapter.order).all()
    
    data = []
    for chapter in chapters:
        data.append(
            ChapterData(
                id=str(chapter.id),
                type="chapter",
                attributes=ChapterAttributes(
                    project_id=str(chapter.project_id),
                    title=chapter.title,
                    content=chapter.content,
                    order=chapter.order,
                    status=chapter.status,
                    word_count=count_words(chapter.content),
                    created_at=chapter.created_at,
                    updated_at=chapter.updated_at,
                ),
            )
        )
    
    return ChapterListResponse(data=data)


@router.post("/projects/{project_id}/chapters", status_code=201)
def create_chapter(project_id: int, chapter: ChapterCreate, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db_chapter = Chapter(
        project_id=project_id,
        title=chapter.title,
        content=chapter.content,
        order=chapter.order,
        status=chapter.status,
    )
    db.add(db_chapter)
    db.commit()
    db.refresh(db_chapter)
    
    return {
        "data": {
            "id": str(db_chapter.id),
            "type": "chapter",
            "attributes": {
                "project_id": str(db_chapter.project_id),
                "title": db_chapter.title,
                "content": db_chapter.content,
                "order": db_chapter.order,
                "status": db_chapter.status,
                "word_count": count_words(db_chapter.content),
                "created_at": db_chapter.created_at,
                "updated_at": db_chapter.updated_at,
            },
        }
    }
