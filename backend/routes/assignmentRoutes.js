const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireRole, teacherClassControl } = require('../middleware/rbacMiddleware');

router.get('/', authMiddleware, assignmentController.getAllAssignments);
router.post('/', authMiddleware, requireRole('teacher', 'admin'), teacherClassControl, assignmentController.createAssignment);
router.post('/submit', authMiddleware, assignmentController.submitAssignment);
router.post('/grade', authMiddleware, requireRole('teacher', 'admin'), teacherClassControl, assignmentController.gradeSubmission);
router.put('/grade/:submission_id', authMiddleware, requireRole('teacher', 'admin'), teacherClassControl, assignmentController.gradeSubmission);

module.exports = router;
