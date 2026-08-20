import React from 'react';
import { Briefcase, AlertCircle, Users, Cpu } from 'lucide-react';

export default function StatsOverview({ stats, closingSoonCount, totalVacancies }) {
  return (
    <div className="stats-grid">
      <div className="glass-card stat-card">
        <div className="stat-icon-wrapper stat-icon-blue">
          <Briefcase size={24} />
        </div>
        <div>
          <div className="stat-value">{stats?.total_jobs || 0}</div>
          <div className="stat-label">Active Job Postings</div>
        </div>
      </div>

      <div className="glass-card stat-card">
        <div className="stat-icon-wrapper stat-icon-amber">
          <AlertCircle size={24} />
        </div>
        <div>
          <div className="stat-value">{closingSoonCount || 0}</div>
          <div className="stat-label">Closing in Next 7 Days</div>
        </div>
      </div>

      <div className="glass-card stat-card">
        <div className="stat-icon-wrapper stat-icon-emerald">
          <Users size={24} />
        </div>
        <div>
          <div className="stat-value">
            {totalVacancies ? totalVacancies.toLocaleString() : '50,000+'}
          </div>
          <div className="stat-label">Total Vacancies</div>
        </div>
      </div>

      <div className="glass-card stat-card">
        <div className="stat-icon-wrapper stat-icon-purple">
          <Cpu size={24} />
        </div>
        <div>
          <div className="stat-value" style={{ fontSize: '1.25rem' }}>
            5/5 DSA Active
          </div>
          <div className="stat-label">Trie • Heap • Sort • Search • Hash</div>
        </div>
      </div>
    </div>
  );
}
