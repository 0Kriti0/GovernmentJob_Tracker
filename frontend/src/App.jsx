import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import JobsPage from './pages/JobsPage';
import AlertsPage from './pages/AlertsPage';
import JobDetailsModal from './components/JobDetailsModal';
import AddJobModal from './components/AddJobModal';
import EmailAlertModal from './components/EmailAlertModal';
import DSAModal from './components/DSAModal';
import { jobApi } from './api/jobApi';
import { ShieldCheck, Cpu } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isOnline, setIsOnline] = useState(false);

  const [stats, setStats] = useState({ total_jobs: 0, pending_in_alert_heap: 0 });
  const [closingSoonJobs, setClosingSoonJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isDSAModalOpen, setIsDSAModalOpen] = useState(false);
  const [emailAlertDays, setEmailAlertDays] = useState(7);

  const loadInitialData = async () => {
    setLoading(true);
    const online = await jobApi.checkHealth();
    setIsOnline(online);

    if (online) {
      try {
        const [statsRes, closingRes, allRes] = await Promise.all([
          jobApi.getStats(),
          jobApi.getJobsClosingSoon(7),
          jobApi.getAllJobs(false),
        ]);

        setStats(statsRes);
        setClosingSoonJobs(closingRes.jobs || []);
        setAllJobs(allRes.jobs || []);
      } catch (err) {
        console.error('Failed loading initial backend data:', err);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleOpenEmailModal = (days = 7) => {
    setEmailAlertDays(days);
    setIsEmailModalOpen(true);
  };

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOnline={isOnline}
        onOpenDSAModal={() => setIsDSAModalOpen(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard
            stats={stats}
            closingSoonJobs={closingSoonJobs}
            allJobs={allJobs}
            loading={loading}
            onNavigateExplore={() => setActiveTab('explore')}
            onNavigateAlerts={() => setActiveTab('alerts')}
            onViewDetails={(job) => setSelectedJobDetails(job)}
            onOpenEmailModal={handleOpenEmailModal}
          />
        )}

        {activeTab === 'explore' && (
          <JobsPage
            onViewDetails={(job) => setSelectedJobDetails(job)}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertsPage
            onViewDetails={(job) => setSelectedJobDetails(job)}
            onOpenEmailModal={handleOpenEmailModal}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '1.5rem',
        textAlign: 'center',
        fontSize: '0.8125rem',
        color: 'var(--text-muted)',
        background: 'rgba(11, 15, 25, 0.9)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <strong>Government Job Tracker & Alert System</strong> — Full-Stack DSA Project
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={14} style={{ color: 'var(--teal)' }} />
            <span>Trie • Min-Heap • Merge Sort • Binary Search • Hashing</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <JobDetailsModal
        job={selectedJobDetails}
        onClose={() => setSelectedJobDetails(null)}
      />

      <AddJobModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onJobAdded={() => loadInitialData()}
      />

      <EmailAlertModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        defaultDays={emailAlertDays}
      />

      <DSAModal
        isOpen={isDSAModalOpen}
        onClose={() => setIsDSAModalOpen(false)}
      />
    </div>
  );
}
