import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { fetchCourseById } from '../api';
import { DEFAULT_COURSES } from '../data/courses';

const CourseDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [course, setCourse] = useState(location.state?.course || null);
  const [loading, setLoading] = useState(!location.state?.course);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!course && id) {
      const loadCourse = async () => {
        try {
          const data = await fetchCourseById(id);
          setCourse(data);
        } catch (err) {
          // Fallback to static if backend fails or empty
          const fallback = DEFAULT_COURSES.find(c => String(c.id) === id || String(c._id) === id);
          if (fallback) setCourse(fallback);
        } finally {
          setLoading(false);
        }
      };
      loadCourse();
    } else {
      setLoading(false);
    }
  }, [id, course]);

  if (loading) {
    return (
      <div className="container" style={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--primary)' }}>Loading Course Details...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>Course not found</h2>
        <button className="btn-outline-sm" onClick={() => navigate('/')}>Return Home</button>
      </div>
    );
  }

  return (
    <div className="details-view container">
      <button className="btn-outline-sm back-btn" onClick={() => navigate('/')}>
        ← Back to All Courses
      </button>
      <div className="details-header">
        <div className="course-tags">
          <span className="tag mode-tag">🏫 {course.mode}</span>
          <span className="tag center-tag">📍 {course.center}</span>
        </div>
        <h1 className="responsive-heading details-title">{course.title}</h1>
        <p className="details-target">{course.target}</p>
      </div>

      <div className="details-grid">
        <div className="details-main">
          <img src={course.image} alt={course.title} className="details-image" />

          <h2 className="responsive-heading-sm section-title">About the Program</h2>
          <p className="details-desc">{course.description}</p>

          <h2 className="responsive-heading-sm section-title">Faculty & Schedule</h2>
          <div className="info-box">
            <p><strong>👨‍🏫 Lead Faculty:</strong> {course.faculty}</p>
            <p className="mt-10"><strong>⏰ Schedule:</strong> {course.schedule}</p>
            <p className="mt-10"><strong>⏳ Duration:</strong> {course.duration}</p>
          </div>

          <h2 className="responsive-heading-sm section-title">Syllabus Highlights</h2>
          <ul className="syllabus-list">
            {course.syllabus.map((item, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="details-sidebar">
          <div className="enroll-card">
            <h3 className="responsive-heading-sm card-title">Enrollment Details</h3>
            <div className="price-row">
              <span className="price-main">{course.price}</span>
              <span className="price-strike">{course.originalPrice}</span>
            </div>
            <p className="discount-text">Includes {course.discount}</p>

            <ul className="features-list">
              <li>✅ Full Classroom Access</li>
              <li>✅ Printed Hardcopy Material</li>
              <li>✅ 24/7 Doubt Forum Access</li>
              <li>✅ Free Lab Components Usage</li>
            </ul>

            <button className="btn-solid-lg w-full" onClick={() => navigate(`/enroll/${course.id}`, { state: { course } })}>
              Proceed to Enroll
            </button>
            <p className="seats-text">Seats are limited per batch.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
