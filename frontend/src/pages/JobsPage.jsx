import React, { useState, useEffect } from 'react';
import { Search, Filter, ListOrdered, Briefcase, RefreshCw, AlertTriangle } from 'lucide-react';
import { jobApi } from '../api/jobApi';
import JobCard from '../components/JobCard';
import DSABadge from '../components/DSABadge';

const CATEGORIES = [
  'All',
  'Banking',
  'Railways',
  'SSC',
  'UPSC',
  'Defence',
  'State PSC',
  'State PSU',
  'Central Govt',
  'Education',
  'Insurance',
];

export default function JobsPage({ onViewDetails }) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortedByDeadline, setSortedByDeadline] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [algoInfo, setAlgoInfo] = useState({ name: '', time: 0 });

  const loadJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      let res;
      if (query.trim()) {
        res = await jobApi.searchJobs(query.trim());
      } else {
        const cat = selectedCategory === 'All' ? '' : selectedCategory;
        res = await jobApi.getAllJobs(sortedByDeadline, cat);
      }

      let filtered = res.jobs || [];
      if (query.trim() && selectedCategory !== 'All') {
        filtered = filtered.filter(
          (j) => j.category.toLowerCase() === selectedCategory.toLowerCase()
        );
      }

      setJobs(filtered);
      setAlgoInfo({
        name: res.algorithm_used || 'Hash Map Lookup',
        time: res.execution_time_ms || 0,
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch job postings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadJobs();
    }, 200); // 200ms debounce for Trie search input
    return () => clearTimeout(timer);
  }, [query, selectedCategory, sortedByDeadline]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Explore Job Postings</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Search-as-you-type powered by custom Trie indexing & Merge Sort deadline ordering.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <DSABadge algorithm={algoInfo.name} executionTimeMs={algoInfo.time} />

          <button
            className={`btn ${sortedByDeadline ? 'btn-primary' : 'btn-outline'} btn-sm`}
            onClick={() => setSortedByDeadline(!sortedByDeadline)}
            title="Sort jobs by application deadline using hand-coded Merge Sort"
          >
            <ListOrdered size={14} />
            {sortedByDeadline ? 'Sorted by Deadline' : 'Sort by Deadline'}
          </button>
        </div>
      </div>

      {/* Search Bar & Category Filter Pills */}
      <div className="search-filter-section">
        <div className="search-bar-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, department, location, or keyword (e.g. 'bank', 'ssc', 'punjab', 'army')..."
          />
          {query && (
            <button
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
              onClick={() => setQuery('')}
            >
              Clear
            </button>
          )}
        </div>

        <div className="filter-bar">
          <div className="category-pills">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Showing <strong>{jobs.length}</strong> {jobs.length === 1 ? 'job' : 'jobs'}
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', borderColor: 'rgba(244,63,94,0.3)', marginBottom: '1.5rem' }}>
          <AlertTriangle size={32} style={{ color: '#f87171', margin: '0 auto 0.5rem auto' }} />
          <p style={{ color: '#f87171', fontWeight: 600 }}>{error}</p>
          <button className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }} onClick={loadJobs}>
            <RefreshCw size={14} /> Retry Connection
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="loading-spinner"></div>
      ) : jobs.length > 0 ? (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <JobCard key={job.job_id} job={job} onViewDetails={onViewDetails} />
          ))}
        </div>
      ) : (
        <div className="glass-card empty-state">
          <Briefcase size={40} className="empty-icon" />
          <h3>No matching job notifications found</h3>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
            Try searching for a different keyword or select another category filter.
          </p>
          {(query || selectedCategory !== 'All') && (
            <button
              className="btn btn-outline btn-sm"
              style={{ marginTop: '1rem' }}
              onClick={() => { setQuery(''); setSelectedCategory('All'); }}
            >
              Reset Search Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
