"""
data_structures package initialization.
"""
from data_structures.trie import Trie, TrieNode
from data_structures.min_heap import MinHeap
from data_structures.sorting import merge_sort
from data_structures.search import (
    lower_bound_by_deadline,
    upper_bound_by_deadline,
    jobs_closing_between,
)

__all__ = [
    "Trie",
    "TrieNode",
    "MinHeap",
    "merge_sort",
    "lower_bound_by_deadline",
    "upper_bound_by_deadline",
    "jobs_closing_between",
]
