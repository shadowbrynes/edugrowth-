const { Exam, Question, StudentExamResult, ExamAttempt, Student, Subject, User } = require('../models');

// 1. Get all CBT Exams
exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.findAll({
      include: [
        { model: Subject, as: 'subject', attributes: ['subject_name', 'subject_code'] }
      ],
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({ success: true, count: exams.length, exams });
  } catch (err) {
    console.error('getAllExams error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
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
          as: 'questions'
        }
      ]
    });

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    return res.status(200).json({ success: true, exam });
  } catch (err) {
    console.error('getExamQuestions error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// 3. Create a new Exam
exports.createExam = async (req, res) => {
  try {
    const { title, subject_id, exam_type, duration, total_questions, created_by } = req.body;
    if (!title || !subject_id) {
      return res.status(400).json({ success: false, message: 'title and subject_id are required' });
    }

    const exam = await Exam.create({
      school_id: 1,
      subject_id,
      title,
      exam_type: exam_type || 'CBT',
      duration: duration || 60,
      total_questions: total_questions || 40,
      created_by: created_by || (req.user ? req.user.id : 1),
      exam_date: new Date()
    });

    return res.status(201).json({ success: true, message: 'Exam created successfully', exam });
  } catch (err) {
    console.error('createExam error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// 4. Add question to an exam
exports.addQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty_level } = req.body;

    if (!question_text || !option_a || !option_b || !correct_answer) {
      return res.status(400).json({ success: false, message: 'question_text, option_a, option_b and correct_answer are required' });
    }

    const question = await Question.create({
      exam_id: id,
      question_text,
      option_a,
      option_b,
      option_c: option_c || '',
      option_d: option_d || '',
      correct_answer,
      explanation: explanation || '',
      difficulty_level: difficulty_level || 'Medium'
    });

    return res.status(201).json({ success: true, message: 'Question saved in MySQL questions table', question });
  } catch (err) {
    console.error('addQuestion error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// 5. Submit CBT Exam answers & Auto-Mark
exports.submitExam = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers, student_id } = req.body; // { questionId: 'A' | 'B' | 'C' | 'D' }

    const targetStudentId = student_id || (req.user ? req.user.id : 1);

    const questions = await Question.findAll({ where: { exam_id: id } });
    if (!questions.length) {
      return res.status(404).json({ success: false, message: 'No questions found for this exam' });
    }

    let correctCount = 0;
    const questionReview = [];

    questions.forEach((q) => {
      const qKey = q.id || q.question_id;
      const userAnswer = answers ? answers[qKey] : null;
      const isCorrect = userAnswer === q.correct_answer;
      if (isCorrect) correctCount++;

      questionReview.push({
        question_id: qKey,
        question_text: q.question_text,
        user_answer: userAnswer,
        correct_answer: q.correct_answer,
        is_correct: isCorrect,
        explanation: q.explanation
      });
    });

    const total = questions.length;
    const percentage = Math.round((correctCount / total) * 100);

    // Save in exam_attempts table
    const attempt = await ExamAttempt.create({
      student_id: targetStudentId,
      exam_id: id,
      score: correctCount,
      percentage: percentage,
      end_time: new Date(),
      status: 'completed'
    });

    // Save in student_exam_results
    try {
      await StudentExamResult.create({
        student_id: targetStudentId,
        exam_id: id,
        score: correctCount,
        percentage: percentage,
        grade: percentage >= 80 ? 'A1' : percentage >= 75 ? 'B2' : percentage >= 65 ? 'C4' : percentage >= 50 ? 'C6' : 'F9'
      });
    } catch (e) {
      // Ignored if table variation exists
    }

    return res.status(200).json({
      success: true,
      message: 'CBT examination marked and permanently recorded in MySQL exam_attempts table',
      result: {
        score: correctCount,
        total,
        percentage,
        grade: percentage >= 90 ? 'A' : percentage >= 75 ? 'B' : percentage >= 60 ? 'C' : percentage >= 50 ? 'D' : 'F',
        jamb_equivalent: Math.round((percentage / 100) * 400),
        attempt_id: attempt.id,
        review: questionReview
      }
    });
  } catch (err) {
    console.error('submitExam error:', err);
    return res.status(500).json({ success: false, message: 'Server error during exam marking', error: err.message });
  }
};

// 6. Record CBT Attempt directly from UI
exports.recordAttempt = async (req, res) => {
  try {
    const { student_id, exam_id, score, percentage } = req.body;

    const attempt = await ExamAttempt.create({
      student_id: student_id || (req.user ? req.user.id : 1),
      exam_id: exam_id || 1,
      score: score || 0,
      percentage: percentage || 0,
      end_time: new Date(),
      status: 'completed'
    });

    return res.status(201).json({
      success: true,
      message: 'CBT exam attempt saved to MySQL exam_attempts table',
      attempt
    });
  } catch (err) {
    console.error('recordAttempt error:', err);
    return res.status(500).json({ success: false, message: 'Server error saving attempt', error: err.message });
  }
};

// 7. Get student's exam attempts
exports.getStudentAttempts = async (req, res) => {
  try {
    const { student_id } = req.params;

    const attempts = await ExamAttempt.findAll({
      where: { student_id },
      include: [{ model: Exam, as: 'exam', attributes: ['title', 'exam_type', 'duration'] }],
      order: [['start_time', 'DESC']]
    });

    return res.status(200).json({ success: true, count: attempts.length, attempts });
  } catch (err) {
    console.error('getStudentAttempts error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
