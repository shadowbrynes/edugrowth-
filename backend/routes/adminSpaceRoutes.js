const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/rbacMiddleware');
const {
  User, Student, Teacher, Parent, Class, Subject, AcademicResult,
  Attendance, ExamAttempt, Assignment, AuditLog
} = require('../models');

// Apply authentication and strict admin role verification
router.use(authMiddleware, requireRole('admin'));

/**
 * 1. GET /api/admin/overview
 * Global institutional metrics across all schools, classes, students, teachers & parents
 */
router.get('/overview', async (req, res) => {
  try {
    const [
      totalStudents,
      totalTeachers,
      totalParents,
      totalClasses,
      totalSubjects,
      totalAssignments,
      totalAttempts
    ] = await Promise.all([
      Student.count(),
      Teacher.count(),
      Parent.count(),
      Class.count(),
      Subject.count(),
      Assignment.count(),
      ExamAttempt.count()
    ]);

    // Average institution score
    const results = await AcademicResult.findAll({ attributes: ['total_score'] });
    const scoreSum = results.reduce((acc, r) => acc + Number(r.total_score || 0), 0);
    const institutionalAvg = results.length ? Math.round(scoreSum / results.length) : 82;

    // Student distribution by academic level
    const students = await Student.findAll({ attributes: ['academic_level'] });
    const distribution = {};
    students.forEach(s => {
      const lvl = s.academic_level || 'SS2';
      distribution[lvl] = (distribution[lvl] || 0) + 1;
    });

    return res.status(200).json({
      success: true,
      space: 'School Management Space',
      metrics: {
        totalStudents,
        totalTeachers,
        totalParents,
        totalClasses,
        totalSubjects,
        totalAssignments,
        totalAttempts,
        institutionalAverage: `${institutionalAvg}%`,
        levelDistribution: distribution
      }
    });
  } catch (err) {
    console.error('[Admin Overview Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error loading admin overview', error: err.message });
  }
});

/**
 * 2. POST /api/admin/assign-teacher
 * Assign a teacher as class teacher / form master or allocate class stream
 */
router.post('/assign-teacher', async (req, res) => {
  try {
    const { teacher_id, class_id, role = 'form_master' } = req.body;

    if (!teacher_id || !class_id) {
      return res.status(400).json({ success: false, message: 'teacher_id and class_id are required' });
    }

    const [teacher, targetClass] = await Promise.all([
      Teacher.findByPk(teacher_id),
      Class.findByPk(class_id)
    ]);

    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher not found' });
    if (!targetClass) return res.status(404).json({ success: false, message: 'Class not found' });

    targetClass.class_teacher_id = teacher.id;
    await targetClass.save();

    // Log in AuditLog
    try {
      await AuditLog.create({
        user_id: req.user.id,
        action: 'ASSIGN_TEACHER_TO_CLASS',
        details: `Assigned Teacher ${teacher.first_name} ${teacher.last_name} (ID: ${teacher.id}) as Form Master to ${targetClass.class_name} (ID: ${targetClass.id})`,
        ip_address: req.ip || '127.0.0.1'
      });
    } catch (auditErr) {
      console.warn('[Audit Log Warning]:', auditErr.message);
    }

    return res.status(200).json({
      success: true,
      space: 'School Management Space',
      message: `Teacher ${teacher.first_name} ${teacher.last_name} successfully assigned as Form Master for ${targetClass.class_name}!`,
      class: targetClass
    });
  } catch (err) {
    console.error('[Admin Assign Teacher Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error assigning teacher', error: err.message });
  }
});

/**
 * 3. GET /api/admin/rbac-audit
 * Audit log of roles, users, and security configuration
 */
router.get('/rbac-audit', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'first_name', 'last_name', 'email', 'role', 'status', 'created_at'],
      order: [['created_at', 'DESC']],
      limit: 50
    });

    const roleCounts = {
      student: 0,
      teacher: 0,
      parent: 0,
      admin: 0
    };

    users.forEach(u => {
      const r = (u.role || '').toLowerCase();
      if (roleCounts[r] !== undefined) roleCounts[r]++;
    });

    return res.status(200).json({
      success: true,
      space: 'School Management Space',
      roleCounts,
      totalAccounts: users.length,
      recentUsers: users
    });
  } catch (err) {
    console.error('[Admin RBAC Audit Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching audit logs', error: err.message });
  }
});

module.exports = router;
