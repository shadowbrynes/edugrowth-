const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.post('/', attendanceController.markAttendance);
router.get('/class/:class_id', attendanceController.getClassAttendance);
router.get('/student/:student_id', attendanceController.getStudentAttendance);

module.exports = router;
