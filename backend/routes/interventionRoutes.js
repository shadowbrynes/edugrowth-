const express = require('express');
const router = express.Router();
const interventionController = require('../controllers/interventionController');
const authMiddleware = require('../middleware/authMiddleware');
const { enforceStudentDataIsolation } = require('../middleware/rbacMiddleware');

// Intervention routes - strict role-based student data isolation
router.get('/student/:student_id', authMiddleware, enforceStudentDataIsolation, interventionController.getStudentInterventions);
router.get('/:id', authMiddleware, interventionController.getInterventionById);
router.post('/:id/start', authMiddleware, interventionController.startIntervention);
router.post('/:id/complete', authMiddleware, interventionController.completeIntervention);

module.exports = router;
