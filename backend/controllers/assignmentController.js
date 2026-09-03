const { Assignment, AssignmentSubmission, Subject, Teacher, Student, User } = require('../models');

// 1. Get assignments
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.findAll({
      include: [
        { model: Subject, as: 'subject' },
        {
          model: Teacher,
          as: 'teacher',
          include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name'] }]
        }
      ],
      order: [['deadline', 'ASC']]
    });

    return res.status(200).json({ success: true, count: assignments.length, assignments });
  } catch (err) {
    console.error('getAllAssignments error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 2. Submit solution for an assignment
exports.submitAssignment = async (req, res) => {
  try {
    const { assignment_id, submission_file } = req.body;
    const student = await Student.findOne({ where: { user_id: req.user.id } });
    const studentId = student ? student.student_id : 1;

    const submission = await AssignmentSubmission.create({
      assignment_id,
      student_id: studentId,
      submission_file: submission_file || 'Student_Worksheet_Solution.pdf',
      status: 'submitted'
    });

    return res.status(201).json({
      success: true,
      message: 'Assignment submitted successfully to the teacher',
      submission
    });
  } catch (err) {
    console.error('submitAssignment error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 3. Teacher: Grade an assignment submission
exports.gradeSubmission = async (req, res) => {
  try {
    const { submission_id } = req.params;
    const { score, teacher_feedback } = req.body;

    const sub = await AssignmentSubmission.findByPk(submission_id);
    if (!sub) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    sub.score = score;
    sub.teacher_feedback = teacher_feedback;
    sub.status = 'graded';
    await sub.save();

    return res.status(200).json({
      success: true,
      message: 'Submission graded successfully',
      submission: sub
    });
  } catch (err) {
    console.error('gradeSubmission error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
