const { createBackup, listBackups } = require('../services/backupService');

// 1. Trigger automated database backup
exports.triggerBackup = async (req, res) => {
  try {
    const { type } = req.body; // 'daily' | 'weekly' | 'monthly'
    const backupResult = await createBackup(type || 'daily');

    return res.status(200).json({
      success: true,
      message: `MySQL ${backupResult.type.toUpperCase()} database backup successfully compiled to secure storage.`,
      backup: backupResult
    });
  } catch (err) {
    console.error('triggerBackup error:', err);
    return res.status(500).json({ success: false, message: 'Server error during backup', error: err.message });
  }
};

// 2. Get history of all database backups
exports.getBackups = async (req, res) => {
  try {
    const backups = listBackups();
    return res.status(200).json({
      success: true,
      count: backups.length,
      backups
    });
  } catch (err) {
    console.error('getBackups error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
