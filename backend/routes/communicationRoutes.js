const express = require('express');
const router = express.Router();
const communicationController = require('../controllers/communicationController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/teachers', communicationController.getTeacherContacts);
router.post('/log', communicationController.logCommunicationEvent);
router.post('/send', communicationController.sendMessage);
router.get('/messages/:contactId', communicationController.getMessageHistory);

module.exports = router;
