const { Teacher, User, Subject, Assignment, AssignmentSubmission, Student } = require('../models');

// 1. Get teacher dashboard summary
exports.getTeacherDashboard = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({
      where: { user_id: req.user.id },
      include: [
        { model: User, as: 'user', attributes: ['first_name', 'last_name', 'email', 'profile_image'] },
        { model: Subject, as: 'subjects' }
      ]
    });

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher profile not found' });
    }

    const assignments = await Assignment.findAll({
      where: { teacher_id: teacher.teacher_id },
      include: [
        {
          model: AssignmentSubmission,
          as: 'submissions',
          include: [{ model: Student, as: 'student' }]
        }
      ]
    });

    return res.status(200).json({
      success: true,
      teacher,
      assignmentsCount: assignments.length,
      assignments
    });
  } catch (err) {
    console.error('getTeacherDashboard error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 2. List all teachers (for directory/student communications)
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.findAll({
      include: [
        { model: User, as: 'user', attributes: ['first_name', 'last_name', 'email', 'profile_image'] },
        { model: Subject, as: 'subjects' }
      ]
    });

    return res.status(200).json({ success: true, count: teachers.length, teachers });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
