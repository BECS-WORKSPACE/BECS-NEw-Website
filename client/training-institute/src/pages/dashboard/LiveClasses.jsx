import React from 'react';
import { useAuth } from '../../context/AuthContext';
import StudentLiveClasses from './components/StudentLiveClasses';
import TeacherLiveClassManager from './components/TeacherLiveClassManager';

const LiveClasses = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  const isTeacherOrAdmin = user.isAdmin || user.role?.name === 'Teacher' || user.legacyRole === 'teacher' || user.legacyRole === 'admin';

  if (isTeacherOrAdmin) {
    return <TeacherLiveClassManager />;
  }

  return <StudentLiveClasses />;
};

export default LiveClasses;
