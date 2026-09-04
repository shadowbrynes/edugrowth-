const { Message, User, Teacher, Student, Parent, CommunicationLog, CommunicationSetting } = require('../models');

// 1. Get contactable teachers for a student ward
exports.getTeacherContacts = async (req, res) => {
  try {
    const teachers = await Teacher.findAll({
      where: { allow_parent_contact: true },
      include: [
        { model: User, as: 'user', attributes: ['first_name', 'last_name', 'email', 'profile_image'] }
      ]
    });

    const settings = await CommunicationSetting.findOne({ where: { school_id: 1 } });

    const formatted = teachers.map((t) => ({
      id: t.id,
      name: `${t.first_name} ${t.last_name}`,
      employeeNumber: t.employee_number,
      department: t.department,
      specialisation: t.specialization,
      phone: settings?.allow_phone_visibility ? (t.phone_number || t.phone) : 'Protected by School Admin',
      whatsappNumber: t.whatsapp_number || '2348022334455',
      communicationStatus: t.communication_status || 'available',
      allowWhatsApp: settings?.allow_whatsapp_contact ?? true,
      allowChat: settings?.allow_parent_teacher_chat ?? true,
      profileImage: t.user?.profile_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    }));

    return res.status(200).json({
      success: true,
      count: formatted.length,
      teachers: formatted,
      settings: settings || {
        working_hours: 'Monday - Friday, 8:00 AM - 5:00 PM',
        allow_whatsapp_contact: true,
        allow_phone_visibility: true
      }
    });
  } catch (err) {
    console.error('getTeacherContacts error:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching teacher contacts', error: err.message });
  }
};

// 2. Log a communication event (Call or WhatsApp initiated)
exports.logCommunicationEvent = async (req, res) => {
  try {
    const { senderId, receiverId, studentId, communicationType } = req.body;

    const log = await CommunicationLog.create({
      sender_id: senderId || (req.user ? req.user.id : 1),
      receiver_id: receiverId,
      student_id: studentId || 1,
      communication_type: communicationType || 'whatsapp',
      status: 'initiated'
    });

    return res.status(201).json({ success: true, logId: log.id });
  } catch (err) {
    console.error('logCommunicationEvent error:', err);
    return res.status(500).json({ success: false, message: 'Error logging communication' });
  }
};

// 3. Send in-app message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, studentId, message, senderRole, receiverRole, messageType } = req.body;
    const senderId = req.user ? req.user.id : (senderRole === 'parent' ? 3 : 2);

    const newMsg = await Message.create({
      sender_id: senderId,
      receiver_id: receiverId,
      message,
      read_status: false
    });

    // Also log in communication logs
    await CommunicationLog.create({
      sender_id: senderId,
      receiver_id: receiverId,
      student_id: studentId || 1,
      communication_type: 'in_app',
      status: 'delivered'
    });

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMsg
    });
  } catch (err) {
    console.error('sendMessage error:', err);
    return res.status(500).json({ success: false, message: 'Server error sending message' });
  }
};

// 4. Get message history between parent and teacher
exports.getMessageHistory = async (req, res) => {
  try {
    const { contactId } = req.params;
    const currentUserId = req.user ? req.user.id : 3; // Default to Parent Doe

    const messages = await Message.findAll({
      where: {
        [sequelize.Op.or]: [
          { sender_id: currentUserId, receiver_id: contactId },
          { sender_id: contactId, receiver_id: currentUserId }
        ]
      },
      order: [['created_at', 'ASC']]
    });

    return res.status(200).json({ success: true, messages });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
