const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireRole, studentIsolation, parentIsolation, teacherClassControl } = require('../middleware/rbacMiddleware');

// Institutional results overview - Admin only
router.get('/', authMiddleware, requireRole('admin'), resultController.getAllResults);

// Individual student results - protected by student and parent isolation
router.get('/student/:id', authMiddleware, studentIsolation, parentIsolation, resultController.getStudentResults);

// Academic score entry - Teachers (assigned class only) and Admins
router.post('/', authMiddleware, requireRole('teacher', 'admin'), teacherClassControl, resultController.saveAcademicScore);

// Report card - student and parent isolation
router.get('/report-card/:student_id', authMiddleware, studentIsolation, parentIsolation, resultController.getReportCard);

module.exports = router;
