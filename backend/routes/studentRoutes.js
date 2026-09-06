const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireRole, studentIsolation, enforceStudentDataIsolation } = require('../middleware/rbacMiddleware');

// Student self routes (protected by student isolation)
router.get('/profile', authMiddleware, studentIsolation, studentController.getStudentProfile);
router.get('/timetable', authMiddleware, studentIsolation, studentController.getStudentTimetable);
router.get('/attendance', authMiddleware, studentIsolation, studentController.getStudentAttendance);

// Institutional student directories and records - protected with strict RBAC:
// Admin: Full access; Teacher: Assigned class students; Parent: Verified child; Student: Own profile
router.get('/', authMiddleware, enforceStudentDataIsolation, studentController.getAllStudents);
router.get('/:id', authMiddleware, enforceStudentDataIsolation, studentController.getStudentById);

// Admin-only management operations
router.post('/', authMiddleware, requireRole('admin'), studentController.registerStudent);
router.put('/:id', authMiddleware, requireRole('admin'), studentController.updateStudent);
router.delete('/:id', authMiddleware, requireRole('admin'), studentController.deleteStudent);

module.exports = router;
