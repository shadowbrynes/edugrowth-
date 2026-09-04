const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/children', authMiddleware, parentController.getParentChildren);
router.post('/register', parentController.registerParent);

module.exports = router;
