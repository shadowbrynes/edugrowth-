/**
 * ExcelMind Academic Platform - OpenAI AI Tutor Service
 * 
 * Architecture:
 * Student App (Web / Android / iOS)
 *        |
 *        v
 * ExcelMind Backend API (/api/ai/tutor/query)
 *        |
 *        v
 * OpenAI API (gpt-4o-mini with structured JSON output)
 *        |
 *        v
 * Response Validation Layer (no template filler, format check)
 *        |
 *        v
 * Student Interface
 */

const {
  Student, Class, AIChatHistory
} = require('../models');

// System Instruction as specified
const SYSTEM_PROMPT = `You are ExcelMind AI Tutor, an intelligent educational assistant.

Your job is to teach students clearly and accurately.

Always answer the exact question asked.

Do not describe the question.
Do not repeat the question.
Do not use generic academic filler.

Adapt your explanation according to the student's level.

You can answer:
- Mathematics
- Physics
- Chemistry
- Biology
- English
- Civic Education
- Government
- Social Studies
- Religious Studies
- Bible questions
- General knowledge
- Study advice

Before answering:
1. Understand the student's intent.
2. Identify the correct subject.
3. Provide a direct and accurate answer.

For simple questions:
Give a simple explanation.

For academic questions:
Give:
- Definition
- Explanation
- Examples
- Important points

For calculations:
Show working steps.

For Bible questions:
Answer from scripture context.

Never force every answer into a curriculum template.

You MUST respond strictly with a valid JSON object matching this schema:
{
  "answer": "actual student-friendly explanation",
  "subject": "identified subject",
  "questionType": "definition/explanation/calculation/scripture/general",
  "level": "student level",
  "confidence": 0.95
}`;

// Strictly blocked template phrases
const FORBIDDEN_PHRASES = [
  /key academic principles/i,
  /fundamental definitions/i,
  /core analytical principles/i,
  /practical problem-solving methods/i,
  /verified curriculum alignment/i,
  /nerdc/i,
  /waec standard/i,
  /general knowledge fallback/i,
  /foundational subject matter/i,
  /is a foundational concept/i,
  /in the nigerian curriculum/i,
  /students explore/i,
  /this topic covers/i,
  /it is a recognized academic concept/i,
  /refers to the concept or subject matter under study/i
];

class OpenAITutorService {
  constructor() {
    this.sessionContextMap = new Map();
  }

  /**
   * Reset session context for a student
   */
  clearSession(studentId) {
    const key = String(studentId || 1);
    this.sessionContextMap.delete(key);
    return { success: true, message: `Context cleared for student ${studentId}` };
  }

  /**
   * Fetch relevant student context (class level, name) without leaking prior conversations
   */
  async getStudentContext(studentId) {
    const sId = studentId || 1;
    try {
      if (Student) {
        const student = await Student.findOne({
          where: { id: sId },
          attributes: ['id', 'user_id', 'admission_number', 'class_id', 'department', 'created_at'],
          include: Class ? [{ model: Class, as: 'class', attributes: ['name', 'level'] }] : []
        });

        if (student) {
          const className = student.class?.name || (student.class_id ? `Class ${student.class_id}` : 'SS3');
          const department = student.department || 'Science';
          return {
            id: student.id,
            name: `Student #${student.admission_number || student.id}`,
            classLevel: `${className} (${department})`,
            department: department,
            school: 'ExcelMind Academy'
          };
        }
      }
    } catch (err) {
      console.warn('[OpenAITutorService] Context lookup non-critical notice:', err.message);
    }

    return {
      id: sId,
      name: 'Student',
      classLevel: 'SS3 (Science)',
      department: 'Science',
      school: 'ExcelMind Academy'
    };
  }

  /**
   * Main AI Tutor query processor
   */
  async processQuery({ studentId, question, category, imageAttachment, subject }) {
    const cleanQuestion = String(question || '').trim();
    const resolvedStudentId = studentId || 1;

    // Retrieve student level context
    const studentContext = await this.getStudentContext(resolvedStudentId);
    const studentLevel = studentContext.classLevel || 'SS3';

    // Verify OpenAI API Key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('[OpenAITutorService] Missing OPENAI_API_KEY in environment variables.');
      return {
        answer: 'The AI Tutor is temporarily unavailable. Please try again.',
        subject: subject || 'General Knowledge',
        questionType: 'general',
        level: studentLevel,
        confidence: 0
      };
    }

    // Prepare OpenAI Messages
    const systemInstructionWithContext = `${SYSTEM_PROMPT}\n\nStudent Profile:\n- Level: ${studentLevel}\n- Context: Answer at an appropriate level for this student.`;

    let userContent;
    if (imageAttachment) {
      userContent = [
        {
          type: 'text',
          text: cleanQuestion || 'Please review this educational image/question and provide the complete solution or explanation.'
        },
        {
          type: 'image_url',
          image_url: {
            url: imageAttachment
          }
        }
      ];
    } else {
      userContent = cleanQuestion;
      if (subject && subject !== 'Auto-Detect') {
        userContent += `\n[Student designated subject: ${subject}]`;
      }
    }

    const requestBody = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemInstructionWithContext },
        { role: 'user', content: userContent }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2
    };

    // Execute OpenAI request with timeout & retry protection
    const openAiResponse = await this._executeWithRetry(apiKey, requestBody, 2);

    if (!openAiResponse) {
      console.warn('[OpenAITutorService] OpenAI request failed after retries.');
      return {
        answer: 'The AI Tutor is temporarily unavailable. Please try again.',
        subject: subject || 'General Knowledge',
        questionType: 'general',
        level: studentLevel,
        confidence: 0
      };
    }

    // Response Validation Layer
    const validated = this._validateResponse(openAiResponse, cleanQuestion, subject, studentLevel);

    // Persist to AIChatHistory asynchronously
    this._persistChat(resolvedStudentId, cleanQuestion, validated.answer).catch((e) =>
      console.warn('[OpenAITutorService] Failed to persist chat history:', e.message)
    );

    return validated;
  }

  /**
   * Execute OpenAI API call with timeout and retry handling
   */
  async _executeWithRetry(apiKey, requestBody, maxRetries = 2) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          const errText = await res.text().catch(() => '');
          console.error(`[OpenAITutorService] OpenAI HTTP error ${res.status} (attempt ${attempt}):`, errText);
          if (attempt === maxRetries || res.status === 401 || res.status === 400) {
            return null;
          }
          await new Promise((r) => setTimeout(r, 1000 * attempt));
          continue;
        }

        const data = await res.json();
        const rawContent = data.choices?.[0]?.message?.content;
        if (!rawContent) {
          console.warn(`[OpenAITutorService] Empty choices content from OpenAI (attempt ${attempt})`);
          continue;
        }

        try {
          const parsed = JSON.parse(rawContent);
          return parsed;
        } catch (jsonErr) {
          console.error(`[OpenAITutorService] JSON parse error on OpenAI response:`, jsonErr.message);
          return null;
        }
      } catch (networkErr) {
        clearTimeout(timeoutId);
        console.warn(`[OpenAITutorService] Network/timeout error on attempt ${attempt}:`, networkErr.message);
        if (attempt === maxRetries) {
          return null;
        }
        await new Promise((r) => setTimeout(r, 1000 * attempt));
      }
    }
    return null;
  }

  /**
   * Response Validation Layer
   * Ensures the answer contains no forbidden template boilerplate, is non-empty, and conforms to format.
   */
  _validateResponse(parsed, originalQuestion, requestedSubject, defaultLevel) {
    let rawAnswer = String(parsed?.answer || '').trim();
    const detectedSubject = String(parsed?.subject || requestedSubject || 'General Knowledge').trim();
    const questionType = String(parsed?.questionType || 'explanation').trim();
    const level = String(parsed?.level || defaultLevel).trim();
    const confidence = parsed?.confidence !== undefined ? parsed.confidence : 0.95;

    // Check for forbidden template patterns
    let hasForbidden = false;
    for (const pattern of FORBIDDEN_PHRASES) {
      if (pattern.test(rawAnswer)) {
        console.warn(`[OpenAITutorService Validation] Detected forbidden template pattern: ${pattern}. Sanitizing.`);
        hasForbidden = true;
        break;
      }
    }

    if (hasForbidden || !rawAnswer) {
      return {
        answer: 'The AI Tutor is temporarily unavailable. Please try again.',
        subject: detectedSubject,
        questionType: questionType,
        level: level,
        confidence: 0
      };
    }

    return {
      answer: rawAnswer,
      subject: detectedSubject,
      questionType: questionType,
      level: level,
      confidence: confidence
    };
  }

  /**
   * Persist interaction to MySQL database
   */
  async _persistChat(studentId, question, answer) {
    if (!AIChatHistory) return;
    try {
      await AIChatHistory.create({
        student_id: studentId,
        question: question || '(Photo Attachment)',
        response: answer
      });
    } catch (e) {
      // Non-critical background logging
    }
  }
}

const openaiTutorService = new OpenAITutorService();
module.exports = openaiTutorService;
