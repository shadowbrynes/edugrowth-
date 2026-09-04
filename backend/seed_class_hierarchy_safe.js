const { sequelize, Class, Student, Teacher, StudentEnvironment, School, CommunityPost, CommunityComment } = require('./models');

async function seedHierarchySafe() {
  console.log('==============================================================');
  console.log('  Seeding Nigerian Secondary School Hierarchy & Environments  ');
  console.log('==============================================================\n');

  try {
    await sequelize.authenticate();
    console.log('✓ MySQL Connected successfully.\n');

    const queryInterface = sequelize.getQueryInterface();

    // 1. Ensure columns exist on classes safely
    const classTableDesc = await queryInterface.describeTable('classes');
    if (!classTableDesc.education_level) {
      await queryInterface.addColumn('classes', 'education_level', {
        type: sequelize.Sequelize.STRING(50),
        allowNull: true,
        defaultValue: 'Senior Secondary'
      });
      console.log('✓ Added education_level to classes table.');
    }
    if (!classTableDesc.department) {
      await queryInterface.addColumn('classes', 'department', {
        type: sequelize.Sequelize.STRING(50),
        allowNull: true,
        defaultValue: 'Science'
      });
      console.log('✓ Added department to classes table.');
    }
    if (!classTableDesc.academic_session) {
      await queryInterface.addColumn('classes', 'academic_session', {
        type: sequelize.Sequelize.STRING(50),
        defaultValue: '2026/2027'
      });
      console.log('✓ Added academic_session to classes table.');
    }
    if (!classTableDesc.created_at) {
      await queryInterface.addColumn('classes', 'created_at', {
        type: sequelize.Sequelize.DATE,
        defaultValue: sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
      });
      console.log('✓ Added created_at to classes table.');
    }

    // 2. Safely sync new tables only
    await StudentEnvironment.sync();
    console.log('✓ student_environment table verified/created.');
    await CommunityPost.sync();
    console.log('✓ community_posts table verified/created.');
    await CommunityComment.sync();
    console.log('✓ community_comments table verified/created.\n');

    // Ensure school exists
    let [school] = await School.findOrCreate({
      where: { id: 1 },
      defaults: {
        school_name: 'ExcelMind Academy',
        address: 'Victoria Island, Lagos, Nigeria',
        email: 'admin@excelmind.edu.ng',
        phone: '+2348003923564'
      }
    });

    // 3. Nigerian Secondary School Class Hierarchy Definitions
    const classDefinitions = [
      // Junior Secondary School
      { class_name: 'JSS 1', level: 'JSS1', education_level: 'Junior Secondary', department: 'General', academic_session: '2026/2027' },
      { class_name: 'JSS 2', level: 'JSS2', education_level: 'Junior Secondary', department: 'General', academic_session: '2026/2027' },
      { class_name: 'JSS 3', level: 'JSS3', education_level: 'Junior Secondary', department: 'General', academic_session: '2026/2027' },

      // Senior Secondary School - SS1
      { class_name: 'SS 1 Science', level: 'SS1', education_level: 'Senior Secondary', department: 'Science', academic_session: '2026/2027' },
      { class_name: 'SS 1 Arts', level: 'SS1', education_level: 'Senior Secondary', department: 'Arts', academic_session: '2026/2027' },
      { class_name: 'SS 1 Commercial', level: 'SS1', education_level: 'Senior Secondary', department: 'Commercial', academic_session: '2026/2027' },

      // Senior Secondary School - SS2
      { class_name: 'SS 2 Science', level: 'SS2', education_level: 'Senior Secondary', department: 'Science', academic_session: '2026/2027' },
      { class_name: 'SS 2 Arts', level: 'SS2', education_level: 'Senior Secondary', department: 'Arts', academic_session: '2026/2027' },
      { class_name: 'SS 2 Commercial', level: 'SS2', education_level: 'Senior Secondary', department: 'Commercial', academic_session: '2026/2027' },

      // Senior Secondary School - SS3
      { class_name: 'SS 3 Science', level: 'SS3', education_level: 'Senior Secondary', department: 'Science', academic_session: '2026/2027' },
      { class_name: 'SS 3 Arts', level: 'SS3', education_level: 'Senior Secondary', department: 'Arts', academic_session: '2026/2027' },
      { class_name: 'SS 3 Commercial', level: 'SS3', education_level: 'Senior Secondary', department: 'Commercial', academic_session: '2026/2027' }
    ];

    console.log('Populating Nigerian Secondary School Classes:');
    const createdClasses = [];
    for (const def of classDefinitions) {
      let [cls] = await Class.findOrCreate({
        where: { class_name: def.class_name },
        defaults: {
          school_id: 1,
          ...def
        }
      });

      cls.education_level = def.education_level;
      cls.department = def.department;
      cls.level = def.level;
      cls.academic_session = def.academic_session;
      await cls.save();

      createdClasses.push(cls);
      console.log(`  ✓ ${cls.class_name} (${cls.education_level} • ${cls.department}) [ID: ${cls.id}]`);
    }

    // 4. Assign Teacher (Dr. Kenneth Okon) to SS 2 Science
    const teacher = await Teacher.findOne({ where: { id: 1 } }) || await Teacher.findOne();
    const ss2Science = await Class.findOne({ where: { class_name: 'SS 2 Science' } });

    if (teacher && ss2Science) {
      ss2Science.class_teacher_id = teacher.id;
      await ss2Science.save();
      console.log(`\n✓ Assigned Teacher ${teacher.first_name} ${teacher.last_name} as Form Master to ${ss2Science.class_name}`);
    }

    // 5. Create / Update Student Academic Environments
    console.log('\nCreating Private Student Academic Environments:');
    const students = await Student.findAll();
    for (const student of students) {
      const isJohn = student.first_name === 'John' || student.id === 1;
      const targetClass = isJohn ? (ss2Science || createdClasses[6]) : createdClasses[1]; // e.g. JSS 2 for other students

      student.class_id = targetClass.id;
      student.academic_level = targetClass.class_name;
      await student.save();

      const [env, envCreated] = await StudentEnvironment.findOrCreate({
        where: { student_id: student.id },
        defaults: {
          school_id: 1,
          class_id: targetClass.id,
          department_id: targetClass.department_id || 1,
          academic_session: '2026/2027 Session',
          learning_group: targetClass.department === 'Science' ? 'Physics Learning Group' : `${targetClass.department} Study Group`,
          created_at: new Date()
        }
      });

      if (!envCreated) {
        env.class_id = targetClass.id;
        env.academic_session = '2026/2027 Session';
        env.learning_group = targetClass.department === 'Science' ? 'Physics Learning Group' : `${targetClass.department} Study Group`;
        await env.save();
      }

      console.log(`  ✓ Student: ${student.first_name} ${student.last_name} [ID: ${student.id}]`);
      console.log(`    Environment: ExcelMind Academy • ${targetClass.class_name} • 2026/2027 Session • ${env.learning_group}`);
    }

    console.log('\n==============================================================');
    console.log('  Nigerian Secondary School Hierarchy & Environments Complete! ✓ ');
    console.log('==============================================================\n');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    process.exit(0);
  }
}

seedHierarchySafe();
