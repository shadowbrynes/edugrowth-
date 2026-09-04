const { Student, Parent, Teacher, ParentStudent, Class, Timetable, Assignment } = require('../models');

/**
 * 1. Role-based access authorization
 * Verifies that the authenticated user possesses one of the allowed roles.
 * Administrators bypass role checks for global administrative oversight.
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied: Authentication session required.'
      });
    }

    const userRole = (req.user.role || '').toLowerCase();

    // Global Admin bypass
    if (userRole === 'admin') {
      return next();
    }

    const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());
    if (!normalizedAllowed.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user.role}' lacks permission for this space. Allowed roles: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
};

/**
 * 2. Student Data Isolation Middleware ("My Learning Space")
 * Restricts students strictly to their own profile, grades, and class streams.
 * Rejects access to other students' private records.
 */
const studentIsolation = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const userRole = (req.user.role || '').toLowerCase();

    // Admins bypass for institutional audit
    if (userRole === 'admin') {
      return next();
    }

    // Resolve Student Record
    const student = await Student.findOne({
      where: { user_id: req.user.id },
      include: [
        { model: Class, as: 'class' },
        { model: Parent, as: 'parent' }
      ]
    });

    if (!student && userRole === 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student profile not linked to this authenticated account.'
      });
    }

    if (student) {
      req.student = student;
      req.studentId = student.id;
      req.studentClassId = student.class_id;
      req.studentAcademicLevel = student.academic_level || (student.class ? student.class.level : 'SS2');
    }

    // Check if a specific student_id was targeted in URL params or body
    const targetStudentId = req.params.student_id || req.params.id || req.query.student_id || req.body.student_id;
    if (targetStudentId && student) {
      if (Number(targetStudentId) !== Number(student.id)) {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: Data isolation policy prevents accessing records outside your own student learning space.'
        });
      }
    }

    next();
  } catch (err) {
    console.error('[Student Isolation Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error enforcing student isolation', error: err.message });
  }
};

/**
 * 3. Parent Data Isolation Middleware ("My Child Monitoring Space")
 * Restricts parents strictly to their verified student wards.
 * Rejects access to unrelated students.
 */
const parentIsolation = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const userRole = (req.user.role || '').toLowerCase();

    // Admins bypass for institutional management
    if (userRole === 'admin') {
      return next();
    }

    const parent = await Parent.findOne({ where: { user_id: req.user.id } });
    if (!parent) {
      return res.status(404).json({
        success: false,
        message: 'Parent profile not linked to this authenticated account.'
      });
    }

    // Find all linked student IDs for this parent (both via parent_student_relationship and direct parent_id)
    const relationships = await ParentStudent.findAll({ where: { parent_id: parent.id } });
    const directStudents = await Student.findAll({ where: { parent_id: parent.id }, attributes: ['id'] });

    const linkedIds = new Set([
      ...relationships.map(r => Number(r.student_id)),
      ...directStudents.map(s => Number(s.id))
    ]);

    req.parent = parent;
    req.parentLinkedStudentIds = Array.from(linkedIds);

    // If a student_id is requested in params, query, or body, verify relationship
    const targetStudentId = req.params.student_id || req.params.id || req.query.student_id || req.body.student_id;
    if (targetStudentId) {
      if (!linkedIds.has(Number(targetStudentId))) {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: You are not authorized to view or manage records for this student. Data isolation policy restricts access to verified wards only.'
        });
      }
    }

    next();
  } catch (err) {
    console.error('[Parent Isolation Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error enforcing parent isolation', error: err.message });
  }
};

/**
 * 4. Teacher Class Control Middleware ("My Teaching Space")
 * Ensures teachers can only view students, enter scores, and grade assignments
 * for classes and subject streams assigned to them.
 */
const teacherClassControl = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const userRole = (req.user.role || '').toLowerCase();

    // Admins bypass for institutional supervision
    if (userRole === 'admin') {
      return next();
    }

    const teacher = await Teacher.findOne({ where: { user_id: req.user.id } });
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher profile not linked to this authenticated account.'
      });
    }

    // Find all classes assigned to this teacher
    // 1. Managed classes as Form Master / Class Teacher
    const managedClasses = await Class.findAll({ where: { class_teacher_id: teacher.id }, attributes: ['id'] });
    
    // 2. Classes taught via Timetable
    const timetableClasses = await Timetable.findAll({ where: { teacher_id: teacher.id }, attributes: ['class_id'] });
    
    // 3. Classes with assignments
    const assignmentClasses = await Assignment.findAll({ where: { teacher_id: teacher.id }, attributes: ['class_id'] });

    const assignedClassIds = new Set([
      ...managedClasses.map(c => Number(c.id)),
      ...timetableClasses.map(t => Number(t.class_id)).filter(Boolean),
      ...assignmentClasses.map(a => Number(a.class_id)).filter(Boolean)
    ]);

    req.teacher = teacher;
    req.assignedClassIds = Array.from(assignedClassIds);

    // If an explicit class_id is passed, verify authorization
    const targetClassId = req.params.class_id || req.query.class_id || req.body.class_id;
    if (targetClassId && assignedClassIds.size > 0) {
      if (!assignedClassIds.has(Number(targetClassId))) {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: You are not assigned to this class. Score entry and student management are restricted to authorized teachers.'
        });
      }
    }

    // If a student_id is targeted (e.g. For scoring or grading), verify student belongs to teacher's classes
    const targetStudentId = req.params.student_id || req.body.student_id;
    if (targetStudentId && assignedClassIds.size > 0) {
      const student = await Student.findByPk(targetStudentId);
      if (student && student.class_id && !assignedClassIds.has(Number(student.class_id))) {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: You are not authorized to enter scores or grade assignments for this student outside your assigned classes.'
        });
      }
    }

    next();
  } catch (err) {
    console.error('[Teacher Class Control Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error enforcing teacher class control', error: err.message });
  }
};

module.exports = {
  requireRole,
  studentIsolation,
  parentIsolation,
  teacherClassControl
};
