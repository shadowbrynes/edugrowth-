import React, { useState } from 'react';
import { Course, Lesson, ForumTopic } from '../../types/excelmind';
import { COURSES_DATA, FORUM_TOPICS_DATA } from '../../data/excelmindData';
import { TopicLearningWorkspace } from './TopicLearningWorkspace';

interface LearningHubViewProps {
  initialCourseId?: string;
}

export const LearningHubView: React.FC<LearningHubViewProps> = ({ initialCourseId }) => {
  const [courses, setCourses] = useState<Course[]>(COURSES_DATA);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    initialCourseId || COURSES_DATA[0].course_id
  );
  const [activeTab, setActiveTab] = useState<'lessons' | 'pdf' | 'audio' | 'quiz' | 'forum'>('lessons');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [showInteractiveWorkspace, setShowInteractiveWorkspace] = useState(false);
  const [forumTopics, setForumTopics] = useState<ForumTopic[]>(FORUM_TOPICS_DATA);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  // Quick Quiz State
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const selectedCourse = courses.find((c) => c.course_id === selectedCourseId) || courses[0];

  const handleToggleLessonComplete = (lessonId: string) => {
    const updated = courses.map((c) => {
      if (c.course_id === selectedCourse.course_id) {
        const updatedLessons = c.lessons.map((l) => (l.id === lessonId ? { ...l, completed: !l.completed } : l));
        const completedCount = updatedLessons.filter((l) => l.completed).length;
        const newProgress = Math.round((completedCount / updatedLessons.length) * 100);
        return {
          ...c,
          lessons: updatedLessons,
          progress: newProgress
        };
      }
      return c;
    });
    setCourses(updated);
  };

  const handleUpvoteTopic = (topicId: string) => {
    setForumTopics(
      forumTopics.map((t) => (t.id === topicId ? { ...t, upvotes: t.upvotes + 1 } : t))
    );
  };

  const handleAddForumPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const newTopic: ForumTopic = {
      id: `ft-${Date.now()}`,
      subject: selectedCourse.title,
      title: newPostTitle,
      author: 'John Doe (You)',
      authorRole: 'SSS 3 Student',
      repliesCount: 0,
      upvotes: 1,
      timeAgo: 'Just now',
      content: newPostContent
    };

    setForumTopics([newTopic, ...forumTopics]);
    setNewPostTitle('');
    setNewPostContent('');
    setShowNewPostModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner: Learning Hub Showcase */}
      <div className="bg-gradient-to-r from-[#111B5E] via-indigo-900 to-purple-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-white/10 backdrop-blur-sm">
                <span className="material-symbols-outlined text-2xl text-blue-300">hub</span>
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-300">
                Interactive Learning Management
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ExcelMind Learning Hub
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
              Access high-definition recorded video masterclasses, downloadable PDF lecture handbooks, audio podcasts, and peer discussion forums.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              onClick={() => setShowInteractiveWorkspace(true)}
              className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2 cursor-pointer transition transform hover:scale-105"
            >
              <span className="material-symbols-outlined text-base">dashboard_customize</span>
              <span>Open Multi-Panel Workspace (Physics SS2 Motion)</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-center">
                <span className="text-xl font-black font-mono text-blue-300">6</span>
                <p className="text-[10px] text-indigo-200 font-bold uppercase mt-0.5">Active Courses</p>
              </div>
              <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-center">
                <span className="text-xl font-black font-mono text-emerald-300">116+</span>
                <p className="text-[10px] text-indigo-200 font-bold uppercase mt-0.5">Lessons & Notes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showInteractiveWorkspace ? (
        <TopicLearningWorkspace onClose={() => setShowInteractiveWorkspace(false)} />
      ) : (
        <>

      {/* Course Selection Horizontal Rail */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        {courses.map((c) => {
          const isSelected = c.course_id === selectedCourseId;
          return (
            <button
              key={c.course_id}
              onClick={() => {
                setSelectedCourseId(c.course_id);
                setActiveLesson(null);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2.5 cursor-pointer border ${
                isSelected
                  ? 'bg-[#111B5E] text-white border-blue-600 shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <span className="font-mono text-[11px] opacity-80">{c.code}</span>
              <span>{c.title.split('&')[0].trim()}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md font-extrabold ${
                  isSelected ? 'bg-blue-500/30 text-blue-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {c.progress}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Course Overview Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                {selectedCourse.code} • {selectedCourse.category}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {selectedCourse.lessons.length} Modules Available
              </span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              {selectedCourse.title}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              {selectedCourse.description}
            </p>

            <div className="flex items-center gap-3 pt-1 text-xs">
              <img
                src={selectedCourse.teacherAvatar}
                alt={selectedCourse.teacher}
                className="w-7 h-7 rounded-full object-cover border border-blue-400"
              />
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Instructor: {selectedCourse.teacher}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 min-w-[240px]">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-700 dark:text-slate-300">Course Progress</span>
              <span className="font-mono text-blue-600 dark:text-blue-400 text-sm">{selectedCourse.progress}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden mb-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${selectedCourse.progress}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              Next: <span className="font-bold text-slate-800 dark:text-slate-200">{selectedCourse.nextLesson}</span>
            </p>
          </div>

        </div>

        {/* Media Formats Tab Bar */}
        <div className="flex items-center gap-2 pt-6 overflow-x-auto">
          {[
            { id: 'lessons', label: 'Video Lessons', icon: 'smart_display', count: selectedCourse.materialsCount.videos },
            { id: 'pdf', label: 'PDF Notes & Worksheets', icon: 'description', count: selectedCourse.materialsCount.pdfs },
            { id: 'audio', label: 'Audio Podcasts', icon: 'headphones', count: selectedCourse.materialsCount.audios },
            { id: 'quiz', label: 'Quick Quiz Practice', icon: 'quiz', count: selectedCourse.materialsCount.quizzes },
            { id: 'forum', label: 'Discussion Forum', icon: 'forum', count: forumTopics.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#111B5E] text-white shadow'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              <span>{tab.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area based on Active Tab */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        
        {/* TAB 1: VIDEO LESSONS */}
        {activeTab === 'lessons' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Interactive Video Lessons & Masterclasses
              </h3>
              <span className="text-xs text-slate-400">Click any lesson to open player</span>
            </div>

            {/* Video Player Mockup if activeLesson is chosen */}
            {activeLesson && (
              <div className="rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl p-6 text-white space-y-4">
                <div className="relative aspect-video w-full max-h-[380px] bg-slate-900 rounded-2xl flex flex-col items-center justify-center border border-slate-800 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
                  <div className="w-16 h-16 rounded-full bg-blue-600/90 group-hover:scale-110 group-hover:bg-blue-500 text-white flex items-center justify-center shadow-2xl transition cursor-pointer z-10">
                    <span className="material-symbols-outlined text-3xl ml-1">play_arrow</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold bg-blue-500/80 px-2 py-0.5 rounded">HD 1080p</span>
                      <h4 className="text-sm font-black text-white mt-1">{activeLesson.title}</h4>
                    </div>
                    <span className="text-xs font-mono text-slate-300 bg-black/60 px-2 py-1 rounded">
                      {activeLesson.durationOrPages}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <h3 className="text-base font-black text-white">{activeLesson.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{activeLesson.description}</p>
                  </div>
                  <button
                    onClick={() => handleToggleLessonComplete(activeLesson.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                      activeLesson.completed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {activeLesson.completed ? 'check_circle' : 'circle'}
                    </span>
                    <span>{activeLesson.completed ? 'Completed' : 'Mark Complete'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Lessons List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedCourse.lessons.map((l) => (
                <div
                  key={l.id}
                  onClick={() => setActiveLesson(l)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    activeLesson?.id === l.id
                      ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 shadow-sm'
                      : 'border-slate-200/80 dark:border-slate-800 hover:border-blue-300 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        l.completed
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                          : 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">
                        {l.completed ? 'check' : 'play_arrow'}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">
                        {l.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                        {l.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 font-mono">
                        <span>{l.durationOrPages}</span>
                        <span>•</span>
                        <span className="capitalize">{l.type} format</span>
                      </div>
                    </div>
                  </div>

                  <span className="material-symbols-outlined text-slate-400 hover:text-blue-600 text-lg">
                    chevron_right
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PDF NOTES & HANDBOOKS */}
        {activeTab === 'pdf' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Curriculum Handbooks & PDF Revision Notes
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Comprehensive notes compiled by WAEC chief examiners and subject department heads
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'Standard Formulae & Derivations Handbook', pages: '32 pages', size: '4.2 MB' },
                { title: 'WAEC Past 10-Year Theory Questions & Answers', pages: '58 pages', size: '7.8 MB' },
                { title: 'Laboratory Practical Manual & Calculations', pages: '24 pages', size: '3.1 MB' },
                { title: 'Mid-Term Summary & High-Yield Key Points', pages: '16 pages', size: '2.4 MB' }
              ].map((pdf, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between hover:border-purple-400 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                      <span className="material-symbols-outlined text-2xl">picture_as_pdf</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">{pdf.title}</h4>
                      <p className="text-[11px] text-slate-400 font-mono mt-1">{pdf.pages} • {pdf.size}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                    <button
                      onClick={() => alert(`Opening PDF viewer for: ${pdf.title}`)}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      Read Online
                    </button>
                    <button
                      onClick={() => alert(`Downloading PDF: ${pdf.title}`)}
                      className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-bold hover:bg-slate-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xs">download</span>
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: AUDIO PODCASTS */}
        {activeTab === 'audio' && (
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900 to-indigo-950 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-purple-300">
                  <span className="material-symbols-outlined text-3xl">headphones</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-300">
                    Audio Lecture Series
                  </span>
                  <h3 className="text-base font-black text-white">
                    Listen on the Go: High-Yield Audio Recaps
                  </h3>
                  <p className="text-xs text-indigo-200">
                    Reinforce your retention while commuting or during revision breaks.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => alert('Playing Audio Lecture 1')}
                  className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">play_arrow</span>
                  <span>Play Episode 1</span>
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { title: 'Audio 1: Trigonometric Identities & Angle Addition Formulas', duration: '22 mins', speaker: 'Mrs. Folashade Adeleke' },
                { title: 'Audio 2: Sarrus Rule & Determinants of 3x3 Matrices', duration: '18 mins', speaker: 'Mrs. Folashade Adeleke' },
                { title: 'Audio 3: Permutations with Repetitions & Word Arrangements', duration: '25 mins', speaker: 'Mrs. Folashade Adeleke' }
              ].map((aud, i) => (
                <div key={i} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => alert(`Playing ${aud.title}`)}
                      className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-200 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">play_arrow</span>
                    </button>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{aud.title}</p>
                      <p className="text-[11px] text-slate-400">{aud.speaker}</p>
                    </div>
                  </div>
                  <span className="font-mono text-slate-400 font-bold">{aud.duration}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: QUICK QUIZ PRACTICE */}
        {activeTab === 'quiz' && (
          <div className="max-w-xl mx-auto p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase">
                Lesson Mini-Quiz • 5 Points
              </span>
              <span className="text-xs text-slate-400 font-bold">Instant Self-Check</span>
            </div>

            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
                Question: What is the gradient (derivative) of the curve y = 3x² - 5x + 7 at the point x = 2?
              </h4>
            </div>

            <div className="space-y-2">
              {[
                { key: 'A', text: '5' },
                { key: 'B', text: '7' },
                { key: 'C', text: '12' },
                { key: 'D', text: '17' }
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => {
                    setQuizAnswer(opt.key);
                    setQuizSubmitted(false);
                  }}
                  className={`w-full p-3 rounded-xl text-left text-xs font-bold transition flex items-center gap-3 border cursor-pointer ${
                    quizAnswer === opt.key
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="w-6 h-6 rounded-md bg-black/10 dark:bg-white/10 flex items-center justify-center font-mono">
                    {opt.key}
                  </span>
                  <span>{opt.text}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setQuizSubmitted(true)}
                disabled={!quizAnswer}
                className="px-5 py-2.5 bg-[#111B5E] hover:bg-blue-900 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Submit Answer
              </button>
            </div>

            {quizSubmitted && (
              <div
                className={`p-4 rounded-2xl text-xs ${
                  quizAnswer === 'B'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-300'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-300'
                }`}
              >
                {quizAnswer === 'B' ? (
                  <div>
                    <span className="font-black text-sm">🎉 Correct! Option B (7)</span>
                    <p className="mt-1">
                      dy/dx = d/dx(3x² - 5x + 7) = 6x - 5. At x = 2: 6(2) - 5 = 12 - 5 = 7.
                    </p>
                  </div>
                ) : (
                  <div>
                    <span className="font-black text-sm">❌ Incorrect. The correct answer is Option B (7).</span>
                    <p className="mt-1">
                      dy/dx = 6x - 5. Substituting x = 2 gives 6(2) - 5 = 12 - 5 = 7.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: DISCUSSION FORUM */}
        {activeTab === 'forum' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Subject Discussion & Peer Community
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ask academic questions, collaborate on difficult problems, and receive verified answers from subject teachers
                </p>
              </div>

              <button
                onClick={() => setShowNewPostModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">add_comment</span>
                <span>Ask Question</span>
              </button>
            </div>

            {/* Forum Thread Items */}
            <div className="space-y-3">
              {forumTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-blue-400 transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {topic.subject}
                      </span>
                      <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">
                        {topic.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                        {topic.content}
                      </p>
                    </div>

                    {/* Upvote Button */}
                    <button
                      onClick={() => handleUpvoteTopic(topic.id)}
                      className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-500 flex flex-col items-center justify-center shrink-0 min-w-[42px] cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xs text-blue-600">arrow_upward</span>
                      <span className="text-[11px] font-mono font-bold text-slate-800 dark:text-slate-200">
                        {topic.upvotes}
                      </span>
                    </button>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700 dark:text-slate-300">{topic.author}</span>
                      <span>({topic.authorRole})</span>
                      <span>•</span>
                      <span>{topic.timeAgo}</span>
                    </div>

                    <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold cursor-pointer hover:underline">
                      <span className="material-symbols-outlined text-sm">chat_bubble</span>
                      <span>{topic.repliesCount} Replies</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* New Forum Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                Post to Subject Discussion Forum
              </h3>
              <button
                onClick={() => setShowNewPostModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form onSubmit={handleAddForumPost} className="py-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Question Title / Topic:
                </label>
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  required
                  placeholder="e.g. How to solve integration by parts with logarithmic terms"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Explanation / Working:
                </label>
                <textarea
                  rows={4}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  required
                  placeholder="Describe what you have tried and where you encountered difficulty..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#111B5E] hover:bg-blue-900 text-white text-xs font-bold rounded-xl shadow cursor-pointer"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </>
      )}

    </div>
  );
};
