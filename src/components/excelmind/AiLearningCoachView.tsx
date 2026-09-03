import React, { useState } from 'react';
import {
  AI_LEARNING_COACH_RECOMMENDATIONS,
  REVISION_PLAN_DATA,
  STUDENT_REWARDS_DATA,
  PARENT_AI_REPORT_DATA,
  CURRENT_STUDENT
} from '../../data/excelmindData';

export const AiLearningCoachView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'coach' | 'revision' | 'gamification' | 'offline' | 'parentReport'>('coach');
  const [offlineSyncActive, setOfflineSyncActive] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const [revisionWeeks, setRevisionWeeks] = useState(REVISION_PLAN_DATA.weeks);

  const toggleRevisionItem = (weekIndex: number, subjectIndex: number) => {
    const updated = [...revisionWeeks];
    updated[weekIndex].subjects[subjectIndex].completed = !updated[weekIndex].subjects[subjectIndex].completed;
    setRevisionWeeks(updated);
  };

  const handleDownloadOfflineNotes = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#111B5E] to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-900/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-white/10 backdrop-blur-sm text-emerald-300">
                <span className="material-symbols-outlined text-2xl">neurology</span>
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
                Personalized Cognitive Mentorship Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ExcelMind AI Learning Coach & Smart Revision
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-2xl">
              Real-time cognitive surveillance, adaptive CBT difficulty calibration, goal-oriented exam countdown schedules, and motivational gamification streaks.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15">
            <div className="text-center">
              <span className="text-[10px] font-mono text-emerald-300 uppercase block font-bold">Study Streak</span>
              <span className="text-2xl font-black text-white flex items-center justify-center gap-1">
                🔥 {CURRENT_STUDENT.studyStreakDays} <span className="text-xs font-normal">Days</span>
              </span>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <span className="text-[10px] font-mono text-purple-300 uppercase block font-bold">Reward XP</span>
              <span className="text-2xl font-black text-amber-400">
                {CURRENT_STUDENT.rewardPoints}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'coach', label: 'AI Learning Coach & Diagnostics', icon: 'psychology' },
          { id: 'revision', label: 'Smart Revision Planner (WAEC/JAMB)', icon: 'calendar_month' },
          { id: 'gamification', label: 'Achievements & Badges', icon: 'military_tech' },
          { id: 'offline', label: 'Offline Learning Support', icon: 'cloud_download' },
          { id: 'parentReport', label: 'Parent Monthly AI Report', icon: 'assessment' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#111B5E] text-white shadow'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: AI LEARNING COACH & ADAPTIVE DIAGNOSTICS */}
      {activeTab === 'coach' && (
        <div className="space-y-6">
          
          {/* Adaptive CBT Rule Engine Pill */}
          <div className="p-5 bg-gradient-to-r from-blue-900 via-indigo-900 to-[#111B5E] text-white rounded-3xl shadow-md border border-indigo-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400">tune</span>
                <h3 className="text-sm font-black uppercase tracking-wider text-amber-300">
                  Adaptive Cognitive CBT Tuning Active
                </h3>
              </div>
              <p className="text-xs text-indigo-200 max-w-2xl">
                The evaluation engine dynamically calibrates question difficulty: Scores &gt; 80% automatically trigger Advanced WAEC Olympiad questions; Scores &lt; 50% automatically deliver foundational remedial micro-lessons.
              </p>
            </div>
            <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-mono font-bold">
              Current Level: Level 3 (Optimal)
            </span>
          </div>

          {/* Diagnostics Cards */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
              Personalized Learning Intervention Signals
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {AI_LEARNING_COACH_RECOMMENDATIONS.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                        {rec.subject}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        rec.priority === 'high'
                          ? 'bg-rose-100 text-rose-800'
                          : rec.priority === 'medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {rec.priority.toUpperCase()} PRIORITY
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
                      {rec.topic}
                    </h4>

                    {/* Progress indicator */}
                    <div>
                      <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                        <span>Pacing Completion:</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{rec.studentCompletion}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            rec.studentCompletion < 50
                              ? 'bg-rose-500'
                              : rec.studentCompletion < 75
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${rec.studentCompletion}%` }}
                        ></div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                      "{rec.diagnosis}"
                    </p>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs border border-slate-200/60 dark:border-slate-700 space-y-1">
                      <span className="font-bold text-slate-900 dark:text-slate-100 block">AI Prescribed Plan:</span>
                      <p className="text-slate-600 dark:text-slate-300">{rec.actionPlan}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Starting action: ${rec.suggestedAction}`)}
                    className="w-full py-2.5 bg-[#111B5E] hover:bg-blue-900 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer"
                  >
                    {rec.suggestedAction}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: SMART REVISION PLANNER */}
      {activeTab === 'revision' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase">
                Goal-Driven Study Engine
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100 mt-0.5">
                {REVISION_PLAN_DATA.examName}
              </h3>
              <p className="text-xs text-slate-500">
                Target Date: <span className="font-bold text-slate-900 dark:text-slate-100">{REVISION_PLAN_DATA.examDate}</span> • Target: <span className="font-bold text-blue-600">{REVISION_PLAN_DATA.targetAggregate}</span>
              </p>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 px-4 py-2.5 rounded-2xl text-center">
              <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase block">Countdown</span>
              <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300 font-mono">
                {REVISION_PLAN_DATA.daysLeft} Days
              </span>
            </div>
          </div>

          {/* Weekly Schedule */}
          <div className="space-y-4">
            {revisionWeeks.map((week, wIdx) => (
              <div
                key={wIdx}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#111B5E] text-white flex items-center justify-center text-xs font-bold font-mono">
                      {week.weekNumber}
                    </span>
                    <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">
                      Week {week.weekNumber}: {week.focus}
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 font-bold">{week.weekRange}</span>
                </div>

                <div className="space-y-2 pt-1">
                  {week.subjects.map((item, sIdx) => (
                    <div
                      key={sIdx}
                      onClick={() => toggleRevisionItem(wIdx, sIdx)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                        item.completed
                          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-200'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => {}} // Handled by div click
                          className="w-4 h-4 rounded accent-emerald-600 cursor-pointer"
                        />
                        <div>
                          <span className="text-xs font-bold block">{item.name}</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.topic}</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-slate-400">
                        {item.hours} hrs study allocation
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 3: GAMIFICATION & BADGES */}
      {activeTab === 'gamification' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
              Academic Milestones, Achievements & Streak Badges
            </h3>
            <p className="text-xs text-slate-500">
              Gamified rewards unlocked through consistent daily study, CBT mock excellence, and homework completion.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STUDENT_REWARDS_DATA.map((rew) => (
              <div
                key={rew.id}
                className={`p-5 rounded-3xl border flex flex-col justify-between transition ${
                  rew.isUnlocked
                    ? 'bg-gradient-to-b from-amber-50/50 to-white dark:from-amber-950/20 dark:to-slate-900 border-amber-300 dark:border-amber-800/60 shadow-sm'
                    : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                      <span className="material-symbols-outlined text-2xl">{rew.icon}</span>
                    </span>
                    <span className="text-xs font-mono font-black text-amber-600">
                      +{rew.points} XP
                    </span>
                  </div>

                  <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">
                    {rew.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {rew.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                  {rew.isUnlocked ? (
                    <span className="font-mono font-bold text-emerald-600 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">verified</span>
                      <span>Unlocked {rew.unlockedDate}</span>
                    </span>
                  ) : (
                    <div>
                      <div className="flex justify-between text-slate-400 font-mono mb-1">
                        <span>Progress</span>
                        <span>{rew.currentProgress}/{rew.targetProgress}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${(rew.currentProgress / rew.targetProgress) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: OFFLINE LEARNING SUPPORT */}
      {activeTab === 'offline' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
              Offline Digital Learning & Local Cache Support
            </h3>
            <p className="text-xs text-slate-500">
              For locations with intermittent network connectivity, cache textbook PDF handbooks, audio lectures, and CBT mock exam question palettes directly on your device.
            </p>
          </div>

          {downloadSuccess && (
            <div className="p-3.5 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-300 text-xs font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              <span>12 Course modules & 150 CBT practice questions downloaded to local offline cache!</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
              <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-blue-600">download_for_offline</span>
                <span>Download SSS 3 Curriculum Revision Pack</span>
              </h4>
              <p className="text-xs text-slate-500">
                Includes all Physics, Mathematics, and Chemistry PDF textbooks, past questions, and audio podcast masterclasses (Approx. 24.5 MB).
              </p>
              <button
                onClick={handleDownloadOfflineNotes}
                className="px-4 py-2 bg-[#111B5E] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
              >
                Download Pack Now
              </button>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-purple-600">offline_pin</span>
                  <span>Offline CBT Simulation Engine</span>
                </h4>
                <input
                  type="checkbox"
                  checked={offlineSyncActive}
                  onChange={(e) => setOfflineSyncActive(e.target.checked)}
                  className="w-4 h-4 accent-purple-600 cursor-pointer"
                />
              </div>
              <p className="text-xs text-slate-500">
                When enabled, test sessions are scored locally without sending network requests until internet connection is restored.
              </p>
              <span className="text-[10px] font-mono font-bold text-emerald-600 block">
                {offlineSyncActive ? '✓ Offline Mode Engaged' : '○ Standby Mode'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PARENT MONTHLY AI REPORT */}
      {activeTab === 'parentReport' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-mono font-bold text-blue-600 uppercase">
                Guardian AI Executive Digest
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                {PARENT_AI_REPORT_DATA.month} Academic Summary for {PARENT_AI_REPORT_DATA.studentName}
              </h3>
              <p className="text-xs text-slate-500">Recipient: Engr. Michael Doe (Parent/Guardian)</p>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black text-[#111B5E] dark:text-blue-300 font-mono">
                {PARENT_AI_REPORT_DATA.academicScore}%
              </span>
              <span className="block text-[10px] font-bold text-emerald-600 uppercase">
                {PARENT_AI_REPORT_DATA.attendanceRate}% Certified Attendance
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 space-y-2">
              <h4 className="font-bold text-emerald-900 dark:text-emerald-200">
                🌟 Demonstrating Subject Mastery:
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-emerald-800 dark:text-emerald-300">
                {PARENT_AI_REPORT_DATA.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 space-y-2">
              <h4 className="font-bold text-amber-900 dark:text-amber-200">
                ⚠️ Recommended Diagnostic Attention:
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-amber-800 dark:text-amber-300">
                {PARENT_AI_REPORT_DATA.improvementAreas.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-5 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-2xl border border-indigo-200 dark:border-indigo-800 space-y-2 text-xs">
            <h4 className="font-bold text-indigo-950 dark:text-indigo-200">
              🤖 AI Learning Coach Strategic Guidance:
            </h4>
            <p className="text-indigo-900 dark:text-indigo-300 leading-relaxed">
              {PARENT_AI_REPORT_DATA.aiActionAdvice}
            </p>
            <div className="pt-2 text-[11px] font-mono font-bold text-blue-700 dark:text-blue-300">
              National Syllabus Benchmark: {PARENT_AI_REPORT_DATA.pacingSummary}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AiLearningCoachView;
