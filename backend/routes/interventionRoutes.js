const express = require('express');
const router = express.Router();
const interventionController = require('../controllers/interventionController');

// Intervention routes
router.get('/student/:student_id', interventionController.getStudentInterventions);
router.get('/:id', interventionController.getInterventionById);
router.post('/:id/start', interventionController.startIntervention);
router.post('/:id/complete', interventionController.completeIntervention);

module.exports = router;
