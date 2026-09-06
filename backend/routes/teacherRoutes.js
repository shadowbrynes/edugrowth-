const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/rbacMiddleware');

router.get('/dashboard', authMiddleware, requireRole('teacher', 'admin'), teacherController.getTeacherDashboard);
router.get('/', authMiddleware, requireRole('admin'), teacherController.getAllTeachers);
router.get('/:id', authMiddleware, requireRole('teacher', 'admin'), teacherController.getTeacherById);
router.post('/register', authMiddleware, requireRole('admin'), teacherController.registerTeacher);
router.post('/', authMiddleware, requireRole('admin'), teacherController.registerTeacher);

module.exports = router;
