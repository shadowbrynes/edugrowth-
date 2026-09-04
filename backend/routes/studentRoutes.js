const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/profile', authMiddleware, studentController.getStudentProfile);
router.get('/timetable', authMiddleware, studentController.getStudentTimetable);
router.get('/attendance', authMiddleware, studentController.getStudentAttendance);

router.get('/', studentController.getAllStudents);
router.post('/', studentController.registerStudent);
router.get('/:id', studentController.getStudentById);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
