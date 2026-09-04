const { Attendance, Student, User, Class } = require('../models');

// 1. Mark attendance for student(s)
exports.markAttendance = async (req, res) => {
  try {
    const { student_id, class_id, teacher_id, date, status } = req.body;

    if (!student_id || !date) {
      return res.status(400).json({ success: false, message: 'student_id and date are required' });
    }

    const [record, created] = await Attendance.findOrCreate({
      where: {
        student_id,
        date: date.slice(0, 10)
      },
      defaults: {
        class_id: class_id || 1,
        teacher_id: teacher_id || (req.user ? req.user.id : 1),
        status: status || 'Present'
      }
    });

    if (!created) {
      record.status = status || 'Present';
      if (class_id) record.class_id = class_id;
      if (teacher_id) record.teacher_id = teacher_id;
      await record.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Attendance recorded successfully in MySQL attendance table',
      attendance: record
    });
  } catch (err) {
    console.error('markAttendance error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// 2. Get attendance by class and date
exports.getClassAttendance = async (req, res) => {
  try {
    const { class_id } = req.params;
    const { date } = req.query;
    const where = { class_id };
    if (date) where.date = date;

    const records = await Attendance.findAll({
      where,
      include: [
        {
          model: Student,
          as: 'student',
          include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name', 'email'] }]
        }
      ],
      order: [['date', 'DESC']]
    });

    return res.status(200).json({ success: true, count: records.length, attendance: records });
  } catch (err) {
    console.error('getClassAttendance error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// 3. Get attendance for a specific student
exports.getStudentAttendance = async (req, res) => {
  try {
    const { student_id } = req.params;

    const records = await Attendance.findAll({
      where: { student_id },
      order: [['date', 'DESC']]
    });

    const presentCount = records.filter(r => r.status === 'Present').length;
    const totalCount = records.length || 1;
    const attendanceRate = Math.round((presentCount / totalCount) * 100);

    return res.status(200).json({
      success: true,
      student_id,
      attendanceRate,
      totalCount,
      presentCount,
      records
    });
  } catch (err) {
    console.error('getStudentAttendance error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
