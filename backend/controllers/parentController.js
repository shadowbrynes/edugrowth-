const { Parent, Student, User, Class, AcademicResult, Attendance } = require('../models');

// 1. Get parent's children & their academic status
exports.getParentChildren = async (req, res) => {
  try {
    const parent = await Parent.findOne({
      where: { user_id: req.user.id },
      include: [
        {
          model: Student,
          as: 'children',
          include: [
            { model: User, as: 'user', attributes: ['first_name', 'last_name', 'email', 'profile_image'] },
            { model: Class, as: 'class' },
            { model: AcademicResult, as: 'academic_results' },
            { model: Attendance, as: 'attendance_records' }
          ]
        }
      ]
    });

    if (!parent) {
      return res.status(404).json({ success: false, message: 'Parent profile not found' });
    }

    return res.status(200).json({
      success: true,
      parent,
      children: parent.children
    });
  } catch (err) {
    console.error('getParentChildren error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
