/**
 * ExcelMind Academic Service
 * Business logic for computing student GPA, positions, and broadsheet report cards.
 */

function calculateGrade(totalScore) {
  if (totalScore >= 75) return { grade: 'A1', remark: 'Excellent' };
  if (totalScore >= 70) return { grade: 'B2', remark: 'Very Good' };
  if (totalScore >= 65) return { grade: 'B3', remark: 'Good' };
  if (totalScore >= 60) return { grade: 'C4', remark: 'Credit' };
  if (totalScore >= 55) return { grade: 'C5', remark: 'Credit' };
  if (totalScore >= 50) return { grade: 'C6', remark: 'Credit' };
  if (totalScore >= 45) return { grade: 'D7', remark: 'Pass' };
  if (totalScore >= 40) return { grade: 'E8', remark: 'Pass' };
  return { grade: 'F9', remark: 'Fail' };
}

function computeOverallAverage(results) {
  if (!results || results.length === 0) return 0;
  const sum = results.reduce((acc, r) => acc + Number(r.total_score || 0), 0);
  return Number((sum / results.length).toFixed(2));
}

module.exports = {
  calculateGrade,
  computeOverallAverage
};
