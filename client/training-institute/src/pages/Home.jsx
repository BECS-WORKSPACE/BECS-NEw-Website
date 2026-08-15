import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AutoCarousel from '../components/common/AutoCarousel';
import { DEFAULT_COURSES } from '../data/courses';
import { fetchCourses } from '../api';

const Home = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await fetchCourses();
        // The API returns { courses: [...], totalPages: X }
        if (data && data.courses && data.courses.length > 0) {
          setCourses(data.courses);
        } else if (Array.isArray(data) && data.length > 0) {
          setCourses(data); // Legacy fallback
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

  let filteredCourses = courses;
  if (searchQuery) {
    filteredCourses = filteredCourses.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase())));
  }
  if (categoryFilter) {
    filteredCourses = filteredCourses.filter(c => c.target.includes(categoryFilter) || c.title.includes(categoryFilter) || (c.badge && c.badge.includes(categoryFilter)));
  }
  if (languageFilter) {
    filteredCourses = filteredCourses.filter(c => c.language?.includes(languageFilter));
  }

  const navigateToDetails = (course) => {
    // Pass state, but ideally navigate to /course/:id and fetch there
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
      <section className="hero" style={{ background: 'var(--bg)', paddingTop: '60px', paddingBottom: '60px' }}>
        <div className="container hero-inner">
          <div className="hero-content" style={{ flex: '1' }}>
            <h1 className="responsive-heading" style={{ fontSize: '3.5rem', lineHeight: 1.1, marginBottom: '20px', color: 'var(--primary)', fontFamily: 'Outfit, sans-serif', fontWeight: 800 }}>
              Advance Your Career with <br />
              <span className="highlight">Industry-Ready Courses</span>
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '30px', maxWidth: '600px', lineHeight: 1.6 }}>
              Government Exams • MAKAUT Preparation • Board Exams • Interview Preparation • Career Guidance • Psychological Counselling
            </p>
            <div className="hero-buttons" style={{ display: 'flex', gap: '15px' }}>
              <a href="#courses" className="btn-solid-lg" style={{ background: 'var(--accent)', boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)' }}>Explore Courses</a>
              <a href="#courses" className="btn-outline-lg">Enroll Now</a>
            </div>
            <div className="hero-features" style={{ marginTop: '30px', color: 'var(--text-muted)', fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✅ Expert Mentors</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✅ Lifetime Access</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✅ Certificates</span>
            </div>
          </div>
          <div className="hero-image-wrapper" style={{ flex: '1', position: 'relative' }}>
            <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80" alt="Students in modern classroom" className="hero-image" style={{ width: '100%', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }} />
          </div>
        </div>
      </section>

      <section className="stats-section" style={{ background: 'var(--surface)', padding: '60px 0' }}>
        <div className="container stats-grid" style={{ display: 'grid', gap: '30px', textAlign: 'center' }}>
          <div className="stat-box" style={{ background: 'var(--bg)', padding: '30px', borderRadius: '20px' }}>
            <h3 className="responsive-stat" style={{ color: 'var(--primary)', fontSize: '2.5rem', fontWeight: 900 }}>10+</h3>
            <p style={{ color: 'var(--text)', fontWeight: 600, margin: 0 }}>Students</p>
          </div>
          <div className="stat-box" style={{ background: 'var(--bg)', padding: '30px', borderRadius: '20px' }}>
            <h3 className="responsive-stat" style={{ color: 'var(--accent)', fontSize: '2.5rem', fontWeight: 900 }}>50+</h3>
            <p style={{ color: 'var(--text)', fontWeight: 600, margin: 0 }}>Mock Tests</p>
          </div>
          <div className="stat-box" style={{ background: 'var(--bg)', padding: '30px', borderRadius: '20px' }}>
            <h3 className="responsive-stat" style={{ color: 'var(--primary)', fontSize: '2.5rem', fontWeight: 900 }}>10+</h3>
            <p style={{ color: 'var(--text)', fontWeight: 600, margin: 0 }}>Mentors</p>
          </div>
          <div className="stat-box" style={{ background: 'var(--bg)', padding: '30px', borderRadius: '20px' }}>
            <h3 className="responsive-stat" style={{ color: 'var(--accent)', fontSize: '2.5rem', fontWeight: 900 }}>95%</h3>
            <p style={{ color: 'var(--text)', fontWeight: 600, margin: 0 }}>Student Satisfaction</p>
          </div>
        </div>
      </section>

      <section className="courses-section" id="courses">
        <div className="container">
          <div className="section-header">
            <h2 className="responsive-heading">Our Premium <span className="highlight">Offline/Online Batches</span></h2>
            <p>Enroll in our structured classroom programs designed for competitive success.</p>
          </div>

          <div className="course-filters" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '40px', background: 'var(--surface)', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <input type="text" placeholder="Search courses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--border)', flex: '1 1 250px', background: 'var(--bg)', color: 'var(--text)' }} />
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', flex: '1 1 150px' }}>
              <option value="">Category filter</option>
              <option value="Government">Government Exams</option>
              <option value="MAKAUT">MAKAUT</option>
              <option value="Board">Board Exams</option>
            </select>
            <select value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)} style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', flex: '1 1 150px' }}>
              <option value="">Language filter</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Bengali">Bengali</option>
            </select>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', flex: '1 1 250px', justifyContent: 'flex-start' }}>
              <button className="pill-button" onClick={() => { setSearchQuery(''); setCategoryFilter(''); setLanguageFilter(''); }} style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', cursor: 'pointer', flex: '1 1 auto' }}>Clear Filters</button>
            </div>
          </div>
          <div className="courses-grid">
            {filteredCourses.length === 0 ? <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No courses found matching your criteria.</p> : null}
            {filteredCourses.map(course => (
              <div className="course-card" key={course.id} onClick={() => navigateToDetails(course)} style={{ cursor: 'pointer', position: 'relative' }}>
                <div className="course-image-container">
                  <img src={course.image} alt={course.title} />
                  <span className="discount-badge">{course.discount}</span>
                  {course.badge && <span className="category-badge" style={{ position: 'absolute', top: '16px', left: '16px', background: 'var(--primary)', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800 }}>{course.badge}</span>}
                  <button style={{ position: 'absolute', bottom: '16px', right: '16px', background: 'var(--surface)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>🤍</button>
                </div>
                <div className="course-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 className="course-title" style={{ margin: 0, fontSize: '1.4rem', lineHeight: 1.3 }}>{course.title}</h3>
                  </div>
                  <p className="course-target" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{course.target}</p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
                    <span style={{ color: '#F59E0B' }}>{'★'.repeat(Math.floor(course.rating))}</span>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{course.rating}</span>
                    <span style={{ color: 'var(--text-muted)' }}>({course.studentCount} Students)</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                    <img src={course.mentorPhoto} alt={course.mentorName} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>{course.mentorName}</span>
                  </div>

                  <div className="course-tags" style={{ marginBottom: '16px', rowGap: '8px' }}>
                    <span className="tag" style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text)' }}>⏱️ {course.duration}</span>
                    <span className="tag" style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text)' }}>🗣️ {course.language}</span>
                    {course.certificate && <span className="tag" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--emerald)' }}>🎓 Certificate Included</span>}
                  </div>

                  <div className="course-footer" style={{ marginTop: 'auto', paddingTop: '16px', borderTop: 'none', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div className="price-container" style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                        <span className="price">{course.price}</span>
                        <span className="original-price">{course.originalPrice}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '4px' }}>
                        <span className="enroll-fee" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>+ {course.enrollmentFee} Enrollment</span>
                        {course.emi && <span style={{ fontSize: '0.75rem', background: '#FEF3C7', color: '#D97706', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>EMI Available</span>}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#EF4444', fontWeight: 600, marginTop: '8px' }}>🔥 Only {course.seatsLeft} Seats Left — Starts {course.startsIn}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '12px' }}>
                      <button className="btn-outline" style={{ flex: '1', padding: '10px', fontSize: '0.9rem', textAlign: 'center' }} onClick={(e) => { e.stopPropagation(); navigateToDetails(course); }}>View Details</button>
                      <button className="btn-solid" style={{ flex: '1', padding: '10px', fontSize: '0.9rem', textAlign: 'center' }} onClick={(e) => { e.stopPropagation(); navigate(`/enroll/${course.id}`, { state: { course } }); }}>Enroll Now</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="features-section" id="features" style={{ background: 'var(--bg)', padding: '80px 0' }}>
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: '50px' }}>
            <h2 className="responsive-heading">Premium <span className="highlight">Features</span></h2>
            <p style={{ color: 'var(--text-muted)' }}>Everything you need for a successful career journey.</p>
          </div>
          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            {[
              { icon: '🤖', title: 'AI Learning Support' },
              { icon: '🎥', title: 'Live & Recorded Classes' },
              { icon: '📝', title: 'Mock Tests & Analytics' },
              { icon: '👨‍🏫', title: 'Experienced Mentors' },
              { icon: '🗺️', title: 'Career Roadmap' },
              { icon: '📚', title: 'Study Materials' },
              { icon: '🎓', title: 'Certificates' },
              { icon: '💼', title: 'Placement Assistance' }
            ].map((f, i) => (
              <div key={i} className="feature-card" style={{ background: 'var(--surface)', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{f.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="memberships-section" id="memberships" style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="section-header text-center">
            <h2 className="responsive-heading">Choose Your <span className="highlight">Success Plan</span></h2>
          </div>
          <div className="memberships-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginTop: '40px' }}>
            {[
              { name: 'Starter', price: '₹199', desc: 'One-Time Enrollment', features: ['Student Dashboard', 'ID Card', 'Community Access', 'Notifications', 'Basic Mock Tests'] },
              { name: 'Silver', price: '₹999/year', desc: 'Essential Learning', features: ['Unlimited Mock Tests', 'Study Materials', 'Career Guidance', 'Progress Analytics'] },
              { name: 'Gold', price: '₹2,499/year', desc: 'Advanced Preparation', features: ['Everything in Silver', 'Interview Preparation', 'Resume Review', 'Doubt Solving', 'Counselling Discount'] },
              { name: 'Platinum', price: '₹4,999/year', desc: 'Complete Success Ecosystem', features: ['Everything in Gold', 'Personal Mentor', 'Career Planning', 'Psychological Counselling', 'Placement Preparation', 'Scholarship Guidance'] }
            ].map((plan, i) => (
              <div key={i} className="pricing-card" style={{ background: i === 3 ? 'var(--primary)' : 'white', color: i === 3 ? 'white' : 'inherit', padding: '40px 30px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', position: 'relative' }}>
                {i === 3 && <div style={{ position: 'absolute', top: '-15px', right: '30px', background: 'var(--accent)', color: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800 }}>RECOMMENDED</div>}
                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{plan.name}</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '5px' }}>{plan.price}</div>
                <p style={{ color: i === 3 ? '#93C5FD' : '#6B7280', marginBottom: '30px' }}>{plan.desc}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0' }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                      <span style={{ color: i === 3 ? '#34D399' : 'var(--accent)' }}>✔️</span> {f}
                    </li>
                  ))}
                </ul>
                <button className={i === 3 ? 'btn-solid-lg' : 'btn-outline-lg'} style={{ width: '100%', background: i === 3 ? 'white' : 'transparent', color: i === 3 ? 'var(--primary)' : 'inherit', border: i === 3 ? 'none' : '2px solid var(--line)' }}>Get Started</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section" id="about" style={{ background: 'var(--bg)', padding: '80px 0' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h2 className="responsive-heading" style={{ marginBottom: '20px' }}>About <span className="highlight">BECS Eduverse</span></h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text)', lineHeight: 1.8 }}>
            BECS Eduverse is a next-generation student success platform dedicated to helping learners excel in academics, competitive examinations, university education, career development, and personal growth through technology-driven learning and expert mentorship.
          </p>
        </div>
      </section>

      <section className="counselling-section" id="counselling" style={{ padding: '80px 0', background: 'var(--surface)' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="section-header text-center" style={{ marginBottom: '40px' }}>
            <h2 className="responsive-heading">Book a <span className="highlight">Counselling Session</span></h2>
            <p style={{ color: 'var(--text-muted)' }}>Get expert guidance for your career and mental wellness. Schedule a 1-on-1 session today.</p>
          </div>
          <form
            style={{ background: 'var(--bg)', padding: '40px', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}
            onSubmit={async (e) => {
              e.preventDefault();
              alert('Your counselling request has been received! Our team will contact you shortly.');
              e.target.reset();
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text)' }}>Full Name</label>
                <input type="text" required placeholder="John Doe" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text)' }}>Phone Number</label>
                <input type="tel" required placeholder="+91" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)' }} />
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text)' }}>Type of Counselling</label>
              <select required style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
                <option value="">Select an option...</option>
                <option value="career">Career & Placement Guidance</option>
                <option value="psychological">Psychological & Exam Stress</option>
                <option value="academic">Academic / Course Selection</option>
              </select>
            </div>
            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text)' }}>Tell us a bit about your situation</label>
              <textarea rows="4" placeholder="How can we help you?" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)', resize: 'vertical' }}></textarea>
            </div>
            <button type="submit" className="btn-solid-lg" style={{ width: '100%', border: 'none', cursor: 'pointer' }}>Book Session (₹99 Enrollment)</button>
          </form>
        </div>
      </section>

      <section className="testimonials-section" id="testimonials" style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="section-header text-center" style={{ marginBottom: '50px' }}>
            <h2 className="responsive-heading">Success <span className="highlight">Stories</span></h2>
            <p style={{ color: 'var(--text-muted)' }}>Hear from students who have achieved their dreams with us.</p>
          </div>
          <style>
            {`
            .mobile-success-carousel { display: none; margin-top: 30px; }
            @media (max-width: 768px) {
              .desktop-success-grid { display: none !important; }
              .mobile-success-carousel { display: block; overflow: hidden; width: 100vw; margin-left: -24px; padding: 0 24px; }
              .testimonial-card-mobile { width: 300px; flex-shrink: 0; white-space: normal; }
            }
          `}
          </style>

          <div className="testimonials-grid desktop-success-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            {[
              { name: 'Rohan Sharma', role: 'Government Aspirant', text: 'The mentoring I received was exceptional. I cleared SSC CGL on my first attempt thanks to the structured roadmap and mock tests.' },
              { name: 'Priya Das', role: 'Engineering Student', text: 'MAKAUT semester prep became so much easier. The notes and PYQ analysis helped me secure an 9.2 CGPA this year!' },
              { name: 'Amit Gupta', role: 'Parent', text: 'We enrolled our son for the career counselling and board preparation. The psychological support and focus on holistic learning changed his approach completely.' },
              { name: 'Sneha Verma', role: 'Board Student', text: 'The mock test series and expert suggestions gave me immense confidence before my 12th board exams. Highly recommended!' }
            ].map((t, i) => (
              <div key={i} className="testimonial-card" style={{ background: 'var(--surface)', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                <div style={{ color: 'var(--accent)', fontSize: '1.5rem', marginBottom: '15px' }}>⭐⭐⭐⭐⭐</div>
                <p style={{ color: 'var(--text)', fontStyle: 'italic', marginBottom: '20px', lineHeight: 1.6 }}>"{t.text}"</p>
                <h4 style={{ margin: '0 0 5px 0', color: 'var(--primary)' }}>{t.name}</h4>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t.role}</div>
              </div>
            ))}
          </div>

          <div className="mobile-success-carousel">
            <AutoCarousel speed={1}>
              {[
                { name: 'Rohan Sharma', role: 'Government Aspirant', text: 'The mentoring I received was exceptional. I cleared SSC CGL on my first attempt thanks to the structured roadmap and mock tests.' },
                { name: 'Priya Das', role: 'Engineering Student', text: 'MAKAUT semester prep became so much easier. The notes and PYQ analysis helped me secure an 9.2 CGPA this year!' },
                { name: 'Amit Gupta', role: 'Parent', text: 'We enrolled our son for the career counselling and board preparation. The psychological support and focus on holistic learning changed his approach completely.' },
                { name: 'Sneha Verma', role: 'Board Student', text: 'The mock test series and expert suggestions gave me immense confidence before my 12th board exams. Highly recommended!' }
              ].map((t, i) => (
                <div key={i} className="testimonial-card-mobile" style={{ background: 'var(--surface)', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                  <div style={{ color: 'var(--accent)', fontSize: '1.5rem', marginBottom: '15px' }}>⭐⭐⭐⭐⭐</div>
                  <p style={{ color: 'var(--text)', fontStyle: 'italic', marginBottom: '20px', lineHeight: 1.6 }}>"{t.text}"</p>
                  <h4 style={{ margin: '0 0 5px 0', color: 'var(--primary)' }}>{t.name}</h4>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t.role}</div>
                </div>
              ))}
            </AutoCarousel>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
