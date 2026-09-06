const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireRole, teacherClassControl, enforceStudentDataIsolation } = require('../middleware/rbacMiddleware');

// Institutional results overview - filtered strictly by role at database level
router.get('/', authMiddleware, enforceStudentDataIsolation, resultController.getAllResults);

// Individual student results - protected by unified enforceStudentDataIsolation
router.get('/student/:id', authMiddleware, enforceStudentDataIsolation, resultController.getStudentResults);

// Academic score entry - Teachers (assigned class only) and Admins
router.post('/', authMiddleware, requireRole('teacher', 'admin'), teacherClassControl, resultController.saveAcademicScore);

// Report card - protected by unified enforceStudentDataIsolation
router.get('/report-card/:student_id', authMiddleware, enforceStudentDataIsolation, resultController.getReportCard);

module.exports = router;
