const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');

router.get('/', resultController.getAllResults);
router.get('/student/:id', resultController.getStudentResults);
router.post('/', resultController.saveAcademicScore);
router.get('/report-card/:student_id', resultController.getReportCard);

module.exports = router;
