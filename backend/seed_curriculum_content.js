const { sequelize, CurriculumContent } = require('./models');

async function seedCurriculumContent() {
  console.log('==============================================================');
  console.log('  Seeding Nigerian Secondary Curriculum Content (JSS1 - SS3)   ');
  console.log('==============================================================\n');

  try {
    await sequelize.authenticate();
    console.log('✓ MySQL Connected successfully.\n');

    await CurriculumContent.sync();
    console.log('✓ curriculum_content table verified/created.\n');

    const contents = [
      // SCIENCE - PHYSICS
      {
        class_level: 'SS3',
        department: 'Science',
        subject: 'Physics',
        topic: 'Introduction to Physics & Major Pillars',
        lesson_content: `Physics is the branch of science that studies matter, energy, motion, forces, and how they interact with each other. Simply put, physics explains how things work in the world around us.
Major areas of physics include:
1. Mechanics (Motion, Force, Energy, Momentum, Gravitation)
2. Electricity (Current, Voltage, Resistance, Circuits)
3. Waves (Sound, Light, Optics, Resonance)
4. Heat (Temperature, Thermal energy, Gas laws, Latent heat)
5. Modern Physics (Atomic structure, Photoelectric effect, Radioactivity)`,
        examples: `When a car moves, physics explains:
- how fast it travels (velocity)
- what makes it accelerate (force)
- how it stops (friction)`,
        exam_questions: `WAEC Testing Focus for SS3:
- Mechanics accounts for over 25% of Section B theory marks.
- Important SS3 WAEC topics: Mechanics, Electricity, Electromagnetic induction, Waves, Modern physics.
Example WAEC Question: A car travels 100 metres in 20 seconds. Calculate its velocity.`,
        solutions: `Velocity = Distance ÷ Time = 100 ÷ 20 = 5 m/s.`
      },
      // SCIENCE - MATHEMATICS
      {
        class_level: 'SS3',
        department: 'Science',
        subject: 'Mathematics',
        topic: 'Introduction to Mathematics & Core Branches',
        lesson_content: `Mathematics is the study of numbers, quantities, patterns, shapes and relationships. Mathematics helps us solve problems logically.
Major areas include:
1. Algebra: Study of unknown values and mathematical symbols (e.g. 2x + 4 = 10).
2. Geometry: Study of shapes, angles, dimensions, and coordinate planes.
3. Statistics: Study of collecting, organizing, and analysing numerical data.
4. Calculus: Study of continuous change, rates, differentiation, and integration.`,
        examples: `When calculating money: ₦500 + ₦300 = ₦800.
When designing buildings: Nigerian civil engineers use geometry and precise trigonometric measurements.`,
        exam_questions: `For SS3 students preparing for WAEC, commonly tested areas include:
- Quadratic equations & Simultaneous equations
- Trigonometry & Angles of elevation/depression
- Statistics & Cumulative frequency curves (Ogive)
- Probability & Venn diagrams
- Differentiation & Calculus
Practice Question: Solve x² - 5x + 6 = 0`,
        solutions: `x² - 5x + 6 = 0 => (x - 2)(x - 3) = 0 => x = 2 or x = 3.`
      },
      // SCIENCE - BIOLOGY
      {
        class_level: 'SS2',
        department: 'Science',
        subject: 'Biology',
        topic: 'Photosynthesis: Mechanism, Light and Dark Reactions',
        lesson_content: `Photosynthesis is the metabolic process by which green plants manufacture organic food (glucose) from inorganic raw materials (carbon dioxide and water) using radiant sunlight energy absorbed by chlorophyll, releasing oxygen as a byproduct.
Chemical Equation:
6CO₂ + 6H₂O  ---[Sunlight / Chlorophyll]--->  C₆H₁₂O₆ + 6O₂
Occurs in the chloroplast:
1. Light reaction (Photolysis): In grana, 2H₂O -> 4H⁺ + 4e⁻ + O₂.
2. Dark reaction (Calvin cycle): In stroma, carbon fixation into glucose.`,
        examples: `A cassava or maize plant absorbing sunlight in a Nigerian farm to produce starch stored in roots/cobs.`,
        exam_questions: `WAEC High-Frequency Testing Focus:
- Adaptations of leaves (broad flat lamina, stomata for diffusion, palisade mesophyll packed with chloroplasts).
- Starch test experimental procedure (boil in water, decolorize in ethanol water bath, soften in warm water, add iodine solution).
- Four limiting factors: light intensity, CO₂ concentration, temperature, chlorophyll.`,
        solutions: `Leaf turns blue-black upon adding iodine if starch is present; remains brown if no starch.`
      },
      // SCIENCE - CHEMISTRY
      {
        class_level: 'SS3',
        department: 'Science',
        subject: 'Chemistry',
        topic: 'Acids, Bases, Salts and pH Concept',
        lesson_content: `Acids are substances which produce hydrogen ions (H⁺) or hydronium ions (H₃O⁺) when dissolved in water.
Bases produce hydroxide ions (OH⁻) in aqueous solution.
Salts are formed when the replaceable hydrogen ion of an acid is replaced by a metal or ammonium ion.
pH scale: pH = -log₁₀[H⁺]. Range 0 - 14.
- Acidic: pH < 7
- Neutral: pH = 7
- Alkaline/Basic: pH > 7`,
        examples: `Hydrochloric acid (HCl) in gastric juice, Citric acid in Nigerian oranges/limes, Sodium hydroxide (NaOH) in soap making.`,
        exam_questions: `WAEC Titration & Theory:
Calculate the pH of 0.01 mol/dm³ HCl solution.`,
        solutions: `HCl is a strong acid: [H⁺] = 0.01 = 10⁻² mol/dm³. pH = -log₁₀(10⁻²) = 2.`
      },
      // ARTS - GOVERNMENT
      {
        class_level: 'SS3',
        department: 'Arts',
        subject: 'Government',
        topic: 'Nigerian Federalism and Separation of Powers',
        lesson_content: `Federalism is a system of government in which political power is constitutionally shared between a central (federal) authority and coordinate regional or state governments.
Arms of Government (Separation of Powers):
1. The Legislature: Makes laws (National Assembly: Senate & House of Representatives).
2. The Executive: Enforces and implements laws (President, Governors, Ministers).
3. The Judiciary: Interprets laws and administers justice (Supreme Court, Court of Appeal, High Courts).`,
        examples: `The 1999 Constitution of the Federal Republic of Nigeria divides legislative powers into Exclusive List (Federal only), Concurrent List (Federal and State), and Residual List (States only).`,
        exam_questions: `WAEC Government Theory:
State four main features of Nigerian Federalism and explain two merits of federalism in a multi-ethnic society.`,
        solutions: `Features: Written and rigid constitution, division of powers, bicameral legislature, supremacy of the constitution.`
      },
      // COMMERCIAL - ECONOMICS
      {
        class_level: 'SS3',
        department: 'Commercial',
        subject: 'Economics',
        topic: 'Theory of Demand and Supply & Equilibrium Price',
        lesson_content: `Demand is the quantity of a commodity that consumers are willing and able to buy at a given price over a specific period of time.
Law of Demand: Other things being equal (ceteris paribus), the higher the price, the lower the quantity demanded, and vice versa.
Supply is the quantity of a commodity that producers are willing and able to offer for sale at a given price.
Equilibrium Price: The market price where quantity demanded equals quantity supplied (Qd = Qs).`,
        examples: `When the price of petrol or yam rises in a Nigerian market, quantity demanded decreases if consumer income remains constant.`,
        exam_questions: `Given Qd = 50 - 2P and Qs = 10 + 2P, calculate the equilibrium price and equilibrium quantity.`,
        solutions: `Equilibrium occurs when Qd = Qs: 50 - 2P = 10 + 2P => 4P = 40 => P = ₦10. Equilibrium quantity: Qd = 50 - 2(10) = 30 units.`
      }
    ];

    console.log(`Populating ${contents.length} curriculum content records across Nigerian subjects:`);
    for (const item of contents) {
      const [rec, created] = await CurriculumContent.findOrCreate({
        where: {
          subject: item.subject,
          topic: item.topic,
          class_level: item.class_level
        },
        defaults: item
      });

      if (!created) {
        rec.lesson_content = item.lesson_content;
        rec.examples = item.examples;
        rec.exam_questions = item.exam_questions;
        rec.solutions = item.solutions;
        await rec.save();
      }

      console.log(`  ✓ [${item.class_level} ${item.department}] ${item.subject}: ${item.topic}`);
    }

    console.log('\n==============================================================');
    console.log('  Curriculum Content Seed Completed Successfully! ✓           ');
    console.log('==============================================================\n');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    process.exit(0);
  }
}

seedCurriculumContent();
