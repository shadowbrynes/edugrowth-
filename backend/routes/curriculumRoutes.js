const express = require('express');
const router = express.Router();
const curriculumController = require('../controllers/curriculumController');

// Subjects
router.get('/subjects', curriculumController.getSubjects);
router.post('/subjects', curriculumController.createSubject);

// Topics
router.get('/topics', curriculumController.getTopics);
router.post('/topics', curriculumController.createTopic);

// Lessons
router.get('/lessons', curriculumController.getLessons);
router.post('/lessons', curriculumController.createLesson);

// Materials & Media Files
router.get('/files', curriculumController.getFiles);
router.post('/files', curriculumController.createFile);

module.exports = router;
