const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/children', authMiddleware, parentController.getParentChildren);
router.get('/', parentController.getAllParents);
router.post('/register', parentController.registerParent);
router.post('/', parentController.registerParent);

module.exports = router;
