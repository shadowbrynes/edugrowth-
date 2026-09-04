const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');

router.get('/', assignmentController.getAllAssignments);
router.post('/', assignmentController.createAssignment);
router.post('/submit', assignmentController.submitAssignment);
router.post('/grade', assignmentController.gradeSubmission);
router.put('/grade/:submission_id', assignmentController.gradeSubmission);

module.exports = router;
