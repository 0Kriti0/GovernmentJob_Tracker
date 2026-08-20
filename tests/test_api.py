"""
test_api.py
Automated integration test suite for FastAPI backend endpoints.
"""
import os
import sys
import unittest
from datetime import date, timedelta
from fastapi.testclient import TestClient

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.main_api import app


class TestAPIEndpoints(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_root_endpoint(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "online")
        self.assertIn("documentation", data)

    def test_get_all_jobs(self):
        response = self.client.get("/api/jobs")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreaterEqual(data["total"], 18)
        self.assertEqual(data["algorithm_used"], "Hash Map Lookup (O(1))")
        self.assertIsInstance(data["jobs"], list)

    def test_get_jobs_sorted_by_deadline(self):
        response = self.client.get("/api/jobs?sorted_by_deadline=true")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["algorithm_used"], "Merge Sort (O(n log n))")
        jobs = data["jobs"]
        # Verify deadlines are sorted in non-decreasing order
        deadlines = [j["deadline"] for j in jobs]
        self.assertEqual(deadlines, sorted(deadlines))

    def test_trie_search_endpoint(self):
        response = self.client.get("/api/jobs/search?q=bank")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("Trie", data["algorithm_used"])
        self.assertGreater(data["total"], 0)
        for job in data["jobs"]:
            text = (job["title"] + " " + job["department"] + " " + job["category"]).lower()
            self.assertTrue("bank" in text or "banking" in text or "pnb" in text)

    def test_closing_soon_binary_search_endpoint(self):
        response = self.client.get("/api/jobs/closing-soon?days=10")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("Binary Search", data["algorithm_used"])
        for job in data["jobs"]:
            self.assertLessEqual(job["days_left"], 10)
            self.assertGreaterEqual(job["days_left"], 0)

    def test_alerts_non_destructive_min_heap_endpoint(self):
        response1 = self.client.get("/api/alerts?days=7")
        self.assertEqual(response1.status_code, 200)
        data1 = response1.json()

        response2 = self.client.get("/api/alerts?days=7")
        self.assertEqual(response2.status_code, 200)
        data2 = response2.json()

        # Non-destructive test: second request returns same total
        self.assertEqual(data1["total"], data2["total"])
        self.assertIn("Min-Heap", data1["algorithm_used"])

    def test_create_unique_job_and_reject_duplicate(self):
        today_str = date.today().isoformat()
        deadline_str = (date.today() + timedelta(days=20)).isoformat()

        payload = {
            "title": "Unique Test Officer Exam 2026",
            "department": "Department of Testing",
            "category": "Testing",
            "location": "All India",
            "qualification": "B.Tech",
            "post_date": today_str,
            "deadline": deadline_str,
            "apply_link": "https://test.gov.in/apply",
            "vacancies": 100,
        }

        # 1. Create new unique job
        res1 = self.client.post("/api/jobs", json=payload)
        self.assertEqual(res1.status_code, 201)
        created_job = res1.json()
        self.assertEqual(created_job["title"], payload["title"])

        # 2. Re-submit same payload -> should trigger Hash Set duplicate rejection (409 Conflict)
        res2 = self.client.post("/api/jobs", json=payload)
        self.assertEqual(res2.status_code, 409)
        err_detail = res2.json()["detail"]
        self.assertIn("Duplicate", err_detail)

    def test_stats_endpoint(self):
        response = self.client.get("/api/stats")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("total_jobs", data)
        self.assertIn("pending_in_alert_heap", data)
        self.assertGreaterEqual(data["total_jobs"], 18)


if __name__ == "__main__":
    unittest.main()
