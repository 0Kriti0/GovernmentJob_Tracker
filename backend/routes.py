"""
routes.py
FastAPI router definition connecting REST API requests directly to the JobTracker engine.
"""
import time
from datetime import datetime, date
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, Request, status

from job import Job
from alert import send_email_alert
from backend.schemas import (
    JobCreate,
    JobResponse,
    JobListResponse,
    EmailAlertRequest,
    EmailAlertResponse,
    TrackerStatsResponse,
)

router = APIRouter(prefix="/api", tags=["Government Job Tracker API"])


def get_tracker(request: Request):
    """Retrieve singleton JobTracker instance attached to app state."""
    return request.app.state.tracker


def job_to_response(job: Job) -> JobResponse:
    """Convert Job dataclass to Pydantic response schema."""
    return JobResponse(
        job_id=job.job_id,
        title=job.title,
        department=job.department,
        category=job.category,
        location=job.location,
        qualification=job.qualification,
        post_date=job.post_date.isoformat(),
        deadline=job.deadline.isoformat(),
        apply_link=job.apply_link,
        vacancies=job.vacancies,
        days_left=job.days_left(),
    )


@router.get("/jobs", response_model=JobListResponse)
def get_all_jobs(
    request: Request,
    sorted_by_deadline: bool = Query(False, description="Sort jobs by deadline using custom Merge Sort algorithm"),
    category: Optional[str] = Query(None, description="Filter jobs by category"),
):
    start = time.perf_counter()
    tracker = get_tracker(request)

    if sorted_by_deadline:
        jobs = tracker.all_jobs_sorted_by_deadline()  # Custom Merge Sort
        algo = "Merge Sort (O(n log n))"
    else:
        jobs = list(tracker.jobs_by_id.values())      # Hash Map
        algo = "Hash Map Lookup (O(1))"

    if category:
        category_lower = category.strip().lower()
        jobs = [j for j in jobs if j.category.lower() == category_lower]

    exec_time = round((time.perf_counter() - start) * 1000, 3)

    return JobListResponse(
        total=len(jobs),
        algorithm_used=algo,
        execution_time_ms=exec_time,
        jobs=[job_to_response(j) for j in jobs],
    )


@router.get("/jobs/search", response_model=JobListResponse)
def search_jobs(
    request: Request,
    q: str = Query(..., min_length=1, description="Keyword / prefix search string"),
):
    start = time.perf_counter()
    tracker = get_tracker(request)

    # Prefix search using custom Trie tree
    matched_jobs = tracker.search(q)
    exec_time = round((time.perf_counter() - start) * 1000, 3)

    return JobListResponse(
        total=len(matched_jobs),
        algorithm_used="Trie (Prefix Tree - O(L))",
        execution_time_ms=exec_time,
        jobs=[job_to_response(j) for j in matched_jobs],
    )


@router.get("/jobs/closing-soon", response_model=JobListResponse)
def get_jobs_closing_soon(
    request: Request,
    days: int = Query(7, ge=1, le=365, description="Number of days to check for upcoming deadline"),
):
    start = time.perf_counter()
    tracker = get_tracker(request)

    # Range query using Merge Sort + Binary Search
    closing_jobs = tracker.closing_within(days)
    exec_time = round((time.perf_counter() - start) * 1000, 3)

    return JobListResponse(
        total=len(closing_jobs),
        algorithm_used="Binary Search on Merge-Sorted List (O(log n))",
        execution_time_ms=exec_time,
        jobs=[job_to_response(j) for j in closing_jobs],
    )


@router.get("/alerts", response_model=JobListResponse)
def get_deadline_alerts(
    request: Request,
    days: int = Query(7, ge=1, le=365, description="Alert horizon window in days"),
):
    start = time.perf_counter()
    tracker = get_tracker(request)

    # Non-destructive priority preview using Min-Heap
    alerts = tracker.peek_all_due_alerts(within_days=days)
    exec_time = round((time.perf_counter() - start) * 1000, 3)

    return JobListResponse(
        total=len(alerts),
        algorithm_used="Min-Heap Priority Queue (Non-Destructive Peek)",
        execution_time_ms=exec_time,
        jobs=[job_to_response(j) for j in alerts],
    )


@router.post("/alerts/email", response_model=EmailAlertResponse)
def send_email_alerts(
    request: Request,
    payload: EmailAlertRequest,
):
    tracker = get_tracker(request)
    alerts = tracker.peek_all_due_alerts(within_days=payload.within_days)

    if not alerts:
        return EmailAlertResponse(
            success=False,
            message=f"No jobs closing within {payload.within_days} days to alert.",
            alerts_count=0,
        )

    sent = send_email_alert(payload.to_email, alerts)
    if sent:
        return EmailAlertResponse(
            success=True,
            message=f"Successfully dispatched deadline alert email to {payload.to_email}",
            alerts_count=len(alerts),
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Email delivery failed. Ensure GJT_EMAIL and GJT_EMAIL_APP_PASSWORD "
                "environment variables are configured."
            ),
        )


@router.post("/jobs", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
def create_job(
    request: Request,
    payload: JobCreate,
):
    tracker = get_tracker(request)

    try:
        post_dt = datetime.fromisoformat(payload.post_date).date()
        dead_dt = datetime.fromisoformat(payload.deadline).date()
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid ISO date format: {e}",
        )

    job_id = payload.job_id or f"GJ{len(tracker.jobs_by_id) + 1:04d}"

    new_job = Job(
        job_id=job_id,
        title=payload.title,
        department=payload.department,
        category=payload.category,
        location=payload.location,
        qualification=payload.qualification,
        post_date=post_dt,
        deadline=dead_dt,
        apply_link=payload.apply_link,
        vacancies=payload.vacancies,
    )

    # Hash Set duplicate check + Trie & MinHeap indexing inside add_job
    added = tracker.add_job(new_job)

    if not added:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                f"Duplicate posting rejected: A job with title '{payload.title}', "
                f"department '{payload.department}', and post date '{payload.post_date}' already exists."
            ),
        )

    return job_to_response(new_job)


@router.get("/stats", response_model=TrackerStatsResponse)
def get_tracker_stats(request: Request):
    tracker = get_tracker(request)
    stats = tracker.stats()
    return TrackerStatsResponse(
        total_jobs=stats["total_jobs"],
        pending_in_alert_heap=stats["pending_in_alert_heap"],
    )
