/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Service to handle Google Gemini AI integrations for academic insights,
 * progress remark drafts, and administrative intervention plans.
 * Uses direct HTTPS REST calls to the Google Generative Language API for maximum compatibility.
 */

const getApiKey = (): string => {
  // Vite exposes env variables prefixed with VITE_ to the client
  const key = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  if (key && key !== 'MY_GEMINI_API_KEY') {
    return key;
  }
  return '';
};

export const isAiConfigured = (): boolean => {
  return getApiKey() !== '';
};

/**
 * Call the Gemini REST API to generate content.
 * Falls back to local simulated response if the key is not set.
 */
async function callGemini(prompt: string, fallbackResponse: string): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn('Gemini API key is not configured. Returning offline simulated response.');
    // Simulate a brief network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return fallbackResponse;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP error ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!generatedText) {
      throw new Error('Empty response from Gemini API');
    }

    return generatedText.trim();
  } catch (error) {
    console.error('Failed to call Gemini API:', error);
    return `${fallbackResponse}\n\n*(Note: Gemini connection fell back to local simulator due to: ${(error as any).message})*`;
  }
}

/**
 * Generate a personalized progress remark for a student.
 */
export async function generateStudentRemark(
  studentName: string,
  subject: string,
  gpa: number,
  attendance: number,
  tone: 'encouraging' | 'professional' | 'constructive'
): Promise<string> {
  const prompt = `You are a professional teacher writing an official transcript progress remark for a student.
Student Name: ${studentName}
Subject: ${subject}
Current GPA: ${gpa} (out of 4.0)
Attendance: ${attendance}%
Tone style: ${tone}

Please write a concise evaluation remark (2 to 4 sentences, maximum 60 words).
Focus on:
- Acknowledge their current academic standing (GPA: ${gpa}) and class participation (Attendance: ${attendance}%).
- Highlight a key strength or area of focus based on these stats.
- Provide a clear recommendation or forward-looking word of advice.
- Keep the writing highly personalized, professional, and do not use generic placeholders. Do not include subject headers or sign-offs.`;

  // Local simulated fallback
  let fallback = '';
  if (tone === 'encouraging') {
    fallback = `${studentName} shows tremendous potential and enthusiasm in ${subject}. Their current GPA of ${gpa} reflects a strong work ethic, supported by an excellent ${attendance}% attendance record. With continued dedication and active participation, they are well on their way to academic excellence.`;
  } else if (tone === 'constructive') {
    fallback = `While ${studentName} exhibits a good foundational understanding of ${subject}, their current GPA of ${gpa} indicates room for growth. Improving their ${attendance}% attendance will be critical to catching up on complex concepts and lab sessions. I recommend scheduling regular office hours for targeted study.`;
  } else {
    fallback = `${studentName} maintains a satisfactory academic standing in ${subject} with a GPA of ${gpa} and a steady attendance rate of ${attendance}%. They consistently complete assignments on time and participate well in class. Continuing this consistent effort will ensure they meet all term milestones successfully.`;
  }

  return callGemini(prompt, fallback);
}

/**
 * Generate a comprehensive intervention plan for critical student alerts.
 */
export async function generateInterventionPlan(
  studentName: string,
  alertType: string,
  details: string,
  advisor: string
): Promise<string> {
  const prompt = `You are an expert Academic Advisor designing a formal student intervention plan.
Student: ${studentName}
Alert Type: ${alertType.toUpperCase()}
Issue Details: ${details}
Assigned Advisor: ${advisor}

Create a structured academic intervention plan.
Use clear headers (do not use HTML, use standard markdown):
1. Root Cause Analysis (briefly analyze the issue)
2. Corrective Actions (bulleted points for the student)
3. Faculty/Advisor Actions (how the school will support the student)
4. Milestones (clear timeline of improvements needed)

Keep it practical, highly encouraging, and professional. Make it feel personalized to the student's issue. Limit the output to 250 words.`;

  const fallback = `### Academic Intervention Plan: ${studentName}
**Prepared by**: ${advisor}
**Focus Area**: ${alertType === 'attendance' ? 'Attendance Recovery' : 'Grade Intervention'}

#### 1. Root Cause Analysis
The student is experiencing challenges related to *"${details}"*, leading to a critical flag in the academic system. Immediate corrective measures are required to ensure the student remains in good academic standing.

#### 2. Student Action Items
*   **Establish Communication**: Check in with ${advisor} weekly to review progress.
*   **Attendance/Study Commitment**: Attend all future lectures and complete catch-up assignments by the end of each week.
*   **Peer Tutoring**: Join the supervised study group sessions on Tuesday/Thursday afternoons.

#### 3. Faculty & Advisor Support
*   **Weekly Check-ins**: ${advisor} will monitor weekly class files and report cards.
*   **Concept Clarification**: Subject teachers will provide 15 minutes of individual review after sessions if requested.

#### 4. Success Milestones
*   **Week 2**: 100% attendance in core lectures; submit outstanding worksheets.
*   **Week 4**: Achieve passing marks (>75%) in upcoming quizzes.
*   **Week 6**: Complete review of the intervention plan with parents/guardians.`;

  return callGemini(prompt, fallback);
}

/**
 * Generate a polite, formal advising email to a parent/guardian.
 */
export async function generateAdvisingEmail(
  studentName: string,
  alertType: string,
  details: string,
  advisor: string
): Promise<string> {
  const prompt = `You are a school administrator drafting a sensitive, professional academic alert email to a student's parent/guardian.
Student Name: ${studentName}
Issue Category: ${alertType}
Details: ${details}
Sender: ${advisor} (Academic Advisor)

Write a polite, supportive, and formal email to the parent.
The email should:
1. Warmly greet the parent.
2. Politely inform them of the academic flag (type: ${alertType}, details: ${details}).
3. Reassure them that the school is dedicated to their student's success and has prepared a supportive intervention plan.
4. Invite them to schedule a brief meeting or call with ${advisor} to align on next steps.
5. Close professionally.

Do not include subject lines or bracketed placeholders. Keep it under 150 words.`;

  const fallback = `Dear Parent/Guardian,

I am writing to you today from the Academic Advising office regarding ${studentName}'s recent progress. 

We have noticed a critical flag concerning ${studentName}'s ${alertType === 'attendance' ? 'attendance rate' : 'academic performance'}. Specifically: ${details}. 

At our institution, we are deeply committed to ensuring that every student has the tools and support they need to succeed. We have already drafted a personalized academic intervention plan to help ${studentName} get back on track. 

We would appreciate the opportunity to discuss this plan with you briefly so we can work together to support ${studentName}. Please let me know when you might be available for a brief phone call or meeting this week.

Thank you for your partnership in your student's education.

Warm regards,

${advisor}
Academic Advising Department`;

  return callGemini(prompt, fallback);
}

/**
 * AI Academic Assistant: Generate personalized student learning insights & study recommendations.
 */
export async function generatePersonalizedLearningInsights(
  studentName: string,
  gpa: number,
  subjects: { subject: string; grade: string; totalScore: number }[]
): Promise<string> {
  const subjectListText = subjects.map(s => `${s.subject}: ${s.grade} (${s.totalScore}%)`).join(', ');
  const prompt = `You are an AI Academic Learning Coach analyzing a student's term performance.
Student: ${studentName}
Cumulative GPA: ${gpa}
Subject Breakdown: ${subjectListText}

Write 3 bullet points:
1. Core Academic Strength (praise the top performing subject)
2. Primary Growth Opportunity (identify subject needing focus)
3. Actionable Study Strategy (specific study habit recommendation)

Keep output friendly, highly encouraging, and under 120 words. Do not use generic placeholders.`;

  const fallback = `• **Core Strength**: ${studentName} exhibits exceptional analytical mastery in Mathematics and Science, maintaining top-tier grades.\n• **Growth Focus**: Focus additional study time on writing and essay revisions to balance overall term performance.\n• **Recommended Strategy**: Implement 25-minute pomodoro study blocks for literature reviews prior to weekly quizzes.`;

  return callGemini(prompt, fallback);
}

/**
 * AI Financial Assistant: Summarize institutional fee collections & revenue metrics.
 */
export async function generateFinancialReportSummary(
  totalBilled: number,
  totalCollected: number,
  overdueAmount: number
): Promise<string> {
  const collectionRate = Math.round((totalCollected / (totalBilled || 1)) * 100);
  const prompt = `You are a Chief Financial Officer summarizing school fee collections.
Total Fees Billed: ₦${totalBilled.toLocaleString()}
Total Fees Collected: ₦${totalCollected.toLocaleString()}
Overdue Balance: ₦${overdueAmount.toLocaleString()}
Current Collection Rate: ${collectionRate}%

Write a brief 2-sentence executive financial summary and cashflow recommendation.`;

  const fallback = `School fee collection rate currently stands at **${collectionRate}%** (₦${totalCollected.toLocaleString()} collected out of ₦${totalBilled.toLocaleString()} billed). We recommend sending automated WhatsApp payment reminders for overdue balances totaling ₦${overdueAmount.toLocaleString()}.`;

  return callGemini(prompt, fallback);
}

/**
 * Generic Gemini content generator for curriculum plans and academic questions.
 */
export async function generateGeminiResponse(
  prompt: string,
  fallbackResponse: string = ''
): Promise<string> {
  return callGemini(prompt, fallbackResponse);
}

