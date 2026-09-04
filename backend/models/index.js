const sequelize = require('../config/database');

// Import all models
const User = require('./User');
const School = require('./School');
const Department = require('./Department');
const Class = require('./Class');
const Student = require('./Student');
const Teacher = require('./Teacher');
const Parent = require('./Parent');
const ParentStudent = require('./ParentStudent');
const Subject = require('./Subject');
const Course = require('./Course');
const Topic = require('./Topic');
const Lesson = require('./Lesson');
const Assignment = require('./Assignment');
const AssignmentSubmission = require('./AssignmentSubmission');
const Attendance = require('./Attendance');
const Exam = require('./Exam');
const Question = require('./Question');
const ExamAttempt = require('./ExamAttempt');
const StudentExamResult = require('./StudentExamResult');
const AcademicResult = require('./AcademicResult');
const Result = require('./Result');
const ReportCard = require('./ReportCard');
const Message = require('./Message');
const CommunicationLog = require('./CommunicationLog');
const CommunicationSetting = require('./CommunicationSetting');
const Notification = require('./Notification');
const AIChatHistory = require('./AIChatHistory');
const AIRecommendation = require('./AIRecommendation');
const File = require('./File');
const PasswordResetToken = require('./PasswordResetToken');
const LoginActivity = require('./LoginActivity');
const AuditLog = require('./AuditLog');
const Timetable = require('./Timetable');
const ProfileImage = require('./ProfileImage');
const CommunityPost = require('./CommunityPost');
const CommunityComment = require('./CommunityComment');
const StudentEnvironment = require('./StudentEnvironment');
const CurriculumKnowledge = require('./CurriculumKnowledge');
const AILearningContext = require('./AILearningContext');
const AIQuestion = require('./AIQuestion');

// --- Associations ---

// User <-> Student (1:1)
User.hasOne(Student, { foreignKey: 'user_id', as: 'student_profile', onDelete: 'CASCADE' });
Student.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User <-> Teacher (1:1)
User.hasOne(Teacher, { foreignKey: 'user_id', as: 'teacher_profile', onDelete: 'CASCADE' });
Teacher.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User <-> Parent (1:1)
User.hasOne(Parent, { foreignKey: 'user_id', as: 'parent_profile', onDelete: 'CASCADE' });
Parent.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Parent <-> Student (1:N & M:N via ParentStudent)
Parent.hasMany(Student, { foreignKey: 'parent_id', as: 'children' });
Student.belongsTo(Parent, { foreignKey: 'parent_id', as: 'parent' });

// Class <-> Student (1:N)
Class.hasMany(Student, { foreignKey: 'class_id', as: 'students' });
Student.belongsTo(Class, { foreignKey: 'class_id', as: 'class' });

// Teacher <-> Class (1:N)
Teacher.hasMany(Class, { foreignKey: 'class_teacher_id', as: 'managed_classes' });
Class.belongsTo(Teacher, { foreignKey: 'class_teacher_id', as: 'class_teacher' });

// Subject <-> Topic (1:N)
Subject.hasMany(Topic, { foreignKey: 'subject_id', as: 'topics' });
Topic.belongsTo(Subject, { foreignKey: 'subject_id', as: 'subject' });

// Timetable associations
Class.hasMany(Timetable, { foreignKey: 'class_id', as: 'timetable_entries' });
Timetable.belongsTo(Class, { foreignKey: 'class_id', as: 'class' });

Subject.hasMany(Timetable, { foreignKey: 'subject_id', as: 'timetable_slots' });
Timetable.belongsTo(Subject, { foreignKey: 'subject_id', as: 'subject' });

Teacher.hasMany(Timetable, { foreignKey: 'teacher_id', as: 'teaching_slots' });
Timetable.belongsTo(Teacher, { foreignKey: 'teacher_id', as: 'teacher' });

// Assignment associations
Subject.hasMany(Assignment, { foreignKey: 'subject_id', as: 'assignments' });
Assignment.belongsTo(Subject, { foreignKey: 'subject_id', as: 'subject' });

Teacher.hasMany(Assignment, { foreignKey: 'teacher_id', as: 'given_assignments' });
Assignment.belongsTo(Teacher, { foreignKey: 'teacher_id', as: 'teacher' });

// Assignment <-> Submission
Assignment.hasMany(AssignmentSubmission, { foreignKey: 'assignment_id', as: 'submissions' });
AssignmentSubmission.belongsTo(Assignment, { foreignKey: 'assignment_id', as: 'assignment' });

Student.hasMany(AssignmentSubmission, { foreignKey: 'student_id', as: 'assignment_submissions' });
AssignmentSubmission.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

// Exam <-> Subject & Teacher
Subject.hasMany(Exam, { foreignKey: 'subject_id', as: 'exams' });
Exam.belongsTo(Subject, { foreignKey: 'subject_id', as: 'subject' });

Teacher.hasMany(Exam, { foreignKey: 'created_by', as: 'created_exams' });
Exam.belongsTo(Teacher, { foreignKey: 'created_by', as: 'creator' });

// Exam <-> Question (1:N)
Exam.hasMany(Question, { foreignKey: 'exam_id', as: 'questions' });
Question.belongsTo(Exam, { foreignKey: 'exam_id', as: 'exam' });

// Exam <-> ExamAttempt
Exam.hasMany(ExamAttempt, { foreignKey: 'exam_id', as: 'attempts' });
ExamAttempt.belongsTo(Exam, { foreignKey: 'exam_id', as: 'exam' });

Student.hasMany(ExamAttempt, { foreignKey: 'student_id', as: 'exam_attempts' });
ExamAttempt.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

// Student <-> Exam Results
Student.hasMany(StudentExamResult, { foreignKey: 'student_id', as: 'exam_results' });
StudentExamResult.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

// Academic Results
Student.hasMany(AcademicResult, { foreignKey: 'student_id', as: 'academic_results' });
AcademicResult.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

Subject.hasMany(AcademicResult, { foreignKey: 'subject_id', as: 'subject_results' });
AcademicResult.belongsTo(Subject, { foreignKey: 'subject_id', as: 'subject' });

// Attendance
Student.hasMany(Attendance, { foreignKey: 'student_id', as: 'attendance_records' });
Attendance.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

Class.hasMany(Attendance, { foreignKey: 'class_id', as: 'class_attendance' });
Attendance.belongsTo(Class, { foreignKey: 'class_id', as: 'class' });

// Messages (Sender & Receiver)
User.hasMany(Message, { foreignKey: 'sender_id', as: 'sent_messages' });
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });

User.hasMany(Message, { foreignKey: 'receiver_id', as: 'received_messages' });
Message.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver' });

// Notifications
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Login Activity
User.hasMany(LoginActivity, { foreignKey: 'user_id', as: 'login_history' });
LoginActivity.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Password Reset Token
User.hasMany(PasswordResetToken, { foreignKey: 'user_id', as: 'reset_tokens' });
PasswordResetToken.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Course <-> Lesson
Course.hasMany(Lesson, { foreignKey: 'topic_id', as: 'lessons' });
Lesson.belongsTo(Course, { foreignKey: 'topic_id', as: 'course' });

// School associations
School.hasMany(Student, { foreignKey: 'school_id', as: 'students' });
Student.belongsTo(School, { foreignKey: 'school_id', as: 'school' });

School.hasMany(Teacher, { foreignKey: 'school_id', as: 'teachers' });
Teacher.belongsTo(School, { foreignKey: 'school_id', as: 'school' });

// Result associations
Student.hasMany(Result, { foreignKey: 'student_id', as: 'results' });
Result.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

// Report Card associations
Student.hasMany(ReportCard, { foreignKey: 'student_id', as: 'report_cards' });
ReportCard.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

// Community associations
Student.hasMany(CommunityPost, { foreignKey: 'student_id', as: 'community_posts' });
CommunityPost.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });
CommunityPost.hasMany(CommunityComment, { foreignKey: 'post_id', as: 'comments' });
CommunityComment.belongsTo(CommunityPost, { foreignKey: 'post_id', as: 'post' });
CommunityComment.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

// Student Environment association
Student.hasOne(StudentEnvironment, { foreignKey: 'student_id', as: 'environment' });
StudentEnvironment.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });
StudentEnvironment.belongsTo(Class, { foreignKey: 'class_id', as: 'class' });

// AI Curriculum & Question Associations
Student.hasMany(AIQuestion, { foreignKey: 'student_id', as: 'ai_questions' });
AIQuestion.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

Student.hasOne(AILearningContext, { foreignKey: 'student_id', as: 'learning_context' });
AILearningContext.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

module.exports = {
  sequelize,
  User,
  School,
  Department,
  Class,
  Student,
  Teacher,
  Parent,
  ParentStudent,
  Subject,
  Course,
  Topic,
  Lesson,
  Assignment,
  AssignmentSubmission,
  Attendance,
  Exam,
  Question,
  ExamAttempt,
  StudentExamResult,
  AcademicResult,
  Result,
  ReportCard,
  Message,
  CommunicationLog,
  CommunicationSetting,
  Notification,
  AIChatHistory,
  AIRecommendation,
  File,
  PasswordResetToken,
  LoginActivity,
  AuditLog,
  Timetable,
  ProfileImage,
  CommunityPost,
  CommunityComment,
  StudentEnvironment,
  CurriculumKnowledge,
  AILearningContext,
  AIQuestion
};
