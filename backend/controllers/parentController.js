const bcrypt = require('bcryptjs');
const { Parent, Student, User, Class, AcademicResult, Attendance, ParentStudent } = require('../models');

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
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// 2. List all parents
exports.getAllParents = async (req, res) => {
  try {
    const parents = await Parent.findAll({
      include: [
        { model: User, as: 'user', attributes: ['first_name', 'last_name', 'email', 'phone'] },
        { model: Student, as: 'children' }
      ],
      order: [['first_name', 'ASC']]
    });

    return res.status(200).json({ success: true, count: parents.length, parents });
  } catch (err) {
    console.error('getAllParents error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// 3. Register new parent and link student ward
exports.registerParent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      gender,
      phone,
      whatsappNumber,
      email,
      address,
      occupation,
      relationship,
      studentAdmissionNumber,
      studentAdmissionNumbers,
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
      role: 'parent',
      status: 'active'
    });

    const newParent = await Parent.create({
      user_id: newUser.id,
      school_id: 1,
      first_name: firstName,
      last_name: lastName,
      phone: phone || null,
      phone_number: phone || null,
      whatsapp_number: whatsappNumber || phone || null,
      communication_preference: 'whatsapp',
      email: email.toLowerCase().trim(),
      occupation: occupation || null,
      relationship: relationship || 'Parent',
      address: address || null
    });

    // Link student wards if admission numbers provided
    const admList = studentAdmissionNumbers || (studentAdmissionNumber ? [studentAdmissionNumber] : []);
    const linkedStudents = [];

    for (const admNo of admList) {
      if (!admNo) continue;
      const student = await Student.findOne({ where: { admission_number: admNo.trim() } });
      if (student) {
        student.parent_id = newParent.id;
        await student.save();

        try {
          await ParentStudent.create({
            parent_id: newParent.id,
            student_id: student.id,
            relationship_type: relationship || 'Parent'
          });
        } catch (e) {
          // Ignore duplicate link
        }
        linkedStudents.push(student.admission_number);
      }
    }

    return res.status(201).json({
      success: true,
      message: `Parent registered successfully and linked to ${linkedStudents.length} student ward(s) in MySQL database`,
      parent: newParent,
      linked_students: linkedStudents,
      user: { id: newUser.id, email: newUser.email, role: newUser.role }
    });
  } catch (err) {
    console.error('registerParent error:', err);
    return res.status(500).json({ success: false, message: 'Server error registering parent', error: err.message });
  }
};
