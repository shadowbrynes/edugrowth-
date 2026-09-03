const { Exam, Question, StudentExamResult, Student, Subject } = require('../models');

// 1. Get all CBT Exams
exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.findAll({
      include: [
        { model: Subject, as: 'subject', attributes: ['subject_name', 'subject_code'] }
      ],
      order: [['exam_date', 'DESC']]
    });

    return res.status(200).json({ success: true, count: exams.length, exams });
  } catch (err) {
    console.error('getAllExams error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 2. Get questions for an Exam
exports.getExamQuestions = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await Exam.findByPk(id, {
      include: [
        { model: Subject, as: 'subject' },
        {
          model: Question,
          as: 'questions',
          // Do not send correct_answer to client during test for anti-cheat
          attributes: ['question_id', 'question_text', 'option_a', 'option_b', 'option_c', 'option_d']
        }
      ]
    });

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    return res.status(200).json({ success: true, exam });
  } catch (err) {
    console.error('getExamQuestions error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 3. Submit CBT Exam answers & Auto-Mark
exports.submitExam = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body; // { questionId: 'A' | 'B' | 'C' | 'D' }

    const student = await Student.findOne({ where: { user_id: req.user.id } });
    const studentId = student ? student.student_id : 1;

    const questions = await Question.findAll({ where: { exam_id: id } });
    if (!questions.length) {
      return res.status(404).json({ success: false, message: 'No questions found for this exam' });
    }

    let correctCount = 0;
    const questionReview = [];

    questions.forEach((q) => {
      const userAnswer = answers ? answers[q.question_id] : null;
      const isCorrect = userAnswer === q.correct_answer;
      if (isCorrect) correctCount++;

      questionReview.push({
        question_id: q.question_id,
        question_text: q.question_text,
        user_answer: userAnswer,
        correct_answer: q.correct_answer,
        is_correct: isCorrect,
        explanation: q.explanation
      });
    });

    const total = questions.length;
    const percentage = Math.round((correctCount / total) * 100);

    const calculateGrade = (pct) => {
      if (pct >= 80) return 'A1';
      if (pct >= 75) return 'B2';
      if (pct >= 70) return 'B3';
      if (pct >= 65) return 'C4';
      if (pct >= 60) return 'C5';
      if (pct >= 50) return 'C6';
      if (pct >= 45) return 'D7';
      if (pct >= 40) return 'E8';
      return 'F9';
    };

    const grade = calculateGrade(percentage);

    const savedResult = await StudentExamResult.create({
      student_id: studentId,
      exam_id: id,
      score: correctCount,
      percentage: percentage,
      grade: grade
    });

    return res.status(200).json({
      success: true,
      message: 'CBT examination marked successfully',
      result: {
        score: correctCount,
        total,
        percentage,
        grade,
        jamb_equivalent: Math.round((percentage / 100) * 400),
        review: questionReview,
        saved_id: savedResult.result_id
      }
    });
  } catch (err) {
    console.error('submitExam error:', err);
    return res.status(500).json({ success: false, message: 'Server error during exam marking' });
  }
};
