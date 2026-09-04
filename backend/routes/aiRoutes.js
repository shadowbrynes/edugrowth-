const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/chat', aiController.saveChat);
router.get('/chat/:student_id', aiController.getChatHistory);
router.post('/recommendations', aiController.saveRecommendation);
router.get('/recommendations/:student_id', aiController.getRecommendations);

// Personalized Curriculum-Aware AI Tutor Routes
router.post('/tutor/query', aiController.tutorQuery);
router.get('/tutor/context/:student_id', aiController.tutorContext);
router.post('/tutor/waec-prep', aiController.tutorWaecPrep);

module.exports = router;
