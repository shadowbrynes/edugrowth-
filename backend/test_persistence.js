const http = require('http');
const sequelize = require('../backend/config/database');

async function testPersistence() {
  console.log('=====================================================');
  console.log('STEP 11: Testing Full Database Persistence Pipeline');
  console.log('=====================================================');

  // 1. Delete existing EXM001 if any so test is repeatable
  await sequelize.query("DELETE FROM students WHERE admission_number = 'EXM001'");
  await sequelize.query("DELETE FROM users WHERE email = 'john.smith.exm001@excelmind.edu.ng'");

  // 2. Register John Smith (EXM001) via API
  console.log('\n1. Registering John Smith (EXM001) via POST http://localhost:5000/api/students...');
  const payload = JSON.stringify({
    firstName: 'John',
    lastName: 'Smith',
    admissionNo: 'EXM001',
    classLevel: 'SS2 Science',
    department: 'Sciences',
    email: 'john.smith.exm001@excelmind.edu.ng',
    parentName: 'Mr. Robert Smith',
    parentPhone: '+2348011223344'
  });

  const postRes = await new Promise((resolve, reject) => {
    const req = http.request('http://localhost:5000/api/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data) }));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });

  console.log('POST Response Status:', postRes.status);
  console.log('Response JSON:', JSON.stringify(postRes.data, null, 2));

  // 3. Direct SQL Check in MySQL excelmind_academic
  console.log('\n2. Direct MySQL Query: SELECT * FROM students WHERE admission_number = \'EXM001\':');
  const [rows] = await sequelize.query("SELECT id, user_id, first_name, last_name, admission_number, academic_level FROM students WHERE admission_number = 'EXM001'");
  console.table(rows);

  if (rows.length === 0) {
    throw new Error('FAIL: John Smith (EXM001) was not found in MySQL database!');
  }
  console.log('✓ VERIFIED in MySQL Database table "students":', rows[0]);

  // 4. Test Fresh App Reload (GET /api/students)
  console.log('\n3. Simulating Frontend Page Refresh: GET /api/students:');
  const getRes = await new Promise((resolve, reject) => {
    http.get('http://localhost:5000/api/students', res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data) }));
    }).on('error', reject);
  });

  const retrieved = getRes.data.students.find(s => s.admission_number === 'EXM001');
  if (!retrieved) {
    throw new Error('FAIL: John Smith (EXM001) not returned in fresh GET /api/students reload!');
  }

  console.log('✓ VERIFIED on Application Refresh:');
  console.log('   Name:', `${retrieved.first_name} ${retrieved.last_name}`);
  console.log('   Admission Number:', retrieved.admission_number);
  console.log('   Class:', retrieved.academic_level);
  console.log('   Student ID:', retrieved.id);
  console.log('\n=====================================================');
  console.log('SUCCESS: Full Persistence Architecture Verified 100%');
  console.log('=====================================================');
}

testPersistence()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
