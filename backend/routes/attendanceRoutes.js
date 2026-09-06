const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireRole, enforceStudentDataIsolation, teacherClassControl } = require('../middleware/rbacMiddleware');

// Marking attendance - Teachers (assigned class) and Admins only
router.post('/', authMiddleware, requireRole('teacher', 'admin'), teacherClassControl, attendanceController.markAttendance);

// Class attendance - Teachers (assigned class) and Admins only
router.get('/class/:class_id', authMiddleware, requireRole('teacher', 'admin'), teacherClassControl, attendanceController.getClassAttendance);

// Student attendance - Strict isolation (Student: self only; Parent: verified ward; Teacher: assigned classes; Admin: all)
router.get('/student/:student_id', authMiddleware, enforceStudentDataIsolation, attendanceController.getStudentAttendance);

module.exports = router;
