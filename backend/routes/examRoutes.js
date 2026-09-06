const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireRole, enforceStudentDataIsolation } = require('../middleware/rbacMiddleware');

// CBT Question Bank Engine Routes
router.get('/cbt/subjects', examController.getCbtSubjects);
router.get('/cbt/topics', examController.getCbtTopics);
router.get('/cbt/generate', examController.generateCbtExam);
router.post('/cbt/submit', authMiddleware, examController.submitCbtExam);
router.get('/cbt/analytics/:student_id', authMiddleware, enforceStudentDataIsolation, examController.getCbtAnalytics);
router.get('/cbt/questions-bank', authMiddleware, requireRole('teacher', 'admin'), examController.getQuestionBankAdmin);
router.post('/cbt/questions-bank', authMiddleware, requireRole('teacher', 'admin'), examController.createQuestionInBank);

// Standard Exam Routes
router.get('/', examController.getAllExams);
router.post('/', authMiddleware, requireRole('teacher', 'admin'), examController.createExam);
router.get('/:id/questions', examController.getExamQuestions);
router.post('/:id/questions', authMiddleware, requireRole('teacher', 'admin'), examController.addQuestion);
router.post('/:id/submit', authMiddleware, examController.submitExam);
router.post('/attempt', authMiddleware, examController.recordAttempt);
router.get('/attempts/student/:student_id', authMiddleware, enforceStudentDataIsolation, examController.getStudentAttempts);

module.exports = router;

