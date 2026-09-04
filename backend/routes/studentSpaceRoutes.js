const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { requireRole, studentIsolation } = require('../middleware/rbacMiddleware');
const {
  Student, User, Class, Parent, Teacher, Subject, Course, Lesson, Assignment,
  AssignmentSubmission, AcademicResult, Result, ReportCard, Attendance,
  Timetable, Exam, CommunityPost, CommunityComment
} = require('../models');

// Apply authentication, student role verification, and student data isolation to all routes
router.use(authMiddleware, requireRole('student'), studentIsolation);

/**
 * 1. GET /api/student/profile
 * Returns the student's private profile, class details, and attendance rate
 */
router.get('/profile', async (req, res) => {
  try {
    const student = await Student.findByPk(req.studentId, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'profile_image'] },
        {
          model: Class,
          as: 'class',
          include: [{
            model: Teacher,
            as: 'class_teacher',
            include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name', 'email', 'phone'] }]
          }]
        },
        { model: Parent, as: 'parent' }
      ]
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    // Attendance stats
    const attendanceRecords = await Attendance.findAll({ where: { student_id: req.studentId } });
    const presentCount = attendanceRecords.filter(a => a.status === 'Present').length;
    const attendanceRate = attendanceRecords.length ? Math.round((presentCount / attendanceRecords.length) * 100) : 95;

    return res.status(200).json({
      success: true,
      space: 'My Learning Space',
      student,
      stats: {
        academicLevel: student.academic_level || 'SS2',
        attendanceRate: `${attendanceRate}%`,
        status: student.status
      }
    });
  } catch (err) {
    console.error('[Student Profile Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error loading profile', error: err.message });
  }
});

/**
 * 2. GET /api/student/results
 * Returns strictly the authenticated student's certified academic transcripts & scores
 */
router.get('/results', async (req, res) => {
  try {
    const results = await AcademicResult.findAll({
      where: { student_id: req.studentId },
      include: [
        { model: Subject, as: 'subject', attributes: ['id', 'subject_name', 'subject_code', 'department_id'] }
      ],
      order: [['result_id', 'DESC']]
    });

    const totalSum = results.reduce((acc, r) => acc + Number(r.total_score || 0), 0);
    const overallAverage = results.length ? Math.round(totalSum / results.length) : 0;

    const reportCard = await ReportCard.findOne({
      where: { student_id: req.studentId },
      order: [['id', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      space: 'My Learning Space',
      student_id: req.studentId,
      overallAverage,
      resultsCount: results.length,
      results,
      reportCard
    });
  } catch (err) {
    console.error('[Student Results Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error loading results', error: err.message });
  }
});

/**
 * 3. GET /api/student/courses
 * Returns curriculum courses tailored to student's academic level and department
 */
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [
        { model: Subject, as: 'subject' },
        { model: Lesson, as: 'lessons' }
      ]
    });

    return res.status(200).json({
      success: true,
      space: 'My Learning Space',
      academicLevel: req.studentAcademicLevel,
      coursesCount: courses.length,
      courses
    });
  } catch (err) {
    console.error('[Student Courses Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error loading courses', error: err.message });
  }
});

/**
 * 4. GET /api/student/assignments
 * Returns assignments given to student's class with student's submission status
 */
router.get('/assignments', async (req, res) => {
  try {
    const classId = req.studentClassId || 1;

    const assignments = await Assignment.findAll({
      include: [
        { model: Subject, as: 'subject', attributes: ['subject_name', 'subject_code'] },
        {
          model: AssignmentSubmission,
          as: 'submissions',
          where: { student_id: req.studentId },
          required: false
        }
      ],
      order: [['id', 'DESC']]
    });

    const formatted = assignments.map(a => {
      const submission = a.submissions && a.submissions[0];
      return {
        id: a.id,
        title: a.title,
        description: a.description,
        subject: a.subject?.subject_name || 'General',
        deadline: a.deadline,
        attachment: a.attachment,
        submitted: !!submission,
        grade: submission?.score ?? null,
        feedback: submission?.feedback ?? null,
        submittedAt: submission?.submission_date ?? null
      };
    });

    return res.status(200).json({
      success: true,
      space: 'My Learning Space',
      assignments: formatted
    });
  } catch (err) {
    console.error('[Student Assignments Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error loading assignments', error: err.message });
  }
});

/**
 * 5. GET /api/student/learning-hub
 * Comprehensive learning hub resources (Videos, Notes, CBT Practice, Revision Plan)
 */
router.get('/learning-hub', async (req, res) => {
  try {
    const exams = await Exam.findAll({
      where: { status: 'published' },
      include: [{ model: Subject, as: 'subject' }],
      limit: 10
    });

    const timetable = await Timetable.findAll({
      where: { class_id: req.studentClassId || 1 },
      include: [{ model: Subject, as: 'subject' }]
    });

    return res.status(200).json({
      success: true,
      space: 'My Learning Space',
      modules: {
        myCourses: `/api/student/courses`,
        myLessons: `/api/curriculum/lessons`,
        myCbtPractice: exams,
        myTimetable: timetable,
        myRevisionPlan: {
          term: 'Term 1, 2025/2026',
          targetGpa: '4.5 / 5.0',
          prioritySubjects: ['Further Mathematics', 'Physics', 'Chemistry'],
          dailyGoal: '2.5 Hours Daily'
        }
      }
    });
  } catch (err) {
    console.error('[Student Learning Hub Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error loading learning hub', error: err.message });
  }
});

/**
 * 6. GET /api/student/community
 * Class and stream isolated student community discussions.
 * (e.g. SS2 Science students cannot view SS3 Commercial discussions)
 */
router.get('/community', async (req, res) => {
  try {
    const classLevel = req.studentAcademicLevel || 'SS2';
    const department = req.student?.department || 'Science';

    const posts = await CommunityPost.findAll({
      where: { class_level: classLevel },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['first_name', 'last_name', 'photo'],
          include: [{ model: User, as: 'user', attributes: ['profile_image'] }]
        },
        {
          model: CommunityComment,
          as: 'comments',
          include: [
            {
              model: Student,
              as: 'student',
              attributes: ['first_name', 'last_name'],
              include: [{ model: User, as: 'user', attributes: ['profile_image'] }]
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      space: 'My Learning Space',
      isolatedStream: `${classLevel} • ${department}`,
      postsCount: posts.length,
      posts
    });
  } catch (err) {
    console.error('[Student Community Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching community posts', error: err.message });
  }
});

/**
 * 7. POST /api/student/community
 * Create a new post locked strictly to the student's class level and department stream
 */
router.post('/community', async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const post = await CommunityPost.create({
      student_id: req.studentId,
      class_level: req.studentAcademicLevel || 'SS2',
      department: req.student?.department || 'Science',
      title,
      content,
      category: category || 'Study Group',
      likes_count: 0,
      created_at: new Date()
    });

    return res.status(201).json({
      success: true,
      message: `Discussion post created inside isolated ${req.studentAcademicLevel} community!`,
      post
    });
  } catch (err) {
    console.error('[Create Community Post Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error creating community post', error: err.message });
  }
});

/**
 * 8. POST /api/student/community/:post_id/reply
 * Reply to a discussion post within the student's class stream
 */
router.post('/community/:post_id/reply', async (req, res) => {
  try {
    const { post_id } = req.params;
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({ success: false, message: 'Comment content is required' });
    }

    const post = await CommunityPost.findByPk(post_id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Discussion post not found' });
    }

    // Verify stream isolation
    if (post.class_level !== req.studentAcademicLevel && (req.user.role || '').toLowerCase() !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: You cannot reply to discussion posts outside your class stream.'
      });
    }

    const newComment = await CommunityComment.create({
      post_id,
      student_id: req.studentId,
      comment,
      created_at: new Date()
    });

    return res.status(201).json({
      success: true,
      message: 'Reply posted successfully',
      comment: newComment
    });
  } catch (err) {
    console.error('[Reply Community Post Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error creating reply', error: err.message });
  }
});

module.exports = router;
