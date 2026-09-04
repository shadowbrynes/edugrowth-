const { Parent, Student, User, Class, AcademicResult, Attendance } = require('../models');

// 1. Get parent's children & their academic status
exports.getParentChildren = async (req, res) => {
  try {
    const parent = await Parent.findOne({
      where: { user_id: req.user.id },
      include: [
        {
          model: Student,
          as: 'children',
          include: [
            { model: User, as: 'user', attributes: ['first_name', 'last_name', 'email', 'profile_image'] },
            { model: Class, as: 'class' },
            { model: AcademicResult, as: 'academic_results' },
            { model: Attendance, as: 'attendance_records' }
          ]
        }
      ]
    });

    if (!parent) {
      return res.status(404).json({ success: false, message: 'Parent profile not found' });
    }

    return res.status(200).json({
      success: true,
      parent,
      children: parent.children
    });
  } catch (err) {
    console.error('getParentChildren error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 2. Register new parent and link student ward
exports.registerParent = async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const {
      firstName,
      lastName,
      gender,
      phone,
      email,
      address,
      occupation,
      relationship,
      studentAdmissionNumber,
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
      role: 'parent',
      status: 'active'
    });

    const newParent = await Parent.create({
      user_id: newUser.id,
      school_id: 1,
      first_name: firstName,
      last_name: lastName,
      phone: phone,
      email: email,
      occupation: occupation || null,
      relationship: relationship || 'Parent',
      address: address || null
    });

    // Link student if admission number provided
    if (studentAdmissionNumber) {
      const student = await Student.findOne({ where: { admission_number: studentAdmissionNumber } });
      if (student) {
        await student.update({ parent_id: newParent.id });
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Parent registered and student linked successfully',
      parent: newParent
    });
  } catch (err) {
    console.error('registerParent error:', err);
    return res.status(500).json({ success: false, message: 'Server error registering parent', error: err.message });
  }
};
