import React, { useState, useEffect } from 'react';
import { StudentPassportCard } from './StudentPassportCard';
import { ParentPassportCard } from './ParentPassportCard';
import { TeacherPassportCard } from './TeacherPassportCard';
import { ImageUploader } from './ImageUploader';
import { imageApi } from '../../services/api';

interface ProfileViewerProps {
  studentId: number | string;
  onClose?: () => void;
  canEdit?: boolean;
}

export const ProfileViewer: React.FC<ProfileViewerProps> = ({
  studentId,
  onClose,
  canEdit = true
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'personal' | 'academic' | 'parents' | 'teachers' | 'emergency'>('all');
  const [loading, setLoading] = useState(true);
  const [identityData, setIdentityData] = useState<any>(null);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  // Emergency contact editable states
  const [emergName, setEmergName] = useState('');
  const [emergPhone, setEmergPhone] = useState('');
  const [emergRel, setEmergRel] = useState('');
  const [emergAddr, setEmergAddr] = useState('');
  const [emergPhoto, setEmergPhoto] = useState('');
  const [isUpdatingEmerg, setIsUpdatingEmerg] = useState(false);

  useEffect(() => {
    async function loadIdentity() {
      setLoading(true);
      try {
        const res = await imageApi.getStudentIdentity(studentId);
        if (res.success && res.data?.identity) {
          const idt = res.data.identity;
          setIdentityData(idt);
          if (idt.student?.emergency_contact) {
            setEmergName(idt.student.emergency_contact.name || '');
            setEmergPhone(idt.student.emergency_contact.phone || '');
            setEmergRel(idt.student.emergency_contact.relationship || '');
            setEmergAddr(idt.student.emergency_contact.address || '');
            setEmergPhoto(idt.student.emergency_contact.photo || '');
          }
        }
      } catch (e) {
        console.warn('Digital identity load notice:', e);
      } finally {
        setLoading(false);
      }
    }
    loadIdentity();
  }, [studentId]);

  const handleSaveEmergencyContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingEmerg(true);
    try {
      const res = await imageApi.updateEmergencyContact(studentId, {
        name: emergName,
        phone: emergPhone,
        relationship: emergRel,
        address: emergAddr,
        photo: emergPhoto
      });
      if (res.success) {
        setSaveNotice('✓ Emergency contact updated in MySQL database!');
        setTimeout(() => setSaveNotice(null), 4000);
      }
    } catch (e) {
      console.warn('Emergency contact update error:', e);
    } finally {
      setIsUpdatingEmerg(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <span className="material-symbols-outlined text-4xl text-blue-600 animate-spin">progress_activity</span>
        <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
          Retrieving Digital Student Identity File from MySQL...
        </p>
      </div>
    );
  }

  const s = identityData?.student || {
    id: Number(studentId),
    full_name: 'John Emmanuel Smith',
    admission_number: 'EXM/2026/00125',
    class_name: 'SS2 Science',
    department: 'Science',
    academic_session: '2026/2027',
    school: 'ExcelMind Academy',
    gender: 'Male',
    date_of_birth: '2009-04-12',
    address: '15 Admiralty Way, Lekki Phase 1, Lagos',
    phone: '+2348012345678',
    email: 'john.smith@excelmind.edu.ng',
    student_passport: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'
  };

  return (
    <div className="space-y-6 pb-12 print:p-0 print:m-0">
      
      {/* Top Header Bar */}
      <div className="bg-gradient-to-r from-[#111B5E] via-indigo-950 to-blue-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/60 print:hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-white/10 backdrop-blur-sm text-blue-300">
                <span className="material-symbols-outlined text-2xl">badge</span>
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-300">
                Institutional Digital Student Identity File
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {s.full_name} • {s.admission_number}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200">
              Official digital dossier linking student, parent, class teacher, and subject teacher passport photographs with verified institutional credentials.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition flex items-center gap-2 cursor-pointer shadow"
            >
              <span className="material-symbols-outlined text-base">print</span>
              <span>Print Profile</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs shadow-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                <span>Back to Directory</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 pt-6 mt-4 border-t border-white/10 text-xs">
          {[
            { id: 'all', label: 'Complete Digital File', icon: 'view_agenda' },
            { id: 'personal', label: '1. Personal & Passport', icon: 'person' },
            { id: 'academic', label: '2. Academic Records', icon: 'school' },
            { id: 'parents', label: '3. Parents & Guardians', icon: 'family_restroom' },
            { id: 'teachers', label: '4. Assigned Teachers', icon: 'assignment_ind' },
            { id: 'emergency', label: '5. Emergency Contact', icon: 'emergency' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-indigo-200'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: PERSONAL & PASSPORT */}
      {(activeTab === 'all' || activeTab === 'personal') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <StudentPassportCard
              student={s}
              canEdit={canEdit}
              onPassportUpdated={(url) => {
                setIdentityData((prev: any) => ({
                  ...prev,
                  student: { ...(prev?.student || s), student_passport: url, photo: url }
                }));
              }}
            />
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
              <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600">
                <span className="material-symbols-outlined text-2xl">account_circle</span>
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Section 1: Detailed Personal Information
                </h3>
                <p className="text-xs text-slate-500">Official student biographical records</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Full Legal Name:</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{s.full_name}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Admission Number:</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">{s.admission_number}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Gender:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{s.gender || 'Male'}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Date of Birth:</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{s.date_of_birth}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Institutional Email:</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{s.email}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Contact Telephone:</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{s.phone}</span>
              </div>

              <div className="sm:col-span-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Residential Address:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{s.address}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <span className="material-symbols-outlined text-lg">photo_camera</span>
                <span>Need to update this student's official passport?</span>
              </div>
              <ImageUploader
                label="Update Passport"
                imageType="student_passport"
                studentId={s.id}
                currentImage={s.student_passport}
                onUploadSuccess={(url) => {
                  setIdentityData((prev: any) => ({
                    ...prev,
                    student: { ...(prev?.student || s), student_passport: url, photo: url }
                  }));
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: ACADEMIC INFORMATION */}
      {(activeTab === 'all' || activeTab === 'academic') && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-600">
                <span className="material-symbols-outlined text-2xl">auto_stories</span>
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Section 2: Academic Progress & Certified Transcripts
                </h3>
                <p className="text-xs text-slate-500">Continuous Assessment, WAEC results, and attendance metrics</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-mono font-bold text-xs">
                Attendance: {identityData?.academics?.attendanceRate || 95}%
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 font-mono font-bold text-xs">
                GPA: {identityData?.academics?.gpa || '3.82 / 4.0'}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/70 text-[10px] font-bold text-slate-400 uppercase">
                <tr>
                  <th className="px-4 py-3">Subject Name</th>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Term</th>
                  <th className="px-4 py-3">CA (30)</th>
                  <th className="px-4 py-3">Exam (70)</th>
                  <th className="px-4 py-3">Total (100)</th>
                  <th className="px-4 py-3">Grade</th>
                  <th className="px-4 py-3">Teacher Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {(identityData?.academics?.results?.length > 0 ? identityData.academics.results : [
                  { subject: { subject_name: 'General Mathematics', subject_code: 'MTH 301' }, term: 'Term 1', ca_score: '28.00', exam_score: '61.00', total_score: '89.00', grade: 'A1', teacher_comment: 'Excellent mathematical working' },
                  { subject: { subject_name: 'Physics', subject_code: 'PHY 302' }, term: 'Term 1', ca_score: '25.00', exam_score: '58.00', total_score: '83.00', grade: 'A1', teacher_comment: 'Superior kinematics derivations' },
                  { subject: { subject_name: 'Chemistry', subject_code: 'CHM 303' }, term: 'Term 1', ca_score: '22.00', exam_score: '53.00', total_score: '75.00', grade: 'B2', teacher_comment: 'Strong laboratory analysis' },
                  { subject: { subject_name: 'English Language', subject_code: 'ENG 304' }, term: 'Term 1', ca_score: '24.00', exam_score: '52.00', total_score: '76.00', grade: 'B2', teacher_comment: 'Good vocabulary and essay structure' }
                ]).map((r: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                      {r.subject?.subject_name || 'General Mathematics'}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-500">
                      {r.subject?.subject_code || 'MTH 301'}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {r.term || 'Term 1'}
                    </td>
                    <td className="px-4 py-3 font-mono">{Number(r.ca_score).toFixed(0)}</td>
                    <td className="px-4 py-3 font-mono">{Number(r.exam_score).toFixed(0)}</td>
                    <td className="px-4 py-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {Number(r.total_score).toFixed(0)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded font-black text-[11px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        {r.grade}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 max-w-xs truncate">
                      {r.teacher_comment}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: PARENT & GUARDIAN INFORMATION */}
      {(activeTab === 'all' || activeTab === 'parents') && (
        <ParentPassportCard
          studentId={s.id}
          parentId={identityData?.student?.parent_id}
          parentsData={identityData?.parents}
          canEdit={canEdit}
        />
      )}

      {/* SECTION 4: TEACHER INFORMATION */}
      {(activeTab === 'all' || activeTab === 'teachers') && (
        <TeacherPassportCard
          classTeacher={identityData?.teachers?.class_teacher}
          subjectTeachers={identityData?.teachers?.subject_teachers}
          canEdit={canEdit}
        />
      )}

      {/* SECTION 5: EMERGENCY CONTACT INFORMATION */}
      {(activeTab === 'all' || activeTab === 'emergency') && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/50 text-rose-600">
                <span className="material-symbols-outlined text-2xl">emergency</span>
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Section 5: Emergency Contact & Critical Incident File
                </h3>
                <p className="text-xs text-slate-500">Designated immediate responder in cases of health or logistical urgency</p>
              </div>
            </div>

            {saveNotice && (
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs animate-fadeIn">
                {saveNotice}
              </span>
            )}
          </div>

          <form onSubmit={handleSaveEmergencyContact} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Photo Column */}
            <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-center space-y-3">
              <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-md border-2 border-white dark:border-slate-700 bg-slate-200 dark:bg-slate-700">
                <img
                  src={emergPhoto || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'}
                  alt="Emergency Contact Passport"
                  className="w-full h-full object-cover"
                />
              </div>

              {canEdit && (
                <ImageUploader
                  label="Update Photo"
                  imageType="guardian_passport"
                  studentId={s.id}
                  currentImage={emergPhoto}
                  onUploadSuccess={(url) => setEmergPhoto(url)}
                />
              )}
            </div>

            {/* Fields Column */}
            <div className="md:col-span-2 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Emergency Contact Full Name
                  </label>
                  <input
                    type="text"
                    value={emergName}
                    onChange={(e) => setEmergName(e.target.value)}
                    disabled={!canEdit}
                    placeholder="Full Legal Name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Direct Telephone Line
                  </label>
                  <input
                    type="text"
                    value={emergPhone}
                    onChange={(e) => setEmergPhone(e.target.value)}
                    disabled={!canEdit}
                    placeholder="+234..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Relationship to Student
                  </label>
                  <input
                    type="text"
                    value={emergRel}
                    onChange={(e) => setEmergRel(e.target.value)}
                    disabled={!canEdit}
                    placeholder="e.g. Uncle / Paternal Aunt"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Residential Address
                  </label>
                  <input
                    type="text"
                    value={emergAddr}
                    onChange={(e) => setEmergAddr(e.target.value)}
                    disabled={!canEdit}
                    placeholder="Address in Lagos"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {canEdit && (
                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isUpdatingEmerg}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isUpdatingEmerg ? (
                      <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                    ) : (
                      <span className="material-symbols-outlined text-sm">save</span>
                    )}
                    <span>Save Emergency Contact</span>
                  </button>
                </div>
              )}
            </div>

          </form>
        </div>
      )}

    </div>
  );
};
