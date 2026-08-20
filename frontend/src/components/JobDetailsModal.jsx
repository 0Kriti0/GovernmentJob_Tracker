import React from 'react';
import { X, Calendar, MapPin, GraduationCap, Users, Building, ExternalLink, ShieldCheck } from 'lucide-react';

export default function JobDetailsModal({ job, onClose }) {
  if (!job) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="category-tag">{job.category}</span>
            <h2 style={{ fontSize: '1.35rem', marginTop: '0.4rem', color: 'var(--text-primary)' }}>
              {job.title}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Job ID: <code style={{ color: 'var(--primary)' }}>{job.job_id}</code>
            </p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1.25rem 0' }}>
          <div className="glass-card" style={{ padding: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
              <div>
                <strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Department</strong>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{job.department}</span>
              </div>
              <div>
                <strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Location</strong>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{job.location}</span>
              </div>
              <div>
                <strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Qualification</strong>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{job.qualification}</span>
              </div>
              <div>
                <strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Vacancies</strong>
                <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>{job.vacancies.toLocaleString()} Posts</span>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
              <div>
                <strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Posted Date</strong>
                <span>{job.post_date}</span>
              </div>
              <div>
                <strong style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase' }}>Application Deadline</strong>
                <span style={{ color: job.days_left <= 3 ? 'var(--rose)' : 'var(--amber)', fontWeight: 600 }}>
                  {job.deadline} ({job.days_left} days left)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
          <a
            href={job.apply_link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Apply on Official Portal
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
