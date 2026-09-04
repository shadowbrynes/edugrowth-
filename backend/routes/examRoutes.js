const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');

router.get('/', examController.getAllExams);
router.post('/', examController.createExam);
router.get('/:id/questions', examController.getExamQuestions);
router.post('/:id/questions', examController.addQuestion);
router.post('/:id/submit', examController.submitExam);
router.post('/attempt', examController.recordAttempt);
router.get('/attempts/student/:student_id', examController.getStudentAttempts);

module.exports = router;
