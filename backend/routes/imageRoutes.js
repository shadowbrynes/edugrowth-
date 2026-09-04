const express = require('express');
const router = express.Router();
const profileImageController = require('../controllers/profileImageController');

// Upload passport photo (Student, Parent, Teacher)
router.post('/upload', profileImageController.uploadPassportImage);

// Get complete student digital identity file (student, parents, teachers, emergency contact)
router.get('/student/:id', profileImageController.getStudentDigitalIdentity);

// Searchable directory
router.get('/directory', profileImageController.getStudentDirectory);

// Update emergency contact
router.put('/emergency/:student_id', profileImageController.updateEmergencyContact);

module.exports = router;
