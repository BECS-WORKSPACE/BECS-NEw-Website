import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AutoCarousel from '../components/common/AutoCarousel';
import { DEFAULT_COURSES } from '../data/courses';
import { fetchCourses } from '../api';

const Home = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await fetchCourses();
        if (data && data.courses && data.courses.length > 0) {
          // If the backend has legacy courses (more than 4), fallback to the DEFAULT_COURSES to ensure exactly 4 flagship categories are shown
          if (data.courses.length > 4) {
            setCourses(DEFAULT_COURSES);
          } else {
            setCourses(data.courses);
          }
        } else if (Array.isArray(data) && data.length > 0) {
          if (data.length > 4) {
            setCourses(DEFAULT_COURSES);
          } else {
            setCourses(data);
          }
        } else {
          setCourses(DEFAULT_COURSES);
        }
      } catch (err) {
        console.error('Failed to load courses from API:', err);
        setCourses(DEFAULT_COURSES);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  const navigateToDetails = (course) => {
    navigate(`/course/${course._id || course.id}`, { state: { course } });
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--primary)' }}>Loading EduVerse...</div>
      </div>
    );
  }

  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="hero" id="home" style={{ background: 'var(--bg)', padding: '100px 0' }}>
        <div className="container hero-inner" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px', alignItems: 'center' }}>
          <div className="hero-content">
            <div className="badge" style={{ marginBottom: '24px', fontSize: '0.8rem', padding: '6px 16px', background: 'rgba(230, 34, 59, 0.1)', color: 'var(--primary)', border: 'none', fontWeight: 800 }}>⭐ YOUR COMPLETE LEARNING & CAREER ECOSYSTEM</div>
            <h1 className="responsive-heading" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: 'var(--text)', marginBottom: '24px', lineHeight: 1.1, fontWeight: 900, letterSpacing: '-1px' }}>
              Your Gateway to <br />
              <span className="highlight">Academic Excellence.</span>
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginBottom: '40px', maxWidth: '600px', lineHeight: 1.6, fontWeight: 500 }}>
              India's premium EdTech platform offering structured offline and online programs for Government Exams, Joint Entrance, and Board Exams.
            </p>
            <div className="hero-buttons" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <a href="#programs" className="btn-solid-lg" style={{ background: 'var(--primary)', color: 'white', boxShadow: '0 10px 25px rgba(230, 34, 59, 0.3)', border: 'none', padding: '16px 32px' }}>Explore Programs</a>
              <a href="#counselling" className="btn-outline-lg" style={{ borderColor: 'var(--border)', color: 'var(--text)', padding: '16px 32px' }}>Book Free Counselling</a>
            </div>
            <div className="hero-features" style={{ marginTop: '40px', color: 'var(--text)', fontWeight: 700, display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '0.9rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ color: '#10B981' }}>✔️</span> Top Educators</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ color: '#10B981' }}>✔️</span> Advanced Analytics</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ color: '#10B981' }}>✔️</span> 1-on-1 Mentorship</span>
            </div>
          </div>
          <div className="hero-image-wrapper" style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-10px', left: '-10px', right: '10px', bottom: '10px', borderRadius: '24px', background: 'var(--primary)', opacity: 0.1, zIndex: 0 }}></div>
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" alt="Students learning" className="hero-image" style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.2)', position: 'relative', zIndex: 1, border: '4px solid white' }} />
          </div>
        </div>
      </section>

      {/* 2. EDUVERSE LEARNING JOURNEY */}
      <section id="journey" style={{ background: 'var(--surface)', padding: '100px 0' }}>
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: '60px' }}>
            <h2 className="responsive-heading">The EduVerse <span className="highlight">Methodology</span></h2>
            <p style={{ color: 'var(--text-muted)' }}>A proven, scientific approach to academic and competitive success.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', textAlign: 'center' }}>
            {[
              { title: 'Assess', icon: '🎯', desc: 'Identify baseline performance.' },
              { title: 'Plan', icon: '📅', desc: 'Structured study roadmap.' },
              { title: 'Learn', icon: '📚', desc: 'Concept mastery.' },
              { title: 'Practice', icon: '✍️', desc: 'Targeted drills.' },
              { title: 'Test', icon: '📝', desc: 'Real-exam simulation.' },
              { title: 'Analyze', icon: '📊', desc: 'Identify weak areas.' },
              { title: 'Improve', icon: '🚀', desc: 'Focused revision.' },
              { title: 'Mentor', icon: '👨‍🏫', desc: 'Expert guidance.' },
              { title: 'Achieve', icon: '🏆', desc: 'Goal completion.' }
            ].map((step, idx) => (
              <div key={idx} className="methodology-card">
                <span className="methodology-step-num">0{idx + 1}</span>
                <div className="methodology-content">
                  <div className="methodology-icon-wrapper">
                    <span className="emoji-icon">{step.icon}</span>
                  </div>
                  <h4 style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.2rem', marginBottom: '8px' }}>{step.title}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FLAGSHIP PROGRAMS */}
      <section className="courses-section" id="programs" style={{ background: 'var(--bg)', padding: '100px 0' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="responsive-heading">Flagship <span className="highlight">Programs</span></h2>
            <p>Comprehensive preparation programs designed by experts.</p>
          </div>
          
          <div className="courses-grid">
            {courses.slice(0, 4).map(course => (
              <div className="course-card" key={course.id || course._id} onClick={() => navigateToDetails(course)} style={{ cursor: 'pointer', position: 'relative' }}>
                <div className="course-image-container">
                  <img src={course.image} alt={course.title} />
                  {course.badge && <span className="category-badge" style={{ position: 'absolute', top: '16px', left: '16px', background: 'var(--primary)', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800 }}>{course.badge}</span>}
                </div>
                <div className="course-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div style={{ marginBottom: '8px' }}>
                    <h3 className="course-title" style={{ margin: 0, fontSize: '1.4rem', lineHeight: 1.3 }}>{course.title}</h3>
                  </div>
                  <p className="course-target" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{course.target}</p>

                  <div className="course-tags" style={{ marginBottom: '16px', rowGap: '8px' }}>
                    <span className="tag" style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text)' }}>⏱️ {course.duration}</span>
                    <span className="tag" style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text)' }}>🗣️ {course.language || 'English, Hindi, Bengali'}</span>
                  </div>

                  <div className="course-footer" style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border)', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div className="price-container" style={{ marginBottom: '16px', width: '100%', background: 'var(--surface)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      {/* One Time Enrollment */}
                      <div style={{ paddingBottom: '8px', borderBottom: '1px dashed var(--border)', marginBottom: '8px' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Step 1: One-Time Enrollment</div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)' }}>₹999</span>
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹1,999</span>
                        </div>
                      </div>
                      
                      {/* Monthly Subscription */}
                      <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Step 2: Course Subscription</div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                          <span className="price" style={{ fontSize: '1.6rem', color: 'var(--primary)' }}>₹4,999<span style={{ fontSize: '1rem' }}>/mo</span></span>
                          <span className="original-price" style={{ fontSize: '0.9rem' }}>₹7,999/mo</span>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                      <button className="btn-outline" style={{ flex: '1', padding: '10px', fontSize: '0.9rem', textAlign: 'center', borderRadius: '8px', border: '1px solid var(--primary)', color: 'var(--primary)', fontWeight: 700, background: 'transparent' }} onClick={(e) => { e.stopPropagation(); navigateToDetails(course); }}>View Details</button>
                      <button className="btn-solid" style={{ flex: '1', padding: '10px', fontSize: '0.9rem', textAlign: 'center', borderRadius: '8px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 700 }} onClick={(e) => { e.stopPropagation(); navigate(`/enroll/${course.id || course._id}`, { state: { course } }); }}>Enroll Now</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PRACTICE & TESTING */}
      <section id="tests" style={{ padding: '100px 0', background: 'var(--surface)' }}>
        <div className="container">
          <div className="hero-inner" style={{ gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            <div className="hero-image-wrapper" style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-15px', left: '-15px', width: '100px', height: '100px', background: 'var(--primary)', borderRadius: '20px', zIndex: 0, opacity: 0.1 }}></div>
              <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80" alt="Testing and Analytics" style={{ width: '100%', borderRadius: '24px', boxShadow: '0 30px 60px rgba(0,0,0,0.12)', position: 'relative', zIndex: 1, border: '4px solid white' }} />
              <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', background: 'white', padding: '15px 25px', borderRadius: '16px', boxShadow: '0 15px 30px rgba(0,0,0,0.1)', zIndex: 2, display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '2.5rem' }}>📊</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text)' }}>Weekly</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Mock Tests</div>
                </div>
              </div>
            </div>
            <div className="hero-content">
              <h2 className="responsive-heading" style={{ color: 'var(--text)', marginBottom: '20px' }}>Rigorous <span className="highlight">Practice & Testing</span></h2>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginBottom: '30px', lineHeight: 1.7 }}>
                True mastery comes from practice. Our platform offers an extensive library of tests and AI-driven performance analytics to ensure you are exam-ready.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  'Weekly and Monthly Mock Tests',
                  'Previous Year Questions (PYQs)',
                  'AI-Driven Performance Analytics',
                  'National Level Ranking & Percentile'
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1.1rem', color: 'var(--text)', fontWeight: 600 }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 }}>✓</div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PERSONALIZED LEARNING */}
      <section id="personalized" style={{ padding: '100px 0', background: 'var(--bg)' }}>
        <div className="container">
          <div className="hero-inner" style={{ gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            <div className="hero-content" style={{ order: window.innerWidth <= 1024 ? 2 : 1 }}>
              <h2 className="responsive-heading" style={{ color: 'var(--text)', marginBottom: '20px' }}>Tailored for <span className="highlight">Your Pace</span></h2>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginBottom: '30px', lineHeight: 1.7 }}>
                Every student learns differently. We offer a hybrid model that adapts to your learning style, ensuring maximum retention and conceptual clarity.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  'Interactive Live Classes & Webinars',
                  'Unlimited Access to Recorded Lectures',
                  'Structured 1-on-1 Doubt Solving',
                  'Comprehensive Digital Study Materials'
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1.1rem', color: 'var(--text)', fontWeight: 600 }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 }}>✓</div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="hero-image-wrapper" style={{ order: window.innerWidth <= 1024 ? 1 : 2, position: 'relative' }}>
              <div style={{ position: 'absolute', bottom: '-15px', right: '-15px', width: '100px', height: '100px', background: 'var(--accent)', borderRadius: '20px', zIndex: 0, opacity: 0.1 }}></div>
              <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80" alt="Personalized Learning" style={{ width: '100%', borderRadius: '24px', boxShadow: '0 30px 60px rgba(0,0,0,0.12)', position: 'relative', zIndex: 1, border: '4px solid white' }} />
              <div style={{ position: 'absolute', top: '-20px', left: '-20px', background: 'white', padding: '15px 25px', borderRadius: '16px', boxShadow: '0 15px 30px rgba(0,0,0,0.1)', zIndex: 2, display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '2.5rem' }}>👨‍💻</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text)' }}>24/7</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Access</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MENTORSHIP & STUDENT SUPPORT */}
      <section id="mentorship" style={{ padding: '100px 0', background: 'var(--surface)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '1000px' }}>
          <div className="section-header" style={{ marginBottom: '60px' }}>
            <h2 className="responsive-heading" style={{ color: 'var(--text)' }}>Expert <span className="highlight">Mentorship & Support</span></h2>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              Beyond academics, we focus on your holistic development. Get guidance from industry experts and dedicated counselors.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', textAlign: 'left' }}>
            {[
              { title: 'Career Counselling', icon: '🎯', desc: 'Confused about your career path? Our experts help you navigate choices, providing clear roadmaps for university admissions and government jobs.' },
              { title: 'Psychological Support', icon: '🧠', desc: 'Exam stress is real. We provide professional psychological support to help you maintain mental well-being and peak performance.' },
              { title: 'Academic Mentorship', icon: '👨‍🏫', desc: 'Get paired with mentors who have cleared the exact exams you are preparing for. Learn their strategies and avoid common pitfalls.' }
            ].map((feature, idx) => (
              <div key={idx} className="feature-card" style={{ padding: '40px 30px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px', background: 'white', width: '70px', height: '70px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', marginBottom: '15px' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '1.05rem' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* COUNSELLING FORM SEPARATE */}
      <section id="counselling" style={{ padding: '100px 0', background: 'var(--bg)' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="section-header text-center" style={{ marginBottom: '50px' }}>
            <h2 className="responsive-heading" style={{ color: 'var(--text)' }}>Book a <span className="highlight">Counselling Session</span></h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem' }}>Get expert guidance for your career and mental wellness. Schedule a 1-on-1 session today.</p>
          </div>
          <form
            style={{ background: 'white', padding: '50px', borderRadius: '32px', border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.04)' }}
            onSubmit={async (e) => {
              e.preventDefault();
              alert('Your counselling request has been received! Our team will contact you shortly.');
              e.target.reset();
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginBottom: '30px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 700, color: 'var(--text)' }}>Full Name</label>
                <input type="text" required placeholder="John Doe" style={{ width: '100%', padding: '16px 20px', borderRadius: '12px', border: '2px solid var(--bg)', background: 'var(--bg)', color: 'var(--text)', fontSize: '1rem', transition: '0.3s', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--bg)'} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 700, color: 'var(--text)' }}>Phone Number</label>
                <input type="tel" required placeholder="+91" style={{ width: '100%', padding: '16px 20px', borderRadius: '12px', border: '2px solid var(--bg)', background: 'var(--bg)', color: 'var(--text)', fontSize: '1rem', transition: '0.3s', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--bg)'} />
              </div>
            </div>
            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 700, color: 'var(--text)' }}>Type of Counselling</label>
              <select required style={{ width: '100%', padding: '16px 20px', borderRadius: '12px', border: '2px solid var(--bg)', background: 'var(--bg)', color: 'var(--text)', fontSize: '1rem', transition: '0.3s', outline: 'none', appearance: 'none', cursor: 'pointer' }} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--bg)'}>
                <option value="">Select an option...</option>
                <option value="career">Career & Placement Guidance</option>
                <option value="psychological">Psychological & Exam Stress</option>
                <option value="academic">Academic / Course Selection</option>
              </select>
            </div>
            <div style={{ marginBottom: '40px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 700, color: 'var(--text)' }}>Tell us a bit about your situation</label>
              <textarea rows="4" placeholder="How can we help you?" style={{ width: '100%', padding: '16px 20px', borderRadius: '12px', border: '2px solid var(--bg)', resize: 'vertical', background: 'var(--bg)', color: 'var(--text)', fontSize: '1rem', transition: '0.3s', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--bg)'}></textarea>
            </div>
            <button type="submit" className="btn-solid-lg" style={{ width: '100%', padding: '20px', fontSize: '1.2rem', borderRadius: '16px', background: 'var(--primary)', border: 'none', cursor: 'pointer', boxShadow: '0 10px 20px rgba(230, 34, 59, 0.2)' }}>Book Session (₹99 Enrollment)</button>
          </form>
        </div>
      </section>

      {/* 7. SCHOLARSHIP SECTION */}
      <section id="scholarship" style={{ padding: '100px 0', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1, backgroundImage: 'radial-gradient(circle at 20% 150%, var(--primary) 20%, transparent 60%)' }}></div>
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-block', padding: '10px 20px', background: 'rgba(230, 34, 59, 0.2)', color: '#ff8a98', borderRadius: '30px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px', border: '1px solid rgba(230, 34, 59, 0.3)' }}>🎓 EduVerse Scholarships</div>
          <h2 style={{ fontSize: '3.5rem', fontFamily: 'Outfit, sans-serif', fontWeight: 900, marginBottom: '20px', lineHeight: 1.1 }}>Unlock Your True Potential</h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '50px', maxWidth: '700px', margin: '0 auto 50px auto', opacity: 0.8, lineHeight: 1.6 }}>
            We believe finances should never be a barrier to education. Take our national scholarship test and get up to 50% off on your course subscriptions based on your merit.
          </p>
          
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', padding: '50px', borderRadius: '32px', maxWidth: '900px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'space-around', alignItems: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white' }}>Up to 50%</div>
              <div style={{ opacity: 0.7, fontWeight: 600, fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Fee Waiver</div>
            </div>
            <div style={{ width: '2px', height: '80px', background: 'rgba(255,255,255,0.1)' }}></div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white' }}>Merit-Based</div>
              <div style={{ opacity: 0.7, fontWeight: 600, fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '10px' }}>Selection Process</div>
            </div>
            
            <button className="btn-solid-lg" style={{ background: 'var(--primary)', color: 'white', padding: '20px 40px', fontSize: '1.2rem', borderRadius: '16px', border: 'none', boxShadow: '0 15px 30px rgba(230, 34, 59, 0.3)' }} onClick={() => alert('Scholarship Engine coming soon!')}>Apply Now</button>
          </div>
        </div>
      </section>

      {/* 8. ABOUT US */}
      <section id="about" style={{ padding: '100px 0', background: 'var(--surface)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '24px', background: 'var(--bg)', marginBottom: '30px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
            <img src="/logo.png" alt="BECS Eduverse Logo" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
          </div>
          <h2 className="responsive-heading" style={{ marginBottom: '30px', color: 'var(--text)' }}>About <span className="highlight">BECS Eduverse</span></h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.8, fontWeight: 500 }}>
            BECS Eduverse is a next-generation student success platform dedicated to helping learners excel in academics, competitive examinations, university education, career development, and personal growth through technology-driven learning and expert mentorship.
          </p>
        </div>
      </section>
    </>
  );
};

export default Home;
