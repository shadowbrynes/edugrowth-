const bcrypt = require('bcryptjs');
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
      where: { teacher_id: teacher.id },
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
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// 2. List all teachers (for directory/student communications)
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.findAll({
      include: [
        { model: User, as: 'user', attributes: ['first_name', 'last_name', 'email', 'profile_image'] },
        { model: Subject, as: 'subjects' }
      ],
      order: [['first_name', 'ASC']]
    });

    return res.status(200).json({ success: true, count: teachers.length, teachers });
  } catch (err) {
    console.error('getAllTeachers error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// 3. Get single teacher
exports.getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['first_name', 'last_name', 'email', 'profile_image'] },
        { model: Subject, as: 'subjects' }
      ]
    });

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    return res.status(200).json({ success: true, teacher });
  } catch (err) {
    console.error('getTeacherById error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// 4. Register new teacher
exports.registerTeacher = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      gender,
      dob,
      phone,
      whatsappNumber,
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

    const existingUser = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      first_name: firstName,
      last_name: lastName,
      email: email.toLowerCase().trim(),
      phone: phone || null,
      password_hash: passwordHash,
      role: 'teacher',
      status: 'active'
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
      phone: phone || null,
      phone_number: phone || null,
      whatsapp_number: whatsappNumber || phone || null,
      allow_parent_contact: 1,
      communication_status: 'available',
      address: address || null,
      employment_date: employmentDate || new Date(),
      status: 'active'
    });

    return res.status(201).json({
      success: true,
      message: 'Teacher registered successfully and recorded in MySQL teachers table',
      teacher: newTeacher,
      user: { id: newUser.id, email: newUser.email, role: newUser.role }
    });
  } catch (err) {
    console.error('registerTeacher error:', err);
    return res.status(500).json({ success: false, message: 'Server error registering teacher', error: err.message });
  }
};
