"""
schemas.py
Pydantic models for API request validation and response serialization.
"""
from typing import List, Optional
from pydantic import BaseModel, Field


class JobCreate(BaseModel):
    job_id: Optional[str] = Field(None, description="Unique job ID. Generated automatically if omitted.")
    title: str = Field(..., example="SSC CGL 2026 Examination")
    department: str = Field(..., example="Staff Selection Commission")
    category: str = Field(..., example="SSC")
    location: str = Field(..., example="All India")
    qualification: str = Field(..., example="Bachelor's Degree")
    post_date: str = Field(..., example="2026-08-01", description="Posting date in YYYY-MM-DD format")
    deadline: str = Field(..., example="2026-08-30", description="Application deadline in YYYY-MM-DD format")
    apply_link: str = Field(..., example="https://ssc.nic.in/apply")
    vacancies: int = Field(0, example=5000)


class JobResponse(BaseModel):
    job_id: str
    title: str
    department: str
    category: str
    location: str
    qualification: str
    post_date: str
    deadline: str
    apply_link: str
    vacancies: int
    days_left: int


class JobListResponse(BaseModel):
    total: int
    algorithm_used: str
    execution_time_ms: float
    jobs: List[JobResponse]


class EmailAlertRequest(BaseModel):
    to_email: str = Field(..., example="user@example.com")
    within_days: int = Field(7, ge=1, le=60, example=7)


class EmailAlertResponse(BaseModel):
    success: bool
    message: str
    alerts_count: int


class TrackerStatsResponse(BaseModel):
    total_jobs: int
    pending_in_alert_heap: int
