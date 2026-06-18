import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendContactMessage } from '../api';

const ecommerceUrl = import.meta.env.VITE_ECOMMERCE_URL || 'http://localhost:5174';
const trainingUrl = import.meta.env.VITE_TRAINING_URL || 'http://localhost:5176';

const stats = [
  { icon: 'yr', value: '15+', label: 'Years Experience' },
  { icon: 'cl', value: '500+', label: 'Happy Clients' },
  { icon: 'pj', value: '1.2k', label: 'Projects Completed' },
  { icon: 'ce', value: '25+', label: 'Certifications Earned' },
  { icon: 'pd', value: '10k+', label: 'Products Delivered' },
];

const services = [
  {
    icon: 'idea',
    title: 'Consultancy',
    text: 'Expert guidance on electronic architecture, component selection, and system design for maximum performance and reliability.',
    points: ['System Architecture Review', 'Component Sourcing Strategy', 'Technical Documentation'],
  },
  {
    icon: 'auto',
    title: 'Automation',
    text: 'Custom industrial and smart home automation systems built for efficiency, safety, and seamless digital integration.',
    points: ['PLC & SCADA Integration', 'Smart Building Systems', 'Process Optimization'],
  },
  {
    icon: 'supply',
    title: 'Product Supply',
    text: 'Sourcing and supplying premium-grade electronic components, kits, and turnkey solutions for any scale project.',
    points: ['Certified Components', 'Bulk & Custom Orders', 'Pan-India Delivery'],
  },
  {
    icon: 'install',
    title: 'Installation',
    text: 'On-site professional installation services ensuring systems run flawlessly from day one with full commissioning support.',
    points: ['Site Assessment', 'Certified Engineers', 'Post-Install Testing'],
  },
  {
    icon: 'maintain',
    title: 'Maintenance',
    text: 'Proactive and reactive maintenance programs keeping your electronic systems performing at peak efficiency year-round.',
    points: ['AMC Contracts', '24/7 Support', 'Preventive Audits'],
  },
  {
    icon: 'train',
    title: 'Training',
    text: 'Industry-recognized training programs on IoT, embedded systems, PCB design, and industrial automation for professionals.',
    points: ['Hands-On Workshops', 'Certified Courses', 'Corporate Programs'],
  },
];

const products = [
  {
    badge: 'New',
    image:
      'https://images.unsplash.com/photo-1558089687-f282ffcbc0d4?auto=format&fit=crop&w=600&q=80',
    name: 'Smart Switch Kit',
    detail: 'Home Automation + WiFi Enabled',
    price: '5,500',
    rating: '(48)',
  },
  {
    badge: 'Bestseller',
    image:
      'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80',
    name: 'Automation Controller',
    detail: 'Industrial Grade + Multi-Channel',
    price: '9,800',
    rating: '(92)',
  },
  {
    badge: '',
    image:
      'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
    name: 'Security Camera Set',
    detail: '4K Resolution + Night Vision',
    price: '12,500',
    rating: '(67)',
  },
  {
    badge: 'Popular',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    name: 'IoT Starter Kit',
    detail: '30+ Components + Beginner Friendly',
    price: '4,200',
    rating: '(134)',
  },
  {
    badge: '',
    image:
      'https://images.unsplash.com/photo-1563770660941-10a636076f6d?auto=format&fit=crop&w=600&q=80',
    name: 'Circuit Tools Kit',
    detail: 'Professional Grade + 25 Tools',
    price: '6,800',
    rating: '(55)',
  },
  {
    badge: 'In Stock',
    image:
      'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&w=600&q=80',
    name: 'Power Backup Module',
    detail: '2000VA + Auto Switchover',
    price: '15,000',
    rating: '(4.9)',
  },
];

const storeCategories = [
  { name: 'Electronic Components', icon: 'idea', count: '500+ Items' },
  { name: 'Automation Systems', icon: 'auto', count: '50+ Items' },
  { name: 'IoT Devices', icon: 'yr', count: '120+ Items' },
  { name: 'Smart Home Solutions', icon: 'maintain', count: '80+ Items' },
  { name: 'Educational Kits', icon: 'train', count: '35+ Items' },
  { name: 'Industrial Equipment', icon: 'install', count: '40+ Items' },
];

const storeStats = [
  { value: '100+', label: 'Products' },
  { value: '10+', label: 'Categories' },
  { value: 'Fast', label: 'Delivery' },
  { value: 'Secure', label: 'Payments' }
];

const tech = [
  ['Embedded Systems', 'Firmware & RTOS'],
  ['IoT Solutions', 'Connected Devices'],
  ['PCB Design', 'Schematic & Layout'],
  ['Smart Home', 'Home Automation'],
  ['Security Systems', 'Surveillance & CCTV'],
  ['Industrial Electronics', 'PLC & SCADA'],
  ['Renewable Energy', 'Solar & Wind'],
  ['AI & ML', 'Edge AI Systems'],
  ['Robotics', 'Autonomous Systems'],
  ['Power Electronics', 'Inverters & UPS'],
];

const team = [
  {
    name: 'Marco Barbieri',
    role: 'Chief Technology Officer',
    note: 'AI & Embedded Systems',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Sarah Chen',
    role: 'Head of Operations',
    note: 'Supply Chain Optimization',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Marcus Thorne',
    role: 'Lead Design Engineer',
    note: 'PCB Design & Prototyping',
    image:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Director of Innovation',
    note: 'IoT & Smart Automation',
    image:
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=400&q=80',
  },
];

const projects = [
  {
    id: 1,
    title: 'Smart Energy Monitoring System',
    category: 'IoT Projects',
    status: 'Completed',
    image: 'https://media.istockphoto.com/id/2193635891/photo/smart-industry-4-0-mangement-control-system-concept.jpg?s=2048x2048&w=is&k=20&c=tW54C3MnETI-QPj3DOOPjIpPQVBRpCDgOt_SFzihgdg=',
    tech: ['ESP32', 'Node.js', 'MongoDB', 'MQTT'],
    overview: 'Developed a highly scalable industrial IoT platform for real-time energy monitoring, reducing wastage and optimizing consumption patterns.',
    timeline: 'Started: Jan 2025 | Completed: May 2025',
    impact: 'Reduced energy costs by 20%. Improved anomaly detection speed by 60%.',
    gallery: ['https://media.istockphoto.com/id/2193635891/photo/smart-industry-4-0-mangement-control-system-concept.jpg?s=2048x2048&w=is&k=20&c=tW54C3MnETI-QPj3DOOPjIpPQVBRpCDgOt_SFzihgdg=']
  },
  {
    id: 2,
    title: 'Factory Process Automation',
    category: 'Automation Projects',
    status: 'Ongoing',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80',
    tech: ['PLC', 'SCADA', 'Industrial Ethernet', 'Python'],
    overview: 'Complete overhaul of legacy manufacturing lines to a fully automated system with predictive maintenance capabilities.',
    timeline: 'Status: Ongoing (Expected Q3 2026)',
    impact: 'Expected to increase production efficiency by 35% and reduce downtime by 40%.',
    gallery: []
  },
  {
    id: 3,
    title: 'Embedded Controller Platform',
    category: 'Hardware Projects',
    status: 'Completed',
    image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=900&q=80',
    tech: ['Altium', 'ARM Cortex-M', 'C++', 'FreeRTOS'],
    overview: 'Designed a custom industrial-grade PCB and firmware stack for precision motor control in harsh environments.',
    timeline: 'Started: Nov 2024 | Completed: Mar 2025',
    impact: 'Delivered a robust platform operating at 99.9% uptime under extreme conditions.',
    gallery: []
  },
  {
    id: 4,
    title: 'Fleet Monitoring Dashboard',
    category: 'Software Projects',
    status: 'Completed',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
    tech: ['React.js', 'Node.js', 'PostgreSQL', 'Google Maps API'],
    overview: 'Built a comprehensive software portal to track real-time fleet GPS data, monitor fuel consumption, and schedule maintenance.',
    timeline: 'Started: Jun 2024 | Completed: Dec 2024',
    impact: 'Reduced fleet idle time by 15% and optimized routing leading to fuel savings.',
    gallery: []
  },
  {
    id: 5,
    title: 'Smart Agriculture Sensors',
    category: 'IoT Projects',
    status: 'Completed',
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=900&q=80',
    tech: ['LoRaWAN', 'Arduino', 'AWS IoT', 'React Native'],
    overview: 'Deployed distributed soil moisture and temperature sensors across a 500-acre farm, connected via long-range wireless.',
    timeline: 'Started: Feb 2024 | Completed: Aug 2024',
    impact: 'Optimized irrigation cycles, saving 30% water and increasing crop yield.',
    gallery: []
  },
  {
    id: 6,
    title: 'Warehouse Robotics Control',
    category: 'Automation Projects',
    status: 'Ongoing',
    image: 'https://images.unsplash.com/photo-1716191299980-a6e8827ba10b?q=80&w=1225&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tech: ['ROS', 'C++', 'Computer Vision', 'Lidar'],
    overview: 'Developing navigation and coordination logic for a fleet of autonomous mobile robots in a high-density warehouse.',
    timeline: 'Status: Ongoing (Expected Q1 2027)',
    impact: 'Targeting 2x faster order fulfillment and zero collision incidents.',
    gallery: []
  },
  {
    id: 7,
    title: 'Custom Medical Device PCB',
    category: 'Hardware Projects',
    status: 'Completed',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
    tech: ['KiCad', 'Microchip PIC', 'Bluetooth LE', 'ISO 13485'],
    overview: 'Engineered a highly compact, low-power circuit board for a wearable patient monitoring device.',
    timeline: 'Started: Oct 2023 | Completed: Apr 2024',
    impact: 'Achieved 14-day battery life on a single charge while meeting strict medical certifications.',
    gallery: []
  },
  {
    id: 8,
    title: 'Inventory AI Analytics',
    category: 'Software Projects',
    status: 'Ongoing',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
    tech: ['Python', 'TensorFlow', 'Vue.js', 'Snowflake'],
    overview: 'Integrating machine learning models to predict stock shortages and automate supply chain reordering.',
    timeline: 'Status: Ongoing (Expected Dec 2026)',
    impact: 'Expected to reduce out-of-stock scenarios by 45%.',
    gallery: []
  },
  {
    id: 9,
    title: 'Smart Building HVAC Integration',
    category: 'Automation Projects',
    status: 'Completed',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80',
    tech: ['BACnet', 'Siemens Desigo', 'Node-RED', 'InfluxDB'],
    overview: 'Upgraded a commercial office tower with centralized HVAC control mapped to real-time occupancy data.',
    timeline: 'Started: Jan 2023 | Completed: Sep 2023',
    impact: 'Cut building electricity usage by 22% during off-peak hours.',
    gallery: []
  }
];

const partnerCards = [
  {
    title: 'Global Reach',
    text: "Tap into BECS's worldwide network spanning 40+ markets. Expand your business footprint and connect with new audiences across continents with ease.",
    points: ['Access to 40+ international markets', 'Co-branded marketing campaigns', 'Multilingual partner support'],
  },
  {
    title: 'Technical Support',
    text: 'Our dedicated partner success team is with you every step of the way from onboarding to integration, ensuring seamless operations at all times.',
    points: ['24/7 dedicated partner helpdesk', 'Priority API & integration access', 'Custom onboarding & training'],
    featured: true,
  },
  {
    title: 'Revenue Growth',
    text: 'Unlock competitive commission structures, co-selling incentives, and performance-based bonuses designed to accelerate your bottom line.',
    points: ['Tiered commission up to 30%', 'Performance-based bonuses', 'Real-time revenue dashboard'],
  },
];

const clientLogos = [
  ['TechCorp', 'Technology'],
  ['Global Systems', 'Infrastructure'],
  ['Innovate', 'R&D Solutions'],
  ['Nexus Electronics', 'Electronics'],
  ['Apex Solutions', 'Consulting'],
  ['Visionary AI', 'Artificial Intelligence'],
  ['OmniTech', 'Industrial'],
  ['StellarNet', 'Communications'],
];

const testimonials = [
  {
    text: 'Professional and highly skilled team. Their expertise in electronics consultancy is unmatched. Delivery was on time and beyond expectations.',
    name: 'John Doe',
    company: 'TechCorp',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
  {
    text: 'Excellent smart automation support. The team seamlessly integrated cutting-edge automation solutions into our existing infrastructure with zero downtime.',
    name: 'Sarah Miller',
    company: 'AutoSystems',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  },
  {
    text: 'Reliable consultancy and fast service. BECS understood our global requirements and delivered a comprehensive solution that transformed our operations.',
    name: 'Robert Wilson',
    company: 'Global Solutions',
    image:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
  },
  {
    text: 'Reliable consultancy and fast service. BECS understood our global requirements and delivered a comprehensive solution that transformed our operations.',
    name: 'Robert Wilson',
    company: 'Global Solutions',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
];

const Icon = ({ kind }) => <span className={`icon-mark icon-${kind}`} aria-hidden="true" />;

const repeatArray = (arr, times) => Array(times).fill(arr).flat();
const carouselServices = repeatArray(services, 4);
const carouselTeam = repeatArray(team, 6);
const carouselTestimonials = repeatArray(testimonials, 6);

const ManualCarousel = ({ children, headingTitle, headingPill, headingText, speed = 1, isTestimonial = false }) => {
  const scrollRef = React.useRef(null);
  const isPausedRef = React.useRef(false);
  const interactTimeoutRef = React.useRef(null);

  React.useEffect(() => {
    let animationFrameId;
    let pos = 0;
    
    const scrollLoop = () => {
      if (scrollRef.current && !isPausedRef.current) {
        if (pos === 0 || Math.abs(pos - scrollRef.current.scrollLeft) > 10) {
           pos = scrollRef.current.scrollLeft;
        }
        
        pos += speed;
        scrollRef.current.scrollLeft = pos;
        
        if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 20) {
           scrollRef.current.scrollLeft = 0;
           pos = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scrollLoop);
    };

    animationFrameId = requestAnimationFrame(scrollLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [speed]);

  const handleManualInteract = (offset) => {
    isPausedRef.current = true;
    if (interactTimeoutRef.current) clearTimeout(interactTimeoutRef.current);
    
    if (scrollRef.current && offset !== 0) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }

    interactTimeoutRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, 4000);
  };

  return (
    <>
      <div style={{ marginBottom: '32px' }}>
        <div className={`section-heading ${!isTestimonial ? 'section-heading--left' : ''}`} style={{ margin: 0, textAlign: 'left' }}>
          {headingPill && <span className="section-pill">{headingPill}</span>}
          <h2 style={{ marginBottom: '16px' }}>{headingTitle}</h2>
          <p style={{ margin: 0 }}>{headingText}</p>
        </div>
      </div>

      <div 
        className="carousel-container-wrapper"
        onMouseEnter={() => { isPausedRef.current = true; }}
        onMouseLeave={() => { if (!interactTimeoutRef.current) isPausedRef.current = false; }}
        onTouchStart={() => handleManualInteract(0)}
      >
        <button className="carousel-btn carousel-btn--left" onClick={() => handleManualInteract(-380)} aria-label="Previous">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        
        <div className="carousel-container-manual" ref={scrollRef}>
          <div className="carousel-track-manual">
            {children}
          </div>
        </div>

        <button className="carousel-btn carousel-btn--right" onClick={() => handleManualInteract(380)} aria-label="Next">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
    </>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState('');
  const [contactError, setContactError] = useState('');
  const [contactLoading, setContactLoading] = useState(false);
  const [serviceState, setServiceState] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeProjectCategory, setActiveProjectCategory] = useState('All');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setServiceState((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const isElecActive = serviceState === 0 || serviceState === 3;
  const isSoftActive = serviceState === 1 || serviceState === 3;
  const isMktgActive = serviceState === 2 || serviceState === 3;

  const getHubColor = () => {
    if (serviceState === 0) return '#22d3ee';
    if (serviceState === 1) return '#fb923c';
    if (serviceState === 2) return '#34d399';
    return '#c084fc';
  };

  const getHubLabel = () => {
    if (serviceState === 0) return 'IOT';
    if (serviceState === 1) return 'DEV';
    if (serviceState === 2) return 'MKTG';
    return 'UNIFIED';
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactSuccess('');
    setContactError('');
    setContactLoading(true);
    try {
      const { data } = await sendContactMessage({
        name: contactName,
        email: contactEmail,
        subject: contactSubject,
        message: contactMessage,
      });
      setContactSuccess(data.message || 'Message sent successfully!');
      setContactName('');
      setContactEmail('');
      setContactSubject('');
      setContactMessage('');
    } catch (err) {
      setContactError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setContactLoading(false);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('becs_user');
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch (e) {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('becs_user');
    setUser(null);
  };

  return (
    <div className="becs-page">
      <header className={`topbar ${isScrolled ? 'topbar--scrolled' : ''}`}>
        <div className="container topbar-inner">
          <a className="brand" href="#home">
            <img src="/logo.png" alt="BECS Logo" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
            <span className="brand-name">BECS</span>
          </a>

          <nav className="main-nav">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <div className="nav-dropdown">
              <a href="#services" style={{ cursor: 'pointer' }}>Services ▼</a>
              <div className="mega-menu">
                <a href="#services">Automation</a>
                <a href="#services">IoT Solutions</a>
                <a href="#services">Training</a>
                <a href="#services">Consultancy</a>
                <a href="#services">Product Supply</a>
              </div>
            </div>
            <div className="nav-dropdown">
              <a href={ecommerceUrl} style={{ cursor: 'pointer' }}>BECS Store ▼</a>
              <div className="mega-menu">
                <a href={ecommerceUrl}>Electronics Components</a>
                <a href={ecommerceUrl}>IoT Devices</a>
                <a href={ecommerceUrl}>Smart Automation</a>
                <a href={ecommerceUrl}>Industrial Equipment</a>
              </div>
            </div>
            <a href="#projects">Portfolio</a>
            <a href={trainingUrl}>Vidyapeeth</a>
            <a href="#contact">Contact</a>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', marginLeft: '10px' }}>🔍</button>
          </nav>

          {user ? (
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                style={{ 
                  background: 'none', border: 'none', cursor: 'pointer', 
                  display: 'flex', alignItems: 'center', gap: '8px', 
                  color: 'var(--navy)', fontWeight: 600 
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent-deep))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', border: '2px solid var(--surface)', boxShadow: '0 4px 15px rgba(255, 112, 72, 0.3)' }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </button>

              {isProfileOpen && (
                <div style={{ 
                  position: 'absolute', top: '120%', right: '0', 
                  background: 'white', borderRadius: '12px', padding: '16px', 
                  boxShadow: 'var(--shadow)', border: '1px solid var(--line)', 
                  minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 100 
                }}>
                  <div style={{ borderBottom: '1px solid var(--line)', paddingBottom: '12px', marginBottom: '4px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text)' }}>{user.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{user.email || 'user@becs.com'}</div>
                  </div>
                  
                  {user.isAdmin && (
                    <Link to="/admin" style={{ display: 'block', padding: '10px 12px', background: 'var(--surface-soft)', borderRadius: '8px', color: 'var(--navy)', fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}>
                      Admin Panel
                    </Link>
                  )}
                  
                  <button onClick={handleLogout} style={{ width: '100%', padding: '10px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', transition: '0.2s' }}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="topbar-login">
              <button className="pill-button pill-button--ghost" onClick={() => navigate('/login')}>
                Client Portal
              </button>
            </div>
          )}
        </div>
      </header>

      <main>
        <section className="hero-section" id="home">
          <div className="container hero-grid">
            <div className="hero-copy fade-in-up">
              <span className="section-pill">Enterprise Technology Partner</span>
              <h1>
                Engineering Smart Electronics, <br />
                Automation & Digital Solutions <br />
                <span>for Modern Businesses.</span>
              </h1>
              <p>
                BECS delivers professional electronics solutions, industrial automation, IoT systems, embedded technologies, digital platforms, and educational initiatives that help businesses, institutions, and individuals innovate faster.
              </p>

              <div className="hero-actions">
                <a className="pill-button pill-button--solid" href="#services">
                  Explore Services
                </a>
                <a className="pill-button pill-button--ghost" href={ecommerceUrl}>
                  Visit BECS Store
                </a>
                <a className="pill-button pill-button--ghost" href="#contact" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                  Contact Us
                </a>
              </div>

              <div className="hero-trust-metrics">
                <div className="trust-item"><span className="trust-check">✓</span> Electronics Solutions</div>
                <div className="trust-item"><span className="trust-check">✓</span> Automation Projects</div>
                <div className="trust-item"><span className="trust-check">✓</span> Educational Programs</div>
                <div className="trust-item"><span className="trust-check">✓</span> E-Commerce Platform</div>
              </div>
            </div>

            <div className="hero-visual fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="hero-collage">
                <div className="collage-img collage-img-1">
                  <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80" alt="PCB Design" />
                </div>
                <div className="collage-img collage-img-2">
                  <img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80" alt="Industrial Automation" />
                </div>
                <div className="collage-img collage-img-3">
                  <img src="https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=600&q=80" alt="Electronics Component" />
                </div>
                <div className="collage-img collage-img-4">
                  <img src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80" alt="IoT Device" />
                </div>
              </div>
            </div>
          </div>

          <div className="container fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="hero-statistics">
              <div className="stat-box">
                <strong>100+</strong>
                <span>Products</span>
              </div>
              <div className="stat-box">
                <strong>10+</strong>
                <span>Services</span>
              </div>
              <div className="stat-box">
                <strong>24/7</strong>
                <span>Support</span>
              </div>
              <div className="stat-box">
                <strong>99%</strong>
                <span>Customer Satisfaction</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section-cream" id="about">
          <div className="container">
            <div className="section-heading">
              <span className="section-pill section-pill--outlined">About BECS</span>
              <h2>Trusted by Industry Leaders</h2>
              <p>
                Banerjee Electronics Consultancy Services has been at the forefront
                of electronic innovation, delivering world-class solutions for over a decade.
              </p>
            </div>

            <div className="stats-grid">
              {stats.map((item) => (
                <article className="stat-card" key={item.label}>
                  <div className="soft-icon">
                    <Icon kind={item.icon} />
                  </div>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="quote-section">
          <div className="container quote-card">
            <span className="quote-mark">"</span>
            <h2>Excellence in electronics starts with innovation and education.</h2>
            <div className="quote-author">
              <img
                src="/ceo.jpg"
                alt="Mr. Banerjee"
              />
              <div>
                <strong>Mr. Banerjee</strong>
                <span>CEO, BECS</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section-white" id="services">
          <div className="container">
            <ManualCarousel 
              headingPill="What We Offer"
              headingTitle="Our Services"
              headingText="End-to-end electronic solutions tailored to your industry needs from initial concept to full deployment."
              speed={1.2}
            >
              {carouselServices.map((service, index) => {
                const isTraining = service.title === 'Training';
                return (
                  <article className="service-card" key={`${service.title}-${index}`}>
                    <div className="service-icon">
                      <Icon kind={service.icon} />
                    </div>
                    <h3>{service.title}</h3>
                    <p>{service.text}</p>
                    <ul>
                      {service.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                    <a
                      href={isTraining ? trainingUrl : "#contact"}
                      target={isTraining ? "_blank" : undefined}
                      rel={isTraining ? "noopener noreferrer" : undefined}
                    >
                      {isTraining ? 'Explore Courses' : 'Learn More'}
                    </a>
                  </article>
                );
              })}
            </ManualCarousel>
          </div>
        </section>

        <section className="section-cream store-showcase-section" id="products">
          <div className="container">
            <div className="store-showcase-grid">
              
              <div className="store-showcase-content">
                <span className="section-pill">Online Store</span>
                <h2>BECS Store</h2>
                <h3 className="store-highlight-text">
                  Premium Electronics,<br/>
                  IoT Devices,<br/>
                  Automation Components,<br/>
                  Smart Kits &<br/>
                  Professional Hardware.
                </h3>
                <p className="store-desc">
                  Discover a curated collection of industry-grade electronic components and kits designed for professionals, educators, and hobbyists alike.
                </p>

                <div className="store-stats-row">
                  {storeStats.map((stat, idx) => (
                    <div key={idx} className="store-stat-item">
                      <strong>{stat.value}</strong>
                      <span>{stat.label}</span>
                    </div>
                  ))}
                </div>

                <div className="store-cta-group">
                  <button 
                    className="pill-button" 
                    onClick={() => {
                      if (user) {
                        window.location.href = ecommerceUrl;
                      } else {
                        navigate('/login');
                      }
                    }}
                  >
                    Explore Store
                  </button>
                  <a href={ecommerceUrl} className="pill-button pill-button--ghost">
                    View Categories
                  </a>
                </div>
              </div>

              <div className="store-featured-products">
                {/* Product 1 */}
                <a href={ecommerceUrl} className="store-featured-card">
                  <div className="featured-img-wrapper">
                    <img src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80" alt="Industrial Automation Kit" />
                  </div>
                  <div className="featured-info">
                    <span className="featured-badge">Best Seller</span>
                    <h4>Industrial Automation Kit</h4>
                    <div className="featured-price">₹12,999</div>
                  </div>
                </a>

                {/* Product 2 */}
                <a href={ecommerceUrl} className="store-featured-card">
                  <div className="featured-img-wrapper">
                    <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80" alt="Smart IoT Controller" />
                  </div>
                  <div className="featured-info">
                    <span className="featured-badge" style={{ background: 'rgba(249, 115, 22, 0.1)', color: '#f97316' }}>Trending</span>
                    <h4>Smart IoT Controller</h4>
                    <div className="featured-price">₹7,999</div>
                  </div>
                </a>

                {/* Product 3 */}
                <a href={ecommerceUrl} className="store-featured-card">
                  <div className="featured-img-wrapper">
                    <img src="https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=600&q=80" alt="Embedded Development Board" />
                  </div>
                  <div className="featured-info">
                    <span className="featured-badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>New Arrival</span>
                    <h4>Embedded Development Board</h4>
                    <div className="featured-price">₹4,999</div>
                  </div>
                </a>
              </div>

            </div>

            <div className="store-bottom-section">
              <h4>Browse by Category</h4>
              <div className="store-mini-categories">
                {storeCategories.map((cat, idx) => (
                  <div key={idx} className="mini-category-card" onClick={() => window.location.href = ecommerceUrl}>
                    {cat.name}
                  </div>
                ))}
              </div>
              <div className="store-final-cta">
                <h3>Explore 100+ Electronics Products</h3>
                <button 
                  className="pill-button"
                  onClick={() => {
                    if (user) {
                      window.location.href = ecommerceUrl;
                    } else {
                      navigate('/login');
                    }
                  }}
                >
                  Visit BECS Store →
                </button>
              </div>
            </div>

          </div>
        </section>

        <section className="section-white">
          <div className="container">
            <div className="section-heading">
              <span className="section-pill">Expertise</span>
              <h2>Technology We Master</h2>
              <p>
                Cutting-edge domains where our engineers deliver world-class results and
                innovative solutions.
              </p>
            </div>

            <div className="tech-grid">
              {tech.map(([title, subtitle], index) => (
                <article className="tech-card" key={title}>
                  <div className="soft-icon">
                    <Icon kind={`tech-${(index % 5) + 1}`} />
                  </div>
                  <h3>{title}</h3>
                  <span>{subtitle}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-cream" id="testimonials">
          <div className="container">
            <ManualCarousel
              headingPill="Testimonials"
              headingTitle="What Our Clients Say"
              headingText="Trusted by businesses, institutions, and innovators across the industry for delivering reliable and cutting-edge automation solutions."
              isTestimonial={true}
              speed={0.5}
            >
              {carouselTestimonials.map((t, idx) => (
                <article key={idx} style={{ 
                  minWidth: '350px', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', 
                  border: '1px solid rgba(255,255,255,0.4)', borderRadius: '16px', padding: '30px', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img src={t.image} alt={t.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--navy)' }}>{t.name}</h4>
                      <span style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 600 }}>{t.company}</span>
                    </div>
                  </div>
                  <div style={{ color: '#f59e0b', fontSize: '1.2rem', letterSpacing: '2px' }}>★★★★★</div>
                  <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.6, color: '#334155', fontStyle: 'italic' }}>"{t.text}"</p>
                  <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                     <span style={{ background: '#d1fae5', color: '#065f46', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>✓ Verified Client</span>
                  </div>
                </article>
              ))}
            </ManualCarousel>
          </div>
        </section>

        <section className="section-white" id="projects">
          <div className="container">
            <div className="section-heading">
              <span className="section-pill">Our Work</span>
              <h2>BECS Project Portfolio</h2>
              <p>Explore our recent and ongoing deployments across IoT, Automation, Hardware, and Software.</p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '40px' }}>
              {['All', 'IoT Projects', 'Automation Projects', 'Hardware Projects', 'Software Projects'].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setActiveProjectCategory(cat)}
                  style={{ 
                    padding: '8px 20px', borderRadius: '30px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.3s',
                    background: activeProjectCategory === cat ? 'var(--accent)' : '#f8fafc',
                    color: activeProjectCategory === cat ? '#fff' : 'var(--navy)',
                    border: `1px solid ${activeProjectCategory === cat ? 'var(--accent)' : 'var(--line)'}`
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
              {projects.filter(p => activeProjectCategory === 'All' || p.category === activeProjectCategory).map((project) => (
                <article key={project.id} onClick={() => setSelectedProject(project)} style={{ 
                  background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--line)', 
                  cursor: 'pointer', transition: 'transform 0.3s, box-shadow 0.3s', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' 
                }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'; }}>
                  <div style={{ position: 'relative', height: '200px' }}>
                    <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ 
                      position: 'absolute', top: '16px', right: '16px', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700,
                      background: project.status === 'Completed' ? '#10b981' : '#3b82f6', color: '#fff'
                    }}>{project.status}</span>
                  </div>
                  <div style={{ padding: '24px' }}>
                    <span style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{project.category}</span>
                    <h3 style={{ margin: '8px 0 16px', fontSize: '1.3rem', color: 'var(--navy)' }}>{project.title}</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {project.tech.map(t => <span key={t} style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>{t}</span>)}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Project Modal */}
        {selectedProject && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
              <button onClick={() => setSelectedProject(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: '#f1f5f9', border: 'none', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem', zIndex: 10 }}>✕</button>
              
              <div style={{ height: '300px', width: '100%' }}>
                <img src={selectedProject.image} alt={selectedProject.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              
              <div style={{ padding: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase' }}>{selectedProject.category}</span>
                  <span style={{ background: selectedProject.status === 'Completed' ? '#d1fae5' : '#dbeafe', color: selectedProject.status === 'Completed' ? '#065f46' : '#1e40af', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>{selectedProject.status}</span>
                </div>
                
                <h2 style={{ fontSize: '2.5rem', marginBottom: '24px', color: 'var(--navy)' }}>{selectedProject.title}</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px', '@media (min-width: 768px)': { gridTemplateColumns: '2fr 1fr' } }}>
                  <div>
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Project Overview</h4>
                    <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '24px' }}>{selectedProject.overview}</p>
                    
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Business Impact</h4>
                    <p style={{ color: '#475569', lineHeight: 1.7, background: '#f8fafc', padding: '16px', borderRadius: '12px', borderLeft: '4px solid var(--accent)' }}>{selectedProject.impact}</p>
                  </div>
                  
                  <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px' }}>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--line)' }}>Technologies Used</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {selectedProject.tech.map(t => <li key={t} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#334155' }}><span style={{ color: 'var(--accent)' }}>⚡</span> {t}</li>)}
                    </ul>
                    
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--line)' }}>Timeline</h4>
                    <p style={{ fontWeight: 600, color: '#334155', margin: 0 }}>{selectedProject.timeline}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <section className="section-cream section-cream--partner">
          <div className="container partner-wrap">
            <div className="section-heading">
              <span className="section-pill">Partnerships</span>
              <h2>
                Partner with <span>BECS</span>
              </h2>
              <p>
                Join a growing ecosystem of forward-thinking businesses. Together, we create
                lasting value expanding your reach, accelerating growth, and building the
                future of premium services.
              </p>
            </div>

            <div className="partner-grid">
              {partnerCards.map((card) => (
                <article
                  className={`partner-card ${card.featured ? 'partner-card--featured' : ''}`}
                  key={card.title}
                >
                  {card.featured ? <span className="partner-tag">Most Popular</span> : null}
                  <div className="soft-icon">
                    <Icon kind={card.featured ? 'support' : card.title === 'Global Reach' ? 'global' : 'growth'} />
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                  <ul>
                    {card.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className="partner-metrics">
              <div>
                <strong>500+</strong>
                <span>Active Partners</span>
              </div>
              <div>
                <strong>40+</strong>
                <span>Countries Covered</span>
              </div>
              <div>
                <strong>$2B+</strong>
                <span>Partner Revenue Generated</span>
              </div>
              <div>
                <strong>98%</strong>
                <span>Partner Satisfaction Rate</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>Dedicated Support</span>
              </div>
            </div>

            <div className="partner-cta">
              <p>Ready to grow together? Join hundreds of partners already thriving with BECS Premium.</p>
              <div className="partner-buttons">
                <a className="pill-button pill-button--solid" href="#contact">
                  Become a Partner
                </a>
                <a className="pill-button pill-button--ghost" href="#clients">
                  Watch Partner Story
                </a>
              </div>
              <div className="joined-note">
                <div className="joined-dots">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <span>Joined by 500+ partners worldwide</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section-white" id="clients">
          <div className="container">
            <div className="section-heading">
              <span className="section-pill">Our Clients</span>
              <h2>Trusted by Industry Leaders</h2>
              <p>
                We are proud to collaborate with forward-thinking organizations across the globe,
                delivering premium electronic solutions that drive innovation.
              </p>
            </div>

            <div className="client-divider" />

            <div className="client-grid">
              {clientLogos.map(([name, category], index) => (
                <article className="client-card" key={name}>
                  <div className={`client-logo client-logo--${(index % 8) + 1}`}>{name.slice(0, 1)}</div>
                  <h3>{name}</h3>
                  <span>{category}</span>
                </article>
              ))}
            </div>

            <div className="client-metrics">
              <div>
                <strong>200+</strong>
                <span>Global Clients</span>
              </div>
              <div>
                <strong>15+</strong>
                <span>Countries Served</span>
              </div>
              <div>
                <strong>98%</strong>
                <span>Client Satisfaction</span>
              </div>
              <div>
                <strong>10+</strong>
                <span>Years of Trust</span>
              </div>
              <div>
                <strong>500+</strong>
                <span>Projects Delivered</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section-cream testimonials-section">
          <div className="container">
            <ManualCarousel 
              headingTitle="What Our Clients Say"
              headingText="Trusted by industry leaders and innovative companies here's what our clients have to say about working with us."
              speed={1.2}
              isTestimonial={true}
            >
              {carouselTestimonials.map((item, index) => (
                <article className="testimonial-card" key={`${item.name}-${index}`}>
                  <span className="quote-glyph">"</span>
                  <div className="testimonial-stars">5/5</div>
                  <p>{item.text}</p>
                  <div className="testimonial-person">
                    <img src={item.image} alt={item.name} />
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.company}</span>
                    </div>
                  </div>
                </article>
              ))}
            </ManualCarousel>
          </div>
        </section>
      </main>

      <footer className="footer" id="contact">
        <div className="container footer-top">
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
              <img src="/logo.png" alt="BECS Logo" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
              <h2 style={{ margin: 0, color: '#fff' }}>BECS.</h2>
            </div>
            <p>
              Banerjee Electronics Consultancy Services. Your trusted partner for
              innovative electronic solutions, automation, and premium tech supply.
            </p>
            <ul>
              <li>Tech Park, Sector 5, Kolkata, India</li>
              <li>contact@becs.com</li>
              <li>+91 98765 43210</li>
            </ul>
          </div>

          <form className="contact-form" onSubmit={handleContactSubmit}>
            <h3>Contact Us</h3>
            {contactSuccess && (
              <div style={{ background: '#d1fae5', color: '#065f46', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem', fontWeight: 600 }}>
                {contactSuccess}
              </div>
            )}
            {contactError && (
              <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem', fontWeight: 600 }}>
                {contactError}
              </div>
            )}
            <div className="form-row">
              <input
                type="text"
                placeholder="Name"
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                required
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              value={contactSubject}
              onChange={e => setContactSubject(e.target.value)}
            />
            <textarea
              rows="5"
              placeholder="Message"
              value={contactMessage}
              onChange={e => setContactMessage(e.target.value)}
              required
            />
            <button type="submit" disabled={contactLoading}>
              {contactLoading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        <div className="container footer-bottom">
          <span>(c) 2026 BECS. All rights reserved.</span>
          <div className="socials">
            <a href="#contact">in</a>
            <a href="#contact">tw</a>
            <a href="#contact">fb</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
