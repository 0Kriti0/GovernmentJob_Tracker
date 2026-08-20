"""
tracker.py
JobTracker ties together every data structure:
  - dict            : O(1) lookup of job by id
  - set (hashing)   : O(1) duplicate detection when adding jobs
  - Trie            : prefix/keyword search
  - MinHeap         : deadline-priority queue for alerts
  - merge_sort/binary search : range queries ("closing in N days")
"""
from datetime import date, timedelta

from data_structures.trie import Trie
from data_structures.min_heap import MinHeap
from data_structures.sorting import merge_sort
from data_structures.search import jobs_closing_between


class JobTracker:
    def __init__(self):
        self.jobs_by_id = {}          # job_id -> Job          (hash map)
        self._seen_keys = set()       # dedup_key -> presence  (hash set)
        self.trie = Trie()
        self.deadline_heap = MinHeap()  # (deadline_ordinal, job_id), consumed as alerts fire

    # ---------------- adding jobs ----------------
    def add_job(self, job):
        """Add a job. Returns False if it's a duplicate (already tracked)."""
        key = job.dedup_key()
        if key in self._seen_keys:
            return False
        self._seen_keys.add(key)
        self.jobs_by_id[job.job_id] = job

        self.trie.insert_text(job.title, job.job_id)
        self.trie.insert_text(job.department, job.job_id)
        self.trie.insert_text(job.category, job.job_id)
        self.trie.insert_text(job.location, job.job_id)

        self.deadline_heap.push(job.deadline.toordinal(), job.job_id)
        return True

    def add_many(self, jobs):
        added, skipped = 0, 0
        for j in jobs:
            if self.add_job(j):
                added += 1
            else:
                skipped += 1
        return added, skipped

    # ---------------- search (Trie) ----------------
    def search(self, keyword):
        ids = self.trie.search_prefix(keyword)
        return [self.jobs_by_id[i] for i in ids if i in self.jobs_by_id]

    # ---------------- sorting / binary search ----------------
    def all_jobs_sorted_by_deadline(self):
        return merge_sort(list(self.jobs_by_id.values()), key=lambda j: j.deadline)

    def closing_within(self, n_days, today=None):
        today = today or date.today()
        sorted_jobs = self.all_jobs_sorted_by_deadline()
        return jobs_closing_between(sorted_jobs, today, today + timedelta(days=n_days))

    # ---------------- heap-based alerts ----------------
    def pop_next_alert(self, today=None, within_days=7):
        """
        Pop the single most urgent still-open job from the heap, if its
        deadline is within `within_days`. Returns None when the heap is
        empty or the soonest deadline is further out than that window.
        Popped jobs are considered "already alerted" (removed from heap,
        but stay in jobs_by_id).
        """
        today = today or date.today()
        top = self.deadline_heap.peek()
        if top is None:
            return None
        deadline_ordinal, job_id = top
        deadline = date.fromordinal(deadline_ordinal)
        if (deadline - today).days > within_days:
            return None
        self.deadline_heap.pop_min()
        return self.jobs_by_id.get(job_id)

    def pop_all_due_alerts(self, today=None, within_days=7):
        alerts = []
        while True:
            job = self.pop_next_alert(today=today, within_days=within_days)
            if job is None:
                break
            # skip already-expired postings, only alert on still-open ones
            if job.days_left(today) >= 0:
                alerts.append(job)
        return alerts

    def peek_all_due_alerts(self, today=None, within_days=7):
        """
        Non-destructive preview of due alerts.
        Returns all still-open jobs closing within `within_days` in order of deadline urgency,
        without removing any items from the deadline heap.
        """
        today = today or date.today()
        temp_heap = MinHeap()
        temp_heap._heap = list(self.deadline_heap._heap)

        alerts = []
        while not temp_heap.is_empty():
            deadline_ordinal, job_id = temp_heap.peek()
            deadline = date.fromordinal(deadline_ordinal)
            days_left = (deadline - today).days
            if days_left > within_days:
                break
            temp_heap.pop_min()
            job = self.jobs_by_id.get(job_id)
            if job and job.days_left(today) >= 0:
                alerts.append(job)
        return alerts


    def stats(self):
        return {
            "total_jobs": len(self.jobs_by_id),
            "pending_in_alert_heap": len(self.deadline_heap),
        }
