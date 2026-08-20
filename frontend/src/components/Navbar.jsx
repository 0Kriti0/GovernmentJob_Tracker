import React from 'react';
import { Briefcase, Search, Bell, PlusCircle, LayoutDashboard, Cpu, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, isOnline, onOpenDSAModal, onOpenAddModal }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <a href="#" className="nav-brand" onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}>
            <div className="brand-icon">
              <Briefcase size={20} />
            </div>
            <div>
              <span>GovJob Tracker</span>
              <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                Official Alert & Discovery Portal
              </span>
            </div>
          </a>

          <div className={`status-badge ${isOnline ? 'online' : 'offline'}`}>
            <span className="status-dot"></span>
            {isOnline ? 'API Connected' : 'API Offline'}
          </div>
        </div>

        <nav>
          <ul className="nav-links">
            <li>
              <button
                className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </button>
            </li>
            <li>
              <button
                className={`nav-button ${activeTab === 'explore' ? 'active' : ''}`}
                onClick={() => setActiveTab('explore')}
              >
                <Search size={16} />
                Explore Jobs
              </button>
            </li>
            <li>
              <button
                className={`nav-button ${activeTab === 'alerts' ? 'active' : ''}`}
                onClick={() => setActiveTab('alerts')}
              >
                <Bell size={16} />
                Deadline Alerts
              </button>
            </li>
            <li>
              <button className="nav-button" onClick={onOpenAddModal}>
                <PlusCircle size={16} />
                Post Job
              </button>
            </li>
            <li>
              <button className="nav-button" style={{ color: 'var(--teal)' }} onClick={onOpenDSAModal}>
                <Cpu size={16} />
                Architecture
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
