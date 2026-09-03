const { AcademicResult, Student, Subject, User } = require('../models');

// 1. Get student academic transcript results
exports.getStudentResults = async (req, res) => {
  try {
    const student = await Student.findOne({ where: { user_id: req.user.id } });
    const studentId = student ? student.student_id : 1;

    const results = await AcademicResult.findAll({
      where: { student_id: studentId },
      include: [
        { model: Subject, as: 'subject' }
      ]
    });

    const totalScoreSum = results.reduce((acc, r) => acc + Number(r.total_score), 0);
    const overallScore = results.length ? Math.round(totalScoreSum / results.length) : 82;

    return res.status(200).json({
      success: true,
      overallScore,
      resultsCount: results.length,
      results
    });
  } catch (err) {
    console.error('getStudentResults error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 2. Post or update an academic score (Teachers/Admin)
exports.saveAcademicScore = async (req, res) => {
  try {
    const { student_id, subject_id, term, session, ca_score, exam_score, teacher_comment } = req.body;

    const total = Number(ca_score || 0) + Number(exam_score || 0);

    const calculateGrade = (score) => {
      if (score >= 80) return 'A1';
      if (score >= 75) return 'B2';
      if (score >= 70) return 'B3';
      if (score >= 65) return 'C4';
      if (score >= 60) return 'C5';
      if (score >= 50) return 'C6';
      if (score >= 45) return 'D7';
      if (score >= 40) return 'E8';
      return 'F9';
    };

    const grade = calculateGrade(total);

    const [record, created] = await AcademicResult.findOrCreate({
      where: {
        student_id,
        subject_id,
        term: term || 'Term 1',
        session: session || '2025/2026'
      },
      defaults: {
        ca_score,
        exam_score,
        total_score: total,
        grade,
        teacher_comment
      }
    });

    if (!created) {
      record.ca_score = ca_score;
      record.exam_score = exam_score;
      record.total_score = total;
      record.grade = grade;
      record.teacher_comment = teacher_comment;
      await record.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Academic result recorded successfully',
      result: record
    });
  } catch (err) {
    console.error('saveAcademicScore error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
