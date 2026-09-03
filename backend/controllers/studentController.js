const { Student, User, Class, Parent, Attendance, Timetable, Subject, Teacher } = require('../models');

// 1. Get current student profile
exports.getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({
      where: { user_id: req.user.id },
      include: [
        { model: User, as: 'user', attributes: ['first_name', 'last_name', 'email', 'phone', 'profile_image'] },
        { model: Class, as: 'class' },
        { model: Parent, as: 'parent' }
      ]
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    return res.status(200).json({ success: true, student });
  } catch (err) {
    console.error('getStudentProfile error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 2. Get student timetable
exports.getStudentTimetable = async (req, res) => {
  try {
    const student = await Student.findOne({ where: { user_id: req.user.id } });
    const classId = student ? student.class_id : 1;

    const schedule = await Timetable.findAll({
      where: { class_id: classId },
      include: [
        { model: Subject, as: 'subject' },
        {
          model: Teacher,
          as: 'teacher',
          include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name'] }]
        }
      ],
      order: [
        ['day', 'ASC'],
        ['start_time', 'ASC']
      ]
    });

    return res.status(200).json({ success: true, timetable: schedule });
  } catch (err) {
    console.error('getStudentTimetable error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 3. Get student attendance summary
exports.getStudentAttendance = async (req, res) => {
  try {
    const student = await Student.findOne({ where: { user_id: req.user.id } });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const records = await Attendance.findAll({
      where: { student_id: student.student_id },
      order: [['date', 'DESC']]
    });

    const presentCount = records.filter(r => r.status === 'Present').length;
    const totalCount = records.length || 1;
    const rate = Math.round((presentCount / totalCount) * 100);

    return res.status(200).json({
      success: true,
      attendanceRate: rate,
      totalRecords: totalCount,
      present: presentCount,
      records
    });
  } catch (err) {
    console.error('getStudentAttendance error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 4. Admin/Teacher: List all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [
        { model: User, as: 'user', attributes: ['first_name', 'last_name', 'email', 'phone', 'profile_image'] },
        { model: Class, as: 'class' },
        { model: Parent, as: 'parent' }
      ],
      order: [['admission_number', 'ASC']]
    });

    return res.status(200).json({ success: true, count: students.length, students });
  } catch (err) {
    console.error('getAllStudents error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
