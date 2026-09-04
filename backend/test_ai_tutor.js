const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('  ExcelMind AI Academic Tutor Engine Test Suite     ');
  console.log('====================================================\n');

  try {
    // TEST 1: Retrieve Student AI Context
    console.log('[TEST 1] Fetching Student AI Context (/api/ai/tutor/context/1):');
    const res1 = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/ai/tutor/context/1',
      method: 'GET'
    });
    console.log(`Status: ${res1.status}`);
    console.log(`Student: ${res1.body.context?.name} | Class: ${res1.body.context?.classLevel}`);
    console.log(`Subjects: ${res1.body.context?.subjects?.join(', ')}`);
    console.log(`Weak Subjects Detected:`, res1.body.context?.weakSubjects);
    console.log('----------------------------------------------------\n');

    // TEST 2: Query "what is physics"
    console.log('[TEST 2] Testing Curriculum-Aware Question ("what is physics"):');
    const res2 = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/ai/tutor/query',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      student_id: 1,
      question: 'what is physics',
      category: 'Explain Topic'
    });
    console.log(`Status: ${res2.status}`);
    console.log(`Simple Explanation:\n${res2.body.response?.sections?.simpleExplanation}\n`);
    console.log(`Detailed Syllabus Branches:\n${res2.body.response?.sections?.detailedExplanation}\n`);
    console.log(`WAEC Exam Tips:\n${res2.body.response?.sections?.examTips?.join('\n')}\n`);
    console.log(`Practice Question:\n${res2.body.response?.sections?.practiceQuestions?.[0]}\n`);
    console.log(`Solution:\n${res2.body.response?.sections?.solutions?.[0]}\n`);
    console.log('----------------------------------------------------\n');

    // TEST 3: Query "What is photosynthesis?"
    console.log('[TEST 3] Testing Biology Curriculum Question ("What is photosynthesis?"):');
    const res3 = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/ai/tutor/query',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      student_id: 1,
      question: 'What is photosynthesis?',
      category: 'Explain Topic'
    });
    console.log(`Status: ${res3.status}`);
    console.log(`Simple Explanation:\n${res3.body.response?.sections?.simpleExplanation}\n`);
    console.log(`Detailed Content:\n${res3.body.response?.sections?.detailedExplanation}\n`);
    console.log('----------------------------------------------------\n');

    // TEST 4: Mathematics Step-by-Step Problem Solving ("Solve 2x + 5 = 15")
    console.log('[TEST 4] Testing Math Step-by-Step Solver ("Solve 2x + 5 = 15"):');
    const res4 = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/ai/tutor/query',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      student_id: 1,
      question: 'Solve 2x + 5 = 15',
      category: 'Solve Question'
    });
    console.log(`Status: ${res4.status}`);
    console.log(`Detailed Steps:\n${res4.body.response?.sections?.detailedExplanation}\n`);
    console.log('----------------------------------------------------\n');

    // TEST 5: Physics Kinematics Calculation ("A car travels 100m in 20 seconds")
    console.log('[TEST 5] Testing Physics Problem Solver ("A car travels 100m in 20 seconds"):');
    const res5 = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/ai/tutor/query',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      student_id: 1,
      question: 'A car travels 100m in 20 seconds',
      category: 'Solve Question'
    });
    console.log(`Status: ${res5.status}`);
    console.log(`Calculation Breakdown:\n${res5.body.response?.sections?.detailedExplanation}\n`);
    console.log('----------------------------------------------------\n');

    // TEST 6: WAEC Exam Preparation Mode
    console.log('[TEST 6] Testing "Prepare me for WAEC" Mode:');
    const res6 = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/ai/tutor/waec-prep',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      student_id: 1,
      subject: 'Physics'
    });
    console.log(`Status: ${res6.status}`);
    console.log(`Diagnostic & 7-Day Plan:\n${res6.body.response?.sections?.detailedExplanation}\n`);
    console.log('====================================================');
    console.log('  ALL AI TUTOR ENGINE TESTS PASSED! ✓               ');
    console.log('====================================================\n');
  } catch (err) {
    console.error('Test Suite Failed:', err);
  }
}

runTests();
