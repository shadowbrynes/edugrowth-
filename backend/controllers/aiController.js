const { AIChatHistory, AIRecommendation, Student, User } = require('../models');

// 1. Log an AI conversation interaction
exports.saveChat = async (req, res) => {
  try {
    const { student_id, question, response } = req.body;

    if (!question || !response) {
      return res.status(400).json({ success: false, message: 'question and response are required' });
    }

    const chatRecord = await AIChatHistory.create({
      student_id: student_id || (req.user ? req.user.id : 1),
      question,
      response
    });

    return res.status(201).json({
      success: true,
      message: 'AI chat interaction successfully persisted in MySQL ai_chat_history table',
      chat: chatRecord
    });
  } catch (err) {
    console.error('saveChat error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// 2. Get chat history for a student
exports.getChatHistory = async (req, res) => {
  try {
    const { student_id } = req.params;

    const history = await AIChatHistory.findAll({
      where: { student_id },
      order: [['created_at', 'ASC']],
      limit: 50
    });

    return res.status(200).json({ success: true, count: history.length, history });
  } catch (err) {
    console.error('getChatHistory error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// 3. Save an AI recommendation
exports.saveRecommendation = async (req, res) => {
  try {
    const { student_id, weak_subject, recommendation, generated_by } = req.body;

    if (!recommendation) {
      return res.status(400).json({ success: false, message: 'recommendation is required' });
    }

    const recRecord = await AIRecommendation.create({
      student_id: student_id || (req.user ? req.user.id : 1),
      weak_subject: weak_subject || 'General Academic Mastery',
      recommendation,
      generated_by: generated_by || 'ExcelMind AI Academic Coach'
    });

    return res.status(201).json({
      success: true,
      message: 'AI recommendation saved in MySQL ai_recommendations table',
      recommendation: recRecord
    });
  } catch (err) {
    console.error('saveRecommendation error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// 4. Get recommendations for a student
exports.getRecommendations = async (req, res) => {
  try {
    const { student_id } = req.params;

    const recommendations = await AIRecommendation.findAll({
      where: { student_id },
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({ success: true, count: recommendations.length, recommendations });
  } catch (err) {
    console.error('getRecommendations error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

const aiTutorEngine = require('../services/aiTutorEngine');

// 5. Query Intelligent Curriculum-Aware AI Tutor
exports.tutorQuery = async (req, res) => {
  const startTime = Date.now();
  const { student_id, question, category, imageAttachment, subject } = req.body || {};
  const resolvedStudentId = student_id || (req.user?.student_id || req.user?.id || 1);
  const timestamp = new Date().toISOString();

  // Audit Logging: Student ID, Question sent, Timestamp
  console.log(`[AI Tutor Audit] Time: ${timestamp} | Student ID: ${resolvedStudentId} | Question: "${question || '(photo attachment)'}" | Category: ${category || 'Ask Question'} | Subject: ${subject || 'Auto-Detect'}`);

  try {
    if (!question && !imageAttachment) {
      console.warn(`[AI Tutor Audit] Status: 400 Bad Request | Student ID: ${resolvedStudentId} | Message: Empty question`);
      return res.status(400).json({
        success: false,
        answer: 'Please provide a question to ask the AI Tutor.',
        subject: subject || 'General Knowledge',
        confidence: 0,
        message: 'question or imageAttachment is required'
      });
    }

    const result = await aiTutorEngine.processQuery({
      studentId: resolvedStudentId,
      question,
      category,
      imageAttachment,
      subject
    });

    const elapsed = Date.now() - startTime;
    const answer = result.answer || result.response?.text || result.response?.answer || 'No answer was generated. Please try again.';
    const confidence = result.confidence || 95;
    const detectedSubject = result.subject || subject || 'General Knowledge';

    // Audit Logging: API response status
    console.log(`[AI Tutor Audit] Status: 200 OK | Student ID: ${resolvedStudentId} | Subject: ${detectedSubject} | Confidence: ${confidence}% | Duration: ${elapsed}ms`);

    return res.status(200).json({
      success: true,
      answer,
      subject: detectedSubject,
      confidence,
      responseType: result.responseType || 'explanation',
      curriculumLabel: result.curriculumLabel || undefined,
      response: {
        text: answer,
        answer,
        subject: detectedSubject,
        confidence,
        accuracyScore: (result.response?.accuracyScore || 0.99),
        sections: result.response?.sections || {},
        curriculumLabel: result.curriculumLabel || undefined
      },
      studentContext: result.studentContext
    });
  } catch (err) {
    const elapsed = Date.now() - startTime;
    // Log internal error to server console, do not expose stack trace or raw errors to students
    console.error(`[AI Tutor Audit] Status: 500 Handled | Student ID: ${resolvedStudentId} | Duration: ${elapsed}ms | Error:`, err.message);

    // Provide safe, user-friendly fallback response so frontend never crashes and session remains intact
    return res.status(200).json({
      success: false,
      answer: 'AI Tutor is temporarily unavailable. Please try again.',
      subject: subject || 'General Knowledge',
      confidence: 0,
      curriculumLabel: 'Aligned with NERDC / WAEC Syllabus',
      error: 'AI Tutor is temporarily unavailable. Please try again.',
      response: {
        text: 'AI Tutor is temporarily unavailable. Please try again.',
        answer: 'AI Tutor is temporarily unavailable. Please try again.',
        subject: subject || 'General Knowledge',
        confidence: 0,
        accuracyScore: 0,
        sections: {
          simpleExplanation: 'AI Tutor is temporarily unavailable. Please try again.',
          detailedExplanation: 'Our academic intelligence engine experienced a temporary processing delay. Your student session and learning data are completely safe.',
          keyPoints: [
            'Please verify your internet connection and submit your question again.',
            'Your student session remains active without interruption.',
            'You can also select another subject filter or ask a benchmark question.'
          ]
        }
      }
    });
  }
};

// 6. Get Student AI Learning Context (Profile, Class Level, Weak Subjects)
exports.tutorContext = async (req, res) => {
  try {
    const { student_id } = req.params;
    const resolvedStudentId = student_id || (req.user?.student_id || req.user?.id || 1);

    const context = await aiTutorEngine.getStudentContext(resolvedStudentId);
    return res.status(200).json({ success: true, context });
  } catch (err) {
    console.error('tutorContext error:', err);
    return res.status(500).json({ success: false, message: 'Server error loading student AI context', error: err.message });
  }
};

// 7. Generate Personalized WAEC / JAMB Preparation Strategy
exports.tutorWaecPrep = async (req, res) => {
  try {
    const { student_id, subject } = req.body;
    const resolvedStudentId = student_id || (req.user?.student_id || req.user?.id || 1);

    const result = await aiTutorEngine.processQuery({
      studentId: resolvedStudentId,
      question: 'Prepare me for WAEC examination with 7-day revision plan and weak area analysis',
      category: 'Prepare for Exam',
      subject: subject || 'Physics'
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error('tutorWaecPrep error:', err);
    return res.status(500).json({ success: false, message: 'Server error generating WAEC prep', error: err.message });
  }
};

// 8. Clear student AI tutor temporary session context
exports.clearSession = async (req, res) => {
  try {
    const { student_id } = req.body || {};
    const resolvedStudentId = student_id || (req.user?.student_id || req.user?.id || 1);
    const result = aiTutorEngine.clearSession(resolvedStudentId);
    return res.status(200).json(result);
  } catch (err) {
    console.error('clearSession error:', err);
    return res.status(500).json({ success: false, message: 'Server error clearing session', error: err.message });
  }
};

