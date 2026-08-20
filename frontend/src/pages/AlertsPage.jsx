import React, { useState, useEffect } from 'react';
import { Bell, Mail, Clock, Calendar, AlertCircle } from 'lucide-react';
import { jobApi } from '../api/jobApi';
import JobCard from '../components/JobCard';
import DSABadge from '../components/DSABadge';

export default function AlertsPage({ onViewDetails, onOpenEmailModal }) {
  const [days, setDays] = useState(7);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [algoInfo, setAlgoInfo] = useState({ name: '', time: 0 });

  const loadAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await jobApi.getAlerts(days);
      setAlerts(res.jobs || []);
      setAlgoInfo({
        name: res.algorithm_used || 'Min-Heap Priority Queue',
        time: res.execution_time_ms || 0,
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch deadline alerts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [days]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Deadline Priority Alerts</h1>
            <DSABadge algorithm={algoInfo.name} executionTimeMs={algoInfo.time} />
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            High-urgency notifications peeked non-destructively from the Min-Heap priority queue.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => onOpenEmailModal(days)}>
          <Mail size={16} />
          Send Email Digest
        </button>
      </div>

      {/* Horizon Filter Control Card */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="stat-icon-wrapper stat-icon-amber" style={{ width: 40, height: 40 }}>
              <Clock size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Alert Horizon Window: <strong style={{ color: 'var(--amber)' }}>{days} Days</strong>
              </span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Filtering jobs closing between today and {days} days out.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {[3, 7, 14, 30].map((d) => (
              <button
                key={d}
                className={`pill-btn ${days === d ? 'active' : ''}`}
                onClick={() => setDays(d)}
              >
                {d} Days
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alert Listings */}
      {loading ? (
        <div className="loading-spinner"></div>
      ) : error ? (
        <div className="glass-card empty-state" style={{ borderColor: 'rgba(244, 63, 94, 0.3)' }}>
          <AlertCircle size={32} style={{ color: '#f87171', margin: '0 auto 0.5rem auto' }} />
          <p style={{ color: '#f87171' }}>{error}</p>
        </div>
      ) : alerts.length > 0 ? (
        <div className="jobs-grid">
          {alerts.map((job) => (
            <JobCard key={job.job_id} job={job} onViewDetails={onViewDetails} />
          ))}
        </div>
      ) : (
        <div className="glass-card empty-state">
          <Bell size={40} className="empty-icon" />
          <h3>No jobs closing within {days} days</h3>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
            All tracked application deadlines are comfortably further out than {days} days.
          </p>
        </div>
      )}
    </div>
  );
}
