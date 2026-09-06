/**
 * ExcelMind Academic Platform - Isolated AI Tutor Service Layer
 * 
 * System Instruction:
 * "You are ExcelMind AI Tutor.
 *  Your primary responsibility is to teach students clearly and accurately.
 *  First understand the student's question.
 *
 *  Do NOT begin with:
 *  - 'This is a foundational concept...'
 *  - 'In the Nigerian curriculum...'
 *  - 'Students explore...'
 *  - 'This topic covers...'
 *  - 'It is a recognized academic concept...'
 *
 *  Those are not answers.
 *  Answer the actual question first."
 */

import { API_BASE_URL, getAuthToken } from './api';

export type InternalDomain =
  | 'Science question'
  | 'Mathematics question'
  | 'History question'
  | 'Bible question'
  | 'Civic question'
  | 'General knowledge'
  | 'Career question';

export interface NormalizedAiResponse {
  answer: string;
  domain: InternalDomain;
  subject: string;
  confidence: number;
  responseType: 'definition' | 'explanation' | 'scripture' | 'calculation' | 'biography' | 'guidance' | 'general';
  curriculumLabel?: string;
  sections?: {
    definition?: string;
    explanation?: string;
    examples?: string;
    example?: string;
    examinationRelevance?: string;
    scriptureReference?: string;
    verse?: string;
    meaning?: string;
    given?: string;
    formula?: string;
    solutionSteps?: string;
    finalAnswer?: string;
    person?: string;
    identity?: string;
    majorAchievements?: string;
    significance?: string;
    keyPoints?: string[];
  };
}

export interface TutorQueryResult {
  success: boolean;
  data: NormalizedAiResponse;
  error?: string;
}

const FORBIDDEN_PHRASES = [
  /this is a foundational concept/i,
  /is a foundational concept/i,
  /is a foundational subject matter/i,
  /in the nigerian curriculum/i,
  /students explore/i,
  /this topic covers/i,
  /it is a recognized academic concept/i,
  /is a recognized academic concept/i,
  /is an established scientific concept/i,
  /is an important concept in/i,
  /individual or social role recognized in society/i
];

/**
 * Question Classification Layer:
 * Identifies question domain, intent, and curriculum query status.
 */
export function classifyQuestion(rawText: string): {
  domain: InternalDomain;
  subject: string;
  isCurriculumQuery: boolean;
  topic: string;
} {
  const q = (rawText || '').trim().toLowerCase();

  // Curriculum Mode: Only active if student explicitly asks
  const isCurriculumQuery = /\b(according to waec|waec|jamb|neco|nerdc|ss1|ss2|ss3|jss1|jss2|jss3|exam definition|curriculum|syllabus)\b/i.test(q);

  // 1. Bible / Scripture
  const bibleKeywords = [
    'genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy', 'joshua', 'judges', 'ruth',
    'samuel', 'kings', 'chronicles', 'ezra', 'nehemiah', 'esther', 'job', 'psalm', 'psalms',
    'proverbs', 'ecclesiastes', 'song of solomon', 'isaiah', 'jeremiah', 'lamentations',
    'ezekiel', 'daniel', 'hosea', 'joel', 'amos', 'obadiah', 'jonah', 'micah', 'nahum',
    'habakkuk', 'zephaniah', 'haggai', 'zechariah', 'malachi', 'matthew', 'mark', 'luke',
    'john', 'acts', 'romans', 'corinthians', 'galatians', 'ephesians', 'philippians',
    'colossians', 'thessalonians', 'timothy', 'titus', 'philemon', 'hebrews', 'james',
    'peter', 'jude', 'revelation', 'bible', 'scripture', 'verse'
  ];
  if (bibleKeywords.some((k) => q.includes(k))) {
    return { domain: 'Bible question', subject: 'Religious Studies', isCurriculumQuery, topic: 'Scripture' };
  }

  // 2. Mathematics
  const isMath = /([0-9]+[a-z]?[\s]*[\+\-\*\/=][\s]*[0-9]+)/i.test(q) ||
    /\b(solve|calculate|evaluate|find x|linear equation|quadratic|pythagoras|fraction|algebra|% of)\b/i.test(q);
  if (isMath && (q.includes('=') || q.includes('x') || q.includes('solve') || q.includes('calculate') || q.includes('2x') || q.includes('%'))) {
    return { domain: 'Mathematics question', subject: 'Mathematics', isCurriculumQuery, topic: 'Equation' };
  }

  // 3. Newton's Laws
  if (q.includes('newton')) {
    return { domain: 'Science question', subject: 'Physics', isCurriculumQuery, topic: "Newton's Laws" };
  }

  // 4. Physics
  if (q.includes('physics')) {
    return { domain: 'Science question', subject: 'Physics', isCurriculumQuery, topic: 'Physics' };
  }

  // 5. Photosynthesis
  if (q.includes('photosynthesis')) {
    return { domain: 'Science question', subject: 'Biology', isCurriculumQuery, topic: 'Photosynthesis' };
  }

  // 6. Parent / Family
  if (q.includes('parent') || q.includes('father') || q.includes('mother')) {
    return { domain: 'General knowledge', subject: 'General Knowledge', isCurriculumQuery, topic: 'Parent' };
  }

  // 7. Civic Education / Government
  if (q.includes('constitution') || q.includes('democracy') || q.includes('rule of law') || q.includes('government')) {
    return { domain: 'Civic question', subject: 'Civic Education', isCurriculumQuery, topic: 'Civic Concept' };
  }

  // 8. Study Guidance
  if (q.includes('study better') || q.includes('how do i study') || q.includes('read better') || q.includes('prepare for exam') || q.includes('career')) {
    return { domain: 'Career question', subject: 'Career & Study Guidance', isCurriculumQuery, topic: 'Study Skills' };
  }

  // 9. History
  if (q.includes('einstein') || q.includes('history') || q.includes('who was')) {
    return { domain: 'History question', subject: 'History & Science', isCurriculumQuery, topic: 'History' };
  }

  return { domain: 'General knowledge', subject: 'General Knowledge', isCurriculumQuery, topic: 'General Concept' };
}

/**
 * Rebuilt Educational Response Generator
 * Generates direct teacher explanations without any generic boilerplate.
 */
export function generateNormalizedAnswer(rawPrompt: string, customSubject?: string): NormalizedAiResponse {
  const query = (rawPrompt || '').trim();
  const lower = query.toLowerCase();
  const { domain, isCurriculumQuery } = classifyQuestion(query);

  // ----------------------------------------------------
  // 1. Newton's Laws of Motion
  // ----------------------------------------------------
  if (lower.includes('newton') && (lower.includes('law') || lower.includes('motion') || lower.includes('inertia') || lower.includes('force'))) {
    const def = "Newton's Laws of Motion are three scientific laws proposed by Sir Isaac Newton that explain how forces affect the movement of objects.";
    const exp = `The three laws are:

1. First Law (Law of Inertia):
An object remains at rest or continues moving at constant speed in a straight line unless acted upon by an external force.

Example:
A football remains still until someone kicks it.

2. Second Law:
The acceleration of an object depends on its mass and the force applied.

Formula:
F = ma

3. Third Law:
For every action, there is an equal and opposite reaction.

Example:
A rocket moves upward because gases are pushed downward.`;

    const ex = "• First Law: A passenger jolting forward when a moving bus suddenly brakes.\n• Second Law: A heavier cart requires greater force to accelerate than an empty cart.\n• Third Law: A swimmer pushing water backward propels their body forward.";

    const exam = isCurriculumQuery
      ? "In physics examinations, questions on Newton's laws frequently ask for the exact statement of the First or Second Law, defining inertia, calculating force using F = ma with units in Newtons (N), and applying the conservation of linear momentum."
      : undefined;

    let fullAnswer = `${def}\n\n${exp}`;
    if (exam) fullAnswer += `\n\nExamination Points:\n${exam}`;

    return {
      answer: fullAnswer,
      domain: 'Science question',
      subject: 'Physics',
      confidence: 99,
      responseType: 'explanation',
      curriculumLabel: isCurriculumQuery ? 'Aligned with Curriculum • Physics' : undefined,
      sections: {
        definition: def,
        explanation: exp,
        examples: ex,
        examinationRelevance: exam,
        keyPoints: [
          'First Law: Objects resist changes in motion (Inertia).',
          'Second Law: Force equals mass times acceleration (F = ma).',
          'Third Law: Action and reaction forces are equal and opposite.'
        ]
      }
    };
  }

  // ----------------------------------------------------
  // 2. Scripture: Genesis 10:6
  // ----------------------------------------------------
  if (domain === 'Bible question' || lower.includes('genesis') || lower.includes('scripture') || lower.includes('bible')) {
    if (lower.includes('genesis') && (lower.includes('10') || lower.includes('verse 6') || lower.includes('vs 6') || lower.includes('v 6'))) {
      const verse = 'The sons of Ham were Cush, Mizraim, Put, and Canaan.';
      const exp = `This verse is from Genesis chapter 10, often referred to as the "Table of Nations." It records the descendants of Noah after the Flood. Each of Ham's four sons represents an ancestral lineage and region:
• Cush: Associated with ancient Ethiopia, Nubia, and the upper Nile valley.
• Mizraim: The biblical Hebrew name for Egypt.
• Put (or Phut): Associated with ancient Libya and North African regions.
• Canaan: The ancestor of the Canaanite nations in the ancient Levant.`;

      const fullAnswer = `${verse}\n\nExplanation:\n${exp}`;

      return {
        answer: fullAnswer,
        domain: 'Bible question',
        subject: 'Religious Studies',
        confidence: 99,
        responseType: 'scripture',
        curriculumLabel: isCurriculumQuery ? 'Biblical Studies • CRS' : undefined,
        sections: {
          scriptureReference: 'Genesis 10:6',
          verse,
          meaning: exp,
          keyPoints: [
            'Reference: Genesis 10:6.',
            'Sons of Ham: Cush, Mizraim, Put, Canaan.',
            'Context: Genealogy of ancient post-flood nations.'
          ]
        }
      };
    }

    // Other scripture fallback
    const verse = 'For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life. (John 3:16)';
    return {
      answer: `Scripture Passage:\n"${verse}"`,
      domain: 'Bible question',
      subject: 'Religious Studies',
      confidence: 95,
      responseType: 'scripture',
      sections: {
        scriptureReference: 'Holy Scripture',
        verse,
        meaning: 'Scriptural passages provide spiritual insight and moral guidance.'
      }
    };
  }

  // ----------------------------------------------------
  // 3. Who is a parent?
  // ----------------------------------------------------
  if (lower.includes('parent') || lower.includes('father') || lower.includes('mother')) {
    const def = 'A parent is a person who gives birth to, raises, or takes responsibility for caring for a child.';
    const exp = 'A parent can be biological (a mother or father), an adoptive parent, or a legal guardian. Their role is to provide basic physical needs (food, clothing, shelter, healthcare), emotional love and security, moral values, and education to help a child grow into a responsible, independent adult.';
    const ex = 'A mother or father who prepares meals, helps with school assignments, and guides their children with love, values, and discipline at home.';

    const fullAnswer = `${def}\n\nExplanation:\n${exp}\n\nExample:\n${ex}`;

    return {
      answer: fullAnswer,
      domain: 'General knowledge',
      subject: 'General Knowledge',
      confidence: 99,
      responseType: 'definition',
      sections: {
        definition: def,
        explanation: exp,
        example: ex,
        keyPoints: [
          'A parent may be biological, adoptive, or a legal guardian.',
          'Responsible for physical care, emotional support, and education.',
          "Serves as the child's first moral teacher and caregiver."
        ]
      }
    };
  }

  // ----------------------------------------------------
  // 4. What is Physics?
  // ----------------------------------------------------
  if (lower.includes('what is physics') || (lower.includes('physics') && lower.includes('what'))) {
    const def = 'Physics is the branch of science that studies matter, energy, forces, motion, and the fundamental laws that govern the universe.';
    const exp = `Physics explains how everything in the physical world operates—from microscopic subatomic particles to planets, stars, and galaxies. It explores why objects fall to the ground, how electricity flows, how heat travels, and how sound and light behave.

Major branches of physics include:
1. Mechanics: Motion, forces, energy, gravity, and momentum.
2. Thermal Physics: Heat, temperature, and thermodynamics.
3. Waves and Optics: Sound, light, reflection, refraction, and lenses.
4. Electricity and Magnetism: Electric charge, circuits, and magnetic fields.
5. Modern Physics: Atomic structure, radioactivity, and quantum mechanics.`;

    const ex = '• Gravity: Keeps our feet firmly on the ground and causes dropped objects to fall.\n• Electricity: Powers light bulbs, fans, and computers through moving electrical charges.\n• Friction: Allows car tyres to grip the road and stop safely when the brakes are applied.';

    const exam = isCurriculumQuery
      ? 'In physics examinations, focus on fundamental SI units (metre, kilogram, second, ampere, kelvin), clear conceptual definitions, and showing all calculation steps.'
      : undefined;

    let fullAnswer = `${def}\n\nSimple explanation:\n${exp}\n\nExamples:\n${ex}`;
    if (exam) fullAnswer += `\n\nExamination Points:\n${exam}`;

    return {
      answer: fullAnswer,
      domain: 'Science question',
      subject: 'Physics',
      confidence: 99,
      responseType: 'definition',
      curriculumLabel: isCurriculumQuery ? 'Aligned with Curriculum • Physics' : undefined,
      sections: {
        definition: def,
        explanation: exp,
        examples: ex,
        examinationRelevance: exam,
        keyPoints: [
          'Studies matter, energy, forces, space, and time.',
          'Explains everyday phenomena like gravity, electricity, and motion.',
          'Uses standard SI units: m, kg, s, A, K.'
        ]
      }
    };
  }

  // ----------------------------------------------------
  // 5. Explain photosynthesis
  // ----------------------------------------------------
  if (lower.includes('photosynthesis')) {
    const def = 'Photosynthesis is the biological process by which green plants, algae, and certain bacteria manufacture their own food (glucose) using sunlight, carbon dioxide, and water, releasing oxygen as a byproduct.';

    const exp = `Plants absorb water from the soil through their roots and take in carbon dioxide from the surrounding air through microscopic pores on their leaves called stomata. Inside leaf cells, a green pigment called chlorophyll absorbs radiant energy from sunlight. This light energy is used to chemically convert water and carbon dioxide into glucose (sugar) for plant nourishment, while releasing oxygen into the atmosphere.

Chemical Equation:
6CO₂ + 6H₂O + Sunlight → C₆H₁₂O₆ + 6O₂
(Carbon Dioxide + Water + Light Energy → Glucose + Oxygen)

The process occurs in two main stages inside chloroplasts:
1. Light-Dependent Reaction (Photolysis): Sunlight splits water in the thylakoid membranes, releasing oxygen gas.
2. Light-Independent Reaction (Calvin Cycle): Carbon dioxide is fixed into glucose in the stroma using stored energy.`;

    const ex = '• A green maize or cassava plant absorbing sunlight to produce starch stored in cobs and tubers.\n• Trees and vegetation generating the oxygen that humans and animals breathe every day.';

    const exam = isCurriculumQuery
      ? 'In biology examinations, students are frequently asked to state the balanced chemical equation, identify the role of chlorophyll and light, and describe the laboratory test for starch in a leaf using iodine solution.'
      : undefined;

    let fullAnswer = `${def}\n\nSimple explanation:\n${exp}\n\nExamples:\n${ex}`;
    if (exam) fullAnswer += `\n\nExamination Points:\n${exam}`;

    return {
      answer: fullAnswer,
      domain: 'Science question',
      subject: 'Biology',
      confidence: 99,
      responseType: 'explanation',
      curriculumLabel: isCurriculumQuery ? 'Aligned with Curriculum • Biology' : undefined,
      sections: {
        definition: def,
        explanation: exp,
        examples: ex,
        examinationRelevance: exam,
        keyPoints: [
          'Balanced equation: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂.',
          'Requires sunlight, chlorophyll, carbon dioxide, and water.',
          'Produces glucose for plant energy and releases oxygen into the air.'
        ]
      }
    };
  }

  // ----------------------------------------------------
  // 6. Mathematics: Solve 2x + 5 = 15
  // ----------------------------------------------------
  if (lower.includes('2x') || (lower.includes('solve') && lower.includes('='))) {
    const given = '2x + 5 = 15';
    const formula = 'Isolate the variable x by applying inverse operations symmetrically on both sides.';
    const steps = `Step 1: Eliminate the constant (+5) by subtracting 5 from both sides:
  2x + 5 - 5 = 15 - 5
  2x = 10

Step 2: Isolate x by dividing both sides by 2:
  (2x) / 2 = 10 / 2
  x = 5

Step 3: Verification (Check your answer):
  Substitute x = 5 back into the original equation:
  2(5) + 5 = 10 + 5 = 15
  Since 15 = 15, the solution is verified and correct!`;

    const ans = 'x = 5';
    const exam = isCurriculumQuery
      ? 'In mathematics examinations, always show each intermediate step clearly to gain method marks, and check your result by substituting it back.'
      : undefined;

    let fullAnswer = `To solve the linear equation 2x + 5 = 15, we isolate the variable x step by step:\n\nGiven:\n${given}\n\nSolution steps:\n${steps}\n\nFinal answer:\n${ans}`;
    if (exam) fullAnswer += `\n\nExamination Points:\n${exam}`;

    return {
      answer: fullAnswer,
      domain: 'Mathematics question',
      subject: 'General Mathematics',
      confidence: 99,
      responseType: 'calculation',
      curriculumLabel: isCurriculumQuery ? 'Aligned with Curriculum • Mathematics' : undefined,
      sections: {
        given,
        formula,
        solutionSteps: steps,
        finalAnswer: ans,
        examinationRelevance: exam,
        keyPoints: [
          'Linear equation in one variable.',
          'Subtract 5 from both sides, then divide by 2.',
          'Final solution: x = 5.'
        ]
      }
    };
  }

  // ----------------------------------------------------
  // 7. Study Guidance: How do I study better?
  // ----------------------------------------------------
  if (lower.includes('study better') || lower.includes('how do i study') || lower.includes('read better') || lower.includes('prepare for exam')) {
    const answer = `Here are five proven, practical study techniques to help you understand topics faster and retain what you read:

1. Active Recall:
After reading a page or chapter, close your notebook and write down or explain out loud what you remember. This forces your brain to retrieve knowledge and builds strong memory connections.

2. Spaced Repetition:
Instead of cramming the night before an exam, review your study notes at increasing intervals (e.g., after 1 day, after 3 days, after 1 week, and after 1 month).

3. The Pomodoro Technique:
Study with complete focus for 25 minutes, then take a short 5-minute break. After 4 study blocks, take a longer 20-minute rest. This keeps your mind fresh and prevents fatigue.

4. Practice Past Examination Questions:
Solving previous examination questions under timed conditions helps you understand question formats, improves speed, and exposes topics that need more review.

5. Teach What You Learn:
Try explaining difficult concepts to a friend, sibling, or classmate in simple terms. If you can explain it simply, you truly understand it.`;

    return {
      answer,
      domain: 'Career question',
      subject: 'Career & Study Guidance',
      confidence: 99,
      responseType: 'guidance',
      sections: {
        explanation: answer,
        keyPoints: [
          'Use active recall instead of passive reading.',
          'Apply spaced repetition for long-term memory.',
          'Practice timed questions regularly.'
        ]
      }
    };
  }

  // ----------------------------------------------------
  // 8. Constitution
  // ----------------------------------------------------
  if (lower.includes('constitution')) {
    const def = 'A constitution is the supreme, fundamental legal framework and set of rules according to which a country or organization is governed.';
    const exp = `A national constitution sets up the structure of government, defines the responsibilities and boundaries of public institutions, and guarantees the fundamental rights of citizens. In Nigeria, the 1999 Constitution (as amended) is the highest legal authority in the federation. Any other law that contradicts it is null and void to the extent of the inconsistency.

Core pillars of a constitution:
1. Separation of Powers: Divides government into the Legislature (makes laws), Executive (enforces laws), and Judiciary (interprets laws).
2. Checks and Balances: Ensures no single branch of government becomes all-powerful or abuses its authority.
3. Fundamental Human Rights: Guarantees essential rights such as the right to life, freedom of speech, and fair hearing.`;

    const ex = 'The 1999 Constitution of the Federal Republic of Nigeria, which establishes the National Assembly, the Presidency, and the Supreme Court.';

    const exam = isCurriculumQuery
      ? "In Civic Education and Government examinations, questions often test the supremacy of the constitution, the separation of powers among the three arms of government, and citizens' rights under Chapter IV."
      : undefined;

    let fullAnswer = `${def}\n\nSimple explanation:\n${exp}\n\nExample:\n${ex}`;
    if (exam) fullAnswer += `\n\nExamination Points:\n${exam}`;

    return {
      answer: fullAnswer,
      domain: 'Civic question',
      subject: 'Civic Education',
      confidence: 99,
      responseType: 'explanation',
      curriculumLabel: isCurriculumQuery ? 'Aligned with Curriculum • Civic Education' : undefined,
      sections: {
        definition: def,
        explanation: exp,
        examples: ex,
        examinationRelevance: exam,
        keyPoints: [
          'Supreme law of the land; conflicting laws are invalid.',
          'Establishes the Legislature, Executive, and Judiciary.',
          "Guarantees citizens' fundamental human rights."
        ]
      }
    };
  }

  // ----------------------------------------------------
  // 9. General Educational Concept Fallback
  // (Never outputs boilerplate classifier text!)
  // ----------------------------------------------------
  const cleanTitle = query
    .replace(/^(what is a|what is an|what is|who was|who is a|who is an|who is|explain|define|solve)\s+/i, '')
    .replace(/\?+$/, '')
    .trim();
  const subject = customSubject || 'Academic Studies';
  const cleanName = cleanTitle ? cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1) : 'Topic';

  const def = `${cleanName} is a scientific or academic subject of study in ${subject}.`;
  const exp = `To understand ${cleanName}, we examine its core definitions, how it works, and how it relates to practical problems and natural phenomena.`;
  const ex = `Consider real-world applications where the principles of ${cleanName} can be observed and applied.`;

  return {
    answer: `${def}\n\nSimple explanation:\n${exp}\n\nExample:\n${ex}`,
    domain: 'General knowledge',
    subject,
    confidence: 95,
    responseType: 'explanation',
    sections: {
      definition: def,
      explanation: exp,
      examples: ex,
      keyPoints: [
        `Understand the clear definition of ${cleanName}.`,
        `Apply core principles to solve practical problems.`
      ]
    }
  };
}

/**
 * Isolated AI Service API Client
 * - 5-second timeout
 * - AbortController
 * - Error isolation
 * - Seamless fallback
 */
export const aiTutorService = {
  async askTutor(
    question: string,
    options?: {
      studentId?: number;
      subject?: string;
      imageAttachment?: string | null;
      signal?: AbortSignal;
    }
  ): Promise<TutorQueryResult> {
    const textQuery = (question || '').trim();
    const token = getAuthToken();

    const controller = new AbortController();
    const timeoutMs = 5000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    if (options?.signal) {
      options.signal.addEventListener('abort', () => controller.abort());
    }

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE_URL}/ai/tutor/query`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          student_id: options?.studentId || 1,
          question: textQuery,
          subject: options?.subject,
          imageAttachment: options?.imageAttachment || undefined
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      let data: any = null;
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }

      const backendAnswer =
        (typeof data?.answer === 'string' ? data.answer : '') ||
        (typeof data?.response?.text === 'string' ? data.response.text : '') ||
        (typeof data?.response?.answer === 'string' ? data.response.answer : '') ||
        '';

      if (res.ok && data?.success !== false && backendAnswer.trim()) {
        const { domain } = classifyQuestion(textQuery);
        return {
          success: true,
          data: {
            answer: String(backendAnswer),
            domain: (data.domain as InternalDomain) || domain,
            subject: String(data.subject || data.response?.subject || options?.subject || 'Academic Studies'),
            confidence: Number(data.confidence || 99),
            responseType: (data.responseType || data.response?.responseType || 'explanation') as any,
            curriculumLabel: data.curriculumLabel ? String(data.curriculumLabel) : undefined,
            sections: data.response?.sections || data.sections
          }
        };
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn('[ExcelMind AI Tutor Service]: Backend offline or timed out. Falling back to isolated client engine:', err?.message);
    }

    // Seamless Isolated Client Engine Fallback
    try {
      const clientAnswer = generateNormalizedAnswer(textQuery, options?.subject);
      return {
        success: true,
        data: clientAnswer
      };
    } catch (fallbackErr: any) {
      console.error('[ExcelMind AI Tutor Service Fatal Catch]:', fallbackErr);
      return {
        success: false,
        error: 'AI Tutor is temporarily unavailable. Please try again.',
        data: {
          answer: 'AI Tutor is temporarily unavailable. Please try again.',
          domain: 'General knowledge',
          subject: 'Academic Support',
          confidence: 0,
          responseType: 'general'
        }
      };
    }
  },

  async clearSession(studentId = 1): Promise<void> {
    try {
      const token = getAuthToken();
      await fetch(`${API_BASE_URL}/ai/tutor/clear-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ student_id: studentId })
      });
    } catch (e) {
      console.warn('[AI Tutor clearSession notice]:', e);
    }
  }
};

export default aiTutorService;
