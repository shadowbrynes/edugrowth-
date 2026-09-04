const { Assignment, AssignmentSubmission, Subject, Teacher, Student, User, Class } = require('../models');

// 1. Get assignments
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.findAll({
      include: [
        { model: Subject, as: 'subject', attributes: ['subject_name', 'subject_code'] },
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
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// 2. Create Assignment (Teacher / Admin)
exports.createAssignment = async (req, res) => {
  try {
    const { teacher_id, subject_id, class_id, title, description, deadline, attachment } = req.body;

    if (!title || !subject_id) {
      return res.status(400).json({ success: false, message: 'title and subject_id are required' });
    }

    const assignment = await Assignment.create({
      teacher_id: teacher_id || (req.user ? req.user.id : 1),
      subject_id,
      class_id: class_id || 1,
      title,
      description: description || '',
      deadline: deadline || new Date(Date.now() + 7 * 24 * 3600 * 1000),
      attachment: attachment || null
    });

    return res.status(201).json({
      success: true,
      message: 'Assignment successfully created and saved in MySQL assignments table',
      assignment
    });
  } catch (err) {
    console.error('createAssignment error:', err);
    return res.status(500).json({ success: false, message: 'Server error creating assignment', error: err.message });
  }
};

// 3. Submit solution for an assignment
exports.submitAssignment = async (req, res) => {
  try {
    const { assignment_id, submission_file, student_id } = req.body;
    const targetStudentId = student_id || (req.user ? req.user.id : 1);

    const submission = await AssignmentSubmission.create({
      assignment_id,
      student_id: targetStudentId,
      submission_file: submission_file || 'Student_Worksheet_Solution.pdf'
    });

    return res.status(201).json({
      success: true,
      message: 'Assignment submitted successfully and recorded in MySQL assignment_submissions table',
      submission
    });
  } catch (err) {
    console.error('submitAssignment error:', err);
    return res.status(500).json({ success: false, message: 'Server error submitting assignment', error: err.message });
  }
};

// 4. Teacher: Grade an assignment submission (by ID or student/assignment)
exports.gradeSubmission = async (req, res) => {
  try {
    const { submission_id } = req.params;
    const { score, teacher_feedback, student_id, assignment_id } = req.body;

    let sub = null;
    if (submission_id) {
      sub = await AssignmentSubmission.findByPk(submission_id);
    } else if (student_id && assignment_id) {
      [sub] = await AssignmentSubmission.findOrCreate({
        where: { student_id, assignment_id },
        defaults: { score, teacher_comment: teacher_feedback }
      });
    }

    if (!sub) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    sub.score = score;
    sub.teacher_comment = teacher_feedback || '';
    await sub.save();

    return res.status(200).json({
      success: true,
      message: 'Assignment score saved in MySQL assignment_submissions table',
      submission: sub
    });
  } catch (err) {
    console.error('gradeSubmission error:', err);
    return res.status(500).json({ success: false, message: 'Server error grading submission', error: err.message });
  }
};
