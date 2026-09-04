const { Subject, Topic, Lesson, File, Course } = require('../models');

// 1. Get all curriculum subjects
exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.findAll({
      order: [['subject_name', 'ASC']]
    });
    return res.status(200).json({ success: true, count: subjects.length, subjects });
  } catch (err) {
    console.error('getSubjects error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// 2. Create subject
exports.createSubject = async (req, res) => {
  try {
    const { subject_name, subject_code, department, category } = req.body;
    if (!subject_name) {
      return res.status(400).json({ success: false, message: 'Subject name is required' });
    }

    const newSubject = await Subject.create({
      school_id: 1,
      subject_name,
      subject_code: subject_code || `SUB-${Date.now().toString().slice(-4)}`,
      department: department || 'General',
      category: category || 'Compulsory'
    });

    return res.status(201).json({ success: true, subject: newSubject });
  } catch (err) {
    console.error('createSubject error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// 3. Get topics (optional filter by subject_id or class_level)
exports.getTopics = async (req, res) => {
  try {
    const { subject_id, class_level } = req.query;
    const where = {};
    if (subject_id) where.subject_id = subject_id;
    if (class_level) where.class_level = class_level;

    const topics = await Topic.findAll({
      where,
      include: [{ model: Subject, as: 'subject', attributes: ['subject_name', 'subject_code'] }],
      order: [['id', 'ASC']]
    });

    return res.status(200).json({ success: true, count: topics.length, topics });
  } catch (err) {
    console.error('getTopics error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// 4. Create topic
exports.createTopic = async (req, res) => {
  try {
    const { subject_id, class_level, topic_name, term, description } = req.body;
    if (!subject_id || !class_level || !topic_name) {
      return res.status(400).json({ success: false, message: 'subject_id, class_level, and topic_name are required' });
    }

    const topic = await Topic.create({
      subject_id,
      class_level,
      topic_name,
      term: term || 'Term 1',
      description
    });

    return res.status(201).json({ success: true, topic });
  } catch (err) {
    console.error('createTopic error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// 5. Get lessons
exports.getLessons = async (req, res) => {
  try {
    const { topic_id } = req.query;
    const where = {};
    if (topic_id) where.topic_id = topic_id;

    const lessons = await Lesson.findAll({
      where,
      order: [['id', 'ASC']]
    });

    return res.status(200).json({ success: true, count: lessons.length, lessons });
  } catch (err) {
    console.error('getLessons error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// 6. Create lesson
exports.createLesson = async (req, res) => {
  try {
    const { topic_id, lesson_title, learning_objectives, lesson_content, examples, summary, assignment, created_by } = req.body;
    if (!topic_id || !lesson_title) {
      return res.status(400).json({ success: false, message: 'topic_id and lesson_title are required' });
    }

    const lesson = await Lesson.create({
      topic_id,
      lesson_title,
      learning_objectives,
      lesson_content,
      examples,
      summary,
      assignment,
      created_by: created_by || (req.user ? req.user.id : null),
      status: 'Published'
    });

    return res.status(201).json({ success: true, lesson });
  } catch (err) {
    console.error('createLesson error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// 7. Get learning files & materials
exports.getFiles = async (req, res) => {
  try {
    const { category } = req.query;
    const where = {};
    if (category) where.category = category;

    const files = await File.findAll({
      where,
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({ success: true, count: files.length, files });
  } catch (err) {
    console.error('getFiles error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// 8. Register learning file/material
exports.createFile = async (req, res) => {
  try {
    const { file_name, file_type, file_url, category, uploaded_by } = req.body;
    if (!file_name || !file_url) {
      return res.status(400).json({ success: false, message: 'file_name and file_url are required' });
    }

    const file = await File.create({
      uploaded_by: uploaded_by || (req.user ? req.user.id : 1),
      file_name,
      file_type: file_type || 'document',
      file_url,
      category: category || 'PDF notes'
    });

    return res.status(201).json({ success: true, file });
  } catch (err) {
    console.error('createFile error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
