import React, { useState } from 'react';
import { CriticalAlert } from '../../types';
import { generateInterventionPlan, generateAdvisingEmail } from '../../ai';

interface CriticalAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: CriticalAlert[];
  onResolve: (id: string) => void;
}

export const CriticalAlertsModal: React.FC<CriticalAlertsModalProps> = ({ isOpen, onClose, alerts, onResolve }) => {
  const [filter, setFilter] = useState<'all' | 'attendance' | 'grade_drop'>('all');
  const [selectedAlert, setSelectedAlert] = useState<CriticalAlert | null>(null);
  const [aiText, setAiText] = useState<string>('');
  const [aiType, setAiType] = useState<'plan' | 'email' | null>(null);
  const [generating, setGenerating] = useState(false);

  if (!isOpen) return null;

  const handleSelectAlert = (alert: CriticalAlert | null) => {
    setSelectedAlert(alert);
    setAiText('');
    setAiType(null);
  };

  const handleGeneratePlan = async (alertData: CriticalAlert) => {
    setGenerating(true);
    setAiType('plan');
    try {
      const plan = await generateInterventionPlan(
        alertData.studentName,
        alertData.type,
        alertData.details,
        alertData.assignedAdvisor || 'Academic Advisor'
      );
      setAiText(plan);
    } catch (e) {
      console.error(e);
      alert('Failed to generate intervention plan.');
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateEmail = async (alertData: CriticalAlert) => {
    setGenerating(true);
    setAiType('email');
    try {
      const email = await generateAdvisingEmail(
        alertData.studentName,
        alertData.type,
        alertData.details,
        alertData.assignedAdvisor || 'Academic Advisor'
      );
      setAiText(email);
    } catch (e) {
      console.error(e);
      alert('Failed to generate parent advising email.');
    } finally {
      setGenerating(false);
    }
  };

  const filteredAlerts = alerts.filter(a => filter === 'all' ? true : a.type === filter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl border border-outline-variant shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
        <div className="p-6 bg-error text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            <div>
              <h3 className="text-lg font-bold">Critical Institutional Alerts ({alerts.length} Active Cases)</h3>
              <p className="text-xs text-white/80">Students requiring immediate academic or attendance intervention</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-full">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 pt-4 bg-surface border-b border-outline-variant flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold transition-all ${filter === 'all' ? 'bg-white text-error border-t border-x border-outline-variant shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            All Cases ({alerts.length})
          </button>
          <button
            onClick={() => setFilter('attendance')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold transition-all ${filter === 'attendance' ? 'bg-white text-error border-t border-x border-outline-variant shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Attendance Below 70% ({alerts.filter(a => a.type === 'attendance').length})
          </button>
          <button
            onClick={() => setFilter('grade_drop')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold transition-all ${filter === 'grade_drop' ? 'bg-white text-error border-t border-x border-outline-variant shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Rapid Grade Decline ({alerts.filter(a => a.type === 'grade_drop').length})
          </button>
        </div>

        {/* List of Alerts */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar bg-background">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12 text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl text-tertiary-fixed-dim mb-2">check_circle</span>
              <p className="text-sm font-semibold">No active alerts in this category!</p>
            </div>
          ) : (
            filteredAlerts.map(alert => (
              <div
                key={alert.id}
                className="bg-white p-4 rounded-xl border border-error/20 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-error/40 transition-all"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-error text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {alert.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-on-surface">{alert.studentName}</h4>
                      <span className="text-xs font-mono px-2 py-0.5 bg-error-container text-on-error-container rounded font-bold">
                        {alert.value}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1">{alert.details}</p>
                    <div className="flex items-center gap-4 mt-2 text-[11px] text-on-surface-variant/80">
                      <span>Logged: <strong className="text-on-surface">{alert.date}</strong></span>
                      <span>•</span>
                      <span>Advisor: <strong className="text-secondary">{alert.assignedAdvisor}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                  <button
                    onClick={() => handleSelectAlert(alert)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-container text-primary hover:bg-surface-container-highest transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">edit_note</span>
                    Action Plan
                  </button>
                  <button
                    onClick={() => {
                      onResolve(alert.id);
                      if (selectedAlert?.id === alert.id) {
                        handleSelectAlert(null);
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-tertiary-container text-tertiary-fixed hover:opacity-90 transition-opacity flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Resolve
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedAlert && (
          <div className="p-5 bg-purple-50 border-t border-purple-100 animate-fadeIn space-y-4 max-h-[40vh] overflow-y-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-purple-950 flex items-center gap-1.5 text-sm">
                  <span className="material-symbols-outlined text-purple-700 animate-pulse text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  Gemini Academic Intervention Suite: {selectedAlert.studentName}
                </h4>
                <p className="text-xs text-purple-900/60 mt-0.5">
                  Analyze issues and draft corrective actions or contact advising templates.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleGeneratePlan(selectedAlert)}
                  disabled={generating}
                  className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 disabled:bg-purple-300 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs">receipt_long</span>
                  Generate Plan
                </button>
                <button
                  type="button"
                  onClick={() => handleGenerateEmail(selectedAlert)}
                  disabled={generating}
                  className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 disabled:bg-purple-300 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs">mail</span>
                  Draft Email
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectAlert(null)}
                  className="px-3 py-1.5 border border-outline-variant text-on-surface-variant hover:bg-surface rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>

            {generating && (
              <div className="flex items-center justify-center gap-2 py-6 text-xs text-purple-900 font-medium">
                <div className="w-4 h-4 border-2 border-purple-700 border-t-transparent animate-spin rounded-full" />
                <span>Gemini is compiling analytical academic insights...</span>
              </div>
            )}

            {aiText && !generating && (
              <div className="space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-purple-950 bg-purple-100 px-2 py-0.5 rounded border border-purple-200">
                    Generated {aiType === 'plan' ? 'Intervention Plan' : 'Advising Email'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(aiText);
                      alert('Copied to clipboard!');
                    }}
                    className="text-[10px] font-bold text-purple-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs">content_copy</span>
                    Copy to Clipboard
                  </button>
                </div>
                <textarea
                  rows={5}
                  value={aiText}
                  onChange={(e) => setAiText(e.target.value)}
                  className="w-full p-3 text-xs bg-white border border-purple-200 rounded-lg text-on-surface focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono leading-relaxed"
                />
              </div>
            )}
          </div>
        )}

        <div className="p-4 bg-surface-container-low border-t border-outline-variant flex justify-between items-center text-xs text-on-surface-variant">
          <span>Showing <strong>{filteredAlerts.length}</strong> of <strong>{alerts.length}</strong> cases</span>
          <button onClick={onClose} className="px-5 py-2 bg-secondary text-white font-bold rounded-xl shadow-sm hover:opacity-90 cursor-pointer">
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
