import React from 'react';
import { MapPin, GraduationCap, Users, Calendar, ExternalLink, Info, AlertTriangle } from 'lucide-react';

export default function JobCard({ job, onViewDetails }) {
  if (!job) return null;

  const daysLeft = job.days_left;

  let deadlineBadgeClass = 'deadline-normal';
  let deadlineText = `${daysLeft} days left`;

  if (daysLeft < 0) {
    deadlineBadgeClass = 'deadline-normal';
    deadlineText = 'Closed / Expired';
  } else if (daysLeft <= 3) {
    deadlineBadgeClass = 'deadline-urgent';
    deadlineText = `⚠️ Closes in ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}`;
  } else if (daysLeft <= 7) {
    deadlineBadgeClass = 'deadline-warning';
    deadlineText = `Closes in ${daysLeft} days`;
  }

  return (
    <div className="glass-card job-card">
      <div>
        <div className="job-card-header">
          <span className="category-tag">{job.category}</span>
          <span className={`deadline-badge ${deadlineBadgeClass}`}>
            <Calendar size={12} />
            {deadlineText}
          </span>
        </div>

        <h3 className="job-title">{job.title}</h3>
        <p className="job-dept">{job.department}</p>

        <div className="job-meta-list">
          <div className="job-meta-item">
            <MapPin size={14} style={{ color: 'var(--primary)' }} />
            <span>{job.location}</span>
          </div>

          <div className="job-meta-item">
            <GraduationCap size={14} style={{ color: 'var(--teal)' }} />
            <span>{job.qualification}</span>
          </div>

          {job.vacancies > 0 && (
            <div className="job-meta-item">
              <Users size={14} style={{ color: 'var(--emerald)' }} />
              <span><strong>{job.vacancies.toLocaleString()}</strong> Vacancies</span>
            </div>
          )}
        </div>
      </div>

      <div className="job-card-actions">
        <button
          className="btn btn-outline btn-sm"
          onClick={() => onViewDetails(job)}
        >
          <Info size={14} />
          Details
        </button>

        <a
          href={job.apply_link}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-sm"
        >
          Apply
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}
