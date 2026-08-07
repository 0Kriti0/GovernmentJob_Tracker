"""
trie.py
A Trie (prefix tree) used to power fast "search-as-you-type" lookup
over job titles, departments, categories and locations.

Each word maps to a set of job_ids that contain that word, so a prefix
search on "rail" instantly returns every job whose title/department/
category/location contains a word starting with "rail" (e.g. "Railway",
"Railways") in O(L) time, where L is the length of the prefix.
"""


class TrieNode:
    __slots__ = ("children", "job_ids")

    def __init__(self):
        self.children = {}
        self.job_ids = set()   # job ids reachable through this node (this word as prefix)


class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str, job_id: str):
        word = word.lower()
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
            node.job_ids.add(job_id)   # every prefix node remembers this job

    def insert_text(self, text: str, job_id: str):
        """Tokenize a longer string (title, department, etc.) and insert each word."""
        for token in text.lower().replace("-", " ").replace("/", " ").split():
            token = "".join(c for c in token if c.isalnum())
            if token:
                self.insert(token, job_id)

    def search_prefix(self, prefix: str):
        """Return the set of job_ids whose indexed words start with `prefix`."""
        node = self.root
        prefix = prefix.lower().strip()
        if not prefix:
            return set()
        for ch in prefix:
            if ch not in node.children:
                return set()
            node = node.children[ch]
        return set(node.job_ids)
