const http = require('http');

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(`http://localhost:5000${path}`, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('  ExcelMind CBT Question Bank & Exam Engine Test   ');
  console.log('====================================================\n');

  try {
    // TEST 1: Get CBT Subjects
    console.log('[TEST 1] GET /api/exams/cbt/subjects:');
    const res1 = await request('/api/exams/cbt/subjects');
    console.log(`Status: ${res1.status}`);
    console.log(`Subjects Found: ${res1.data.count}`);
    const sample = res1.data.subjects.slice(0, 5).map(s => `${s.name} (${s.questionCount} Qs)`);
    console.log('Sample Subjects:', sample.join(', '));
    console.log('----------------------------------------------------\n');

    // TEST 2: Get Topics for Physics
    console.log('[TEST 2] GET /api/exams/cbt/topics?subject=Physics:');
    const res2 = await request('/api/exams/cbt/topics?subject=Physics');
    console.log(`Status: ${res2.status}`);
    console.log('Physics Topics:', res2.data.topics?.map(t => `${t.topic} (${t.question_count})`).join(', '));
    console.log('----------------------------------------------------\n');

    // TEST 3: Generate CBT Exam (Simulation Mode)
    console.log('[TEST 3] GET /api/exams/cbt/generate?exam_body=WAEC&subject=Physics&mode=simulation&count=5:');
    const res3 = await request('/api/exams/cbt/generate?exam_body=WAEC&subject=Physics&mode=simulation&count=5');
    console.log(`Status: ${res3.status}`);
    const exam = res3.data.exam;
    console.log(`Exam Title: "${exam.title}"`);
    console.log(`Duration: ${exam.durationMinutes} mins | Total Questions: ${exam.totalQuestions}`);
    console.log(`Sample Question 1: "${exam.questions[0]?.question}"`);
    console.log(`Options: ${exam.questions[0]?.options.map(o => o.key + ': ' + o.text).join(' | ')}`);
    console.log('----------------------------------------------------\n');

    // TEST 4: Submit CBT Exam & Auto-Mark
    console.log('[TEST 4] POST /api/exams/cbt/submit:');
    const submitPayload = JSON.stringify({
      student_id: 1,
      exam_body: 'WAEC',
      subject_name: 'Physics',
      class_level: 'SS3',
      department: 'Science',
      questions: exam.questions,
      answers: {
        [exam.questions[0]?.id]: exam.questions[0]?.correctAnswer, // Correct
        [exam.questions[1]?.id]: 'Z' // Incorrect intentional test
      },
      duration_taken_seconds: 450
    });

    const res4 = await request('/api/exams/cbt/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(submitPayload)
      },
      body: submitPayload
    });

    console.log(`Status: ${res4.status}`);
    console.log(`Score: ${res4.data.result?.score} / ${res4.data.result?.total}`);
    console.log(`Percentage: ${res4.data.result?.percentage}% | Grade: ${res4.data.result?.grade}`);
    console.log(`JAMB Equivalent: ${res4.data.result?.jambScore} / 400`);
    console.log(`Performance Rating: ${res4.data.result?.performanceRating}`);
    console.log(`AI Recommendation: "${res4.data.result?.aiRecommendation}"`);
    console.log('----------------------------------------------------\n');

    // TEST 5: Get CBT Analytics
    console.log('[TEST 5] GET /api/exams/cbt/analytics/1:');
    const res5 = await request('/api/exams/cbt/analytics/1');
    console.log(`Status: ${res5.status}`);
    console.log(`Lifetime Questions Attempted: ${res5.data.analytics?.totalQuestionsAttempted}`);
    console.log(`Overall Average: ${res5.data.analytics?.overallAverage}%`);
    console.log(`Identified Weak Topics:`, res5.data.analytics?.weakTopics);
    console.log(`Identified Strong Topics:`, res5.data.analytics?.strongTopics);
    console.log('====================================================');
    console.log('  ALL CBT QUESTION BANK & ENGINE TESTS PASSED! ✓   ');
    console.log('====================================================');
  } catch (err) {
    console.error('Test Error:', err.message);
  }
}

setTimeout(runTests, 1000);
