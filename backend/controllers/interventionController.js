const interventionService = require('../services/interventionService');

exports.getStudentInterventions = async (req, res) => {
  try {
    const studentId = req.params.student_id || req.user?.student_id || req.user?.id || 1;
    const interventions = await interventionService.getStudentInterventions(studentId);
    return res.status(200).json({
      success: true,
      count: interventions.length,
      data: interventions
    });
  } catch (err) {
    console.error('getStudentInterventions error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve learning interventions',
      error: err.message
    });
  }
};

exports.getInterventionById = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user?.student_id || req.user?.id || 1;
    const result = await interventionService.startIntervention(id, studentId);
    return res.status(200).json(result);
  } catch (err) {
    console.error('getInterventionById error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch intervention details',
      error: err.message
    });
  }
};

exports.startIntervention = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.body?.student_id || req.user?.student_id || req.user?.id || 1;
    const result = await interventionService.startIntervention(id, studentId);
    return res.status(200).json(result);
  } catch (err) {
    console.error('startIntervention error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to start learning intervention',
      error: err.message
    });
  }
};

exports.completeIntervention = async (req, res) => {
  try {
    const { id } = req.params;
    const { score_after, student_id } = req.body || {};
    const resolvedStudentId = student_id || req.user?.student_id || req.user?.id || 1;
    const result = await interventionService.completeIntervention(id, resolvedStudentId, score_after);
    return res.status(200).json(result);
  } catch (err) {
    console.error('completeIntervention error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to complete learning intervention',
      error: err.message
    });
  }
};
