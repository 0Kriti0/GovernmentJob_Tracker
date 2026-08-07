"""
data_source.py
Provides job listings to the tracker.

Right now `load_sample_jobs()` generates realistic mock Indian government
job postings with deadlines computed relative to *today*, so the demo
always has a mix of expired / closing-soon / far-off jobs no matter when
you run it.

Later, replace/extend this with `scraper.py` to pull real postings from
a government job portal (see scraper.py for the template + notes on
picking a source).
"""
from datetime import date, timedelta
from job import Job

_RAW_JOBS = [
    # title, department, category, location, qualification, vacancies, post_offset_days, deadline_offset_days
    ("SSC CGL 2026 Combined Graduate Level Exam", "Staff Selection Commission", "SSC", "All India", "Bachelor's Degree", 5000, -20, 12),
    ("IBPS PO Recruitment 2026", "Institute of Banking Personnel Selection", "Banking", "All India", "Bachelor's Degree", 3500, -15, 5),
    ("RRB NTPC Non-Technical Popular Categories", "Railway Recruitment Board", "Railways", "All India", "12th Pass / Graduate", 8000, -30, -3),
    ("UPSC Civil Services Preliminary Exam 2026", "Union Public Service Commission", "UPSC", "All India", "Bachelor's Degree", 1000, -10, 25),
    ("Punjab Police Constable Recruitment", "Punjab Police Department", "State Police", "Punjab", "12th Pass", 1800, -5, 18),
    ("Punjab PSC Civil Judge Recruitment", "Punjab Public Service Commission", "State PSC", "Punjab", "LLB", 90, -8, 40),
    ("Indian Army Agniveer Recruitment Rally", "Indian Army", "Defence", "Punjab", "10th/12th Pass", 4000, -2, 9),
    ("IBPS Clerk Recruitment 2026", "Institute of Banking Personnel Selection", "Banking", "All India", "Bachelor's Degree", 6000, -25, 2),
    ("SSC CHSL Combined Higher Secondary Level", "Staff Selection Commission", "SSC", "All India", "12th Pass", 4500, -18, 15),
    ("Punjab State Power Corporation Ltd Junior Engineer", "PSPCL", "State PSU", "Punjab", "B.Tech / Diploma", 300, -12, 22),
    ("Income Tax Department Inspector Recruitment", "Central Board of Direct Taxes", "Central Govt", "All India", "Bachelor's Degree", 250, -3, 30),
    ("RRB Group D Level 1 Posts", "Railway Recruitment Board", "Railways", "All India", "10th Pass / ITI", 10000, -40, -10),
    ("LIC AAO Recruitment 2026", "Life Insurance Corporation of India", "Insurance", "All India", "Bachelor's Degree", 300, -6, 6),
    ("Punjab School Education Board TGT/PGT Teacher", "Punjab School Education Board", "Education", "Punjab", "B.Ed + Graduate", 1200, -14, 20),
    ("ISRO Scientist/Engineer Recruitment", "Indian Space Research Organisation", "Central Govt", "All India", "B.E/B.Tech", 60, -4, 33),
    ("Punjab National Bank Specialist Officer", "Punjab National Bank", "Banking", "All India", "Bachelor's/Master's Degree", 400, -9, 4),
    ("CRPF Head Constable Recruitment", "Central Reserve Police Force", "Defence", "All India", "12th Pass", 1500, -1, 45),
    ("Food Corporation of India Watchman Recruitment", "Food Corporation of India", "Central Govt", "All India", "10th Pass", 5000, -22, -1),
]


def load_sample_jobs():
    today = date.today()
    jobs = []
    for i, (title, dept, cat, loc, qual, vac, post_off, dead_off) in enumerate(_RAW_JOBS, start=1):
        jobs.append(Job(
            job_id=f"GJ{i:04d}",
            title=title,
            department=dept,
            category=cat,
            location=loc,
            qualification=qual,
            post_date=today + timedelta(days=post_off),
            deadline=today + timedelta(days=dead_off),
            apply_link=f"https://example-govjobs.gov.in/apply/{i}",
            vacancies=vac,
        ))
    return jobs
