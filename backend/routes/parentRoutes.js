const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/rbacMiddleware');

router.get('/children', authMiddleware, parentController.getParentChildren);
router.get('/', authMiddleware, requireRole('admin'), parentController.getAllParents);
router.post('/register', authMiddleware, requireRole('admin'), parentController.registerParent);
router.post('/', authMiddleware, requireRole('admin'), parentController.registerParent);

module.exports = router;
