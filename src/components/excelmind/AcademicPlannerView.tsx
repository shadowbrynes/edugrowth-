import React, { useState } from 'react';
import { Assignment, TimetableSlot } from '../../types/excelmind';
import { TIMETABLE_DATA, ASSIGNMENTS_DATA } from '../../data/excelmindData';

export const AcademicPlannerView: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('Monday');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');
  const [assignments, setAssignments] = useState<Assignment[]>(ASSIGNMENTS_DATA);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissionNote, setSubmissionNote] = useState('');
  const [submissionFile, setSubmissionFile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday')[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday'
  ];

  const currentDaySlots = TIMETABLE_DATA.filter((s) => s.day === selectedDay);

  const filteredAssignments = assignments.filter((a) => {
    if (filterStatus === 'all') return true;
    return a.submission_status === filterStatus;
  });

  const handleOpenSubmissionModal = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setSubmissionNote(assignment.studentSubmissionNote || '');
    setSubmissionFile(assignment.attachedFile || null);
  };

  const handleSubmitAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const updated = assignments.map((a) => {
        if (a.assignment_id === selectedAssignment.assignment_id) {
          return {
            ...a,
            submission_status: 'submitted' as const,
            submittedDate: 'Just now',
            studentSubmissionNote: submissionNote || 'Completed via Academic Portal',
            attachedFile: submissionFile || `${selectedAssignment.subject}_Solution.pdf`
          };
        }
        return a;
      });

      setAssignments(updated);
      setIsSubmitting(false);
      setSelectedAssignment(null);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 4000);
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 z-50 animate-in fade-in slide-in-from-bottom-5">
          <span className="material-symbols-outlined text-2xl">check_circle</span>
          <div>
            <h4 className="text-xs font-bold">Assignment Submitted Successfully!</h4>
            <p className="text-[11px] text-emerald-100">Your teacher has been notified for assessment.</p>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                <span className="material-symbols-outlined text-2xl">calendar_month</span>
              </span>
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  Academic Planner & Deadlines
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage your weekly instructional timetable, calendar deadlines, and assignment submissions
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/50 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">notifications_active</span>
              3 Deadlines this week
            </span>
          </div>
        </div>

        {/* Automatic Reminders Banner */}
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-800/60 border border-blue-100 dark:border-slate-700 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#111B5E] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-lg">alarm</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Mathematics Assignment: Quadratic Curves & Tangent Gradient
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Due Friday, 10:00 AM • Status: <span className="text-rose-600 font-bold">Pending Submission</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => handleOpenSubmissionModal(assignments[0])}
            className="px-3.5 py-1.5 rounded-xl bg-[#111B5E] hover:bg-blue-900 text-white font-bold text-xs transition shrink-0 cursor-pointer"
          >
            Submit Portal
          </button>
        </div>
      </div>

      {/* Grid: Timetable & Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Weekly Timetable (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Weekly Class Timetable
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  SSS 3 Science & Technology • Academic Term 1
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">
                7 Periods / Day
              </span>
            </div>

            {/* Day Selector Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-x-auto mb-5">
              {days.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`flex-1 min-w-[70px] py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                    selectedDay === d
                      ? 'bg-[#111B5E] text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {d.slice(0, 3)}
                </button>
              ))}
            </div>

            {/* Timetable Period Rows */}
            <div className="space-y-2.5">
              {currentDaySlots.map((slot) => (
                <div
                  key={slot.id}
                  className={`p-3.5 rounded-2xl border transition hover:shadow-sm flex items-center justify-between gap-3 ${slot.color}`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-white/70 dark:bg-slate-900/50 flex items-center justify-center font-mono font-black text-xs shadow-sm">
                      P{slot.period}
                    </div>
                    <div>
                      <h4 className="text-xs font-black tracking-tight">{slot.subject}</h4>
                      <p className="text-[11px] opacity-80 mt-0.5">{slot.teacher}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold">{slot.time}</span>
                    <p className="text-[10px] font-semibold opacity-75">{slot.room}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Assignments Submission Portal (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Assignment Tracker
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Current submissions & grading rubrics
                </p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4 text-xs font-bold">
              {(['all', 'pending', 'submitted', 'graded'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`flex-1 py-1.5 rounded-lg capitalize transition cursor-pointer ${
                    filterStatus === status
                      ? 'bg-white dark:bg-slate-700 text-[#111B5E] dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Assignments List */}
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {filteredAssignments.map((asn) => {
                const isPending = asn.submission_status === 'pending';
                const isSubmitted = asn.submission_status === 'submitted';
                const isGraded = asn.submission_status === 'graded';

                return (
                  <div
                    key={asn.assignment_id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 hover:border-blue-400 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                        {asn.subject}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          isPending
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                            : isSubmitted
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        }`}
                      >
                        {asn.submission_status}
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 mt-1.5">
                      {asn.title}
                    </h4>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                      {asn.description}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-mono">
                        {isPending ? `Due: ${asn.deadline}` : isGraded ? `Score: ${asn.score}/${asn.maxScore} (${asn.grade})` : `Submitted: ${asn.submittedDate}`}
                      </span>

                      <button
                        onClick={() => handleOpenSubmissionModal(asn)}
                        className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer ${
                          isPending
                            ? 'bg-[#111B5E] hover:bg-blue-900 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300'
                        }`}
                      >
                        {isPending ? 'Submit' : 'View Details'}
                      </button>
                    </div>

                    {isGraded && asn.teacherFeedback && (
                      <div className="mt-2.5 p-2 bg-emerald-50/80 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/50 text-[11px] text-emerald-900 dark:text-emerald-200">
                        <span className="font-bold">Teacher Feedback:</span> {asn.teacherFeedback}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Assignment Submission Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase">
                  {selectedAssignment.subject} • Assignment Portal
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100 mt-0.5">
                  {selectedAssignment.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-bold block mb-1">Assignment Instructions:</span>
                {selectedAssignment.description}
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <span>Deadline: <b className="text-slate-900 dark:text-slate-100">{selectedAssignment.deadline}</b></span>
                <span>Max Marks: <b className="text-slate-900 dark:text-slate-100">{selectedAssignment.maxScore} pts</b></span>
              </div>

              <form onSubmit={handleSubmitAssignment} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Student Solution Note / Text Answers:
                  </label>
                  <textarea
                    rows={4}
                    value={submissionNote}
                    onChange={(e) => setSubmissionNote(e.target.value)}
                    placeholder="Type your workings, equations, or notes for the teacher here..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Attach Working Document / PDF / Scan:
                  </label>
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer">
                    <span className="material-symbols-outlined text-3xl text-blue-500">upload_file</span>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                      {submissionFile || 'Click to attach PDF or scanned worksheet'}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Supports PDF, DOCX, PNG, JPG (Max 15MB)</p>
                    <input
                      type="file"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSubmissionFile(e.target.files[0].name);
                        }
                      }}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="mt-2 inline-block px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg cursor-pointer hover:bg-slate-300"
                    >
                      Browse Device
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setSelectedAssignment(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-[#111B5E] hover:bg-blue-900 text-white text-xs font-black rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-sm">send</span>
                        <span>Confirm & Submit</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
