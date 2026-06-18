import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    rating: '(81)',
  },
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

const gallery = [
  {
    title: 'Premium Living Automation',
    className: 'gallery-large',
    image:
      'https://images.unsplash.com/photo-1558089687-f282ffcbc0d4?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Control Room Integration',
    image:
      'https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Security Deployment',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Testing Laboratory',
    image:
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Industrial Panels',
    image:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=700&q=80',
  },
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
      <header className="topbar">
        <div className="container topbar-inner">
          <a className="brand" href="#home">
            <img src="/logo.png" alt="BECS Logo" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
            <span className="brand-name">BECS</span>
          </a>

          <nav className="main-nav">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href={ecommerceUrl}>BECS Store</a>
            <a href={trainingUrl}>Vidyapeeth</a>
            <a href="#contact">Contact</a>
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
            <Link className="pill-button pill-button--solid topbar-login" to="/login">
              Login
            </Link>
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

        <section className="section-cream" id="products">
          <div className="container">
            <div className="section-split">
              <div className="section-heading section-heading--left">
                <span className="section-pill">Online Store</span>
                <h2>BECS Store</h2>
                <p>Premium electronic kits, components & smart devices.</p>
              </div>
              <a className="pill-button pill-button--ghost" href={ecommerceUrl}>
                View All Products
              </a>
            </div>

            <div className="product-grid">
              {products.map((product) => (
                <a
                  className="product-card product-card--link"
                  href={`${ecommerceUrl}/?product=${encodeURIComponent(product.name)}`}
                  key={product.name}
                >
                  {product.badge ? <span className="product-badge">{product.badge}</span> : null}
                  <span className="wish-button" aria-hidden="true">
                    o
                  </span>
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="product-rating">5/5 {product.rating}</div>
                  <h3>{product.name}</h3>
                  <p>{product.detail}</p>
                  <div className="product-footer">
                    <strong>Rs. {product.price}</strong>
                    <span className="product-footer-action">View Product</span>
                  </div>
                </a>
              ))}
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

        <section className="section-cream" id="team">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow-line">Our Leadership & Team</span>
              <h2>The Minds Behind BECS</h2>
              <p>
                A team of seasoned engineers, strategists, and innovators united by a
                shared commitment to precision, performance, and technological excellence.
              </p>
            </div>

            <div className="carousel-container">
              <div className="carousel-track" style={{ animationDuration: '45s' }}>
                {carouselTeam.map((member, index) => (
                  <article className="team-card" key={`${member.name}-${index}`}>
                    <img src={member.image} alt={member.name} />
                    <h3>{member.name}</h3>
                    <strong>{member.role}</strong>
                    <p>{member.note}</p>
                    <button type="button">in</button>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-white">
          <div className="container">
            <div className="section-heading">
              <span className="section-pill">Our Work</span>
              <h2>Project Gallery</h2>
              <p>
                A showcase of our most impactful installations and deployments across India.
              </p>
            </div>

            <div className="gallery-grid">
              {gallery.map((item) => (
                <article className={`gallery-card ${item.className || ''}`} key={item.title}>
                  <img src={item.image} alt={item.title} />
                </article>
              ))}
            </div>
          </div>
        </section>

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
