"""
job.py
Defines the Job data model used across the tracker.
"""
from datetime import datetime, date
from dataclasses import dataclass, field, asdict


@dataclass
class Job:
    job_id: str
    title: str
    department: str
    category: str          # e.g. "Banking", "Railways", "SSC", "State PSC", "Defence"
    location: str
    qualification: str
    post_date: date
    deadline: date
    apply_link: str
    vacancies: int = 0

    def to_dict(self):
        d = asdict(self)
        d["post_date"] = self.post_date.isoformat()
        d["deadline"] = self.deadline.isoformat()
        return d

    @staticmethod
    def from_dict(d):
        return Job(
            job_id=d["job_id"],
            title=d["title"],
            department=d["department"],
            category=d["category"],
            location=d["location"],
            qualification=d["qualification"],
            post_date=datetime.fromisoformat(d["post_date"]).date(),
            deadline=datetime.fromisoformat(d["deadline"]).date(),
            apply_link=d["apply_link"],
            vacancies=d.get("vacancies", 0),
        )

    def dedup_key(self):
        """Key used to detect duplicate postings (hashing/dedup demo)."""
        return (self.title.strip().lower(), self.department.strip().lower(), self.post_date.isoformat())

    def days_left(self, today: date = None):
        today = today or date.today()
        return (self.deadline - today).days

    def __str__(self):
        return (f"[{self.job_id}] {self.title} | {self.department} | {self.category}\n"
                f"    Location: {self.location} | Vacancies: {self.vacancies}\n"
                f"    Qualification: {self.qualification}\n"
                f"    Deadline: {self.deadline}  ({self.days_left()} days left)\n"
                f"    Apply: {self.apply_link}")
