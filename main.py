"""
main.py
Government Job Tracker & Alert System -- CLI entry point.

Run:
    python main.py            (interactive menu)
    python main.py --demo     (non-interactive walkthrough of every feature)
"""
import sys
from datetime import date

from tracker import JobTracker
from data_source import load_sample_jobs
from alert import console_alert, send_email_alert


def build_tracker():
    tracker = JobTracker()
    added, skipped = tracker.add_many(load_sample_jobs())
    print(f"Loaded {added} job(s) into tracker ({skipped} duplicate(s) skipped).")
    return tracker


def print_jobs(jobs):
    if not jobs:
        print("No matching jobs found.\n")
        return
    for j in jobs:
        print(j)
        print("-" * 60)


def menu():
    tracker = build_tracker()

    while True:
        print("""
==== Government Job Tracker & Alert System ====
1. Search jobs by keyword (Trie)
2. View all jobs sorted by deadline (Merge Sort)
3. Jobs closing within N days (Binary Search)
4. Check deadline alerts (Min-Heap)
5. Send email alert for due jobs
6. Show tracker stats
0. Exit
""")
        choice = input("Choose an option: ").strip()

        if choice == "1":
            kw = input("Enter keyword / prefix (e.g. 'rail', 'bank', 'punjab'): ").strip()
            print_jobs(tracker.search(kw))

        elif choice == "2":
            print_jobs(tracker.all_jobs_sorted_by_deadline())

        elif choice == "3":
            try:
                n = int(input("Show jobs closing within how many days? ").strip())
            except ValueError:
                n = 7
            print_jobs(tracker.closing_within(n))

        elif choice == "4":
            try:
                n = int(input("Alert window in days (e.g. 7): ").strip())
            except ValueError:
                n = 7
            alerts = tracker.pop_all_due_alerts(within_days=n)
            console_alert(alerts)

        elif choice == "5":
            to_email = input("Send alert email to: ").strip()
            try:
                n = int(input("Alert window in days (e.g. 7): ").strip())
            except ValueError:
                n = 7
            alerts = tracker.pop_all_due_alerts(within_days=n)
            if send_email_alert(to_email, alerts):
                print("Email sent.")
            else:
                console_alert(alerts)  # fallback so alerts aren't lost

        elif choice == "6":
            print(tracker.stats())

        elif choice == "0":
            print("Goodbye!")
            break
        else:
            print("Invalid option, try again.")


def demo():
    """Non-interactive walkthrough -- good for a viva/demo or a quick sanity check."""
    tracker = build_tracker()

    print("\n--- Trie search: 'bank' ---")
    print_jobs(tracker.search("bank"))

    print("\n--- Merge sort: all jobs by deadline (first 5) ---")
    print_jobs(tracker.all_jobs_sorted_by_deadline()[:5])

    print("\n--- Binary search: jobs closing within 10 days ---")
    print_jobs(tracker.closing_within(10))

    print("\n--- Min-heap: pop due alerts (within 7 days) ---")
    alerts = tracker.pop_all_due_alerts(within_days=7)
    console_alert(alerts)

    print("--- Tracker stats ---")
    print(tracker.stats())


if __name__ == "__main__":
    if "--demo" in sys.argv:
        demo()
    else:
        menu()
