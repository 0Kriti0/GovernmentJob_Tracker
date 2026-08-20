"""
test_dsa.py
Automated unit and integration test suite for the Government Job Tracker & Alert System.

Covers:
  - Trie (prefix tree search)
  - Min-Heap (priority queue)
  - Merge Sort (O(n log n) stable sort)
  - Binary Search (range queries)
  - Hash-based duplicate detection
  - JobTracker integration & non-destructive peek_all_due_alerts()
"""
import os
import sys
import unittest
from datetime import date, timedelta

# Ensure govjob_tracker root directory is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from job import Job
from tracker import JobTracker
from data_structures.trie import Trie
from data_structures.min_heap import MinHeap
from data_structures.sorting import merge_sort
from data_structures.search import (
    lower_bound_by_deadline,
    upper_bound_by_deadline,
    jobs_closing_between,
)


class TestTrie(unittest.TestCase):
    def setUp(self):
        self.trie = Trie()

    def test_single_word_insert_and_search(self):
        self.trie.insert("railway", "GJ0001")
        self.assertEqual(self.trie.search_prefix("rail"), {"GJ0001"})
        self.assertEqual(self.trie.search_prefix("railway"), {"GJ0001"})
        self.assertEqual(self.trie.search_prefix("bank"), set())

    def test_insert_text_tokenization(self):
        self.trie.insert_text("State PSC / Civil-Judge Exam 2026", "GJ0002")
        self.assertIn("GJ0002", self.trie.search_prefix("state"))
        self.assertIn("GJ0002", self.trie.search_prefix("psc"))
        self.assertIn("GJ0002", self.trie.search_prefix("civil"))
        self.assertIn("GJ0002", self.trie.search_prefix("judge"))

    def test_empty_and_invalid_prefix(self):
        self.trie.insert("banking", "GJ0003")
        self.assertEqual(self.trie.search_prefix(""), set())
        self.assertEqual(self.trie.search_prefix("   "), set())
        self.assertEqual(self.trie.search_prefix("xyz123"), set())


class TestMinHeap(unittest.TestCase):
    def setUp(self):
        self.heap = MinHeap()

    def test_empty_heap(self):
        self.assertTrue(self.heap.is_empty())
        self.assertEqual(len(self.heap), 0)
        self.assertIsNone(self.heap.peek())
        self.assertIsNone(self.heap.pop_min())

    def test_push_and_pop_min_ordering(self):
        items = [(10, "JobC"), (3, "JobA"), (7, "JobB"), (1, "JobMin"), (15, "JobMax")]
        for priority, item in items:
            self.heap.push(priority, item)

        self.assertEqual(len(self.heap), 5)
        self.assertFalse(self.heap.is_empty())
        self.assertEqual(self.heap.peek(), (1, "JobMin"))

        popped = []
        while not self.heap.is_empty():
            popped.append(self.heap.pop_min())

        expected = [(1, "JobMin"), (3, "JobA"), (7, "JobB"), (10, "JobC"), (15, "JobMax")]
        self.assertEqual(popped, expected)


class TestMergeSort(unittest.TestCase):
    def test_merge_sort_numbers(self):
        data = [5, 2, 8, 1, 9, 3]
        sorted_data = merge_sort(data)
        self.assertEqual(sorted_data, [1, 2, 3, 5, 8, 9])

    def test_merge_sort_with_key(self):
        today = date.today()
        jobs = [
            Job("J3", "C", "D", "Cat", "L", "Q", today, today + timedelta(days=10), "http://3"),
            Job("J1", "A", "D", "Cat", "L", "Q", today, today + timedelta(days=2), "http://1"),
            Job("J2", "B", "D", "Cat", "L", "Q", today, today + timedelta(days=5), "http://2"),
        ]
        sorted_jobs = merge_sort(jobs, key=lambda j: j.deadline)
        ids = [j.job_id for j in sorted_jobs]
        self.assertEqual(ids, ["J1", "J2", "J3"])

    def test_empty_and_single_item(self):
        self.assertEqual(merge_sort([]), [])
        self.assertEqual(merge_sort([42]), [42])


class TestBinarySearch(unittest.TestCase):
    def setUp(self):
        self.today = date.today()
        self.jobs = [
            Job("J1", "Title1", "Dept", "Cat", "Loc", "Qual", self.today, self.today + timedelta(days=2), "link1"),
            Job("J2", "Title2", "Dept", "Cat", "Loc", "Qual", self.today, self.today + timedelta(days=5), "link2"),
            Job("J3", "Title3", "Dept", "Cat", "Loc", "Qual", self.today, self.today + timedelta(days=5), "link3"),
            Job("J4", "Title4", "Dept", "Cat", "Loc", "Qual", self.today, self.today + timedelta(days=10), "link4"),
        ]

    def test_lower_and_upper_bound(self):
        target = self.today + timedelta(days=5)
        lo = lower_bound_by_deadline(self.jobs, target)
        hi = upper_bound_by_deadline(self.jobs, target)

        self.assertEqual(lo, 1)  # J2 is first with deadline +5
        self.assertEqual(hi, 3)  # J4 is first with deadline > +5

    def test_jobs_closing_between(self):
        start = self.today + timedelta(days=3)
        end = self.today + timedelta(days=6)
        matched = jobs_closing_between(self.jobs, start, end)
        matched_ids = [j.job_id for j in matched]
        self.assertEqual(matched_ids, ["J2", "J3"])


class TestDuplicateDetection(unittest.TestCase):
    def test_dedup_key(self):
        today = date.today()
        j1 = Job("J1", "  SSC CGL ", " Staff Selection ", "Cat", "Loc", "Qual", today, today, "link")
        j2 = Job("J2", "ssc cgl", "staff selection", "Cat", "Loc", "Qual", today, today, "link")
        self.assertEqual(j1.dedup_key(), j2.dedup_key())

    def test_tracker_add_job_dedup(self):
        today = date.today()
        tracker = JobTracker()
        j1 = Job("J1", "Title A", "Dept A", "Cat", "Loc", "Qual", today, today + timedelta(days=5), "link")
        j2 = Job("J2", "Title A", "Dept A", "Cat", "Loc", "Qual", today, today + timedelta(days=5), "link")

        self.assertTrue(tracker.add_job(j1))
        self.assertFalse(tracker.add_job(j2))
        self.assertEqual(len(tracker.jobs_by_id), 1)


class TestJobTrackerIntegration(unittest.TestCase):
    def setUp(self):
        self.today = date.today()
        self.tracker = JobTracker()
        self.j1 = Job("J1", "IBPS PO", "Banking Dept", "Banking", "All India", "Degree", self.today, self.today + timedelta(days=3), "l1")
        self.j2 = Job("J2", "SSC CGL", "Staff Selection", "SSC", "All India", "Degree", self.today, self.today + timedelta(days=6), "l2")
        self.j3 = Job("J3", "RRB NTPC", "Railway Board", "Railways", "All India", "12th", self.today, self.today + timedelta(days=15), "l3")
        self.tracker.add_many([self.j1, self.j2, self.j3])

    def test_search_trie(self):
        results = self.tracker.search("bank")
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0].job_id, "J1")

    def test_sorted_by_deadline_merge_sort(self):
        sorted_jobs = self.tracker.all_jobs_sorted_by_deadline()
        self.assertEqual([j.job_id for j in sorted_jobs], ["J1", "J2", "J3"])

    def test_closing_within_binary_search(self):
        closing = self.tracker.closing_within(7, today=self.today)
        self.assertEqual([j.job_id for j in closing], ["J1", "J2"])

    def test_non_destructive_peek_all_due_alerts(self):
        initial_heap_size = len(self.tracker.deadline_heap)

        # Call peek_all_due_alerts twice
        alerts1 = self.tracker.peek_all_due_alerts(today=self.today, within_days=7)
        alerts2 = self.tracker.peek_all_due_alerts(today=self.today, within_days=7)

        self.assertEqual([j.job_id for j in alerts1], ["J1", "J2"])
        self.assertEqual([j.job_id for j in alerts2], ["J1", "J2"])
        # Verify heap size was NOT reduced
        self.assertEqual(len(self.tracker.deadline_heap), initial_heap_size)

    def test_destructive_pop_all_due_alerts(self):
        initial_heap_size = len(self.tracker.deadline_heap)

        alerts = self.tracker.pop_all_due_alerts(today=self.today, within_days=7)
        self.assertEqual([j.job_id for j in alerts], ["J1", "J2"])

        # Verification: heap size IS reduced by 2
        self.assertEqual(len(self.tracker.deadline_heap), initial_heap_size - 2)

        # Second pop returns no alerts for those popped items
        second_pop = self.tracker.pop_all_due_alerts(today=self.today, within_days=7)
        self.assertEqual(second_pop, [])


if __name__ == "__main__":
    unittest.main()
