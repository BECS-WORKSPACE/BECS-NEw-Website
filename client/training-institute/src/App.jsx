import React, { useState, useEffect } from 'react';
import './index.css';
import { fetchCourses, createEnquiry } from './api';

const DEFAULT_COURSES = [
  {
    id: 1,
    title: 'Foundation Builder (Class 8-10)',
    target: 'School Boards, NTSE, Olympiads',
    duration: '1 Year Program',
    mode: 'Offline Classroom',
    center: 'All Centers',
    price: '₹20,000',
    originalPrice: '₹30,000',
    discount: '33% OFF',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
    description: 'The perfect early start for junior students. We build a rock-solid foundation in Mathematics and Science, ensuring top performance in school boards and competitive exams like NTSE and Olympiads.',
    schedule: 'Weekends (Sat-Sun) 10:00 AM - 1:00 PM',
    faculty: 'Top Subject Experts from IITs & NITs',
    syllabus: [
      'Comprehensive Math & Science Coverage',
      'Mental Ability & Logical Reasoning',
      'NTSE & Olympiad Special Coaching',
      'Regular Doubt Clearing Sessions'
    ]
  },
  {
    id: 2,
    title: 'JEE / NEET Target Batch (Class 11-12)',
    target: 'JEE Main & Adv. / NEET-UG',
    duration: '2 Years Program',
    mode: 'Offline Classroom',
    center: 'Kolkata & Delhi',
    price: '₹60,000',
    originalPrice: '₹80,000',
    discount: '25% OFF',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    description: 'Intense and rigorous preparation for India\'s toughest engineering and medical entrance exams. Includes complete board exam support alongside competitive training.',
    schedule: 'Mon, Wed, Fri (4:00 PM - 8:00 PM)',
    faculty: 'Ex-Kota Senior Faculty Members',
    syllabus: [
      'In-depth Physics, Chemistry, Math/Bio',
      'Daily Practice Papers (DPP) & Analysis',
      'All India Mock Test Series',
      'Board Exam Subjective Writing Practice'
    ]
  },
  {
    id: 3,
    title: 'GATE / IES Preparation',
    target: 'Engineering Core Competitive Exams',
    duration: '1 Year Program',
    mode: 'Offline Classroom',
    center: 'Delhi & Bangalore',
    price: '₹35,000',
    originalPrice: '₹45,000',
    discount: '22% OFF',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    description: 'Highly focused coaching for B.Tech students aiming for top PSU jobs or M.Tech in IITs via GATE, as well as the prestigious Indian Engineering Services (IES).',
    schedule: 'Daily Morning / Evening Batches',
    faculty: 'Previous Year GATE Toppers & IES Officers',
    syllabus: [
      'Core Engineering Subjects Mastery',
      'Engineering Mathematics & Aptitude',
      'Previous Year Question (PYQ) Breakdown',
      'Virtual Calculator Practice & Mock Tests'
    ]
  },
  {
    id: 4,
    title: 'Govt Job Prep (SSC, Banking, Railways)',
    target: 'SSC CGL, SBI/IBPS PO, RRB NTPC',
    duration: '6 Months Program',
    mode: 'Offline Classroom',
    center: 'All Centers',
    price: '₹12,000',
    originalPrice: '₹18,000',
    discount: '33% OFF',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    description: 'An all-in-one preparation batch targeting non-technical government exams. Learn shortcut techniques for quantitative aptitude and logical reasoning to beat the clock.',
    schedule: 'Tue, Thu, Sat (10:00 AM - 1:00 PM)',
    faculty: 'SSC & Bank Exam Experts',
    syllabus: [
      'Quantitative Aptitude Speed Math',
      'Logical Reasoning & Data Interpretation',
      'General Awareness & Current Affairs',
      'English Language Comprehension'
    ]
  },
  {
    id: 5,
    title: 'Core Engineering & IoT Masterclass',
    target: 'Practical Electronics, IoT & Automation',
    duration: '6 Months Program',
    mode: 'Offline Lab + Classroom',
    center: 'Kolkata Center',
    price: '₹25,000',
    originalPrice: '₹35,000',
    discount: '28% OFF',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    description: 'Designed for engineering students to master practical implementations of the Internet of Things, Robotics, and Embedded Systems with heavy hands-on lab sessions.',
    schedule: 'Weekends (Sat-Sun) 2:00 PM - 6:00 PM',
    faculty: 'Prof. R. Sharma (IoT Expert)',
    syllabus: [
      'Microcontroller Programming (Arduino/ESP32)',
      'Sensor Integration & Wireless Protocols',
      'PLC Architecture & Industrial Drives',
      'Final Project: Cloud Connected Smart Device'
    ]
  },
  {
    id: 6,
    title: 'Advanced Placement Training',
    target: 'TCS, Infosys, Wipro & Product MNCs',
    duration: '3 Months Crash Course',
    mode: 'Offline / Hybrid',
    center: 'Bangalore Center',
    price: '₹10,000',
    originalPrice: '₹15,000',
    discount: '33% OFF',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    description: 'A rigorous boot camp focused on clearing coding rounds and technical interviews for top IT companies. Master Data Structures, Algorithms, and System Design.',
    schedule: 'Daily (6:00 PM - 8:00 PM)',
    faculty: 'Software Engineers from FAANG',
    syllabus: [
      'Data Structures & Algorithms (C++/Java/Python)',
      'Aptitude & Logical Reasoning for IT',
      'Core CS Subjects (OS, DBMS, CN)',
      'Mock HR & Technical Interviews'
    ]
  }
];

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'details', 'enroll'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';

  useEffect(() => {
    const savedUser = localStorage.getItem('becs_user');
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const getCourses = async () => {
      try {
        const data = await fetchCourses();
        if (data && data.length > 0) {
          const normalized = data.map(c => ({
            ...c,
            id: c._id,
            syllabus: c.syllabus || [
              'Comprehensive Curriculum Coverage',
              'Weekly Offline Tests & Feedback',
              'Regular Doubt Clearing Sessions',
              'Industry-Standard Lab Exercises'
            ]
          }));
          setCourses(normalized);
        } else {
          setCourses(DEFAULT_COURSES);
        }
      } catch (error) {
        console.error('Failed to fetch courses from backend, using default fallback courses:', error);
        setCourses(DEFAULT_COURSES);
      } finally {
        setLoading(false);
      }
    };
    getCourses();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('becs_user');
    setUser(null);
  };

  const navigateTo = (view, course = null) => {
    setSelectedCourse(course);
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const handleNavClick = (e, view, targetId = null) => {
    e.preventDefault();
    if (currentView !== view) {
      setCurrentView(view);
      setSelectedCourse(null);
    }
    if (targetId) {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };


  const centers = [
    { city: 'Kolkata', address: 'Tech Park, Sector 5, Salt Lake', phone: '+91 98765 43210' },
    { city: 'Delhi', address: 'Connaught Place, Block A', phone: '+91 98765 43211' },
    { city: 'Bangalore', address: 'Koramangala, 4th Block', phone: '+91 98765 43212' }
  ];

  const renderNavbar = () => (
    <>
      <div className="top-strip">
        <div className="marquee-container">
          <div className="marquee-content">
            <span onClick={() => navigateTo('home')}>🎉 Admissions Open for 2026-27 Batches! Register Now!</span>
            <span onClick={() => navigateTo('results')}>⭐ Congratulations to our students for dominating GATE 2024!</span>
            <span onClick={() => navigateTo('home')}>🔥 Flat 25% OFF on Foundation Batches this week!</span>
            <span>📞 Call us at +91 98765 43210 for free counseling.</span>
            <span onClick={() => navigateTo('home')}>🎉 Admissions Open for 2026-27 Batches! Register Now!</span>
            <span onClick={() => navigateTo('results')}>⭐ Congratulations to our students for dominating GATE 2024!</span>
            <span onClick={() => navigateTo('home')}>🔥 Flat 25% OFF on Foundation Batches this week!</span>
            <span>📞 Call us at +91 98765 43210 for free counseling.</span>
          </div>
        </div>
      </div>
      <nav className="navbar">
        <div className="container navbar-inner">
          <a href="#" className="brand" onClick={(e) => handleNavClick(e, 'home')}>
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="BECS Logo" className="brand-logo" />
            <div className="brand-text-container">
              <span className="brand-text">BECS Vidyapeeth</span>
              <span className="brand-subtext">Offline Coaching Center</span>
            </div>
          </a>
          <div className="nav-links">
            <a href="#courses" className="nav-item" onClick={(e) => handleNavClick(e, 'home', 'courses')}>Offline Courses</a>
            <a href="#centers" className="nav-item" onClick={(e) => handleNavClick(e, 'home', 'centers')}>Our Centers</a>
            <a href="#study" className="nav-item" onClick={(e) => handleNavClick(e, 'study')}>Study Material</a>
            <a href="#results" className="nav-item" onClick={(e) => handleNavClick(e, 'results')}>Results</a>
          </div>
        </div>
      </nav>
    </>
  );

  const HomeView = () => (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content">
            <div className="badge">🎯 ADMISSIONS OPEN FOR 2026-27</div>
            <h1>
              India's Most Trusted <br />
              <span className="highlight">Offline Coaching</span> for Engineers
            </h1>
            <p>
              Experience the power of traditional classroom learning combined with state-of-the-art practical labs. Learn from industry veterans at our offline centers.
            </p>
            <div className="hero-buttons">
              <a href="#courses" className="btn-solid-lg">Explore Offline Batches</a>
              <a href="#centers" className="btn-outline-lg">Find Nearest Center</a>
            </div>
            <div className="hero-features">
              <span>✅ Best Faculty</span>
              <span>✅ Smart Classrooms</span>
              <span>✅ Practical Labs</span>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80" alt="Students in classroom" className="hero-image" />
            <div className="floating-stat">
              <div className="stat-num">10,000+</div>
              <div className="stat-text">Students Selected</div>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container stats-grid">
          <div className="stat-box">
            <h3>50+</h3>
            <p>Expert Faculty</p>
          </div>
          <div className="stat-box">
            <h3>15+</h3>
            <p>Offline Centers</p>
          </div>
          <div className="stat-box">
            <h3>98%</h3>
            <p>Placement Rate</p>
          </div>
          <div className="stat-box">
            <h3>Top 100</h3>
            <p>All India Ranks</p>
          </div>
        </div>
      </section>

      <section className="courses-section" id="courses">
        <div className="container">
          <div className="section-header">
            <h2>Our Premium <span className="highlight">Offline Batches</span></h2>
            <p>Enroll in our structured classroom programs designed for competitive success.</p>
          </div>
          <div className="courses-grid">
            {courses.map(course => (
              <div className="course-card" key={course.id} onClick={() => navigateTo('details', course)} style={{ cursor: 'pointer' }}>
                <div className="course-image-container">
                  <img src={course.image} alt={course.title} />
                  <span className="discount-badge">{course.discount}</span>
                </div>
                <div className="course-body">
                  <div className="course-tags">
                    <span className="tag mode-tag">🏫 {course.mode}</span>
                    <span className="tag center-tag">📍 {course.center}</span>
                  </div>
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-target">Target: {course.target}</p>
                  <p className="course-duration">Duration: {course.duration}</p>
                  <div className="course-features">
                    <div>✔️ Printed Study Material</div>
                    <div>✔️ Weekly Offline Tests</div>
                    <div>✔️ Doubt Solving Sessions</div>
                  </div>
                  <div className="course-footer">
                    <div className="price-container">
                      <span className="price">{course.price}</span>
                      <span className="original-price">{course.originalPrice}</span>
                    </div>
                    <button className="btn-solid" onClick={(e) => { e.stopPropagation(); navigateTo('details', course); }}>View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="why-offline-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose BECS <span className="highlight">Offline Centers?</span></h2>
            <p>The traditional classroom experience powered by modern technology.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👨‍🏫</div>
              <h3>Face-to-Face Interaction</h3>
              <p>Direct interaction with top educators. Ask questions and clear doubts instantly in the classroom.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Competitive Environment</h3>
              <p>Study among the brightest minds. The peer-to-peer learning environment pushes you to perform your best.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔬</div>
              <h3>State-of-the-Art Labs</h3>
              <p>Access our premium hardware labs equipped with PLCs, IoT kits, and robotics components.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Printed Study Material</h3>
              <p>Comprehensive, researched, and updated hardcopy study materials provided directly to offline students.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="centers-section" id="centers">
        <div className="container">
          <div className="section-header">
            <h2>Find a Center <span className="highlight">Near You</span></h2>
            <p>Walk in for free counseling and demo classes.</p>
          </div>
          <div className="centers-grid">
            {centers.map((center, index) => (
              <div className="center-card" key={index}>
                <h3>📍 {center.city} Center</h3>
                <p>{center.address}</p>
                <div className="center-phone">📞 {center.phone}</div>
                <button className="btn-outline-sm">Get Directions</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );

  const CourseDetailsView = () => {
    if (!selectedCourse) return null;
    return (
      <div className="details-view container" style={{ padding: '40px 24px', minHeight: '80vh' }}>
        <button className="btn-outline-sm" onClick={() => navigateTo('home')} style={{ marginBottom: '20px' }}>
          ← Back to All Courses
        </button>
        <div className="details-header" style={{ marginBottom: '40px' }}>
          <div className="course-tags" style={{ marginBottom: '10px' }}>
            <span className="tag mode-tag">🏫 {selectedCourse.mode}</span>
            <span className="tag center-tag">📍 {selectedCourse.center}</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', fontFamily: 'Outfit', fontWeight: 800 }}>{selectedCourse.title}</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>{selectedCourse.target}</p>
        </div>

        <div className="details-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
          <div className="details-main">
            <img src={selectedCourse.image} alt={selectedCourse.title} style={{ width: '100%', borderRadius: '20px', marginBottom: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
            
            <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '16px', fontFamily: 'Outfit' }}>About the Program</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text)', marginBottom: '40px' }}>{selectedCourse.description}</p>
            
            <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '16px', fontFamily: 'Outfit' }}>Faculty & Schedule</h2>
            <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '40px' }}>
              <p><strong>👨‍🏫 Lead Faculty:</strong> {selectedCourse.faculty}</p>
              <p style={{ marginTop: '10px' }}><strong>⏰ Schedule:</strong> {selectedCourse.schedule}</p>
              <p style={{ marginTop: '10px' }}><strong>⏳ Duration:</strong> {selectedCourse.duration}</p>
            </div>

            <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', marginBottom: '16px', fontFamily: 'Outfit' }}>Syllabus Highlights</h2>
            <ul style={{ background: 'var(--surface)', padding: '24px 24px 24px 40px', borderRadius: '16px', border: '1px solid var(--border)', lineHeight: '2', fontSize: '1.1rem', color: 'var(--text)' }}>
              {selectedCourse.syllabus.map((item, index) => (
                <li key={index} style={{ marginBottom: '10px' }}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="details-sidebar">
            <div style={{ background: 'white', padding: '30px', borderRadius: '20px', border: '1px solid var(--accent)', boxShadow: '0 20px 40px rgba(255, 112, 72, 0.1)', position: 'sticky', top: '100px' }}>
              <h3 style={{ fontSize: '1.4rem', fontFamily: 'Outfit', color: 'var(--primary)', marginBottom: '20px' }}>Enrollment Details</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>{selectedCourse.price}</span>
                <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', textDecoration: 'line-through', paddingBottom: '4px' }}>{selectedCourse.originalPrice}</span>
              </div>
              <p style={{ color: '#22c55e', fontWeight: 700, marginBottom: '24px' }}>Includes {selectedCourse.discount}</p>
              
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px', lineHeight: 2 }}>
                <li>✅ Full Classroom Access</li>
                <li>✅ Printed Hardcopy Material</li>
                <li>✅ 24/7 Doubt Forum Access</li>
                <li>✅ Free Lab Components Usage</li>
              </ul>
              
              <button className="btn-solid-lg" style={{ width: '100%', textAlign: 'center' }} onClick={() => navigateTo('enroll', selectedCourse)}>
                Proceed to Enroll
              </button>
              <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Seats are limited per batch.</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EnrollmentView = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', college: '', year: '' });
    const [submitted, setSubmitted] = useState(false);

    if (!selectedCourse) return null;

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await createEnquiry({
          name: formData.name,
          phone: formData.phone,
          courseId: String(selectedCourse.id || selectedCourse._id),
          courseName: selectedCourse.title,
          type: 'Enrollment'
        });
        setSubmitted(true);
        window.scrollTo(0, 0);
      } catch (err) {
        alert(err.message || 'Failed to submit application. Please try again.');
      }
    };

    if (submitted) {
      return (
        <div className="container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', background: 'white', padding: '50px', borderRadius: '20px', border: '1px solid var(--border)', maxWidth: '600px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
            <h2 style={{ fontSize: '2rem', fontFamily: 'Outfit', color: 'var(--primary)', marginBottom: '16px' }}>Application Received!</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '30px', lineHeight: '1.6' }}>
              Thank you, <strong>{formData.name}</strong>. Your enrollment request for <strong>{selectedCourse.title}</strong> has been successfully submitted. Our admission counselor will call you at {formData.phone} within 24 hours to complete the process.
            </p>
            <button className="btn-solid" onClick={() => navigateTo('home')}>Return to Home</button>
          </div>
        </div>
      );
    }

    return (
      <div className="container" style={{ padding: '60px 24px', minHeight: '80vh', maxWidth: '800px', margin: '0 auto' }}>
        <button className="btn-outline-sm" onClick={() => navigateTo('details', selectedCourse)} style={{ marginBottom: '30px' }}>
          ← Back to Course
        </button>
        <h1 style={{ fontSize: '2.5rem', fontFamily: 'Outfit', color: 'var(--primary)', marginBottom: '10px' }}>Enrollment Form</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '40px' }}>You are enrolling in <strong>{selectedCourse.title}</strong> at <strong>{selectedCourse.center}</strong>.</p>

        <form onSubmit={handleSubmit} style={{ background: 'white', padding: '40px', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--primary)' }}>Full Name</label>
              <input type="text" required placeholder="John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--primary)' }}>Email Address</label>
              <input type="email" required placeholder="john@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }} />
            </div>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--primary)' }}>Phone Number (WhatsApp preferred)</label>
            <input type="tel" required placeholder="+91 98765 43210" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--primary)' }}>College/University</label>
              <input type="text" required placeholder="Institute of Engineering" value={formData.college} onChange={e => setFormData({...formData, college: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--primary)' }}>Expected Graduation Year</label>
              <select required value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem', background: 'white' }}>
                <option value="">Select Year</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-solid-lg" style={{ width: '100%', textAlign: 'center' }}>
            Submit Application
          </button>
          <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>By submitting, you agree to our Terms and Conditions.</p>
        </form>
      </div>
    );
  };

  const StudyMaterialView = () => {
    const [selectedMat, setSelectedMat] = useState(null);
    const [formData, setFormData] = useState({ name: '', phone: '' });
    const [downloading, setDownloading] = useState(false);

    const handleDownloadRequest = (mat) => {
      setSelectedMat(mat);
      setDownloading(false);
      setFormData({ name: '', phone: '' });
    };

    const handleFormSubmit = async (e) => {
      e.preventDefault();
      setDownloading(true);
      try {
        await createEnquiry({
          name: formData.name,
          phone: formData.phone,
          courseName: selectedMat.title,
          type: 'StudyMaterial'
        });
        alert(`Thank you ${formData.name}! Your download for ${selectedMat.title} will begin shortly. A brochure has also been sent to ${formData.phone}.`);
        setSelectedMat(null);
      } catch (err) {
        alert(err.message || 'Failed to submit download request. Please try again.');
      } finally {
        setDownloading(false);
      }
    };

    if (selectedMat) {
      return (
        <div className="container" style={{ padding: '60px 24px', minHeight: '80vh', maxWidth: '600px', margin: '0 auto' }}>
          <button className="btn-outline-sm" onClick={() => setSelectedMat(null)} style={{ marginBottom: '30px' }}>
            ← Back to Materials
          </button>
          <h1 style={{ fontSize: '2rem', fontFamily: 'Outfit', color: 'var(--primary)', marginBottom: '10px' }}>Download Enquiry</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '30px' }}>Please provide your details to download <strong>{selectedMat.title}</strong> ({selectedMat.size}).</p>
          
          <form onSubmit={handleFormSubmit} style={{ background: 'white', padding: '40px', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--primary)' }}>Full Name</label>
              <input type="text" required placeholder="Enter your full name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }} />
            </div>
            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--primary)' }}>WhatsApp Number</label>
              <input type="tel" required placeholder="+91 98765 43210" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }} />
            </div>
            <button type="submit" className="btn-solid-lg" style={{ width: '100%', textAlign: 'center' }} disabled={downloading}>
              {downloading ? 'Preparing Download...' : 'Submit & Download'}
            </button>
          </form>
        </div>
      );
    }

    return (
      <div className="container" style={{ padding: '60px 24px', minHeight: '80vh' }}>
        <h1 style={{ fontSize: '2.5rem', fontFamily: 'Outfit', color: 'var(--primary)', marginBottom: '10px' }}>Study Material</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '40px' }}>Download free resources, previous year question papers, and cheat sheets.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {[
            { title: 'GATE 2025 Previous Papers', size: '15 MB', type: 'PDF' },
            { title: 'IoT Microcontroller Notes', size: '24 MB', type: 'ZIP' },
            { title: 'C Programming Cheat Sheet', size: '2 MB', type: 'PDF' },
            { title: 'Basic Electronics Lab Manual', size: '8 MB', type: 'PDF' }
          ].map((mat, i) => (
            <div key={i} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '2rem' }}>📄</div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)', fontFamily: 'Outfit' }}>{mat.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Format: {mat.type} • Size: {mat.size}</p>
              <button className="btn-outline-sm" style={{ marginTop: 'auto' }} onClick={() => handleDownloadRequest(mat)}>Download Now</button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ResultsView = () => (
    <div className="container" style={{ padding: '60px 24px', minHeight: '80vh' }}>
      <h1 style={{ fontSize: '2.5rem', fontFamily: 'Outfit', color: 'var(--primary)', marginBottom: '10px' }}>Our Star Performers</h1>
      <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '40px' }}>BECS Vidyapeeth students continue to dominate national engineering examinations.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
        {[
          { name: 'Aman Kumar', rank: 'AIR 42', exam: 'GATE 2024', img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80' },
          { name: 'Sneha Patel', rank: 'AIR 115', exam: 'GATE 2024', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
          { name: 'Rahul Bose', rank: 'AIR 204', exam: 'IES 2023', img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=200&q=80' },
          { name: 'Priya Singh', rank: 'Top 1%', exam: 'TCS Digital', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80' }
        ].map((student, i) => (
          <div key={i} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '30px 20px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.03)' }}>
            <img src={student.img} alt={student.name} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 20px', border: '4px solid var(--accent-soft)' }} />
            <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', fontFamily: 'Outfit', marginBottom: '8px' }}>{student.name}</h3>
            <div style={{ color: 'white', background: 'var(--accent)', padding: '4px 12px', borderRadius: '99px', display: 'inline-block', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px' }}>{student.rank}</div>
            <p style={{ color: 'var(--text-muted)' }}>{student.exam}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="app-container">
      {renderNavbar()}

      <main style={{ minHeight: '80vh' }}>
        {loading ? (
          <div className="container" style={{ display: 'grid', placeItems: 'center', padding: '100px 0' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--primary)' }}>Loading Courses...</div>
          </div>
        ) : (
          <>
            {currentView === 'home' && <HomeView />}
            {currentView === 'details' && <CourseDetailsView />}
            {currentView === 'enroll' && <EnrollmentView />}
            {currentView === 'study' && <StudyMaterialView />}
            {currentView === 'results' && <ResultsView />}
          </>
        )}
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <h2>BECS Vidyapeeth</h2>
            <p>India's leading offline coaching network for electronics and automation engineering.</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <a href="#">About Us</a>
            <a href="#">Contact Us</a>
            <a href="#">Careers</a>
            <a href="#">Terms & Conditions</a>
          </div>
          <div className="footer-links">
            <h4>Student Zone</h4>
            <a href="#">Admit Card</a>
            <a href="#">Results</a>
            <a href="#">Scholarship Test</a>
            <a href="#">Fee Structure</a>
          </div>
          <div className="footer-contact">
            <h4>Contact Info</h4>
            <p>Helpline: +91 98765 43210</p>
            <p>Email: support@becs.institute</p>
            <p>Head Office: Tech Park, Kolkata</p>
          </div>
        </div>
        <div className="container footer-bottom">
          <p>© 2026 BECS Vidyapeeth. All Rights Reserved.</p>
        </div>
      </footer>

      <a href="https://wa.me/919876543210" className="whatsapp-button" target="_blank" rel="noopener noreferrer" title="Chat with us on WhatsApp">
        <svg viewBox="0 0 32 32" className="whatsapp-icon" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.002 2.128c-7.662 0-13.886 6.224-13.886 13.886 0 2.45.64 4.838 1.84 6.942L2 30l7.242-1.898a13.81 13.81 0 006.76 1.768h.004c7.66 0 13.884-6.224 13.884-13.884 0-3.714-1.446-7.206-4.072-9.832a13.792 13.792 0 00-9.816-4.026zM16.002 25.43h-.002a11.554 11.554 0 01-5.894-1.614l-.422-.25-4.382 1.15 1.168-4.272-.274-.436A11.558 11.558 0 014.35 16.012c0-6.422 5.226-11.646 11.654-11.646 3.112 0 6.036 1.212 8.236 3.414A11.574 11.574 0 0127.656 16.014c0 6.42-5.226 11.644-11.654 11.644v-.228z" fill="#fff"/>
          <path d="M22.38 18.242c-.35-.176-2.064-1.02-2.384-1.136-.32-.118-.554-.176-.788.176-.232.35-.902 1.136-1.106 1.372-.204.234-.41.264-.76.088-.35-.176-1.472-.544-2.804-1.73-1.036-.924-1.736-2.066-1.94-2.418-.204-.352-.022-.542.152-.718.158-.158.35-.41.526-.614.174-.206.232-.352.35-.586.116-.234.058-.44-.03-.616-.088-.176-.788-1.9-1.08-2.604-.284-.686-.576-.592-.788-.602-.2-.01-.432-.012-.666-.012s-.612.088-.934.44c-.32.35-1.226 1.198-1.226 2.924s1.256 3.392 1.43 3.628c.176.234 2.474 3.776 5.992 5.296 2.502 1.082 3.402 1.166 4.67 1.01 1.054-.13 2.064-.844 2.354-1.66.29-.818.29-1.52.204-1.66-.088-.142-.322-.234-.672-.41z" fill="#fff"/>
        </svg>
      </a>
    </div>
  );
}

export default App;
