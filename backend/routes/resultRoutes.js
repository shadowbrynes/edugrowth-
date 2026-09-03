const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/my-results', authMiddleware, resultController.getStudentResults);
router.post('/save', authMiddleware, roleMiddleware('Teacher', 'Administrator'), resultController.saveAcademicScore);

module.exports = router;
