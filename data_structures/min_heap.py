"""
min_heap.py
A hand-rolled binary min-heap (array based), used as a priority queue
of jobs ordered by application deadline. The job closing soonest is
always at the root, so the alert system can repeatedly pop the most
urgent job in O(log n) instead of re-scanning/re-sorting every job.
"""


class MinHeap:
    def __init__(self):
        self._heap = []   # list of (priority, item) tuples

    def __len__(self):
        return len(self._heap)

    def is_empty(self):
        return len(self._heap) == 0

    def push(self, priority, item):
        self._heap.append((priority, item))
        self._sift_up(len(self._heap) - 1)

    def peek(self):
        if not self._heap:
            return None
        return self._heap[0]

    def pop_min(self):
        if not self._heap:
            return None
        self._swap(0, len(self._heap) - 1)
        priority, item = self._heap.pop()
        if self._heap:
            self._sift_down(0)
        return priority, item

    # ---- internal helpers ----
    def _swap(self, i, j):
        self._heap[i], self._heap[j] = self._heap[j], self._heap[i]

    def _sift_up(self, i):
        while i > 0:
            parent = (i - 1) // 2
            if self._heap[i][0] < self._heap[parent][0]:
                self._swap(i, parent)
                i = parent
            else:
                break

    def _sift_down(self, i):
        n = len(self._heap)
        while True:
            left, right = 2 * i + 1, 2 * i + 2
            smallest = i
            if left < n and self._heap[left][0] < self._heap[smallest][0]:
                smallest = left
            if right < n and self._heap[right][0] < self._heap[smallest][0]:
                smallest = right
            if smallest == i:
                break
            self._swap(i, smallest)
            i = smallest
