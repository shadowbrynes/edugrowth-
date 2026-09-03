const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, examController.getAllExams);
router.get('/:id/questions', authMiddleware, examController.getExamQuestions);
router.post('/:id/submit', authMiddleware, examController.submitExam);

module.exports = router;
