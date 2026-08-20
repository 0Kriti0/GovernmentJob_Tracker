import React, { useState } from 'react';
import { X, PlusCircle, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { jobApi } from '../api/jobApi';

export default function AddJobModal({ isOpen, onClose, onJobAdded }) {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const in30DaysStr = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    category: 'Banking',
    location: 'All India',
    qualification: "Bachelor's Degree",
    vacancies: 100,
    post_date: todayStr,
    deadline: in30DaysStr,
    apply_link: 'https://example-govjobs.gov.in/apply',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'vacancies' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const createdJob = await jobApi.createJob(formData);
      setSuccessMsg(`Successfully registered job '${createdJob.title}' [${createdJob.job_id}]`);
      if (onJobAdded) onJobAdded(createdJob);
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1500);
    } catch (err) {
      if (err.status === 409) {
        setError('Duplicate Posting Rejected by Hash Set Index: A job with identical title, department, and post date already exists.');
      } else {
        setError(err.message || 'Failed to post job listing.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '1.25rem' }}>Post New Government Job</h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Registers job posting & re-indexes into Trie tree, Min-Heap, and Hash Set.
            </p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#f87171',
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertOctagon size={18} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399',
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Job Title *</label>
            <input
              type="text"
              name="title"
              required
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. IBPS Probationary Officer Recruitment 2026"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Department *</label>
              <input
                type="text"
                name="department"
                required
                className="form-input"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g. Institute of Banking Personnel Selection"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Banking">Banking</option>
                <option value="Railways">Railways</option>
                <option value="SSC">SSC</option>
                <option value="UPSC">UPSC</option>
                <option value="Defence">Defence</option>
                <option value="State PSC">State PSC</option>
                <option value="State PSU">State PSU</option>
                <option value="Central Govt">Central Govt</option>
                <option value="Education">Education</option>
                <option value="Insurance">Insurance</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Location *</label>
              <input
                type="text"
                name="location"
                required
                className="form-input"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. All India or Punjab"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Qualification *</label>
              <input
                type="text"
                name="qualification"
                required
                className="form-input"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="e.g. Bachelor's Degree / 12th Pass"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Vacancies</label>
              <input
                type="number"
                name="vacancies"
                min="1"
                className="form-input"
                value={formData.vacancies}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Post Date</label>
              <input
                type="date"
                name="post_date"
                required
                className="form-input"
                value={formData.post_date}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Deadline</label>
              <input
                type="date"
                name="deadline"
                required
                className="form-input"
                value={formData.deadline}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Apply Link</label>
            <input
              type="url"
              name="apply_link"
              required
              className="form-input"
              value={formData.apply_link}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Processing...' : 'Submit Job Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
