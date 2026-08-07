"""
search.py
Binary search helpers used on a deadline-sorted job list to quickly
find "jobs closing within N days" without scanning every job.

Assumes `jobs` is already sorted ascending by deadline (use
data_structures.sorting.merge_sort first).
"""


def lower_bound_by_deadline(jobs, target_date):
    """First index i such that jobs[i].deadline >= target_date."""
    lo, hi = 0, len(jobs)
    while lo < hi:
        mid = (lo + hi) // 2
        if jobs[mid].deadline < target_date:
            lo = mid + 1
        else:
            hi = mid
    return lo


def upper_bound_by_deadline(jobs, target_date):
    """First index i such that jobs[i].deadline > target_date."""
    lo, hi = 0, len(jobs)
    while lo < hi:
        mid = (lo + hi) // 2
        if jobs[mid].deadline <= target_date:
            lo = mid + 1
        else:
            hi = mid
    return lo


def jobs_closing_between(sorted_jobs, start_date, end_date):
    """O(log n) range query on a deadline-sorted list."""
    lo = lower_bound_by_deadline(sorted_jobs, start_date)
    hi = upper_bound_by_deadline(sorted_jobs, end_date)
    return sorted_jobs[lo:hi]
