const sequelize = require('../config/db');

// Import all models
const User = require('./User');
const Class = require('./Class');
const Parent = require('./Parent');
const Student = require('./Student');
const Teacher = require('./Teacher');
const Subject = require('./Subject');
const Timetable = require('./Timetable');
const Assignment = require('./Assignment');
const AssignmentSubmission = require('./AssignmentSubmission');
const Exam = require('./Exam');
const Question = require('./Question');
const StudentExamResult = require('./StudentExamResult');
const AcademicResult = require('./AcademicResult');
const Attendance = require('./Attendance');
const Message = require('./Message');
const PasswordResetToken = require('./PasswordResetToken');
const School = require('./School');
const Course = require('./Course');
const Lesson = require('./Lesson');
const Result = require('./Result');

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

// Parent <-> Student (1:N)
Parent.hasMany(Student, { foreignKey: 'parent_id', as: 'children' });
Student.belongsTo(Parent, { foreignKey: 'parent_id', as: 'parent' });

// Class <-> Student (1:N)
Class.hasMany(Student, { foreignKey: 'class_id', as: 'students' });
Student.belongsTo(Class, { foreignKey: 'class_id', as: 'class' });

// Teacher <-> Subject (1:N)
Teacher.hasMany(Subject, { foreignKey: 'teacher_id', as: 'subjects' });
Subject.belongsTo(Teacher, { foreignKey: 'teacher_id', as: 'teacher' });

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

// Student <-> Exam Results
Student.hasMany(StudentExamResult, { foreignKey: 'student_id', as: 'exam_results' });
StudentExamResult.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

Exam.hasMany(StudentExamResult, { foreignKey: 'exam_id', as: 'student_results' });
StudentExamResult.belongsTo(Exam, { foreignKey: 'exam_id', as: 'exam' });

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

module.exports = {
  sequelize,
  User,
  Class,
  Parent,
  Student,
  Teacher,
  Subject,
  Timetable,
  Assignment,
  AssignmentSubmission,
  Exam,
  Question,
  StudentExamResult,
  AcademicResult,
  Attendance,
  Message,
  PasswordResetToken,
  School,
  Course,
  Lesson,
  Result
};
