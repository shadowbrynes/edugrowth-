const express = require('express');
const router = express.Router();
const backupController = require('../controllers/backupController');

router.post('/run', backupController.triggerBackup);
router.get('/list', backupController.getBackups);

module.exports = router;
