const { sequelize, Subject, QuestionBank } = require('./models');

async function seedCbtQuestionBank() {
  try {
    console.log('[ExcelMind CBT Seed]: Connecting to MySQL...');
    await sequelize.authenticate();
    console.log('[ExcelMind CBT Seed]: Connected. Synchronizing models...');

    await sequelize.sync({ alter: false });

    const { Department } = require('./models');

    // Ensure departments 1 to 4 exist
    const departments = [
      { id: 1, department_name: 'Science', description: 'Senior Secondary Science' },
      { id: 2, department_name: 'Commercial', description: 'Senior Secondary Commercial' },
      { id: 3, department_name: 'Arts', description: 'Senior Secondary Arts & Humanities' },
      { id: 4, department_name: 'Junior Secondary', description: 'Junior Secondary School JSS1-JSS3' }
    ];

    for (const d of departments) {
      const existingDept = await Department.findByPk(d.id);
      if (!existingDept) {
        await Department.create(d);
      }
    }

    // 1. Nigerian Secondary School Subjects
    const allSubjects = [
      // Core & Science (Dept 1)
      { subject_name: 'English Language', subject_code: 'ENG 101', status: 'active', department_id: 1 },
      { subject_name: 'Mathematics', subject_code: 'MTH 101', status: 'active', department_id: 1 },
      { subject_name: 'Physics', subject_code: 'PHY 301', status: 'active', department_id: 1 },
      { subject_name: 'Chemistry', subject_code: 'CHM 301', status: 'active', department_id: 1 },
      { subject_name: 'Biology', subject_code: 'BIO 301', status: 'active', department_id: 1 },
      { subject_name: 'Further Mathematics', subject_code: 'FMTH 301', status: 'active', department_id: 1 },
      { subject_name: 'Agricultural Science', subject_code: 'AGR 201', status: 'active', department_id: 1 },
      { subject_name: 'Computer Science', subject_code: 'CSC 201', status: 'active', department_id: 1 },
      { subject_name: 'Data Processing', subject_code: 'DPR 201', status: 'active', department_id: 1 },
      { subject_name: 'Technical Drawing', subject_code: 'TD 301', status: 'active', department_id: 1 },
      { subject_name: 'Geography', subject_code: 'GEO 201', status: 'active', department_id: 1 },

      // Commercial Department (Dept 2)
      { subject_name: 'Economics', subject_code: 'ECO 301', status: 'active', department_id: 2 },
      { subject_name: 'Financial Accounting', subject_code: 'ACC 301', status: 'active', department_id: 2 },
      { subject_name: 'Commerce', subject_code: 'COM 301', status: 'active', department_id: 2 },
      { subject_name: 'Marketing', subject_code: 'MKT 201', status: 'active', department_id: 2 },
      { subject_name: 'Business Studies', subject_code: 'BST 101', status: 'active', department_id: 2 },

      // Arts Department (Dept 3)
      { subject_name: 'Literature in English', subject_code: 'LIT 301', status: 'active', department_id: 3 },
      { subject_name: 'Government', subject_code: 'GOV 301', status: 'active', department_id: 3 },
      { subject_name: 'History', subject_code: 'HIS 201', status: 'active', department_id: 3 },
      { subject_name: 'Christian Religious Studies', subject_code: 'CRS 201', status: 'active', department_id: 3 },
      { subject_name: 'Islamic Religious Studies', subject_code: 'IRS 201', status: 'active', department_id: 3 },
      { subject_name: 'Civic Education', subject_code: 'CIV 201', status: 'active', department_id: 3 },
      { subject_name: 'French Language', subject_code: 'FRE 201', status: 'active', department_id: 3 },
      { subject_name: 'Fine Arts', subject_code: 'ART 201', status: 'active', department_id: 3 },
      { subject_name: 'Music', subject_code: 'MUS 201', status: 'active', department_id: 3 },

      // Junior Secondary Core (Dept 4)
      { subject_name: 'Basic Science', subject_code: 'BSC 101', status: 'active', department_id: 4 },
      { subject_name: 'Basic Technology', subject_code: 'BTECH 101', status: 'active', department_id: 4 },
      { subject_name: 'Social Studies', subject_code: 'SOS 101', status: 'active', department_id: 4 },
      { subject_name: 'Physical & Health Education', subject_code: 'PHE 101', status: 'active', department_id: 4 },
      { subject_name: 'Cultural & Creative Arts', subject_code: 'CCA 101', status: 'active', department_id: 4 }
    ];

    for (const sub of allSubjects) {
      const existing = await Subject.findOne({ where: { subject_name: sub.subject_name } });
      if (!existing) {
        await Subject.create(sub);
      }
    }
    console.log('[ExcelMind CBT Seed]: ✓ Nigerian Secondary School Subjects seeded/verified.');

    // 2. Comprehensive CBT Question Bank
    const questions = [
      // ==========================================
      // PHYSICS (WAEC / NECO / JAMB)
      // ==========================================
      {
        exam_body: 'WAEC',
        subject_name: 'Physics',
        class_level: 'SS3',
        department: 'Science',
        topic: 'Mechanics & Kinematics',
        sub_topic: 'Linear Motion & Velocity',
        year: 2024,
        difficulty_level: 'Medium',
        question_text: 'A vehicle moves with a uniform acceleration from rest to attain a velocity of 20 m/s in 8 seconds. Determine the total distance covered by the vehicle during this period.',
        option_a: '80 m',
        option_b: '160 m',
        option_c: '40 m',
        option_d: '120 m',
        correct_answer: 'A',
        explanation: 'Distance s = ((u + v) / 2) * t. Since it starts from rest, u = 0 m/s, v = 20 m/s, t = 8 s. Therefore, s = ((0 + 20) / 2) * 8 = 10 * 8 = 80 m.'
      },
      {
        exam_body: 'JAMB',
        subject_name: 'Physics',
        class_level: 'SS3',
        department: 'Science',
        topic: 'Mechanics & Kinematics',
        sub_topic: 'Linear Momentum & Collisions',
        year: 2023,
        difficulty_level: 'Hard',
        question_text: 'A bullet of mass 0.05 kg is fired horizontally with a velocity of 200 m/s into a stationary wooden block of mass 0.95 kg. If the bullet becomes embedded in the block, calculate the common velocity of the combination.',
        option_a: '20 m/s',
        option_b: '10 m/s',
        option_c: '5 m/s',
        option_d: '15 m/s',
        correct_answer: 'B',
        explanation: 'By the law of conservation of linear momentum: m1*u1 + m2*u2 = (m1 + m2)*v. Here, (0.05 * 200) + 0 = (0.05 + 0.95)*v => 10 = 1.0 * v => v = 10 m/s.'
      },
      {
        exam_body: 'WAEC',
        subject_name: 'Physics',
        class_level: 'SS3',
        department: 'Science',
        topic: 'Current Electricity',
        sub_topic: 'Ohm\'s Law & Resistance',
        year: 2022,
        difficulty_level: 'Medium',
        question_text: 'Three resistors of resistances 2 Ω, 3 Ω, and 6 Ω are connected in parallel across a 12V battery of negligible internal resistance. Calculate the total current drawn from the battery.',
        option_a: '6 A',
        option_b: '12 A',
        option_c: '1 A',
        option_d: '4 A',
        correct_answer: 'B',
        explanation: 'Equivalent resistance in parallel: 1/R = 1/2 + 1/3 + 1/6 = (3 + 2 + 1)/6 = 6/6 = 1 => R = 1 Ω. Current I = V / R = 12V / 1 Ω = 12 A.'
      },
      {
        exam_body: 'NECO',
        subject_name: 'Physics',
        class_level: 'SS2',
        department: 'Science',
        topic: 'Waves & Optics',
        sub_topic: 'Refraction & Snell\'s Law',
        year: 2023,
        difficulty_level: 'Medium',
        question_text: 'A ray of light travels from air into glass of refractive index 1.5. If the angle of incidence in air is 30°, what is the sine of the angle of refraction?',
        option_a: '0.333',
        option_b: '0.750',
        option_c: '0.500',
        option_d: '0.250',
        correct_answer: 'A',
        explanation: 'According to Snell\'s Law: n = sin(i) / sin(r). Thus 1.5 = sin(30°) / sin(r) => sin(r) = 0.5 / 1.5 = 1/3 ≈ 0.333.'
      },
      {
        exam_body: 'JAMB',
        subject_name: 'Physics',
        class_level: 'SS3',
        department: 'Science',
        topic: 'Electromagnetic Induction',
        sub_topic: 'Transformers & Faraday\'s Law',
        year: 2024,
        difficulty_level: 'Hard',
        question_text: 'An ideal step-down transformer has a primary coil of 1000 turns and a secondary coil of 200 turns. If the primary voltage is 240 V, calculate the secondary voltage.',
        option_a: '48 V',
        option_b: '120 V',
        option_c: '24 V',
        option_d: '60 V',
        correct_answer: 'A',
        explanation: 'Transformer ratio: Vs / Vp = Ns / Np. Hence Vs = Vp * (Ns / Np) = 240 * (200 / 1000) = 240 * 0.2 = 48 V.'
      },

      // ==========================================
      // MATHEMATICS (WAEC / NECO / JAMB)
      // ==========================================
      {
        exam_body: 'WAEC',
        subject_name: 'Mathematics',
        class_level: 'SS3',
        department: 'Science',
        topic: 'Algebra & Equations',
        sub_topic: 'Quadratic Equations',
        year: 2024,
        difficulty_level: 'Easy',
        question_text: 'Solve for x in the quadratic equation: 2x² - 7x + 3 = 0.',
        option_a: 'x = 3 or x = 1/2',
        option_b: 'x = -3 or x = -1/2',
        option_c: 'x = 2 or x = 3',
        option_d: 'x = 1 or x = 6',
        correct_answer: 'A',
        explanation: 'Factorising 2x² - 6x - x + 3 = 0 gives 2x(x - 3) - 1(x - 3) = (2x - 1)(x - 3) = 0. Therefore, x = 1/2 or x = 3.'
      },
      {
        exam_body: 'JAMB',
        subject_name: 'Mathematics',
        class_level: 'SS3',
        department: 'General',
        topic: 'Calculus',
        sub_topic: 'Differentiation',
        year: 2023,
        difficulty_level: 'Medium',
        question_text: 'Find the derivative of y = 3x⁴ - 5x² + 2x - 7 with respect to x at x = 1.',
        option_a: '4',
        option_b: '12',
        option_c: '14',
        option_d: '-7',
        correct_answer: 'A',
        explanation: 'dy/dx = d/dx(3x⁴ - 5x² + 2x - 7) = 12x³ - 10x + 2. Substituting x = 1 yields 12(1)³ - 10(1) + 2 = 12 - 10 + 2 = 4.'
      },
      {
        exam_body: 'WAEC',
        subject_name: 'Mathematics',
        class_level: 'SS2',
        department: 'General',
        topic: 'Trigonometry',
        sub_topic: 'Angles of Elevation & Depression',
        year: 2022,
        difficulty_level: 'Medium',
        question_text: 'From the top of a cliff 60 m high, the angle of depression of a boat on the sea is 30°. Find the horizontal distance of the boat from the foot of the cliff.',
        option_a: '60√3 m',
        option_b: '30√3 m',
        option_c: '120 m',
        option_d: '20√3 m',
        correct_answer: 'A',
        explanation: 'Let distance be d. The angle of depression equals the angle of elevation from the boat, so tan(30°) = 60 / d => d = 60 / tan(30°) = 60 / (1/√3) = 60√3 m (approx 103.92 m).'
      },
      {
        exam_body: 'NECO',
        subject_name: 'Mathematics',
        class_level: 'SS3',
        department: 'General',
        topic: 'Statistics & Probability',
        sub_topic: 'Probability of Independent Events',
        year: 2024,
        difficulty_level: 'Easy',
        question_text: 'A bag contains 5 red balls, 4 blue balls, and 3 green balls. If one ball is drawn at random, what is the probability that it is NOT blue?',
        option_a: '2/3',
        option_b: '1/3',
        option_c: '5/12',
        option_d: '1/4',
        correct_answer: 'A',
        explanation: 'Total balls = 5 + 4 + 3 = 12. Non-blue balls = 5 red + 3 green = 8. P(not blue) = 8 / 12 = 2/3.'
      },

      // ==========================================
      // CHEMISTRY (WAEC / NECO / JAMB)
      // ==========================================
      {
        exam_body: 'WAEC',
        subject_name: 'Chemistry',
        class_level: 'SS3',
        department: 'Science',
        topic: 'Organic Chemistry',
        sub_topic: 'Hydrocarbons & Isomerism',
        year: 2024,
        difficulty_level: 'Medium',
        question_text: 'Which of the following organic compounds will decolorize bromine water in tetrachloromethane?',
        option_a: 'Ethane',
        option_b: 'Ethene',
        option_c: 'Benzene',
        option_d: 'Ethanol',
        correct_answer: 'B',
        explanation: 'Ethene (C2H4) is an unsaturated alkene with a carbon-carbon double bond. It undergoes rapid addition reaction with bromine water, turning the reddish-brown liquid colorless.'
      },
      {
        exam_body: 'JAMB',
        subject_name: 'Chemistry',
        class_level: 'SS3',
        department: 'Science',
        topic: 'Chemical Equilibrium & Energetics',
        sub_topic: 'Le Chatelier\'s Principle',
        year: 2023,
        difficulty_level: 'Hard',
        question_text: 'For the exothermic reaction: N₂(g) + 3H₂(g) ⇌ 2NH₃(g) (ΔH = -92 kJ/mol), what condition will favor maximum yield of ammonia?',
        option_a: 'High temperature and low pressure',
        option_b: 'Low temperature and high pressure',
        option_c: 'High temperature and high pressure',
        option_d: 'Low temperature and low pressure',
        correct_answer: 'B',
        explanation: 'By Le Chatelier\'s principle: (1) As the forward reaction is exothermic, decreasing temperature shifts the equilibrium to the right. (2) Since 4 moles of gas produce 2 moles of gas, increasing pressure shifts equilibrium towards fewer gas moles (ammonia).'
      },
      {
        exam_body: 'WAEC',
        subject_name: 'Chemistry',
        class_level: 'SS2',
        department: 'Science',
        topic: 'Acids, Bases & Salts',
        sub_topic: 'pH and Neutralization',
        year: 2022,
        difficulty_level: 'Medium',
        question_text: 'Calculate the pH of a 0.005 mol/dm³ solution of tetraoxosulphate(VI) acid (H₂SO₄), assuming complete ionization.',
        option_a: '2.0',
        option_b: '3.0',
        option_c: '1.0',
        option_d: '2.3',
        correct_answer: 'A',
        explanation: 'H₂SO₄ is a diprotic acid: H₂SO₄ → 2H⁺ + SO₄²⁻. Thus [H⁺] = 2 * 0.005 = 0.01 mol/dm³ = 10⁻² mol/dm³. pH = -log[H⁺] = -log(10⁻²) = 2.0.'
      },

      // ==========================================
      // BIOLOGY (WAEC / NECO / JAMB)
      // ==========================================
      {
        exam_body: 'WAEC',
        subject_name: 'Biology',
        class_level: 'SS3',
        department: 'Science',
        topic: 'Genetics & Heredity',
        sub_topic: 'Mendelian Monohybrid Cross',
        year: 2024,
        difficulty_level: 'Medium',
        question_text: 'In garden peas, tallness (T) is dominant over dwarfness (t). What is the expected phenotypic ratio in the offspring when a heterozygous tall pea plant is crossed with a dwarf pea plant?',
        option_a: '3 Tall : 1 Dwarf',
        option_b: '1 Tall : 1 Dwarf',
        option_c: 'All Tall',
        option_d: '1 Tall : 2 Intermediate : 1 Dwarf',
        correct_answer: 'B',
        explanation: 'Cross: Tt (heterozygous tall) × tt (dwarf homozygous). Gametes: T, t from parent 1, and t from parent 2. Offspring: Tt, tt, Tt, tt. Phenotypic ratio is 2 Tall : 2 Dwarf, which simplifies to 1 Tall : 1 Dwarf (50% : 50%).'
      },
      {
        exam_body: 'JAMB',
        subject_name: 'Biology',
        class_level: 'SS3',
        department: 'Science',
        topic: 'Plant Nutrition',
        sub_topic: 'Photosynthesis & Photolysis',
        year: 2023,
        difficulty_level: 'Medium',
        question_text: 'During the light-dependent stage of photosynthesis, radiant energy absorbed by chlorophyll is directly used to:',
        option_a: 'Fix atmospheric carbon dioxide into glucose',
        option_b: 'Split water molecules into hydrogen ions, electrons, and oxygen',
        option_c: 'Synthesize starch from fructose in the stroma',
        option_d: 'Absorb mineral salts through the root hairs',
        correct_answer: 'B',
        explanation: 'Photolysis is the photochemical cleavage of water molecules (2H₂O → 4H⁺ + 4e⁻ + O₂) occurring in the thylakoid membrane (grana) of the chloroplast during the light reaction.'
      },

      // ==========================================
      // ENGLISH LANGUAGE (WAEC / NECO / JAMB)
      // ==========================================
      {
        exam_body: 'WAEC',
        subject_name: 'English Language',
        class_level: 'SS3',
        department: 'General',
        topic: 'Lexis & Structure',
        sub_topic: 'Concord & Subject-Verb Agreement',
        year: 2024,
        difficulty_level: 'Medium',
        question_text: 'The Principal, as well as the teachers, ________ present at the inter-house sports festival yesterday.',
        option_a: 'were',
        option_b: 'was',
        option_c: 'are',
        option_d: 'have been',
        correct_answer: 'B',
        explanation: 'When subjects are connected by parenthetical expressions like "as well as", "together with", or "in addition to", the verb agrees strictly with the primary subject ("The Principal", which is singular). Hence, "was" is grammatically correct.'
      },
      {
        exam_body: 'JAMB',
        subject_name: 'English Language',
        class_level: 'SS3',
        department: 'General',
        topic: 'Oral English',
        sub_topic: 'Vowel Sounds & Diphthongs',
        year: 2023,
        difficulty_level: 'Hard',
        question_text: 'Choose the word that has the same vowel sound as the one represented by the underlined letter(s): "b<u>oa</u>t".',
        option_a: 'bought',
        option_b: 'coat',
        option_c: 'court',
        option_d: 'cot',
        correct_answer: 'B',
        explanation: '"Boat" contains the diphthong /əʊ/ (or /oʊ/). "Coat" shares the identical diphthong sound /kəʊt/.'
      },

      // ==========================================
      // ECONOMICS (COMMERCIAL & ARTS)
      // ==========================================
      {
        exam_body: 'WAEC',
        subject_name: 'Economics',
        class_level: 'SS3',
        department: 'Commercial',
        topic: 'Theory of Demand & Supply',
        sub_topic: 'Price Elasticity of Demand',
        year: 2024,
        difficulty_level: 'Medium',
        question_text: 'If a 10% increase in the price of petroleum results in a 2% decrease in the quantity demanded, the demand for petroleum is described as:',
        option_a: 'Price elastic',
        option_b: 'Price inelastic',
        option_c: 'Unitary elastic',
        option_d: 'Perfectively elastic',
        correct_answer: 'B',
        explanation: 'Price Elasticity of Demand (PED) = (% change in quantity demanded) / (% change in price) = 2% / 10% = 0.2. Since PED < 1, the demand is price inelastic.'
      },
      {
        exam_body: 'JAMB',
        subject_name: 'Economics',
        class_level: 'SS3',
        department: 'Commercial',
        topic: 'Money & Banking',
        sub_topic: 'Central Bank & Monetary Policy',
        year: 2023,
        difficulty_level: 'Medium',
        question_text: 'Which of the following monetary policy instruments will the Central Bank of Nigeria (CBN) employ to combat high domestic inflation?',
        option_a: 'Reduce the Cash Reserve Ratio (CRR)',
        option_b: 'Sell Treasury Bills in the Open Market Operation (OMO)',
        option_c: 'Lower the Monetary Policy Rate (MPR)',
        option_d: 'Increase commercial bank loan limits',
        correct_answer: 'B',
        explanation: 'To curb inflation (tight monetary policy), the Central Bank sells government securities (Treasury bills) in Open Market Operations to withdraw excess liquidity and reduce money supply in circulation.'
      },

      // ==========================================
      // FINANCIAL ACCOUNTING (COMMERCIAL)
      // ==========================================
      {
        exam_body: 'WAEC',
        subject_name: 'Financial Accounting',
        class_level: 'SS3',
        department: 'Commercial',
        topic: 'Double Entry System',
        sub_topic: 'Ledger Entries & Balances',
        year: 2024,
        difficulty_level: 'Easy',
        question_text: 'When office equipment is purchased on credit from XYZ Nig Ltd, what are the corresponding ledger entries?',
        option_a: 'Debit Cash Account, Credit Office Equipment Account',
        option_b: 'Debit Office Equipment Account, Credit XYZ Nig Ltd Account',
        option_c: 'Debit XYZ Nig Ltd Account, Credit Office Equipment Account',
        option_d: 'Debit Purchases Account, Credit Cash Account',
        correct_answer: 'B',
        explanation: 'The golden rule of double entry states: Debit the receiver (or the asset account increasing - Office Equipment) and Credit the giver (the creditor liability increasing - XYZ Nig Ltd).'
      },

      // ==========================================
      // GOVERNMENT (ARTS)
      // ==========================================
      {
        exam_body: 'WAEC',
        subject_name: 'Government',
        class_level: 'SS3',
        department: 'Arts',
        topic: 'Constitutional Development in Nigeria',
        sub_topic: 'The 1954 Lyttelton Constitution',
        year: 2024,
        difficulty_level: 'Medium',
        question_text: 'The major constitutional landmark of the 1954 Lyttelton Constitution of Nigeria was the introduction of:',
        option_a: 'The elective principle for the first time',
        option_b: 'A true federal system of government with regional autonomy',
        option_c: 'A republican status for Nigeria',
        option_d: 'A bicameral legislature at the central government level',
        correct_answer: 'B',
        explanation: 'The 1954 Lyttelton Constitution formally instituted a federal structure in Nigeria, establishing the Northern, Western, and Eastern regions with residual powers and regional civil services.'
      },

      // ==========================================
      // JUNIOR SECONDARY BASIC SCIENCE & TECHNOLOGY
      // ==========================================
      {
        exam_body: 'School Exam',
        subject_name: 'Basic Science',
        class_level: 'JSS3',
        department: 'Junior',
        topic: 'Living Things & The Environment',
        sub_topic: 'Ecological Adaptations',
        year: 2024,
        difficulty_level: 'Easy',
        question_text: 'Which of the following biological components is responsible for carrying oxygen throughout the human body?',
        option_a: 'White Blood Cells (Leukocytes)',
        option_b: 'Red Blood Cells (Erythrocytes)',
        option_c: 'Blood Platelets (Thrombocytes)',
        option_d: 'Blood Plasma',
        correct_answer: 'B',
        explanation: 'Red blood cells contain haemoglobin, an iron-rich protein that binds reversibly with oxygen in the lungs to form oxyhaemoglobin and transports it to body tissues.'
      },
      {
        exam_body: 'School Exam',
        subject_name: 'Basic Technology',
        class_level: 'JSS2',
        department: 'Junior',
        topic: 'Materials & Processing',
        sub_topic: 'Properties of Metals',
        year: 2024,
        difficulty_level: 'Easy',
        question_text: 'The ability of a metal to be drawn out into thin wires without breaking is known as:',
        option_a: 'Malleability',
        option_b: 'Ductility',
        option_c: 'Brittleness',
        option_d: 'Elasticity',
        correct_answer: 'B',
        explanation: 'Ductility is the mechanical property of a material allowing it to be stretched into wires under tensile stress. Malleability is the ability to be hammered or rolled into thin sheets.'
      }
    ];

    console.log(`[ExcelMind CBT Seed]: Seeding ${questions.length} authentic past questions...`);
    for (const q of questions) {
      const existingQ = await QuestionBank.findOne({
        where: {
          question_text: q.question_text,
          exam_body: q.exam_body
        }
      });
      if (!existingQ) {
        await QuestionBank.create(q);
      }
    }

    const totalInBank = await QuestionBank.count();
    console.log(`[ExcelMind CBT Seed]: ✓ Seeding complete. Total questions in questions_bank: ${totalInBank}`);
    process.exit(0);
  } catch (err) {
    console.error('[ExcelMind CBT Seed Error]:', err);
    process.exit(1);
  }
}

seedCbtQuestionBank();
