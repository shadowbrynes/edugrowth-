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

// 3. Register new teacher (Status: Pending Approval)
exports.registerTeacher = async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const {
      firstName,
      lastName,
      gender,
      dob,
      phone,
      email,
      address,
      employeeId,
      department,
      specialisation,
      qualification,
      experience,
      employmentDate,
      password
    } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone || null,
      password_hash: passwordHash,
      role: 'teacher',
      status: 'inactive' // Pending Admin Approval
    });

    const newTeacher = await Teacher.create({
      user_id: newUser.id,
      school_id: 1,
      employee_number: employeeId || `TCH-2026-${Math.floor(100 + Math.random() * 900)}`,
      first_name: firstName,
      last_name: lastName,
      gender: gender || 'Male',
      qualification: qualification || 'B.Sc / M.Sc',
      specialization: specialisation || 'General Sciences',
      department: department || 'Science',
      phone: phone,
      address: address || null,
      employment_date: employmentDate || new Date(),
      status: 'inactive' // Requires Administrator Approval
    });

    return res.status(201).json({
      success: true,
      message: 'Teacher registered successfully. Status: Pending Administrator Approval.',
      teacher: newTeacher
    });
  } catch (err) {
    console.error('registerTeacher error:', err);
    return res.status(500).json({ success: false, message: 'Server error registering teacher', error: err.message });
  }
};
