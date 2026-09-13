import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import Home from '../pages/Home';
import CourseDetails from '../pages/CourseDetails';
import Enrollment from '../pages/Enrollment';
import PlatformEnrollment from '../pages/PlatformEnrollment';
import CompleteProfile from '../pages/CompleteProfile';
import Login from '../pages/Login';
import ScholarshipTest from '../pages/ScholarshipTest';
import Counselling from '../pages/Counselling';
import CourseSubscription from '../pages/CourseSubscription';
import Dashboard from '../pages/Dashboard';
import HomeDashboard from '../pages/dashboard/HomeDashboard';
import MyCourses from '../pages/dashboard/MyCourses';
import Subscription from '../pages/dashboard/Subscription';
import CoursePlayer from '../pages/dashboard/CoursePlayer';
import LiveClasses from '../pages/dashboard/LiveClasses';
import MockTests from '../pages/dashboard/MockTests';
import LearningAnalytics from '../pages/dashboard/LearningAnalytics';
import DashboardCalendarPage from '../pages/dashboard/DashboardCalendarPage';
import CurriculumBuilder from '../pages/dashboard/CurriculumBuilder';
import TeacherCourses from '../pages/dashboard/TeacherCourses';
import TeacherBatches from '../pages/dashboard/TeacherBatches';
import TeacherStudents from '../pages/dashboard/TeacherStudents';
import TeacherMaterials from '../pages/dashboard/TeacherMaterials';
import TeacherQuestionBank from '../pages/dashboard/TeacherQuestionBank';
import TeacherMockTests from '../pages/dashboard/TeacherMockTests';
import TeacherAssignments from '../pages/dashboard/TeacherAssignments';
import TeacherDoubts from '../pages/dashboard/TeacherDoubts';
import TeacherAttendance from '../pages/dashboard/TeacherAttendance';
import TeacherMentorship from '../pages/dashboard/TeacherMentorship';
import TeacherPerformance from '../pages/dashboard/TeacherPerformance';
import TeacherAnnouncements from '../pages/dashboard/TeacherAnnouncements';
import AdminStudents from '../pages/admin/AdminStudents';
import AdminTeachers from '../pages/admin/AdminTeachers';
import AdminCourses from '../pages/admin/AdminCourses';
import AdminCourseContent from '../pages/admin/AdminCourseContent';
import AdminBatches from '../pages/admin/AdminBatches';
import AdminEnrollments from '../pages/admin/AdminEnrollments';
import AdminSubscriptions from '../pages/admin/AdminSubscriptions';
import AdminPayments from '../pages/admin/AdminPayments';
import AdminRevenueAnalytics from '../pages/admin/AdminRevenueAnalytics';
import AdminLearningAnalytics from '../pages/admin/AdminLearningAnalytics';
import AdminScholarship from '../pages/admin/AdminScholarship';
import AdminCMS from '../pages/admin/AdminCMS';
import AdminSettings from '../pages/admin/AdminSettings';
import AdminVideoAnalytics from '../pages/dashboard/AdminVideoAnalytics';
import ProfileSettings from '../pages/ProfileSettings';
import UserManagement from '../pages/admin/UserManagement';
import LiveClassroomApp from '../pages/dashboard/LiveClassroomApp';
import LiveExamEngine from '../pages/assessment/LiveExamEngine';
import ResultDashboard from '../pages/assessment/ResultDashboard';
import AssignmentList from '../pages/assessment/AssignmentList';
import Mentorship from '../pages/dashboard/Mentorship';
import SubmissionPortal from '../pages/assessment/SubmissionPortal';
import LibraryHome from '../pages/library/LibraryHome';
import ResourceViewer from '../pages/library/ResourceViewer';
import QuestionBank from '../pages/dashboard/QuestionBank';
import MistakeBook from '../pages/dashboard/MistakeBook';
import Performance from '../pages/dashboard/Performance';
import DoubtRoom from '../pages/dashboard/DoubtRoom';
import StudentsList from '../pages/dashboard/StudentsList';
import DoubtForum from '../pages/community/DoubtForum';
import DiscussionThread from '../pages/community/DiscussionThread';
import ChatInterface from '../pages/community/ChatInterface';
import Certificates from '../pages/dashboard/Certificates';
import CourseViewer from '../pages/dashboard/CourseViewer';
import LessonViewer from '../pages/dashboard/LessonViewer';
const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes for All Users */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<HomeDashboard />} />
            <Route path="courses" element={<MyCourses />} />
            <Route path="video-analytics" element={<AdminVideoAnalytics />} />
            <Route path="achievements" element={<LearningAnalytics />} />
            <Route path="calendar" element={<DashboardCalendarPage />} />
            <Route path="curriculum-builder" element={<CurriculumBuilder />} />
            <Route path="teacher/courses" element={<TeacherCourses />} />
            <Route path="teacher/batches" element={<TeacherBatches />} />
            <Route path="teacher/students" element={<TeacherStudents />} />
            <Route path="teacher/materials" element={<TeacherMaterials />} />
            <Route path="teacher/question-bank" element={<TeacherQuestionBank />} />
            <Route path="teacher/pyqs" element={<TeacherQuestionBank />} />
            <Route path="teacher/tests" element={<TeacherMockTests />} />
            <Route path="teacher/assignments" element={<TeacherAssignments />} />
            <Route path="teacher/doubts" element={<TeacherDoubts />} />
            <Route path="teacher/attendance" element={<TeacherAttendance />} />
            <Route path="teacher/mentorship" element={<TeacherMentorship />} />
            <Route path="teacher/performance" element={<TeacherPerformance />} />
            <Route path="teacher/announcements" element={<TeacherAnnouncements />} />
            <Route path="subscription" element={<Subscription />} />
            <Route path="question-bank" element={<QuestionBank />} />
            <Route path="mistake-book" element={<MistakeBook />} />
            <Route path="performance" element={<Performance />} />
            <Route path="doubts" element={<DoubtRoom />} />
            <Route path="students" element={<StudentsList />} />
            
            <Route element={<ProtectedRoute requireSubscription={false} />}>
              <Route path="course/:id" element={<CourseViewer />} />
              <Route path="lesson/:id" element={<LessonViewer />} />
              <Route path="learn/:courseId" element={<CoursePlayer />} />
              <Route path="live-classes" element={<LiveClasses />} />
              <Route path="live-class/:classId" element={<LiveClassroomApp />} />
            </Route>

            <Route path="test/live/:testId" element={<LiveExamEngine />} />
            <Route path="test/results/:resultId" element={<ResultDashboard />} />
            <Route path="tests" element={<MockTests />} />
            <Route path="assignments" element={<AssignmentList />} />
            <Route path="course/:courseId/assignments" element={<AssignmentList />} />
            <Route path="mentorship" element={<Mentorship />} />
            <Route path="assignments/:assignmentId/submit" element={<SubmissionPortal />} />
            <Route path="library" element={<LibraryHome />} />
            <Route path="library/:resourceId" element={<ResourceViewer />} />
            <Route path="discussions" element={<DoubtForum />} />
            <Route path="discussions/:discussionId" element={<DiscussionThread />} />
            <Route path="chat" element={<ChatInterface />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="*" element={
              <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '16px' }}>
                <h2>🚀 Module Coming Soon</h2>
                <p style={{ color: '#64748b' }}>This premium feature is currently under development.</p>
              </div>
            } />
          </Route>
          
          <Route path="/profile" element={<ProfileSettings />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/enrollment" element={
            <ProtectedRoute>
              <PlatformEnrollment />
            </ProtectedRoute>
          } />
          
          <Route path="/scholarship-test" element={
            <ProtectedRoute requireEnrollment={true}>
              <ScholarshipTest />
            </ProtectedRoute>
          } />

          <Route path="/counselling" element={
            <ProtectedRoute requireEnrollment={true}>
              <Counselling />
            </ProtectedRoute>
          } />

          <Route path="/subscription" element={
            <ProtectedRoute requireEnrollment={true}>
              <CourseSubscription />
            </ProtectedRoute>
          } />

          <Route path="/enroll/:id" element={<Enrollment />} />
        </Route>

        {/* Admin Only Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'Admin', 'Super Admin']} />}>
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/teachers" element={<AdminTeachers />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/content" element={<AdminCourseContent />} />
          <Route path="/admin/batches" element={<AdminBatches />} />
          <Route path="/admin/enrollments" element={<AdminEnrollments />} />
          <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/revenue" element={<AdminRevenueAnalytics />} />
          <Route path="/admin/analytics" element={<AdminLearningAnalytics />} />
          <Route path="/admin/scholarships" element={<AdminScholarship />} />
          <Route path="/admin/cms" element={<AdminCMS />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
        
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
