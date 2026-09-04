const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/dashboard', authMiddleware, teacherController.getTeacherDashboard);
router.get('/', teacherController.getAllTeachers);
router.get('/:id', teacherController.getTeacherById);
router.post('/register', teacherController.registerTeacher);
router.post('/', teacherController.registerTeacher);

module.exports = router;
