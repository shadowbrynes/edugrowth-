import React, { useState } from 'react';
import { generateStudentRemark } from '../../ai';
import { INITIAL_STUDENTS } from '../../data/mockData';

interface RecordRemarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  classNameTitle: string;
  onAddRemark: (studentName: string, subject: string, comment: string) => void;
}

export const RecordRemarksModal: React.FC<RecordRemarksModalProps> = ({ isOpen, onClose, classNameTitle, onAddRemark }) => {
  const [studentName, setStudentName] = useState('Alexander J. Sterling');
  const [subject, setSubject] = useState('MATHEMATICS');
  const [comment, setComment] = useState('');
  const [tone, setTone] = useState<'encouraging' | 'professional' | 'constructive'>('encouraging');
  const [generating, setGenerating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onAddRemark(studentName, subject, comment);
    setComment('');
    onClose();
  };

  const handleGenerateAI = async () => {
    setGenerating(true);
    try {
      // Find student details from mock data to make the prompt contextually rich
      const studentMatch = INITIAL_STUDENTS.find(s => 
        s.name.toLowerCase().includes(studentName.toLowerCase()) || 
        studentName.toLowerCase().includes(s.name.toLowerCase())
      );
      
      const gpa = studentMatch ? studentMatch.gpa : 3.80;
      const attendance = studentMatch ? studentMatch.attendance : 96;

      const generatedText = await generateStudentRemark(
        studentName,
        subject,
        gpa,
        attendance,
        tone
      );
      setComment(generatedText);
    } catch (err) {
      console.error(err);
      alert('AI Generation failed. Falling back to manual input.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl border border-outline-variant shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="p-6 bg-secondary text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>edit_note</span>
            <div>
              <h3 className="text-lg font-bold">Record Student Performance Remarks</h3>
              <p className="text-xs text-secondary-fixed">{classNameTitle} • Official Transcript Log</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-full">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">Select Student</label>
              <select
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-sm font-semibold"
              >
                <option value="Alexander J. Sterling">Alexander J. Sterling</option>
                <option value="Alice Lundberg">Alice Lundberg</option>
                <option value="Marcus Brown">Marcus Brown</option>
                <option value="Kevin Chen">Kevin Chen</option>
                <option value="Sophia Patel">Sophia Patel</option>
                <option value="Leo Vance">Leo Vance</option>
                <option value="Maya Vance">Maya Vance</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">Academic Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-sm uppercase font-semibold"
              />
            </div>
          </div>

          {/* Gemini AI Remark Assistant */}
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-purple-950 uppercase tracking-wider">
                <span className="material-symbols-outlined text-purple-700 text-lg animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                Gemini AI Assistant
              </span>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as any)}
                className="text-[10px] font-bold uppercase tracking-wider bg-white px-2 py-1 rounded border border-purple-200 text-purple-900 focus:outline-none"
              >
                <option value="encouraging">Encouraging Tone</option>
                <option value="professional">Professional Tone</option>
                <option value="constructive">Constructive Tone</option>
              </select>
            </div>
            <p className="text-[11px] text-purple-900/75 leading-relaxed">
              Generate a tailored progress remark draft based on student standing, GPA, class participation, and target subject.
            </p>
            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={generating}
              className="w-full py-2 bg-purple-700 hover:bg-purple-800 disabled:bg-purple-300 text-white font-bold rounded-lg text-xs tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {generating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                  Generating draft...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  Draft Progress Remark with Gemini
                </>
              )}
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">Teacher's Evaluation & Remarks</label>
            <textarea
              rows={3}
              required
              placeholder="Write qualitative observations regarding class participation, leadership, or quantitative understanding..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
            />
          </div>

          <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/50 text-xs text-on-surface-variant flex items-start gap-2">
            <span className="material-symbols-outlined text-secondary text-sm flex-shrink-0 mt-0.5">info</span>
            <span>Remarks recorded here will appear in the student's Parent Portal and Official Academic Transcript upon administrative verification.</span>
          </div>

          <div className="pt-4 border-t border-outline-variant flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-outline-variant hover:bg-surface">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 rounded-xl text-xs font-bold bg-secondary text-white shadow-md hover:bg-secondary/90 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">send</span>
              Save Remark
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
