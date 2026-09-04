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

// 5. Admin: Register new student
exports.registerStudent = async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const {
      firstName,
      lastName,
      email,
      phone,
      gender,
      dob,
      admissionNo,
      classLevel,
      department,
      password
    } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ success: false, message: 'First name, last name, and email are required' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'A user with this email address already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password || 'Password@123', salt);

    const newUser = await User.create({
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone || null,
      password_hash: passwordHash,
      role: 'student',
      status: 'active'
    });

    const newStudent = await Student.create({
      user_id: newUser.id,
      school_id: 1,
      admission_number: admissionNo || `EXM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      first_name: firstName,
      last_name: lastName,
      gender: gender || 'Male',
      date_of_birth: dob || null,
      academic_level: classLevel || 'SSS 3',
      status: 'active'
    });

    return res.status(201).json({
      success: true,
      message: 'Student successfully registered and credentials provisioned',
      student: newStudent,
      user: { id: newUser.id, email: newUser.email, role: newUser.role }
    });
  } catch (err) {
    console.error('registerStudent error:', err);
    return res.status(500).json({ success: false, message: 'Server error registering student', error: err.message });
  }
};
