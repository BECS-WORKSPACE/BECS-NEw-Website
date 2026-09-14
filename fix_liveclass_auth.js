const fs = require('fs');

let controller = fs.readFileSync('server/controllers/liveClassController.js', 'utf8');

const authHelper = `
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
`;

controller = controller.replace(/(const Course = require\('\.\.\/models\/Course'\);)/, "$1\n\n" + authHelper);

const scheduleClassRegex = /(exports\.scheduleClass = async \(req, res\) => \{\n  try \{\n    const \{.*?courseId.*?\} = req\.body;)/s;
controller = controller.replace(scheduleClassRegex, "$1\n    await verifyCourseAccess(req, courseId);");

const getInstructorClassesRegex = /(exports\.getInstructorClasses = async \(req, res\) => \{\n  try \{)/;
const replacement = `$1
    const role = req.user.legacyRole || (req.user.role && req.user.role.name) || (req.user.isAdmin ? 'admin' : 'student');
    const isAdmin = ['admin', 'Admin', 'Super Admin', 'god'].includes(role);
    let query = {};
    
    if (!isAdmin) {
      // Find courses this teacher is assigned to
      const courses = await Course.find({
        $or: [
          { faculty: req.user._id },
          { assignedTeachers: req.user._id }
        ]
      }).select('_id');
      const courseIds = courses.map(c => c._id);
      
      query = { courseId: { $in: courseIds } };
    }
`;

// wait, let's see how getInstructorClasses is currently implemented.
