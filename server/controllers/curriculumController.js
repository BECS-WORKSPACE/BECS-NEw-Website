const Course = require('../models/Course');
const Module = require('../models/Module');
const Chapter = require('../models/Chapter');
const Lesson = require('../models/Lesson');


const verifyCourseAccess = async (req, courseId) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error('Course not found');
  
  const role = req.user.legacyRole || (req.user.role && req.user.role.name) || (req.user.isAdmin ? 'admin' : 'student');
  if (['admin', 'Admin', 'Super Admin', 'god'].includes(role)) return true;
  
  const teacherId = req.user._id.toString();
  const isAssigned = (course.faculty && course.faculty.toString() === teacherId) || 
                     (course.assignedTeachers && course.assignedTeachers.some(id => id.toString() === teacherId));
                     
  if (!isAssigned) throw new Error('Unauthorized: You are not assigned to this course');
  return true;
};


// 1. Create a new Module
exports.createModule = async (req, res) => {
  try {
    const { courseId, title, description, order } = req.body;
    await verifyCourseAccess(req, courseId);
    
    // Create the module
    const newModule = await Module.create({
      courseId,
      title,
      description,
      order: order || 0
    });

    // Automatically push to Course.modules
    await Course.findByIdAndUpdate(courseId, {
      $push: { modules: newModule._id }
    });

    res.status(201).json(newModule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating module' });
  }
};

// 2. Create a new Chapter inside a Module
exports.createChapter = async (req, res) => {
  try {
    const { courseId, moduleId, title, description, order } = req.body;
    await verifyCourseAccess(req, courseId);
    
    const newChapter = await Chapter.create({
      courseId,
      moduleId,
      title,
      description,
      order: order || 0
    });

    res.status(201).json(newChapter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating chapter' });
  }
};

// 3. Create a Lesson inside a Chapter
exports.createLesson = async (req, res) => {
  try {
    const { courseId, moduleId, chapterId, title, description, type, order, videoUrl, isFreePreview } = req.body;
    await verifyCourseAccess(req, courseId);
    
    const newLesson = await Lesson.create({
      course: courseId, // Backward compatibility
      moduleId,
      chapterId,
      title,
      description,
      type: type || 'video',
      videoUrl,
      order: order || 0,
      isFreePreview: isFreePreview || false
    });

    // Add to legacy course.lessons array to not break old frontends
    await Course.findByIdAndUpdate(courseId, {
      $push: { lessons: newLesson._id }
    });

    res.status(201).json(newLesson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating lesson' });
  }
};

// 4. Fetch Full Curriculum Tree for a Course
exports.getCurriculum = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Fetch all parts
    const modules = await Module.find({ courseId }).sort({ order: 1 }).lean();
    const chapters = await Chapter.find({ courseId }).sort({ order: 1 }).lean();
    const lessons = await Lesson.find({ course: courseId }).sort({ order: 1 }).lean();

    // Reconstruct the tree
    const tree = modules.map(mod => {
      const modChapters = chapters.filter(c => String(c.moduleId) === String(mod._id)).map(chap => {
        const chapLessons = lessons.filter(l => String(l.chapterId) === String(chap._id));
        return { ...chap, lessons: chapLessons };
      });
      return { ...mod, chapters: modChapters };
    });

    res.status(200).json(tree);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching curriculum tree' });
  }
};

// 5. Batch Reorder Curriculum (Drag and Drop Save)
exports.reorderCurriculum = async (req, res) => {
  try {
    const { courseId } = req.body;
    await verifyCourseAccess(req, courseId);
    const { modules, chapters, lessons } = req.body;
    
    // Using bulkWrite for high performance DB operations
    
    // Reorder Modules
    if (modules && modules.length > 0) {
      const modOps = modules.map((item, index) => ({
        updateOne: { filter: { _id: item.id }, update: { $set: { order: index } } }
      }));
      await Module.bulkWrite(modOps);
    }
    
    // Reorder Chapters and potentially move them to new modules
    if (chapters && chapters.length > 0) {
      const chapOps = chapters.map((item, index) => ({
        updateOne: { filter: { _id: item.id }, update: { $set: { order: index, moduleId: item.moduleId } } }
      }));
      await Chapter.bulkWrite(chapOps);
    }
    
    // Reorder Lessons and potentially move them to new chapters
    if (lessons && lessons.length > 0) {
      const lessonOps = lessons.map((item, index) => ({
        updateOne: { filter: { _id: item.id }, update: { $set: { order: index, chapterId: item.chapterId } } }
      }));
      await Lesson.bulkWrite(lessonOps);
    }

    res.status(200).json({ message: 'Curriculum reordered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error reordering curriculum' });
  }
};
