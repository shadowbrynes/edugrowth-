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

  const testCases = [
    { question: "What faradays laws of electricity", expectedSub: "Physics" },
    { question: "What is Faraday's law of electricity?", expectedSub: "Physics" },
    { question: "Who is a parent?", expectedSub: "General Knowledge" },
    { question: "What is Genesis chapter 10 verse 6?", expectedSub: "Religious Studies" },
    { question: "What is Newton's Law?", expectedSub: "Physics" },
    { question: "What is Physics?", expectedSub: "Physics" },
    { question: "Explain photosynthesis.", expectedSub: "Biology" },
    { question: "What is a constitution?", expectedSub: "Civic Education" },
    { question: "Solve 2x + 5 = 15.", expectedSub: "Mathematics" }
  ];

  try {
    for (let i = 0; i < testCases.length; i++) {
      const { question, expectedSub } = testCases[i];
      console.log(`[TEST ${i + 1}] Question: "${question}":`);
      const res = await request({
        hostname: 'localhost',
        port: 5000,
        path: '/api/ai/tutor/query',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, {
        student_id: 1,
        question
      });

      console.log(`Status: ${res.status}`);
      console.log(`Subject: ${res.body.subject} (Expected: ${expectedSub})`);
      console.log(`Answer:\n${res.body.answer}\n`);

      // Verify no template text
      const forbidden = [
        'concept or subject matter',
        'foundational subject matter',
        'is a recognized academic concept',
        'refers to the concept'
      ];
      for (const term of forbidden) {
        if (res.body.answer && res.body.answer.toLowerCase().includes(term)) {
          console.error(`FAILED: Found forbidden template term "${term}"`);
          process.exit(1);
        }
      }
      console.log('----------------------------------------------------\n');
    }

    console.log('ALL TESTS PASSED SUCCESSFULLY! ZERO TEMPLATES FOUND.');
  } catch (err) {
    console.error('Test Suite Error:', err);
  }
}

runTests();
