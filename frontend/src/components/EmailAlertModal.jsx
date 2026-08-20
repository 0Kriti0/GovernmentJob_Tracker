import React, { useState } from 'react';
import { X, Mail, Send, CheckCircle2, AlertTriangle } from 'lucide-react';
import { jobApi } from '../api/jobApi';

export default function EmailAlertModal({ isOpen, onClose, defaultDays = 7 }) {
  if (!isOpen) return null;

  const [toEmail, setToEmail] = useState('');
  const [withinDays, setWithinDays] = useState(defaultDays);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!toEmail) return;

    setLoading(true);
    setStatusMsg(null);

    try {
      const res = await jobApi.sendEmailAlert(toEmail, withinDays);
      setStatusMsg({
        type: 'success',
        text: res.message || `Deadline summary email dispatched to ${toEmail}!`,
      });
      setTimeout(() => {
        setStatusMsg(null);
        onClose();
      }, 2000);
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: err.message || 'Failed to dispatch email. Ensure GJT_EMAIL environment variables are configured on server.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="stat-icon-wrapper stat-icon-amber" style={{ width: 36, height: 36 }}>
              <Mail size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem' }}>Send Deadline Alerts via Email</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Sends a digest of upcoming closing jobs peeked from the Min-Heap.
              </p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {statusMsg && (
          <div style={{
            background: statusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
            border: `1px solid ${statusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
            color: statusMsg.type === 'success' ? '#34d399' : '#f87171',
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            {statusMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Recipient Email Address *</label>
            <input
              type="email"
              required
              className="form-input"
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              placeholder="candidate@example.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Alert Horizon (Jobs Closing Within N Days)</label>
            <select
              className="form-select"
              value={withinDays}
              onChange={(e) => setWithinDays(Number(e.target.value))}
            >
              <option value={3}>Next 3 Days</option>
              <option value={7}>Next 7 Days</option>
              <option value={14}>Next 14 Days</option>
              <option value={30}>Next 30 Days</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Send size={15} />
              {loading ? 'Sending...' : 'Dispatch Email Digest'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
