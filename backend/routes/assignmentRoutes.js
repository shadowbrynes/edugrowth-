const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', authMiddleware, assignmentController.getAllAssignments);
router.post('/submit', authMiddleware, assignmentController.submitAssignment);
router.put('/:submission_id/grade', authMiddleware, roleMiddleware('Teacher', 'Administrator'), assignmentController.gradeSubmission);

module.exports = router;
