const bcrypt = require('bcryptjs');
const { Student, User, Class, Parent, Attendance, Timetable, Subject, Teacher, ParentStudent, Department } = require('../models');

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
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// 2. Get student by ID
exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['first_name', 'last_name', 'email', 'phone', 'profile_image'] },
        { model: Class, as: 'class' },
        { model: Parent, as: 'parent' }
      ]
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    return res.status(200).json({ success: true, student });
  } catch (err) {
    console.error('getStudentById error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// 3. Admin/Teacher: List all students
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
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// 4. Admin: Register new student (Creates in users, students, parents, and parent_student_relationship)
exports.registerStudent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      gender,
      dob,
      photo,
      address,
      admissionNo,
      classLevel,
      department,
      parentName,
      parentPhone,
      parentEmail,
      relationship,
      password
    } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ success: false, message: 'First name and last name are required' });
    }

    const studentEmail = email ? email.toLowerCase().trim() : `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(10 + Math.random() * 90)}@excelmind.edu.ng`;

    // 1. Check existing user
    let existingUser = await User.findOne({ where: { email: studentEmail } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: `A user with email ${studentEmail} already exists` });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password || 'Password@123', salt);

    // 2. Create in users table
    const newUser = await User.create({
      first_name: firstName,
      last_name: lastName,
      email: studentEmail,
      phone: phone || null,
      password_hash: passwordHash,
      role: 'student',
      profile_image: photo || null,
      status: 'active'
    });

    // 3. Handle Parent Information if provided
    let parentRecord = null;
    if (parentEmail || parentName) {
      const pEmail = parentEmail ? parentEmail.toLowerCase().trim() : `parent.${firstName.toLowerCase()}@excelmind.edu.ng`;
      let parentUser = await User.findOne({ where: { email: pEmail } });

      if (!parentUser) {
        const parentNames = (parentName || 'Guardian').split(' ');
        const pFirst = parentNames[0] || 'Guardian';
        const pLast = parentNames.slice(1).join(' ') || 'Parent';

        parentUser = await User.create({
          first_name: pFirst,
          last_name: pLast,
          email: pEmail,
          phone: parentPhone || null,
          password_hash: passwordHash,
          role: 'parent',
          status: 'active'
        });

        parentRecord = await Parent.create({
          user_id: parentUser.id,
          school_id: 1,
          first_name: pFirst,
          last_name: pLast,
          relationship: relationship || 'Father',
          phone: parentPhone || null,
          phone_number: parentPhone || null,
          whatsapp_number: parentPhone || null,
          email: pEmail,
          address: address || null
        });
      } else {
        parentRecord = await Parent.findOne({ where: { user_id: parentUser.id } });
      }
    }

    // 4. Create in students table
    const generatedAdmNo = admissionNo || `EXM-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newStudent = await Student.create({
      user_id: newUser.id,
      school_id: 1,
      admission_number: generatedAdmNo,
      first_name: firstName,
      last_name: lastName,
      gender: gender || 'Male',
      date_of_birth: dob || null,
      photo: photo || null,
      address: address || null,
      academic_level: classLevel || 'SS2',
      parent_id: parentRecord ? parentRecord.id : null,
      admission_date: new Date(),
      status: 'active'
    });

    // 5. Link parent_student_relationship if parent exists
    if (parentRecord) {
      try {
        await ParentStudent.create({
          parent_id: parentRecord.id,
          student_id: newStudent.id,
          relationship_type: relationship || 'Parent'
        });
      } catch (e) {
        console.warn('[ParentStudent Link]:', e.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: `Student ${firstName} ${lastName} successfully registered into MySQL users & students tables!`,
      student: newStudent,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        admission_number: generatedAdmNo
      },
      parent: parentRecord ? { id: parentRecord.id, email: parentRecord.email } : null
    });
  } catch (err) {
    console.error('registerStudent error:', err);
    return res.status(500).json({ success: false, message: 'Server error registering student', error: err.message });
  }
};

// 5. Update student profile
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone, address, academicLevel, status } = req.body;

    const student = await Student.findByPk(id, { include: [{ model: User, as: 'user' }] });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    if (firstName) student.first_name = firstName;
    if (lastName) student.last_name = lastName;
    if (address) student.address = address;
    if (academicLevel) student.academic_level = academicLevel;
    if (status) student.status = status;
    await student.save();

    if (student.user) {
      if (firstName) student.user.first_name = firstName;
      if (lastName) student.user.last_name = lastName;
      if (phone) student.user.phone = phone;
      await student.user.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Student updated successfully in MySQL database',
      student
    });
  } catch (err) {
    console.error('updateStudent error:', err);
    return res.status(500).json({ success: false, message: 'Server error updating student', error: err.message });
  }
};

// 6. Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const userId = student.user_id;
    await student.destroy();
    if (userId) {
      await User.destroy({ where: { id: userId } });
    }

    return res.status(200).json({ success: true, message: 'Student removed from database' });
  } catch (err) {
    console.error('deleteStudent error:', err);
    return res.status(500).json({ success: false, message: 'Server error deleting student', error: err.message });
  }
};

// 7. Get timetable
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

// 8. Get attendance summary
exports.getStudentAttendance = async (req, res) => {
  try {
    const student = await Student.findOne({ where: { user_id: req.user.id } });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const records = await Attendance.findAll({
      where: { student_id: student.id },
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
