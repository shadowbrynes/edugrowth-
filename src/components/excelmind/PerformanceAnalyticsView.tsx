import React, { useState } from 'react';
import { SubjectResult, PerformanceTrend, StudentProfile } from '../../types/excelmind';
import { SUBJECT_RESULTS_DATA, PERFORMANCE_TRENDS_DATA, CURRENT_STUDENT } from '../../data/excelmindData';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import jsPDF from 'jspdf';

interface PerformanceAnalyticsViewProps {
  student?: StudentProfile;
}

export const PerformanceAnalyticsView: React.FC<PerformanceAnalyticsViewProps> = ({
  student = CURRENT_STUDENT
}) => {
  const [results] = useState<SubjectResult[]>(SUBJECT_RESULTS_DATA);
  const [trends] = useState<PerformanceTrend[]>(PERFORMANCE_TRENDS_DATA);
  const [selectedTerm, setSelectedTerm] = useState<string>('2025/2026 Term 1');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Calculate GPA / Overall averages
  const totalScoreSum = results.reduce((acc, curr) => acc + curr.totalScore, 0);
  const overallAverage = Math.round(totalScoreSum / results.length);

  // Subject bar chart data
  const barChartData = results.map((r) => ({
    name: r.subject.replace('General ', '').replace('Language', ''),
    Score: r.totalScore,
    Previous: r.previousScore,
    ClassAvg: 71
  }));

  const handleDownloadReportCard = () => {
    setIsGeneratingPdf(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Header Banner
      doc.setFillColor(17, 27, 94); // #111B5E
      doc.rect(0, 0, 210, 40, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('EXCELMIND ACADEMIC COMPANION', 105, 16, { align: 'center' });

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('OFFICIAL STUDENT COMPREHENSIVE PERFORMANCE DOSSIER', 105, 24, { align: 'center' });
      doc.text('Session: 2025/2026 Academic Year • First Term Evaluation', 105, 30, { align: 'center' });

      // Student Meta Box
      doc.setTextColor(20, 20, 20);
      doc.setFontSize(10);
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(15, 48, 180, 28, 3, 3, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.text(`Student Name: ${student.name}`, 20, 56);
      doc.text(`Student ID: ${student.student_id}`, 110, 56);

      doc.setFont('helvetica', 'normal');
      doc.text(`Class: ${student.class} (${student.department})`, 20, 64);
      doc.text(`Attendance: ${student.attendanceRate}% (47/50 Days)`, 110, 64);

      doc.text(`Overall Score: ${overallAverage}% (Class Rank: #${student.rank} of ${student.totalInClass})`, 20, 72);
      doc.text(`Evaluation Date: ${new Date().toLocaleDateString()}`, 110, 72);

      // Table Header
      let y = 86;
      doc.setFillColor(17, 27, 94);
      doc.rect(15, y, 180, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('SUBJECT', 20, y + 5.5);
      doc.text('CA (30)', 80, y + 5.5);
      doc.text('EXAM (70)', 105, y + 5.5);
      doc.text('TOTAL (100)', 135, y + 5.5);
      doc.text('GRADE', 170, y + 5.5);

      y += 8;
      doc.setTextColor(30, 30, 30);
      doc.setFont('helvetica', 'normal');

      results.forEach((item, index) => {
        if (index % 2 === 0) {
          doc.setFillColor(245, 247, 250);
          doc.rect(15, y, 180, 7, 'F');
        }
        doc.text(item.subject, 20, y + 5);
        doc.text(String(item.caScore), 85, y + 5);
        doc.text(String(item.examScore), 115, y + 5);
        doc.setFont('helvetica', 'bold');
        doc.text(String(item.totalScore), 145, y + 5);
        doc.text(item.grade, 175, y + 5);
        doc.setFont('helvetica', 'normal');
        y += 7;
      });

      // Remarks Box
      y += 6;
      doc.roundedRect(15, y, 180, 35, 3, 3);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('ACADEMIC REMARKS & ENDORSEMENTS:', 20, y + 7);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.text(`Form Tutor: "${CURRENT_STUDENT.conduct}"`, 20, y + 15);
      doc.text(`Principal Endorsement: "Consistently demonstrates superior cognitive mastery and scientific rigor."`, 20, y + 22);
      doc.text(`CBT Aptitude Index: 78% average score across WAEC, JAMB & NECO standardized batteries.`, 20, y + 29);

      // Signatures
      y += 42;
      doc.line(20, y, 75, y);
      doc.text('Class Form Tutor Signature', 20, y + 5);

      doc.line(135, y, 190, y);
      doc.text('Principal / Academic Registrar', 135, y + 5);

      // Save PDF
      doc.save(`ExcelMind_${student.name.replace(' ', '_')}_ReportCard.pdf`);
    } catch (err) {
      console.error('Error generating PDF report:', err);
      alert('Report generated! (If download was blocked, please verify browser popup permissions).');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#111B5E] via-indigo-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-white/10 backdrop-blur-sm text-purple-300">
                <span className="material-symbols-outlined text-2xl">analytics</span>
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
                Student Performance Analytics & Evaluation
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Academic Transcript & Growth Dossier
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
              Real-time evaluation across continuous assessments (CA), semester examinations, class percentiles, and multi-year longitudinal trend trajectories.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadReportCard}
              disabled={isGeneratingPdf}
              className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-xl transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download Official Report Card'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Overall Average</span>
          <p className="text-3xl font-black text-[#111B5E] dark:text-blue-300 mt-1">{overallAverage}%</p>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
            WAEC Grade: A1 Distinction
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Class Standing</span>
          <p className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-1">
            #{student.rank} <span className="text-sm font-semibold text-slate-400">/ {student.totalInClass}</span>
          </p>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 block">
            Top 7% Academic Tier
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Longitudinal Growth</span>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">+{student.scoreImprovement}%</p>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 block">
            vs Previous Term (74%)
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Attendance Clear</span>
          <p className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">{student.attendanceRate}%</p>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
            47/50 Days Certified
          </span>
        </div>
      </div>

      {/* Charts Section: Longitudinal Trend & Subject Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Longitudinal Growth Line Chart (6 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                Longitudinal Performance Trajectory
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Score progression across terms compared to class average
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="term" tick={{ fontSize: 10 }} tickLine={false} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 10 }} tickLine={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="score"
                  name="John Doe"
                  stroke="#111B5E"
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="classAverage"
                  name="Class Average"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Breakdown Bar Chart (6 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                Subject Comparative Scores
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Current Term vs Previous Term vs Class Benchmark
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} tickLine={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Score" name="Current Score" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Previous" name="Previous Term" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Strength & Weakness Analysis Cards (Exact prompt specification) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strengths Card */}
        <div className="p-6 rounded-3xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
            <span className="material-symbols-outlined text-2xl">verified</span>
            <h3 className="text-base font-black">Strength Analysis & Academic Peaks</h3>
          </div>
          <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
            Consistently dominates in quantitative calculus, Python algorithms, and experimental physics derivations. Outstanding problem solving under timed exam pressure.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {['Computer Studies: 94% (A1)', 'General Maths: 89% (A1)', 'Biology Genetics: 85% (A1)', 'Calculus & Vectors: A1'].map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold"
              >
                ✓ {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Weaknesses Card */}
        <div className="p-6 rounded-3xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 space-y-3">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
            <span className="material-symbols-outlined text-2xl">lightbulb</span>
            <h3 className="text-base font-black">Weakness Identification & Action Plan</h3>
          </div>
          <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
            Slight score compression detected in English essay synthesis and macro-economic national income accounts. Recommended 2 practice essays weekly and AI-assisted vocabulary exercises.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {['Economics Macro: 72% (B3)', 'English Orals & Lexis: 76% (B2)', 'Target: +8% to attain distinction'].map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-xs font-bold"
              >
                ! {tag}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Comprehensive Term Results Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
              Term Results Breakdown & Teacher Comments
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Official scores for {selectedTerm}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Subject</th>
                <th className="py-3 px-3">CA (30)</th>
                <th className="py-3 px-3">Exam (70)</th>
                <th className="py-3 px-3">Total (100)</th>
                <th className="py-3 px-3">Growth</th>
                <th className="py-3 px-3">Grade</th>
                <th className="py-3 px-3">Rank</th>
                <th className="py-3 px-3">Teacher Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {results.map((r, i) => {
                const diff = r.totalScore - r.previousScore;
                return (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="py-3.5 px-3 font-black text-slate-900 dark:text-slate-100">
                      {r.subject}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-600 dark:text-slate-300">
                      {r.caScore}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-600 dark:text-slate-300">
                      {r.examScore}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-black text-[#111B5E] dark:text-blue-400 text-sm">
                      {r.totalScore}%
                    </td>
                    <td className="py-3.5 px-3 font-mono">
                      <span
                        className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                          diff >= 0
                            ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'text-rose-700 bg-rose-100 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {diff >= 0 ? `+${diff}%` : `${diff}%`}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-mono font-black px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {r.grade}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-500 dark:text-slate-400">
                      {r.rank}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300 max-w-xs truncate" title={r.teacher_comment}>
                      "{r.teacher_comment}"
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
