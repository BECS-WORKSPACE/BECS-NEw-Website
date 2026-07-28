import React, { useState, useEffect } from 'react';
import './index.css';
import { fetchCourses, createEnquiry } from './api';

const DEFAULT_COURSES = [
  {
    id: 1,
    title: 'Government Exam Preparation',
    target: 'SSC, Railway, Banking, WBCS, WBPSC, Police, Defence, TET, CTET',
    duration: '6 Months',
    mode: 'Online / Offline',
    center: 'All Centers',
    price: '₹5,999',
    originalPrice: '₹9,999',
    discount: '40% OFF',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    description: 'Indian government aspirants studying for SSC, Railway, Banking, WBCS, Police exams in a modern classroom setting with advanced study materials.',
    schedule: 'Morning & Evening Batches',
    faculty: 'Expert Government Officers',
    syllabus: [
      'Comprehensive Coverage of Quant & Reasoning',
      'General Awareness & Current Affairs',
      'Weekly Mock Tests',
      'Doubt Clearing Sessions'
    ],
    enrollmentFee: '₹199',
    badge: 'BESTSELLER',
    rating: 4.9,
    studentCount: '3,200',
    mentorName: 'Rajiv Sharma',
    mentorPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80',
    language: 'English, Hindi, Bengali',
    certificate: true,
    emi: true,
    seatsLeft: 12,
    startsIn: '2 Days'
  },
  {
    id: 2,
    title: 'Interview Preparation',
    target: 'Freshers, Corporate Jobs',
    duration: '30 Days',
    mode: 'Online / Offline',
    center: 'All Centers',
    price: '₹999',
    originalPrice: '₹1,999',
    discount: '50% OFF',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    description: 'Corporate interview, HR, Resume building and Mock Interview preparation.',
    schedule: 'Flexible Timings',
    faculty: 'Corporate HR Experts',
    syllabus: [
      'Resume Building',
      'LinkedIn Optimization',
      'Mock Interview',
      'Communication Skills & GD Practice'
    ],
    enrollmentFee: '₹199',
    badge: 'NEW',
    rating: 4.8,
    studentCount: '1,500',
    mentorName: 'Anita Desai',
    mentorPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80',
    language: 'English, Hindi',
    certificate: true,
    emi: false,
    seatsLeft: 25,
    startsIn: 'Next Week'
  },
  {
    id: 3,
    title: 'MAKAUT Semester Preparation',
    target: 'Engineering Students',
    duration: 'Per Semester',
    mode: 'Online / Offline',
    center: 'All Centers',
    price: '₹1,499',
    originalPrice: '₹2,499',
    discount: '40% OFF',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    description: 'Engineering students coding with laptops on campus with books.',
    schedule: 'Weekend & Evening Batches',
    faculty: 'University Faculty & Tech Experts',
    syllabus: [
      'Semester Preparation',
      'Previous Year Questions',
      'Lab Viva Preparation',
      'Notes & Assignments'
    ],
    enrollmentFee: '₹199',
    badge: 'LIVE',
    rating: 4.7,
    studentCount: '4,100',
    mentorName: 'Dr. Amit Bose',
    mentorPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
    language: 'English, Bengali',
    certificate: true,
    emi: true,
    seatsLeft: 8,
    startsIn: 'Tomorrow'
  },
  {
    id: 4,
    title: 'Board Exam Preparation',
    target: 'Class 10 & 12 Students',
    duration: 'Entire Session',
    mode: 'Online / Offline',
    center: 'All Centers',
    price: '₹1,499',
    originalPrice: '₹2,999',
    discount: '50% OFF',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    description: 'Class 10 and Class 12 students in library studying with teachers.',
    schedule: 'Regular Evening Batches',
    faculty: 'Experienced School Teachers',
    syllabus: [
      'Board Exam Suggestions',
      'Mock Tests Series',
      'Chapter Notes & Revision',
      'Expected Questions Practice'
    ],
    enrollmentFee: '₹199',
    badge: 'POPULAR',
    rating: 4.9,
    studentCount: '5,000',
    mentorName: 'Meera Sen',
    mentorPhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80',
    language: 'English, Hindi, Bengali',
    certificate: true,
    emi: true,
    seatsLeft: 15,
    startsIn: '3 Days'
  },
  {
    id: 5,
    title: 'Career Counselling',
    target: 'Students & Professionals',
    duration: 'Per Session',
    mode: 'Online / Offline',
    center: 'All Centers',
    price: '₹199',
    originalPrice: '₹499',
    discount: '60% OFF',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    description: 'Career mentor guiding students.',
    schedule: 'By Appointment',
    faculty: 'Certified Career Counsellors',
    syllabus: [
      'Career Roadmap Planning',
      'University Options Guidance',
      'Placement & Corporate Growth',
      'Personalized Assessment'
    ],
    enrollmentFee: '₹99',
    badge: '',
    rating: 4.9,
    studentCount: '1,200',
    mentorName: 'Vikram Singh',
    mentorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    language: 'English, Hindi',
    certificate: false,
    emi: false,
    seatsLeft: 5,
    startsIn: 'Available Now'
  },
  {
    id: 6,
    title: 'Psychological Counselling',
    target: 'Students & Professionals',
    duration: 'Per Session',
    mode: 'Online / Offline',
    center: 'All Centers',
    price: '₹299',
    originalPrice: '₹699',
    discount: '57% OFF',
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=800&q=80',
    description: 'Professional counsellor helping students with stress management.',
    schedule: 'By Appointment',
    faculty: 'Expert Psychologists',
    syllabus: [
      'Stress & Anxiety Management',
      'Mental Wellness',
      'Motivation & Confidence Building',
      'Exam Preparation Mentality'
    ],
    enrollmentFee: '₹99',
    badge: 'SUPPORT',
    rating: 5.0,
    studentCount: '850',
    mentorName: 'Dr. Priya Roy',
    mentorPhoto: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=100&q=80',
    language: 'English, Bengali, Hindi',
    certificate: false,
    emi: false,
    seatsLeft: 2,
    startsIn: 'Available Now'
  }
];

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'details', 'enroll'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'https://www.becsofficial.com';

  useEffect(() => {
    document.body.className = isDarkMode ? 'theme-dark' : 'theme-light';
  }, [isDarkMode]);

  useEffect(() => {
    const savedUser = localStorage.getItem('becs_user');
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch (e) { }
    }
  }, []);

  useEffect(() => {
    // Override API fetch to force displaying new BECS Udaan courses
    setCourses(DEFAULT_COURSES);
    setLoading(false);
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
      <div className="top-strip" style={{ background: 'var(--primary)', color: 'white' }}>
        <div className="marquee-container">
          <div className="marquee-content">
            <span>🎉 Enroll Now for the 2026-27 Sessions!</span>
            <span>⭐ Congratulations to our students for outstanding results!</span>
            <span>🔥 Exclusive Scholarships Available.</span>
            <span>📞 Call us at +91 98765 43210 for free counseling.</span>
          </div>
        </div>
      </div>
      <nav className="navbar">
        <div className="container navbar-inner">
          <a href="#" className="brand" onClick={(e) => handleNavClick(e, 'home')}>
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="BECS Udaan Logo" className="brand-logo" />
            <div className="brand-text-container">
              <span className="brand-text">BECS Udaan</span>
              <span className="brand-subtext">Learn • Rise • Lead</span>
            </div>
          </a>
          <div className="nav-links">
            <a href="#courses" className="nav-item" onClick={(e) => handleNavClick(e, 'home', 'courses')}>Courses</a>
            <a href="#counselling" className="nav-item" onClick={(e) => handleNavClick(e, 'home', 'counselling')}>Counselling</a>
            <a href="#memberships" className="nav-item" onClick={(e) => handleNavClick(e, 'home', 'memberships')}>Memberships</a>
            <a href="#about" className="nav-item" onClick={(e) => handleNavClick(e, 'home', 'about')}>About Us</a>
          </div>
          <div className="nav-actions">
            <button className="theme-toggle-btn" onClick={() => setIsDarkMode(!isDarkMode)} aria-label="Toggle Theme">
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <a href="#courses" className="btn-solid nav-cta">Enroll Now</a>
            <button className="hamburger-btn" onClick={() => setIsMobileMenuOpen(true)}>☰</button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <div className={`mobile-sidebar-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
      <div className={`mobile-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-sidebar-header">
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>Menu</span>
          <button className="close-btn" onClick={() => setIsMobileMenuOpen(false)}>✕</button>
        </div>
        <nav className="mobile-nav">
          <a href="#courses" onClick={(e) => { setIsMobileMenuOpen(false); handleNavClick(e, 'home', 'courses'); }}>Courses</a>
          <a href="#counselling" onClick={(e) => { setIsMobileMenuOpen(false); handleNavClick(e, 'home', 'counselling'); }}>Counselling</a>
          <a href="#memberships" onClick={(e) => { setIsMobileMenuOpen(false); handleNavClick(e, 'home', 'memberships'); }}>Memberships</a>
          <a href="#about" onClick={(e) => { setIsMobileMenuOpen(false); handleNavClick(e, 'home', 'about'); }}>About Us</a>
          <button className="btn-outline-sm" onClick={() => { setIsDarkMode(!isDarkMode); setIsMobileMenuOpen(false); }} style={{ marginTop: '10px' }}>
            Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
          </button>
          <a href={frontendUrl} onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--accent)', marginTop: '20px' }}>Back to Main Website</a>
        </nav>
      </div>
    </>
  );

  const HomeView = () => (
    <>
      <section className="hero" style={{ background: 'var(--bg)', paddingTop: '60px', paddingBottom: '60px' }}>
        <div className="container hero-inner" style={{ display: 'flex', alignItems: 'center', gap: '50px' }}>
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
            <div className="hero-features" style={{ marginTop: '30px', display: 'flex', gap: '20px', color: 'var(--text-muted)', fontWeight: 600 }}>
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

      {/* Modern Filter Section */}
      <section style={{ padding: '40px 0', borderBottom: '1px solid var(--border)', position: 'sticky', top: '70px', background: 'var(--surface-transparent)', backdropFilter: 'blur(10px)', zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input type="text" placeholder="Search courses..." style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--border)', flex: '1', minWidth: '250px', background: 'var(--surface)', color: 'var(--text)' }} />
          <select style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}>
            <option>Category filter</option>
            <option>Government Exams</option>
            <option>MAKAUT</option>
          </select>
          <select style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}>
            <option>Language filter</option>
            <option>English</option>
            <option>Hindi</option>
          </select>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="pill-button" style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', cursor: 'pointer' }}>Newest</button>
            <button className="pill-button" style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', cursor: 'pointer' }}>Popular</button>
            <button className="pill-button" style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', cursor: 'pointer' }}>Discount</button>
          </div>
        </div>
      </section>

      <section className="stats-section" style={{ background: 'var(--surface)', padding: '60px 0' }}>
        <div className="container stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px', textAlign: 'center' }}>
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
          <div className="courses-grid">
            {courses.map(course => (
              <div className="course-card" key={course.id} onClick={() => navigateTo('details', course)} style={{ cursor: 'pointer', position: 'relative' }}>
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
                      <button className="btn-outline" style={{ flex: '1', padding: '10px', fontSize: '0.9rem', textAlign: 'center' }} onClick={(e) => { e.stopPropagation(); navigateTo('details', course); }}>View Details</button>
                      <button className="btn-solid" style={{ flex: '1', padding: '10px', fontSize: '0.9rem', textAlign: 'center' }} onClick={(e) => { e.stopPropagation(); navigateTo('details', course); }}>Enroll Now</button>
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
          <h2 className="responsive-heading" style={{ marginBottom: '20px' }}>About <span className="highlight">BECS Udaan</span></h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text)', lineHeight: 1.8 }}>
            BECS Udaan is a next-generation student success platform dedicated to helping learners excel in academics, competitive examinations, university education, career development, and personal growth through technology-driven learning and expert mentorship.
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
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
          <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
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
        </div>
      </section>
    </>
  );

  const CourseDetailsView = () => {
    if (!selectedCourse) return null;
    return (
      <div className="details-view container">
        <button className="btn-outline-sm back-btn" onClick={() => navigateTo('home')}>
          ← Back to All Courses
        </button>
        <div className="details-header">
          <div className="course-tags">
            <span className="tag mode-tag">🏫 {selectedCourse.mode}</span>
            <span className="tag center-tag">📍 {selectedCourse.center}</span>
          </div>
          <h1 className="responsive-heading details-title">{selectedCourse.title}</h1>
          <p className="details-target">{selectedCourse.target}</p>
        </div>

        <div className="details-grid">
          <div className="details-main">
            <img src={selectedCourse.image} alt={selectedCourse.title} className="details-image" />

            <h2 className="responsive-heading-sm section-title">About the Program</h2>
            <p className="details-desc">{selectedCourse.description}</p>

            <h2 className="responsive-heading-sm section-title">Faculty & Schedule</h2>
            <div className="info-box">
              <p><strong>👨‍🏫 Lead Faculty:</strong> {selectedCourse.faculty}</p>
              <p className="mt-10"><strong>⏰ Schedule:</strong> {selectedCourse.schedule}</p>
              <p className="mt-10"><strong>⏳ Duration:</strong> {selectedCourse.duration}</p>
            </div>

            <h2 className="responsive-heading-sm section-title">Syllabus Highlights</h2>
            <ul className="syllabus-list">
              {selectedCourse.syllabus.map((item, index) => (
                <li key={index} style={{ marginBottom: '10px' }}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="details-sidebar">
            <div className="enroll-card">
              <h3 className="responsive-heading-sm card-title">Enrollment Details</h3>
              <div className="price-row">
                <span className="price-main">{selectedCourse.price}</span>
                <span className="price-strike">{selectedCourse.originalPrice}</span>
              </div>
              <p className="discount-text">Includes {selectedCourse.discount}</p>

              <ul className="features-list">
                <li>✅ Full Classroom Access</li>
                <li>✅ Printed Hardcopy Material</li>
                <li>✅ 24/7 Doubt Forum Access</li>
                <li>✅ Free Lab Components Usage</li>
              </ul>

              <button className="btn-solid-lg w-full" onClick={() => navigateTo('enroll', selectedCourse)}>
                Proceed to Enroll
              </button>
              <p className="seats-text">Seats are limited per batch.</p>
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
          <div style={{ textAlign: 'center', background: 'var(--surface)', padding: '50px', borderRadius: '20px', border: '1px solid var(--border)', maxWidth: '600px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
            <h2 className="responsive-heading" style={{ fontFamily: 'Outfit', color: 'var(--primary)', marginBottom: '16px' }}>Application Received!</h2>
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
        <h1 className="responsive-heading" style={{ fontFamily: 'Outfit', color: 'var(--primary)', marginBottom: '10px' }}>Enrollment Form</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '40px' }}>You are enrolling in <strong>{selectedCourse.title}</strong> at <strong>{selectedCourse.center}</strong>.</p>

        <form onSubmit={handleSubmit} className="enroll-form" style={{ background: 'var(--surface)', padding: '40px', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
          <div className="form-grid">
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--primary)' }}>Full Name</label>
              <input type="text" required placeholder="John Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--primary)' }}>Email Address</label>
              <input type="email" required placeholder="john@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }} />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--primary)' }}>Phone Number (WhatsApp preferred)</label>
            <input type="tel" required placeholder="+91 98765 43210" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }} />
          </div>

          <div className="form-grid" style={{ marginBottom: '40px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--primary)' }}>College/University</label>
              <input type="text" required placeholder="Institute of Engineering" value={formData.college} onChange={e => setFormData({ ...formData, college: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--primary)' }}>Expected Graduation Year</label>
              <select required value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem', background: 'var(--surface)' }}>
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

          <form onSubmit={handleFormSubmit} style={{ background: 'var(--surface)', padding: '40px', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--primary)' }}>Full Name</label>
              <input type="text" required placeholder="Enter your full name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }} />
            </div>
            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--primary)' }}>WhatsApp Number</label>
              <input type="tel" required placeholder="+91 98765 43210" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }} />
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
            <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
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
          <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '30px 20px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.03)' }}>
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

      <footer className="footer" style={{ background: '#111827', color: 'white', padding: '60px 0 20px 0' }}>
        <div className="container footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          <div className="footer-brand">
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '15px' }}>BECS <span style={{ color: 'var(--accent)' }}>Udaan</span></h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>India's next-generation student success platform integrating learning, mentoring, and psychological support.</p>
          </div>
          <div className="footer-links">
            <h4 style={{ color: 'white', marginBottom: '20px' }}>Quick Links</h4>
            <a href="#" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '10px', textDecoration: 'none' }}>Courses</a>
            <a href="#" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '10px', textDecoration: 'none' }}>Career</a>
            <a href="#" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '10px', textDecoration: 'none' }}>About Us</a>
            <a href="#" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '10px', textDecoration: 'none' }}>Contact</a>
          </div>
          <div className="footer-links">
            <h4 style={{ color: 'white', marginBottom: '20px' }}>Legal & Support</h4>
            <a href="#" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '10px', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '10px', textDecoration: 'none' }}>Terms of Service</a>
            <a href="#" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '10px', textDecoration: 'none' }}>Student Dashboard</a>
            <a href="#" style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '10px', textDecoration: 'none' }}>Help Center</a>
          </div>
          <div className="footer-contact">
            <h4 style={{ color: 'white', marginBottom: '20px' }}>Contact Info</h4>
            <p style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>Helpline: +91 98765 43210</p>
            <p style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>Email: support@becs.institute</p>
            <p style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>Head Office: Tech Park, Kolkata</p>
          </div>
        </div>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', borderTop: '1px solid #374151', paddingTop: '20px' }}>
          &copy; {new Date().getFullYear()} BECS Udaan. All Rights Reserved.
        </div>
      </footer>

      <a href="https://wa.me/919876543210" className="whatsapp-button" target="_blank" rel="noopener noreferrer" title="Chat with us on WhatsApp">
        <svg viewBox="0 0 32 32" className="whatsapp-icon" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.002 2.128c-7.662 0-13.886 6.224-13.886 13.886 0 2.45.64 4.838 1.84 6.942L2 30l7.242-1.898a13.81 13.81 0 006.76 1.768h.004c7.66 0 13.884-6.224 13.884-13.884 0-3.714-1.446-7.206-4.072-9.832a13.792 13.792 0 00-9.816-4.026zM16.002 25.43h-.002a11.554 11.554 0 01-5.894-1.614l-.422-.25-4.382 1.15 1.168-4.272-.274-.436A11.558 11.558 0 014.35 16.012c0-6.422 5.226-11.646 11.654-11.646 3.112 0 6.036 1.212 8.236 3.414A11.574 11.574 0 0127.656 16.014c0 6.42-5.226 11.644-11.654 11.644v-.228z" fill="#fff" />
          <path d="M22.38 18.242c-.35-.176-2.064-1.02-2.384-1.136-.32-.118-.554-.176-.788.176-.232.35-.902 1.136-1.106 1.372-.204.234-.41.264-.76.088-.35-.176-1.472-.544-2.804-1.73-1.036-.924-1.736-2.066-1.94-2.418-.204-.352-.022-.542.152-.718.158-.158.35-.41.526-.614.174-.206.232-.352.35-.586.116-.234.058-.44-.03-.616-.088-.176-.788-1.9-1.08-2.604-.284-.686-.576-.592-.788-.602-.2-.01-.432-.012-.666-.012s-.612.088-.934.44c-.32.35-1.226 1.198-1.226 2.924s1.256 3.392 1.43 3.628c.176.234 2.474 3.776 5.992 5.296 2.502 1.082 3.402 1.166 4.67 1.01 1.054-.13 2.064-.844 2.354-1.66.29-.818.29-1.52.204-1.66-.088-.142-.322-.234-.672-.41z" fill="#fff" />
        </svg>
      </a>
    </div>
  );
}

export default App;
