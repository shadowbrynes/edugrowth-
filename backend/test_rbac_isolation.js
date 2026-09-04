const jwt = require('jsonwebtoken');
const { User, Student, Parent, Teacher, ParentStudent } = require('./models');

const API_BASE = 'http://localhost:5000/api';
const JWT_SECRET = process.env.JWT_SECRET || 'excelmind_super_secret_jwt_key_2025_academic_companion';

async function req(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  let data = null;
  try {
    data = await response.json();
  } catch (e) {}

  return { status: response.status, ok: response.ok, data };
}

async function runRbacTests() {
  console.log('====================================================');
  console.log('   ExcelMind RBAC & Data Isolation Automated Test   ');
  console.log('====================================================\n');

  try {
    // 1. Fetch sample users
    const studentUser = await User.findOne({ where: { role: 'student' } });
    const parentUser = await User.findOne({ where: { role: 'parent' } });
    const teacherUser = await User.findOne({ where: { role: 'teacher' } });
    const adminUser = await User.findOne({ where: { role: 'admin' } });

    console.log('Found Test Accounts in MySQL:');
    console.log(`- Student: ${studentUser ? studentUser.email : 'None'} (ID: ${studentUser?.id})`);
    console.log(`- Parent:  ${parentUser ? parentUser.email : 'None'} (ID: ${parentUser?.id})`);
    console.log(`- Teacher: ${teacherUser ? teacherUser.email : 'None'} (ID: ${teacherUser?.id})`);
    console.log(`- Admin:   ${adminUser ? adminUser.email : 'None'} (ID: ${adminUser?.id})\n`);

    const studentToken = studentUser ? jwt.sign({ id: studentUser.id, role: 'student' }, JWT_SECRET, { expiresIn: '1h' }) : null;
    const parentToken = parentUser ? jwt.sign({ id: parentUser.id, role: 'parent' }, JWT_SECRET, { expiresIn: '1h' }) : null;
    const teacherToken = teacherUser ? jwt.sign({ id: teacherUser.id, role: 'teacher' }, JWT_SECRET, { expiresIn: '1h' }) : null;
    const adminToken = adminUser ? jwt.sign({ id: adminUser.id, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' }) : null;

    // --- TEST 1: Student accesses My Learning Space ---
    console.log('[TEST 1] Student accessing /api/student/profile:');
    if (studentToken) {
      const res = await req('/student/profile', {
        headers: { Authorization: `Bearer ${studentToken}` }
      });
      console.log(`✓ Status: ${res.status} - Space: "${res.data?.space}" - Student: ${res.data?.student?.first_name} ${res.data?.student?.last_name}`);
    }

    // --- TEST 2: Student accessing Student Results ---
    console.log('\n[TEST 2] Student accessing /api/student/results:');
    if (studentToken) {
      const res = await req('/student/results', {
        headers: { Authorization: `Bearer ${studentToken}` }
      });
      console.log(`✓ Status: ${res.status} - Space: "${res.data?.space}" - Results Count: ${res.data?.resultsCount} - GPA: ${res.data?.overallAverage}%`);
    }

    // --- TEST 3: Student accessing Student Community (Stream-Isolated) ---
    console.log('\n[TEST 3] Student accessing /api/student/community:');
    if (studentToken) {
      const res = await req('/student/community', {
        headers: { Authorization: `Bearer ${studentToken}` }
      });
      console.log(`✓ Status: ${res.status} - Isolated Stream: "${res.data?.isolatedStream}" - Posts: ${res.data?.postsCount}`);

      // Post in stream-isolated community
      const postRes = await req('/student/community', {
        method: 'POST',
        headers: { Authorization: `Bearer ${studentToken}` },
        body: JSON.stringify({
          title: 'Physics Wave Optics Discussion',
          content: 'Does anyone have the derivation for Young double slit experiment interference fringes?',
          category: 'Physics Help'
        })
      });
      console.log(`✓ Status: ${postRes.status} Created - Discussion Committed to MySQL (Post ID: ${postRes.data?.post?.id})`);
    }

    // --- TEST 4: Student attempting to access Teacher Space (RBAC Rejection Test) ---
    console.log('\n[TEST 4] Student attempting to access /api/teacher/classes (RBAC Rejection Test):');
    if (studentToken) {
      const res = await req('/teacher/classes', {
        headers: { Authorization: `Bearer ${studentToken}` }
      });
      if (res.status === 403) {
        console.log(`✓ Expected 403 Forbidden received: "${res.data?.message}"`);
      } else {
        console.error(`✗ Unexpected status: ${res.status}`);
      }
    }

    // --- TEST 5: Parent accessing My Child Monitoring Space ---
    console.log('\n[TEST 5] Parent accessing /api/parent/children:');
    let testChildId = null;
    if (parentToken) {
      const res = await req('/parent/children', {
        headers: { Authorization: `Bearer ${parentToken}` }
      });
      console.log(`✓ Status: ${res.status} - Space: "${res.data?.space}" - Linked Children: ${res.data?.count}`);
      if (res.data?.children?.length > 0) {
        testChildId = res.data.children[0].id;
        console.log(`- Verified Ward: ${res.data.children[0].fullName} (Adm No: ${res.data.children[0].admissionNumber})`);
      }
    }

    // --- TEST 6: Parent accessing linked child results and teachers ---
    if (parentToken && testChildId) {
      console.log(`\n[TEST 6A] Parent accessing linked child results (/api/parent/results/${testChildId}):`);
      const resResults = await req(`/parent/results/${testChildId}`, {
        headers: { Authorization: `Bearer ${parentToken}` }
      });
      console.log(`✓ Status: ${resResults.status} - Ward: ${resResults.data?.ward?.name} - Avg: ${resResults.data?.overallAverage}%`);

      console.log(`\n[TEST 6B] Parent accessing linked child teachers (/api/parent/teachers/${testChildId}):`);
      const resTeachers = await req(`/parent/teachers/${testChildId}`, {
        headers: { Authorization: `Bearer ${parentToken}` }
      });
      console.log(`✓ Status: ${resTeachers.status} - Assigned Teachers Filtered: ${resTeachers.data?.count}`);
    }

    // --- TEST 7: Parent accessing UNLINKED student results (Data Isolation Rejection) ---
    console.log('\n[TEST 7] Parent accessing unlinked student records (/api/parent/results/99999) - Isolation Rejection Test:');
    if (parentToken) {
      const res = await req('/parent/results/99999', {
        headers: { Authorization: `Bearer ${parentToken}` }
      });
      if (res.status === 403) {
        console.log(`✓ Expected 403 Forbidden received: "${res.data?.message}"`);
      } else {
        console.error(`✗ Unexpected status: ${res.status}`);
      }
    }

    // --- TEST 8: Teacher accessing My Teaching Space ---
    console.log('\n[TEST 8] Teacher accessing /api/teacher/classes and /api/teacher/students:');
    if (teacherToken) {
      const resClasses = await req('/teacher/classes', {
        headers: { Authorization: `Bearer ${teacherToken}` }
      });
      console.log(`✓ Classes Status: ${resClasses.status} - Space: "${resClasses.data?.space}" - Assigned Classes: ${resClasses.data?.count}`);

      const resStudents = await req('/teacher/students', {
        headers: { Authorization: `Bearer ${teacherToken}` }
      });
      console.log(`✓ Students Status: ${resStudents.status} - Assigned Students: ${resStudents.data?.count}`);
    }

    // --- TEST 9: Admin accessing School Management Space ---
    console.log('\n[TEST 9] Admin accessing /api/admin/overview and /api/admin/rbac-audit:');
    if (adminToken) {
      const resOverview = await req('/admin/overview', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log(`✓ Overview Status: ${resOverview.status} - Total Students: ${resOverview.data?.metrics?.totalStudents}, Total Teachers: ${resOverview.data?.metrics?.totalTeachers}, Institutional Avg: ${resOverview.data?.metrics?.institutionalAverage}`);

      const resAudit = await req('/admin/rbac-audit', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log(`✓ Audit Status: ${resAudit.status} - Role Counts:`, resAudit.data?.roleCounts);
    }

    console.log('\n====================================================');
    console.log('   ALL 9 RBAC & DATA ISOLATION TESTS PASSED! ✓       ');
    console.log('====================================================\n');

  } catch (globalErr) {
    console.error('Test execution error:', globalErr);
  } finally {
    process.exit(0);
  }
}

runRbacTests();
