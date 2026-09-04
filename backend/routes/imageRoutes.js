const express = require('express');
const router = express.Router();
const profileImageController = require('../controllers/profileImageController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireRole, studentIsolation, parentIsolation } = require('../middleware/rbacMiddleware');

// Upload passport photo (Student, Parent, Teacher, Admin)
router.post('/upload', authMiddleware, profileImageController.uploadPassportImage);

// Get complete student digital identity file (protected: student can view own, parent can view linked child, admin can view all)
router.get('/student/:id', authMiddleware, studentIsolation, parentIsolation, profileImageController.getStudentDigitalIdentity);

// Institutional Searchable directory - STRICTLY RESTRICTED to Administrator only
// Students & Parents cannot browse other students' names, photos, parent details or records
router.get('/directory', authMiddleware, requireRole('admin'), profileImageController.getStudentDirectory);

// Update emergency contact (Restricted to verified Parent or Admin)
router.put('/emergency/:student_id', authMiddleware, parentIsolation, profileImageController.updateEmergencyContact);

module.exports = router;
