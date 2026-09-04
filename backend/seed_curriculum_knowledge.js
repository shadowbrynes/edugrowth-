const { sequelize, CurriculumKnowledge, AILearningContext, AIQuestion, Student, Subject, AcademicResult } = require('./models');

async function seedCurriculum() {
  console.log('==============================================================');
  console.log('  Seeding Nigerian Secondary Curriculum Knowledge Base (RAG)  ');
  console.log('==============================================================\n');

  try {
    await sequelize.authenticate();
    console.log('✓ MySQL Connected successfully.\n');

    // 1. Sync models safely
    await CurriculumKnowledge.sync();
    console.log('✓ curriculum_knowledge table verified/created.');
    await AILearningContext.sync();
    console.log('✓ ai_learning_context table verified/created.');
    await AIQuestion.sync();
    console.log('✓ ai_questions table verified/created.\n');

    // 2. Comprehensive Curriculum Knowledge Items
    const knowledgeItems = [
      // PHYSICS - SS3 / SS2
      {
        subject: 'Physics',
        class_level: 'SS3',
        department: 'Science',
        topic: 'Introduction to Physics & Fundamental Branches',
        content: `Physics is the fundamental branch of science concerned with the nature and properties of matter and energy, their interactions, motion, forces, and spacetime.

In the approved Nigerian Senior Secondary Curriculum (NERDC) and WAEC/NECO/JAMB syllabus, Physics is structured into five core pillars:
1. Mechanics: Kinematics, dynamics, Newton's laws of motion, circular motion, gravitation, work, energy, power, momentum, and elasticity.
2. Thermal Physics / Heat: Temperature measurement, thermal expansion, gas laws, calorimetry, latent heat, and thermodynamics.
3. Waves and Optics: Wave properties (reflection, refraction, diffraction, interference, polarization), sound waves, resonance, mirrors, lenses, and optical instruments.
4. Electricity and Magnetism: Electrostatics, Coulomb's law, electric circuits (Ohm's law, Kirchhoff's laws), magnetic fields, electromagnetic induction (Faraday's & Lenz's laws), and alternating current (AC) circuits.
5. Modern / Atomic Physics: Cathode rays, photoelectric effect, wave-particle duality, X-rays, atomic models, radioactivity, and nuclear energy.`,
        exam_relevance: `WAEC & JAMB Syllabus Testing Focus:
- Section A (Objective): Tests dimensional analysis, SI units, scalar vs vector quantities, and rapid conceptual deductions.
- Section B (Theory): Mechanics and Electricity account for approximately 45% of total marks. WAEC heavily penalizes omitting SI units (e.g. m/s², N, J, W, Ω, F) or failing to show the governing formula before substitution.`
      },
      {
        subject: 'Physics',
        class_level: 'SS3',
        department: 'Science',
        topic: 'Linear Motion & Equations of Uniformly Accelerated Motion',
        content: `Linear motion describes an object moving along a straight line path.
Fundamental Parameters:
- Displacement (s) [m]: Vector quantity representing change in position.
- Initial Velocity (u) [m/s] and Final Velocity (v) [m/s].
- Acceleration (a) [m/s²]: Rate of change of velocity: a = (v - u) / t.
- Time taken (t) [s].

The Four Governing Kinematic Equations (applicable ONLY when acceleration is uniform/constant):
1. v = u + at
2. s = ut + ½at²
3. v² = u² + 2as
4. s = [(u + v) / 2] * t

Vertical Motion under Gravity:
Substitute a = ±g (where g ≈ 9.8 m/s² or 10 m/s² in WAEC).
- Upward motion: Acceleration is negative (a = -g) because gravity decelerates the body. At maximum height, final velocity v = 0.
- Downward motion: Acceleration is positive (a = +g).`,
        exam_relevance: `WAEC & JAMB Standard Problem Patterns:
- Calculating maximum height reached: H_max = u² / (2g).
- Time to reach maximum height: t = u / g; Total time of flight: T = 2u / g.
- Velocity-Time graphs: Gradient represents acceleration; Area under the graph represents distance/displacement.`
      },
      {
        subject: 'Physics',
        class_level: 'SS2',
        department: 'Science',
        topic: 'Newton\'s Laws of Motion & Momentum',
        content: `Newton's Laws form the foundation of Classical Mechanics:
1. Newton's First Law (Law of Inertia): Every body continues in its state of rest or uniform motion in a straight line unless acted upon by an external unbalanced force.
2. Newton's Second Law: The rate of change of momentum of a body is directly proportional to the applied force and takes place in the direction of the force.
   Formula: F = ma (where F is resultant force in Newtons, m is mass in kg, a is acceleration in m/s²).
   Momentum (p): p = m * v [kg·m/s or N·s]. Impulse: I = F * Δt = Δp = m(v - u).
3. Newton's Third Law (Action & Reaction): To every action, there is an equal and opposite reaction.
   Principle of Conservation of Linear Momentum: In an isolated system of colliding bodies, total momentum before collision equals total momentum after collision (m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂).`,
        exam_relevance: `WAEC Testing Nuances:
- Elastic collisions: Both momentum and kinetic energy are conserved.
- Inelastic collisions: Momentum is conserved, but kinetic energy is converted to sound/heat (bodies stick together: m₁u₁ + m₂u₂ = (m₁ + m₂)v).`
      },
      {
        subject: 'Physics',
        class_level: 'SS3',
        department: 'Science',
        topic: 'Electromagnetic Induction & Faraday\'s Laws',
        content: `Electromagnetic induction is the production of an electromotive force (EMF) across an electrical conductor in a changing magnetic field.
Laws:
1. Faraday's Law: The magnitude of induced EMF is directly proportional to the rate of change of magnetic flux linkage.
   Formula: E = -N * (ΔΦ / Δt), where N is number of turns, Φ = B * A is magnetic flux in Webers (Wb).
2. Lenz's Law: The direction of the induced current is always such as to oppose the change producing it (represented by the negative sign in Faraday's equation; demonstrates conservation of energy).

Transformers:
Operates on mutual induction.
Ideal Transformer Equation:
Vp / Vs = Np / Ns = Is / Ip
Efficiency: η = (Output Power / Input Power) * 100% = (Vs * Is) / (Vp * Ip) * 100%.`,
        exam_relevance: `WAEC & JAMB Common Questions:
- Distinguish between step-up transformers (Ns > Np, Vs > Vp) and step-down transformers (Np > Ns, Vp > Vs).
- Eddy current reduction via laminating the soft iron core.`
      },

      // BIOLOGY - SS2 / SS3
      {
        subject: 'Biology',
        class_level: 'SS2',
        department: 'Science',
        topic: 'Photosynthesis: Mechanism, Light and Dark Reactions',
        content: `Photosynthesis is the metabolic process by which green plants, algae, and cyanobacteria synthesize organic compounds (glucose) from inorganic raw materials (carbon dioxide and water) using radiant sunlight energy absorbed by chlorophyll, releasing oxygen as a byproduct.

Overall Chemical Equation:
6CO₂ + 6H₂O  ---[Sunlight / Chlorophyll]--->  C₆H₁₂O₆ + 6O₂

Two Distinct Stages:
1. Light-Dependent Phase (Photolysis):
   - Location: Grana / Thylakoid membranes of chloroplasts.
   - Mechanism: Chlorophyll captures photon energy, causing photolysis of water: 2H₂O ---> 4H⁺ + 4e⁻ + O₂.
   - Products: ATP and NADPH (energy carriers) + gaseous Oxygen liberated into the atmosphere.
2. Light-Independent Phase (Dark Reaction / Calvin Cycle):
   - Location: Stroma of the chloroplast.
   - Mechanism: Carbon fixation; CO₂ combines with Ribulose bisphosphate (RuBP) using ATP and NADPH to synthesize glucose (C₆H₁₂O₆).

Limiting Factors Affecting Rate:
1. Light intensity and wavelength.
2. Carbon dioxide concentration (atmospheric standard ~0.04%).
3. Temperature (optimum 25°C - 35°C; enzymes denature above 45°C).
4. Water and chlorophyll availability.`,
        exam_relevance: `WAEC Practical & Theory Questions:
- Anatomical adaptations of leaf for photosynthesis: Broad flat lamina, thinness for rapid diffusion, palisade mesophyll packed with chloroplasts, vascular bundles (xylem for water, phloem for translocating sugars), stomata controlled by guard cells.
- Standard experiments: Testing a leaf for starch (killing leaf in boiling water, decolourizing in ethanol/water bath, rehydrating in warm water, flooding with Iodine solution; blue-black indicates starch).`
      },
      {
        subject: 'Biology',
        class_level: 'SS3',
        department: 'Science',
        topic: 'Genetics & Mendelian Inheritance',
        content: `Genetics is the study of heredity and variation in living organisms.
Key Concepts:
- Gene: Unit of inheritance situated at a specific locus on a chromosome.
- Alleles: Alternative forms of a gene (dominant vs recessive).
- Genotype: The genetic constitution of an organism (e.g. TT, Tt, tt).
- Phenotype: The physical expression of the genotype (e.g. Tall, Dwarf).
- Homozygous: Having identical alleles (TT or tt).
- Heterozygous: Having two different alleles (Tt).

Mendel's Laws:
1. Law of Segregation: During gamete formation, the alleles for each gene segregate so that each gamete carries only one allele.
2. Law of Independent Assortment: Genes for different traits segregate independently during gamete formation.

Sex Determination in Humans:
- Females: Homogametic (XX).
- Males: Heterogametic (XY).
Probability of male or female offspring is always 50% (1:1).`,
        exam_relevance: `WAEC High-Frequency Questions:
- Monohybrid phenotypic ratio for heterozygous cross (Tt x Tt) = 3:1 (Tall:Dwarf); Genotypic ratio = 1:2:1 (TT:Tt:tt).
- Sickle cell anaemia crosses (HbA HbA, HbA HbS, HbS HbS) and ABO blood group compatibility.`
      },

      // MATHEMATICS - ALL LEVELS
      {
        subject: 'Mathematics',
        class_level: 'SS2',
        department: 'General',
        topic: 'Quadratic Equations: Factorisation, Completing the Square & Quadratic Formula',
        content: `A quadratic equation is a polynomial equation of the second degree in one variable, universally expressed in standard form as:
ax² + bx + c = 0, where a ≠ 0, and a, b, c are real coefficients.

Four Solution Methods:
1. Factorisation:
   Find two numbers p and q such that p * q = a * c and p + q = b. Rewrite middle term and factor by grouping.
   Example: 2x² - 5x + 2 = 0. Product = 4, Sum = -5. Numbers are -4 and -1.
   2x² - 4x - x + 2 = 0 => 2x(x - 2) - 1(x - 2) = 0 => (2x - 1)(x - 2) = 0 => x = ½ or x = 2.

2. The Quadratic Formula:
   x = [-b ± √(b² - 4ac)] / (2a)

3. Completing the Square:
   Divide through by 'a', transfer constant 'c/a' to RHS, add the square of half the coefficient of x [i.e., (b/2a)²] to both sides, and take the square root.

4. Discriminant (Δ = b² - 4ac):
   - If Δ > 0: Two distinct real roots.
   - If Δ = 0: Two equal/repeated real roots (perfect square).
   - If Δ < 0: No real roots (roots are complex/imaginary).`,
        exam_relevance: `WAEC & JAMB Marking Guide:
- WAEC Theory Questions award separate method marks (M1) for correct substitution into the quadratic formula before simplification.
- Word problems leading to quadratic equations (e.g. speed-distance problems or rectangular area problems) require rejecting negative roots when physical quantities cannot be negative.`
      },
      {
        subject: 'Mathematics',
        class_level: 'SS1',
        department: 'General',
        topic: 'Linear Equations & Word Problems',
        content: `A linear equation is an algebraic equation in which each term has an exponent of 1.
Standard Single Variable Form:
ax + b = c

Golden Rules of Solution:
1. Whatever operation is performed on the Left Hand Side (LHS) must be simultaneously performed on the Right Hand Side (RHS).
2. Collect like terms (terms with the unknown on one side, constant numbers on the opposite side).
3. Clear fractions by multiplying every term by the Lowest Common Multiple (LCM) of all denominators.
4. Clear brackets by careful expansion, observing signs: (-) * (-) = (+), (-) * (+) = (-).
5. Divide by the coefficient of the variable to isolate x.`,
        exam_relevance: `WAEC Standard Word Problems:
- Age problems (e.g. "A father is 3 times as old as his son. In 5 years time...").
- Perimeter/Area algebra problems.`
      },

      // CHEMISTRY - SS2 / SS3
      {
        subject: 'Chemistry',
        class_level: 'SS3',
        department: 'Science',
        topic: 'Stoichiometry & The Mole Concept',
        content: `The mole is the amount of substance containing Avogadro's number (N_A = 6.022 × 10²³ particles).
Fundamental Formulas:
1. Number of moles (n) = Mass (m) [g] / Molar Mass (M) [g/mol]
2. Number of particles (N) = n * N_A
3. For gases at Standard Temperature and Pressure (s.t.p: 0°C, 1 atm):
   Volume (V) = n * Molar Volume (22.4 dm³/mol or 22,400 cm³/mol).
4. Solution Concentration:
   Molarity (C) [mol/dm³] = n / V [dm³] = (Mass in g) / (Molar mass * Volume in dm³).
   Mass concentration [g/dm³] = Molarity * Molar Mass.`,
        exam_relevance: `WAEC Volumetric Analysis (Titration):
Formula: (C_a * V_a) / (C_b * V_b) = n_a / n_b
Where C_a, C_b are concentrations of acid/base; V_a, V_b are titre volumes; n_a, n_b are stoichiometric coefficients from balanced equation.`
      },
      {
        subject: 'Chemistry',
        class_level: 'SS2',
        department: 'Science',
        topic: 'Acids, Bases, Salts & pH Calculations',
        content: `Definitions:
- Arrhenius Acid: Produces hydrogen ions (H⁺ or H₃O⁺) in aqueous solution.
- Arrhenius Base: Produces hydroxide ions (OH⁻) in aqueous solution.
- Brønsted-Lowry: Acid is a proton (H⁺) donor; Base is a proton acceptor.
- Lewis: Acid is an electron-pair acceptor; Base is an electron-pair donor.

pH Scale:
pH = -log₁₀[H⁺]
pOH = -log₁₀[OH⁻]
pH + pOH = 14 (at 25°C).
- Acidic: pH < 7
- Neutral: pH = 7
- Basic/Alkaline: pH > 7`,
        exam_relevance: `WAEC & JAMB Patterns:
- Calculating pH of strong acids (e.g. 0.01M HCl: [H⁺] = 10⁻² M => pH = 2).
- Distinguish between strong acids (completely ionized, e.g. HCl, H₂SO₄, HNO₃) and weak acids (partially ionized, e.g. CH₃COOH, H₂CO₃).`
      }
    ];

    console.log(`Populating ${knowledgeItems.length} core Nigerian curriculum knowledge records:`);
    for (const item of knowledgeItems) {
      const [record, created] = await CurriculumKnowledge.findOrCreate({
        where: {
          subject: item.subject,
          topic: item.topic,
          class_level: item.class_level
        },
        defaults: item
      });

      if (!created) {
        record.content = item.content;
        record.exam_relevance = item.exam_relevance;
        await record.save();
      }

      console.log(`  ✓ [${item.class_level} ${item.subject}] ${item.topic}`);
    }

    // 3. Initialize AI learning contexts for students
    const students = await Student.findAll();
    for (const st of students) {
      await AILearningContext.findOrCreate({
        where: { student_id: st.id },
        defaults: {
          student_id: st.id,
          difficulty_level: 'WAEC Standard',
          learning_history: JSON.stringify({
            preferredSubjects: ['Physics', 'Mathematics', 'Chemistry', 'Biology'],
            weakAreas: ['Mechanics', 'Kinematics', 'Trigonometry'],
            totalQueries: 0,
            lastSession: new Date()
          })
        }
      });
      console.log(`  ✓ Initialized AI Learning Context for student: ${st.first_name} ${st.last_name} (ID: ${st.id})`);
    }

    console.log('\n==============================================================');
    console.log('  Curriculum Knowledge Base & AI Context Seed Complete! ✓     ');
    console.log('==============================================================\n');
  } catch (err) {
    console.error('Curriculum seeding error:', err);
  } finally {
    process.exit(0);
  }
}

seedCurriculum();
