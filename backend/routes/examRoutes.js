const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');

// CBT Question Bank Engine Routes
router.get('/cbt/subjects', examController.getCbtSubjects);
router.get('/cbt/topics', examController.getCbtTopics);
router.get('/cbt/generate', examController.generateCbtExam);
router.post('/cbt/submit', examController.submitCbtExam);
router.get('/cbt/analytics/:student_id', examController.getCbtAnalytics);
router.get('/cbt/questions-bank', examController.getQuestionBankAdmin);
router.post('/cbt/questions-bank', examController.createQuestionInBank);

// Standard Exam Routes
router.get('/', examController.getAllExams);
router.post('/', examController.createExam);
router.get('/:id/questions', examController.getExamQuestions);
router.post('/:id/questions', examController.addQuestion);
router.post('/:id/submit', examController.submitExam);
router.post('/attempt', examController.recordAttempt);
router.get('/attempts/student/:student_id', examController.getStudentAttempts);

module.exports = router;

