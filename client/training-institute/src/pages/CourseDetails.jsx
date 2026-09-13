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
      <div className="details-header" style={{ marginBottom: '40px' }}>
        <div className="course-tags" style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <span className="tag mode-tag" style={{ fontSize: '0.9rem', padding: '8px 16px', borderRadius: '8px' }}>🏫 {course.mode}</span>
          <span className="tag center-tag" style={{ fontSize: '0.9rem', padding: '8px 16px', borderRadius: '8px' }}>📍 {course.center}</span>
          {course.badge && <span className="tag" style={{ fontSize: '0.9rem', padding: '8px 16px', borderRadius: '8px', background: 'var(--primary)', color: 'white' }}>⭐ {course.badge}</span>}
        </div>
        <h1 className="responsive-heading details-title" style={{ fontSize: '3rem', marginBottom: '16px' }}>{course.title}</h1>
        <p className="details-target" style={{ fontSize: '1.3rem', maxWidth: '800px', lineHeight: 1.6 }}>{course.target}</p>
      </div>

      <div className="details-grid">
        <div className="details-main">
          <img src={course.image} alt={course.title} className="details-image" style={{ width: '100%', height: '450px', objectFit: 'cover', borderRadius: '24px', marginBottom: '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />

          <h2 className="responsive-heading-sm section-title" style={{ fontSize: '2rem', borderBottom: '2px solid var(--border)', paddingBottom: '10px', marginBottom: '20px' }}>About the Program</h2>
          <p className="details-desc" style={{ fontSize: '1.15rem', color: 'var(--text-muted)' }}>{course.description}</p>

          <h2 className="responsive-heading-sm section-title" style={{ fontSize: '2rem', borderBottom: '2px solid var(--border)', paddingBottom: '10px', marginTop: '40px', marginBottom: '20px' }}>Faculty & Schedule</h2>
          <div className="info-box" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', background: 'var(--bg)', padding: '30px', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: '5px' }}>Lead Faculty</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)' }}>👨‍🏫 {course.faculty}</p>
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: '5px' }}>Schedule</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)' }}>⏰ {course.schedule}</p>
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: '5px' }}>Duration</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)' }}>⏳ {course.duration}</p>
            </div>
            {course.language && (
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 700, marginBottom: '5px' }}>Language</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)' }}>🗣️ {course.language}</p>
              </div>
            )}
          </div>

          <h2 className="responsive-heading-sm section-title" style={{ fontSize: '2rem', borderBottom: '2px solid var(--border)', paddingBottom: '10px', marginTop: '40px', marginBottom: '20px' }}>Syllabus Highlights</h2>
          <ul className="syllabus-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', background: 'transparent', border: 'none', padding: 0, listStyle: 'none' }}>
            {course.syllabus.map((item, index) => (
              <li key={index} style={{ padding: '16px 20px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600 }}>
                <span style={{ color: 'var(--primary)' }}>✔️</span> {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="details-sidebar">
          <div className="enroll-card" style={{ position: 'sticky', top: '120px', background: 'var(--surface)', padding: '32px', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
            <h3 className="responsive-heading-sm card-title" style={{ marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>Enrollment & Pricing</h3>
            
            <div style={{ paddingBottom: '20px', borderBottom: '1px dashed var(--border)', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Step 1: One-Time Enrollment</div>
              <div className="price-row" style={{ marginTop: '8px', alignItems: 'baseline' }}>
                <span className="price-main" style={{ fontSize: '2rem' }}>{course.enrollmentFee || '₹999'}</span>
                <span className="price-strike" style={{ fontSize: '1.1rem' }}>{course.originalEnrollmentFee || '₹1,999'}</span>
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Step 2: Course Subscription</div>
              <div className="price-row" style={{ marginTop: '8px', alignItems: 'baseline' }}>
                <span className="price-main" style={{ fontSize: '2.5rem' }}>{course.price}</span>
                <span className="price-strike" style={{ fontSize: '1.2rem' }}>{course.originalPrice}</span>
              </div>
              <p className="discount-text" style={{ fontSize: '1rem', marginTop: '5px' }}>Includes {course.discount}</p>
            </div>

            <ul className="features-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px', color: 'var(--text-muted)', fontWeight: 600 }}>
              <li style={{ display: 'flex', gap: '10px' }}><span style={{ color: '#10B981' }}>✅</span> Full Classroom Access</li>
              <li style={{ display: 'flex', gap: '10px' }}><span style={{ color: '#10B981' }}>✅</span> Printed Hardcopy Material</li>
              <li style={{ display: 'flex', gap: '10px' }}><span style={{ color: '#10B981' }}>✅</span> 24/7 Doubt Forum Access</li>
              <li style={{ display: 'flex', gap: '10px' }}><span style={{ color: '#10B981' }}>✅</span> Free Lab Components Usage</li>
            </ul>

            <button className="btn-solid-lg w-full" style={{ width: '100%', padding: '18px', fontSize: '1.1rem', borderRadius: '12px', background: 'var(--primary)', border: 'none', boxShadow: '0 10px 20px rgba(230, 34, 59, 0.2)' }} onClick={() => navigate(`/enroll/${course.id || course._id}`, { state: { course } })}>
              Proceed to Enroll
            </button>
            <p className="seats-text" style={{ marginTop: '20px', color: 'var(--text-muted)', fontWeight: 600 }}>Seats are limited per batch.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
