"""
scraper.py
Template for pulling REAL job postings once you're ready to move past
sample data. Kept separate from data_source.py so you can swap it in
without touching the DSA logic.

Notes for later (no cost involved, just your time):
  1. Pick a source with a stable, scrapable list page (a "sarkari
     naukri" aggregator, a state PSC site, or India's National Career
     Service (NCS) portal). Check its robots.txt / terms before scraping.
  2. requests + BeautifulSoup4 (both free, `pip install requests
     beautifulsoup4`) is enough for most static HTML listing pages.
  3. Map each row on the page into a Job(...) object (see job.py) and
     feed the list into JobTracker.add_many(jobs) -- dedup is automatic.
  4. If a site renders listings with JavaScript, you may need
     `playwright` (free) instead of requests.
  5. Schedule it for free with a GitHub Actions cron workflow (runs on
     GitHub's free tier) so it re-scrapes daily and commits new data /
     triggers alert.py automatically -- no server needed.

Below is a minimal, generic skeleton showing the shape of a scraper.
It is NOT wired to a real site yet because every government job portal
has different HTML -- fill in the selectors for the site you choose.
"""
import requests
from bs4 import BeautifulSoup
from datetime import date, timedelta
from job import Job


def fetch_jobs_from_listing_page(url, source_department="Unknown Department"):
    """
    Generic skeleton. Replace the CSS selectors below with the ones that
    match your chosen site's HTML structure once you pick a real source.
    """
    resp = requests.get(url, timeout=15, headers={"User-Agent": "Mozilla/5.0"})
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")

    jobs = []
    # Example shape -- adjust selectors to match the real page:
    # for row in soup.select(".job-listing-row"):
    #     title = row.select_one(".job-title").get_text(strip=True)
    #     deadline_text = row.select_one(".last-date").get_text(strip=True)
    #     link = row.select_one("a")["href"]
    #     jobs.append(Job(
    #         job_id=slugify(title),
    #         title=title,
    #         department=source_department,
    #         category="Uncategorized",
    #         location="All India",
    #         qualification="See notification",
    #         post_date=date.today(),
    #         deadline=parse_date(deadline_text),
    #         apply_link=link,
    #     ))
    return jobs
