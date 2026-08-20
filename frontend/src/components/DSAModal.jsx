import React from 'react';
import { X, Cpu, Search, Clock, ListOrdered, Filter, Hash, CheckCircle2 } from 'lucide-react';

export default function DSAModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const dsaFeatures = [
    {
      title: 'Trie Tree (Prefix Search)',
      complexity: 'O(L) Time • O(W) Space',
      icon: <Search size={20} style={{ color: 'var(--primary)' }} />,
      desc: 'Tokenizes job titles, departments, categories, and locations into prefix nodes for instant instant-as-you-type keyword queries.',
      file: 'data_structures/trie.py',
    },
    {
      title: 'Binary Min-Heap (Deadline Priority Queue)',
      complexity: 'O(log N) Push/Pop • O(1) Peek',
      icon: <Clock size={20} style={{ color: 'var(--amber)' }} />,
      desc: 'Maintains an array-based min-heap ordered by deadline timestamp to instantly surface the single most urgent upcoming application deadline.',
      file: 'data_structures/min_heap.py',
    },
    {
      title: 'Custom Merge Sort (Stable Ordering)',
      complexity: 'O(N log N) Guaranteed Time',
      icon: <ListOrdered size={20} style={{ color: 'var(--teal)' }} />,
      desc: 'Hand-coded stable divide-and-conquer sorting algorithm ordering job listings by deadline date without relying on Python built-ins.',
      file: 'data_structures/sorting.py',
    },
    {
      title: 'Binary Search (Deadline Range Bounds)',
      complexity: 'O(log N) Boundary Search',
      icon: <Filter size={20} style={{ color: 'var(--purple)' }} />,
      desc: 'Computes lower_bound and upper_bound indices on deadline-sorted job lists to extract range queries ("closing in N days") in logarithmic time.',
      file: 'data_structures/search.py',
    },
    {
      title: 'Hash Set & Hash Map (Deduplication & Lookup)',
      complexity: 'O(1) Average Lookup',
      icon: <Hash size={20} style={{ color: 'var(--emerald)' }} />,
      desc: 'Generates composite deduplication tuples (title, department, post_date) stored in a Hash Set to block duplicate postings on job submission.',
      file: 'tracker.py & job.py',
    },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="stat-icon-wrapper stat-icon-purple" style={{ width: 40, height: 40 }}>
              <Cpu size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem' }}>Platform Architecture & DSA Engine</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Hand-crafted Data Structures & Algorithms powering backend indexing and query operations.
              </p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1.25rem 0' }}>
          {dsaFeatures.map((item, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.05)' }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                      {item.title}
                    </h4>
                    <span className="dsa-badge">{item.complexity}</span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                    {item.desc}
                  </p>
                  <code style={{ fontSize: '0.725rem', color: 'var(--primary)', marginTop: '0.4rem', display: 'inline-block' }}>
                    Source: {item.file}
                  </code>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button className="btn btn-primary" onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
