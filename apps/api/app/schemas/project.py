from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class ProjectBase(BaseModel):
    title: str
    status: Optional[str] = "draft"


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(ProjectBase):
    title: Optional[str] = None


class ProjectAttributes(BaseModel):
    title: str
    status: str
    chapter_count: int
    word_count: int
    created_at: datetime
    updated_at: datetime


class ProjectData(BaseModel):
    id: str
    type: str = "project"
    attributes: ProjectAttributes


class ProjectResponse(BaseModel):
    data: ProjectData


class ProjectListResponse(BaseModel):
    data: List[ProjectData]
    meta: dict


class ChapterBase(BaseModel):
    title: str
    content: Optional[str] = ""
    order: Optional[int] = 0
    status: Optional[str] = "draft"


class ChapterCreate(ChapterBase):
    pass


class ChapterUpdate(ChapterBase):
    title: Optional[str] = None


class ChapterAttributes(BaseModel):
    project_id: str
    title: str
    content: str
    order: int
    status: str
    word_count: int
    created_at: datetime
    updated_at: datetime


class ChapterData(BaseModel):
    id: str
    type: str = "chapter"
    attributes: ChapterAttributes


class ChapterResponse(BaseModel):
    data: ChapterData


class ChapterListResponse(BaseModel):
    data: List[ChapterData]
