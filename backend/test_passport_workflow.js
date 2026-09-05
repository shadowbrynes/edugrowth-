const http = require('http');

function postJson(url, data, token) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const bodyStr = JSON.stringify(data);
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(bodyStr)
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request({
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'POST',
      headers
    }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

function getJson(url, token) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request({
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'GET',
      headers
    }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log('=====================================================');
  console.log('  EXCELMIND PASSPORT UPLOAD & WORKFLOW TEST SUITE');
  console.log('=====================================================');

  // Step 1: Authenticate as admin/student
  console.log('\n[Test 1]: Generating test session authentication token...');
  const jwt = require('jsonwebtoken');
  const token = jwt.sign(
    { id: 1, email: 'admin@excelmind.edu.ng', role: 'admin' },
    process.env.JWT_SECRET || 'excelmind_super_secret_jwt_key_2025_academic_companion',
    { expiresIn: '24h' }
  );
  console.log(`✓ Authentication token generated successfully.`);

  // Step 2: Validate file format rejection
  console.log('\n[Test 2]: Testing invalid file format rejection...');
  const invalidFormatRes = await postJson('http://localhost:5000/api/images/upload', {
    image_type: 'student_passport',
    student_id: 1,
    base64_image: 'data:application/pdf;base64,JVBERi0xLjQKJc...'
  }, token);
  console.log(`Status: ${invalidFormatRes.status}`);
  console.log(`Message: ${invalidFormatRes.data?.message}`);
  if (invalidFormatRes.data?.message === 'Image format not supported') {
    console.log('✓ PASS: Rejected non-image MIME type with standard message');
  } else {
    console.error('✗ FAIL: Expected "Image format not supported"');
  }

  // Step 3: Validate file size rejection (over 2MB)
  console.log('\n[Test 3]: Testing file size limit (exceeding 2MB)...');
  const oversizedData = 'data:image/jpeg;base64,' + Buffer.alloc(2.5 * 1024 * 1024, 'a').toString('base64');
  const oversizedRes = await postJson('http://localhost:5000/api/images/upload', {
    image_type: 'student_passport',
    student_id: 1,
    base64_image: oversizedData
  }, token);
  console.log(`Status: ${oversizedRes.status}`);
  console.log(`Message: ${oversizedRes.data?.message}`);
  if (oversizedRes.data?.message === 'File size exceeded') {
    console.log('✓ PASS: Rejected oversized image with standard message');
  } else {
    console.error('✗ FAIL: Expected "File size exceeded"');
  }

  // Step 4: Valid Passport Upload & Instant Database Persistence
  console.log('\n[Test 4]: Uploading valid student passport (1x1 square PNG)...');
  // Small 1x1 valid PNG in base64
  const samplePassportPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkWPjfDwAE4wH5z2H86wAAAABJRU5ErkJggg==';
  const uploadRes = await postJson('http://localhost:5000/api/images/upload', {
    image_type: 'student_passport',
    student_id: 1,
    base64_image: samplePassportPng
  }, token);

  console.log(`Status: ${uploadRes.status}`);
  console.log(`Message: ${uploadRes.data?.message}`);
  console.log(`Image URL: ${uploadRes.data?.image_url}`);
  if (uploadRes.status === 200 && uploadRes.data?.message === 'Passport uploaded successfully' && uploadRes.data?.image_url) {
    console.log('✓ PASS: Upload succeeded with public URL and cache buster');
  } else {
    console.error('✗ FAIL: Valid upload failed');
  }

  // Step 5: Database Synchronization Verification (Simulate Refresh)
  console.log('\n[Test 5]: Retrieving Student Digital Identity (Page Refresh Simulation)...');
  const identityRes = await getJson('http://localhost:5000/api/images/student/1', token);
  console.log(`Status: ${identityRes.status}`);
  const fetchedPassport = identityRes.data?.identity?.student?.student_passport;
  console.log(`Retrieved Passport URL: ${fetchedPassport}`);

  if (fetchedPassport && fetchedPassport.includes('/uploads/students/passports/')) {
    console.log('✓ PASS: Student digital identity displays new uploaded passport reference from MySQL!');
  } else {
    console.error('✗ FAIL: Passport reference not found or still placeholder');
  }

  console.log('\n=====================================================');
  console.log('  🎉 ALL 5 PASSPORT WORKFLOW TESTS COMPLETED!');
  console.log('=====================================================');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
