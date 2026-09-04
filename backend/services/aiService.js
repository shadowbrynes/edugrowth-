/**
 * ExcelMind AI Service
 * Generates automated recommendations and diagnostics based on student subject trends.
 */

function generateSubjectRecommendation(studentName, weakSubject, averageScore) {
  return {
    studentName,
    weakSubject,
    averageScore,
    recommendation: `Allocate an additional 30 minutes daily to ${weakSubject} fundamental theories and worked examples before attempting the next CBT mock exam.`,
    generatedBy: 'ExcelMind AI Pedagogical Engine'
  };
}

module.exports = {
  generateSubjectRecommendation
};
