# Government Job Tracker & Alert System

A DSA-course project that tracks government job postings and alerts users
before application deadlines. Built entirely with free/open-source tools.

## Why this maps well to a DSA course

| Feature                                | Data Structure / Algorithm      | File |
|-----------------------------------------|----------------------------------|------|
| Search-as-you-type by title/dept/location | **Trie** (prefix tree)          | `data_structures/trie.py` |
| "What's closing soonest?" alerts        | **Min-Heap** (binary heap, hand-built) | `data_structures/min_heap.py` |
| Ordering jobs by deadline                | **Merge Sort** (O(n log n), hand-built) | `data_structures/sorting.py` |
| "Jobs closing in next N days"            | **Binary Search** (lower/upper bound) | `data_structures/search.py` |
| Duplicate-posting detection              | **Hashing** (Python set/dict)   | `tracker.py` |
| O(1) job lookup by id                    | **Hash Map**                    | `tracker.py` |

`tracker.py` (`JobTracker`) is the class that wires all of these together.

## Project structure

```
govjob_tracker/
├── main.py              # CLI entry point
├── job.py                # Job data model
├── tracker.py             # Combines all DSA structures
├── data_source.py         # Sample/mock job data (swap for scraper.py later)
├── scraper.py              # Template for real scraping later
├── alert.py                 # Console + email alert delivery
├── data_structures/
│   ├── trie.py
│   ├── min_heap.py
│   ├── sorting.py
│   └── search.py
└── requirements.txt
```

## Running it

```bash
pip install -r requirements.txt   # only needed once you wire in scraper.py
python main.py                    # interactive menu
python main.py --demo             # runs through every feature automatically
```


## Notes on the sample data

`data_source.py` generates realistic mock Indian government job listings
(SSC, UPSC, Railways, Banking, State PSC, Defence, etc.) with deadlines
computed relative to *today*, so the demo always shows a healthy mix of
expired, closing-soon, and upcoming postings — regardless of when you run
it. Swap this module for `scraper.py` once you're ready to pull live data.
