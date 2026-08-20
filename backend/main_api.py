"""
main_api.py
FastAPI application entry point for the Government Job Tracker & Alert System.
"""
import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from tracker import JobTracker
from data_source import load_sample_jobs
from backend.routes import router

app = FastAPI(
    title="Government Job Tracker & Alert System API",
    description=(
        "Full-stack REST API powered by custom Data Structures & Algorithms "
        "(Trie prefix tree, Min-Heap priority queue, Merge Sort, Binary Search, and Hash Set deduplication)."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration allowing cross-origin access for local frontend dev (Vite / React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instantiate JobTracker and populate initial mock dataset into application state
tracker_instance = JobTracker()
added, skipped = tracker_instance.add_many(load_sample_jobs())
app.state.tracker = tracker_instance

# Register API routes
app.include_router(router)


@app.get("/", tags=["Health Check"])
def root():
    return {
        "status": "online",
        "message": "Government Job Tracker API is running.",
        "dsa_features": [
            "Trie Prefix Tree Search (O(L))",
            "Min-Heap Deadline Priority Queue (O(log n))",
            "Hand-written Merge Sort (O(n log n))",
            "Binary Search Range Queries (O(log n))",
            "Hash Set Duplicate Detection (O(1))",
        ],
        "documentation": "/docs",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main_api:app", host="127.0.0.1", port=8000, reload=True)
