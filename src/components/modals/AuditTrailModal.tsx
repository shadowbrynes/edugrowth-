import React, { useState } from 'react';
import { SystemActivity } from '../../types';

interface AuditTrailModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: SystemActivity[];
  onAddLog: (log: SystemActivity) => void;
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({ isOpen, onClose, activities, onAddLog }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newLogText, setNewLogText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const filtered = activities.filter(act => 
    act.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    act.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
    act.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddManualLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogText.trim()) return;
    const newLog: SystemActivity = {
      id: `act-${Date.now()}`,
      type: 'upload',
      user: 'Admin User (Manual Entry)',
      action: 'logged note:',
      target: newLogText,
      timeAgo: 'Just now',
      timestamp: new Date().toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      icon: 'admin_panel_settings',
      colorClass: 'bg-primary text-white'
    };
    onAddLog(newLog);
    setNewLogText('');
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl border border-outline-variant shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        <div className="p-6 bg-primary text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary-fixed">security</span>
            <div>
              <h3 className="text-lg font-bold">System Audit Trail & Security Logs</h3>
              <p className="text-xs text-on-primary-container">Real-time immutable institutional activity feed</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-full">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Search & Action Bar */}
        <div className="p-4 bg-surface border-b border-outline-variant flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-sm">search</span>
            <input
              type="text"
              placeholder="Filter audit logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-outline-variant rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="w-full sm:w-auto px-4 py-2 bg-secondary text-white rounded-xl text-xs font-bold hover:bg-secondary/90 flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">{isAdding ? 'close' : 'add'}</span>
            {isAdding ? 'Cancel Manual Log' : 'Add Administrative Note'}
          </button>
        </div>

        {isAdding && (
          <form onSubmit={handleAddManualLog} className="p-4 bg-surface-container-low border-b border-outline-variant animate-fadeIn flex gap-2">
            <input
              type="text"
              placeholder="Enter administrative log or verification note..."
              value={newLogText}
              onChange={(e) => setNewLogText(e.target.value)}
              className="flex-1 px-4 py-2 bg-white border border-outline-variant rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
            <button type="submit" className="px-5 py-2 bg-secondary text-white text-xs font-bold rounded-xl shadow-sm hover:opacity-90">
              Post Log
            </button>
          </form>
        )}

        {/* Log Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-background">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-on-surface-variant">
              <span className="material-symbols-outlined text-3xl mb-2">manage_search</span>
              <p className="text-sm font-semibold">No system activities match your filter.</p>
            </div>
          ) : (
            filtered.map((act) => (
              <div key={act.id} className="flex gap-4 relative bg-white p-3.5 rounded-xl border border-outline-variant/50 shadow-sm hover:border-outline-variant transition-colors">
                <div className={`z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 ${act.colorClass}`}>
                  <span className="material-symbols-outlined text-white text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {act.icon}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-body-sm">
                      <span className="font-bold text-on-surface">{act.user}</span> {act.action}{' '}
                      <span className="font-bold text-secondary">{act.target}</span>
                    </p>
                    <span className="text-[10px] font-mono text-outline uppercase bg-surface px-2 py-0.5 rounded border border-outline-variant/30 flex-shrink-0">
                      {act.timeAgo}
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">history</span>
                    Verified Timestamp: {act.timestamp}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-surface-container border-t border-outline-variant flex justify-between items-center text-xs text-on-surface-variant">
          <span>Total Audit Entries: <strong>{activities.length}</strong></span>
          <button onClick={onClose} className="px-5 py-2 bg-primary text-white font-bold rounded-xl hover:opacity-90">
            Close Audit Trail
          </button>
        </div>
      </div>
    </div>
  );
};
