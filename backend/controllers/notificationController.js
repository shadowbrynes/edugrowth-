const { Notification } = require('../models');

// 1. Get user notifications
exports.getUserNotifications = async (req, res) => {
  try {
    const { user_id } = req.params;

    const notifications = await Notification.findAll({
      where: { user_id },
      order: [['created_at', 'DESC']],
      limit: 50
    });

    const unreadCount = notifications.filter(n => n.status === 'unread').length;

    return res.status(200).json({
      success: true,
      unreadCount,
      count: notifications.length,
      notifications
    });
  } catch (err) {
    console.error('getUserNotifications error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// 2. Create notification
exports.createNotification = async (req, res) => {
  try {
    const { user_id, title, message, type } = req.body;

    if (!user_id || !title || !message) {
      return res.status(400).json({ success: false, message: 'user_id, title, and message are required' });
    }

    const notification = await Notification.create({
      user_id,
      title,
      message,
      type: type || 'academic',
      status: 'unread'
    });

    return res.status(201).json({
      success: true,
      message: 'Notification saved in MySQL notifications table',
      notification
    });
  } catch (err) {
    console.error('createNotification error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// 3. Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    notification.status = 'read';
    await notification.save();

    return res.status(200).json({ success: true, message: 'Notification marked as read', notification });
  } catch (err) {
    console.error('markAsRead error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
