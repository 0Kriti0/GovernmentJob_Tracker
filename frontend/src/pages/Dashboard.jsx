import React from 'react';
import { Search, AlertCircle, ArrowRight, ShieldCheck, Sparkles, Bell } from 'lucide-react';
import StatsOverview from '../components/StatsOverview';
import JobCard from '../components/JobCard';
import DSABadge from '../components/DSABadge';

export default function Dashboard({
  stats,
  closingSoonJobs,
  allJobs,
  loading,
  onNavigateExplore,
  onNavigateAlerts,
  onViewDetails,
  onOpenEmailModal,
}) {
  const totalVacancies = allJobs ? allJobs.reduce((sum, j) => sum + (j.vacancies || 0), 0) : 0;
  const recentJobs = allJobs ? allJobs.slice(0, 6) : [];

  return (
    <div>
      {/* Hero Banner */}
      <div className="glass-card" style={{
        padding: '2.25rem 2rem',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.95))',
        border: '1px solid rgba(59, 130, 246, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '750px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.75rem', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: 'var(--radius-full)', color: '#60a5fa', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem' }}>
            <Sparkles size={14} />
            Central & State Government Vacancy Portal 2026
          </div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '0.85rem' }}>
            Track Verified Government Jobs & <span style={{ color: 'var(--primary)' }}>Never Miss a Deadline</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.975rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Instant search across SSC, UPSC, Banking, Railways, Defence, and State PSC recruitments. Powered by custom in-memory Trie indexing and Min-Heap deadline alert queues.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={onNavigateExplore}>
              <Search size={16} />
              Explore All Jobs
            </button>
            <button className="btn btn-outline" onClick={onNavigateAlerts}>
              <Bell size={16} />
              View Urgent Alerts ({closingSoonJobs?.length || 0})
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <StatsOverview
        stats={stats}
        closingSoonCount={closingSoonJobs?.length || 0}
        totalVacancies={totalVacancies}
      />

      {/* Urgent Alerts Preview Section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Jobs Closing Soon (Next 7 Days)</h2>
              <DSABadge algorithm="Binary Search / Min-Heap" />
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              High-priority postings approaching their application cutoff dates.
            </p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onOpenEmailModal}>
            <Bell size={14} />
            Email Digest
          </button>
        </div>

        {loading ? (
          <div className="loading-spinner"></div>
        ) : closingSoonJobs && closingSoonJobs.length > 0 ? (
          <div className="jobs-grid">
            {closingSoonJobs.slice(0, 3).map((job) => (
              <JobCard key={job.job_id} job={job} onViewDetails={onViewDetails} />
            ))}
          </div>
        ) : (
          <div className="glass-card empty-state" style={{ padding: '2rem' }}>
            <AlertCircle size={32} className="empty-icon" />
            <p>No jobs closing in the next 7 days. You are all caught up!</p>
          </div>
        )}
      </div>

      {/* Recently Added / All Jobs Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Featured Vacancies</h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Latest active Indian government job notifications.
            </p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onNavigateExplore}>
            View All ({stats?.total_jobs || 0})
            <ArrowRight size={14} />
          </button>
        </div>

        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <div className="jobs-grid">
            {recentJobs.map((job) => (
              <JobCard key={job.job_id} job={job} onViewDetails={onViewDetails} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
