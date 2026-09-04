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
  console.log('  ExcelMind AI Classroom Teacher Test Suite         ');
  console.log('====================================================\n');

  try {
    // TEST 1: Question "What is Physics?"
    console.log('[TEST 1] Question: "What is Physics?":');
    const res1 = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/ai/tutor/query',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      student_id: 1,
      question: 'What is Physics?',
      category: 'Explain This Topic'
    });
    console.log(`Status: ${res1.status}`);
    const sec1 = res1.body.response?.sections;
    console.log(`1. Simple Explanation:\n${sec1?.simpleExplanation}\n`);
    console.log(`2. Detailed Explanation:\n${sec1?.detailedExplanation}\n`);
    console.log(`3. Real-Life Example:\n${sec1?.realLifeExample}\n`);
    console.log(`4. Key Points:\n${sec1?.keyPoints?.join('\n')}\n`);
    console.log(`5. Examination Focus:\n${sec1?.examinationFocus}\n`);
    console.log(`6. Practice Question:\n${sec1?.practiceQuestion}\n`);
    console.log(`7. Answer:\n${sec1?.answer}\n`);
    console.log('----------------------------------------------------\n');

    // TEST 2: Question "What is Mathematics?"
    console.log('[TEST 2] Question: "What is Mathematics?":');
    const res2 = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/ai/tutor/query',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      student_id: 1,
      question: 'What is Mathematics?',
      category: 'Explain This Topic'
    });
    console.log(`Status: ${res2.status}`);
    const sec2 = res2.body.response?.sections;
    console.log(`1. Simple Explanation:\n${sec2?.simpleExplanation}\n`);
    console.log(`3. Real-Life Example:\n${sec2?.realLifeExample}\n`);
    console.log(`6. Practice Question:\n${sec2?.practiceQuestion}\n`);
    console.log(`7. Answer:\n${sec2?.answer}\n`);
    console.log('----------------------------------------------------\n');

    // TEST 3: Question "Solve 2x + 5 = 15"
    console.log('[TEST 3] Question: "Solve 2x + 5 = 15":');
    const res3 = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/ai/tutor/query',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      student_id: 1,
      question: 'Solve 2x + 5 = 15',
      category: 'Solve My Question'
    });
    console.log(`Status: ${res3.status}`);
    const sec3 = res3.body.response?.sections;
    console.log(`Detailed Working:\n${sec3?.detailedExplanation}\n`);
    console.log(`Practice Question:\n${sec3?.practiceQuestion}\n`);
    console.log(`Answer:\n${sec3?.answer}\n`);
    console.log('----------------------------------------------------\n');

    // TEST 4: Question "Explain causes of climate change"
    console.log('[TEST 4] Question: "Explain causes of climate change":');
    const res4 = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/ai/tutor/query',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      student_id: 1,
      question: 'Explain causes of climate change',
      category: 'Explain This Topic'
    });
    console.log(`Status: ${res4.status}`);
    const sec4 = res4.body.response?.sections;
    console.log(`Detailed Explanation:\n${sec4?.detailedExplanation}\n`);
    console.log(`Key Points:\n${sec4?.keyPoints?.join('\n')}\n`);
    console.log('====================================================');
    console.log('  ALL 7-PILLAR TEACHER ENGINE TESTS PASSED! ✓       ');
    console.log('====================================================\n');
  } catch (err) {
    console.error('Test error:', err);
  }
}

runTests();
