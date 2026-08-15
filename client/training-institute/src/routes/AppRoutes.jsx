import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import Home from '../pages/Home';
import CourseDetails from '../pages/CourseDetails';
import Enrollment from '../pages/Enrollment';
import Login from '../pages/Login';
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
import AdminVideoAnalytics from '../pages/dashboard/AdminVideoAnalytics';
import ProfileSettings from '../pages/ProfileSettings';
import UserManagement from '../pages/admin/UserManagement';
import LiveClassroomApp from '../pages/dashboard/LiveClassroomApp';
import LiveExamEngine from '../pages/assessment/LiveExamEngine';
import ResultDashboard from '../pages/assessment/ResultDashboard';
import AssignmentList from '../pages/assessment/AssignmentList';
import SubmissionPortal from '../pages/assessment/SubmissionPortal';
import LibraryHome from '../pages/library/LibraryHome';
import ResourceViewer from '../pages/library/ResourceViewer';
import DoubtForum from '../pages/community/DoubtForum';
import DiscussionThread from '../pages/community/DiscussionThread';
import ChatInterface from '../pages/community/ChatInterface';
import Certificates from '../pages/dashboard/Certificates';

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
            <Route path="subscription" element={<Subscription />} />
            <Route path="learn/:courseId" element={<CoursePlayer />} />
            <Route path="live-classes" element={<LiveClasses />} />
            <Route path="live-class/:classId" element={<LiveClassroomApp />} />
            <Route path="test/live/:testId" element={<LiveExamEngine />} />
            <Route path="test/results/:resultId" element={<ResultDashboard />} />
            <Route path="tests" element={<MockTests />} />
            <Route path="course/:courseId/assignments" element={<AssignmentList />} />
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
          <Route path="/enroll/:id" element={<Enrollment />} />
        </Route>

        {/* Admin Only Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'Admin']} />}>
          <Route path="/admin/users" element={<UserManagement />} />
        </Route>
        
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
