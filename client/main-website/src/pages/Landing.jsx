import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendContactMessage } from '../api';
import toast from 'react-hot-toast';

const rawEcommerceUrl = import.meta.env.VITE_ECOMMERCE_URL || 'https://store.becsofficial.com';
const ecommerceUrl = rawEcommerceUrl.endsWith('/') ? rawEcommerceUrl.slice(0, -1) : rawEcommerceUrl;
const trainingUrl = import.meta.env.VITE_TRAINING_URL || 'https://vidyapeeth.becsofficial.com';

const stats = [
  { icon: 'yr', value: '1', label: 'Years Experience' },
  { icon: 'cl', value: '10+', label: 'Happy Clients' },
  { icon: 'pj', value: '15+', label: 'Projects Completed' },
  { icon: 'ce', value: '10+', label: 'Certifications Earned' },
  { icon: 'pd', value: '15+',label: 'Products Delivered' },
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
  { value: '7', label: 'Products' },
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

export const projects = [
  {
    id: 13,
    title: 'MonitorFlow: Complete HRMS & Payroll',
    category: 'Software Projects',
    status: 'Completed',
    image: '/monitorflow.png',
    tech: ['HRMS', 'Payroll', 'Data Analytics', 'Web Platform'],
    overview: 'MonitorFlow is a powerful, comprehensive Employee Tracking and Human Resource Management Solution. It provides a centralized, modern dashboard to effortlessly track employee presence, monitor productivity trends, and manage an end-to-end automated payroll system.',
    timeline: 'Status: Completed',
    impact: 'Dramatically reduces administrative overhead by automating complex HR tasks. It seamlessly calculates taxes, manages benefits, processes real-time leave requests, and generates dynamic department-wide performance analytics for modern enterprises.',
    gallery: []
  },
  {
    id: 14,
    title: 'VisionGuard AI: Intelligent Surveillance',
    category: 'Hardware & Automation',
    status: 'Completed',
    image: '/visionguard.png',
    tech: ['Facial Recognition', 'Object Detection', 'Thermal Imaging', 'AI Analytics'],
    overview: 'An advanced AI-powered security surveillance command center designed for absolute situational awareness. VisionGuard utilizes cutting-edge computer vision to provide real-time facial recognition, precise human and object detection, and dynamic zone-wise tracking.',
    timeline: 'Status: Completed',
    impact: 'Proactively secures large-scale infrastructure by integrating thermal imaging and early-warning fire & gas detection systems. It instantly maps critical threats on a centralized dashboard, drastically reducing response times for security personnel.',
    gallery: []
  },
  {
    id: 1,
    title: 'Smart USB Hub',
    category: 'Hardware & Automation',
    status: 'Completed',
    image: 'https://kritconsultancy.com/img/smart-usb-hub.jpeg',
    tech: ['Hardware', 'IoT', 'API', 'Automation'],
    overview: 'Our Smart USB Hub is an intelligent device designed to simplify and optimize the management of multiple USB-connected devices from a single platform. Unlike conventional USB hubs, it enables users to individually monitor and control each USB port, allowing devices to be switched ON or OFF remotely or automatically based on predefined conditions.',
    timeline: 'Status: Completed',
    impact: 'Individual port switching via scheduling, API, or dashboard. Real-time overload protection and energy-saving automation. Secure and encrypted data transfer for labs, offices, and smart workspaces. Seamless driver integration with Windows, Linux, and custom IoT platforms.',
    gallery: ['https://kritconsultancy.com/img/smart-usb-hub.jpeg']
  },
  {
    id: 2,
    title: 'Smart Holder',
    category: 'Energy Optimization',
    status: 'Completed',
    image: 'https://kritconsultancy.com/img/smart-holder.jpg',
    tech: ['Motion Sensing', 'Hardware', 'Automation'],
    overview: 'Smart Holder is an intelligent automation device that allows you to control electrical appliances with a preset time delay. Built with precision technology, it combines a digital display with motion sensing to deliver efficiency, safety, and convenience for homes, offices, and industrial applications.',
    timeline: 'Status: Completed',
    impact: 'Built-in motion sensor with digital display countdown. Adjustable time delay settings to prevent unnecessary electricity consumption. Hands-free controls ideal for staircases, corridors, and security perimeters. Robust and safety-compliant design that plugs into standard fixtures.',
    gallery: ['https://kritconsultancy.com/img/smart-holder.jpg']
  },
  {
    id: 3,
    title: 'Anti-Theft Alarm & Notification System',
    category: 'Environmental Security',
    status: 'Completed',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80',
    tech: ['Sensors', 'Real-time Alerts', 'Low Power IoT'],
    overview: 'An intelligent anti-theft solution designed to safeguard trees from illegal cutting and theft. It detects unauthorized movement or tampering in real-time and instantly alerts through notifications, ensuring quick action and effective protection of valuable green assets.',
    timeline: 'Status: Completed',
    impact: 'Real-time motion detection algorithms to minimize false alarms. Low power consumption technology with prolonged battery backup. Instantly fires app notifications and alarm sounds upon tampering detection. Easy installation in private plantations, public parks, or dense forests.',
    gallery: []
  },
  {
    id: 4,
    title: 'Fleet & Asset Tracking Platform',
    category: 'Software Projects',
    status: 'Completed',
    image: '/fleet_tracking.png',
    tech: ['GPS Tracking', 'Analytics', 'Web Platform'],
    overview: 'A robust digital platform designed to provide real-time location tracking and performance analytics for fleets and high-value assets across global logistics networks.',
    timeline: 'Status: Completed',
    impact: 'Enhances operational visibility and reduces downtime, saving costs and streamlining supply chain operations.',
    gallery: []
  },
  {
    id: 5,
    title: 'Sentinel Vision Security',
    category: 'Hardware & Automation',
    status: 'Completed',
    image: '/cctv_surveillance.png',
    tech: ['CCTV', 'Computer Vision', 'Security'],
    overview: 'An advanced CCTV surveillance ecosystem that leverages AI-driven monitoring to detect anomalies and secure premises 24/7.',
    timeline: 'Status: Completed',
    impact: 'Provides unparalleled security with instant threat notifications, significantly reducing security breaches.',
    gallery: []
  },
  {
    id: 6,
    title: 'ConnectPro Unified Communications',
    category: 'Software Projects',
    status: 'Ongoing',
    image: '/video_calling.png',
    tech: ['WebRTC', 'VoIP', 'Mobile App'],
    overview: 'A seamless, enterprise-grade video and voice calling application designed to connect distributed teams with crystal-clear audio and high-definition video.',
    timeline: 'Status: Ongoing',
    impact: 'Boosts team productivity and collaboration by providing reliable global communication channels.',
    gallery: []
  },
  {
    id: 7,
    title: 'VitalCare Telehealth Solutions',
    category: 'Software Projects',
    status: 'Completed',
    image: '/telemedicine.png',
    tech: ['Telemedicine', 'Healthcare API', 'Data Security'],
    overview: 'A comprehensive virtual care platform bridging the gap between doctors and patients through secure video consultations and real-time health analytics.',
    timeline: 'Status: Completed',
    impact: 'Expands healthcare accessibility and improves patient outcomes through continuous remote monitoring.',
    gallery: []
  },
  {
    id: 8,
    title: 'Industrial IoT Automation Suite',
    category: 'IoT Projects',
    status: 'Ongoing',
    image: '/iot_automation.png',
    tech: ['SCADA', 'Robotics', 'Sensors'],
    overview: 'A next-generation automation system designed to modernize manufacturing facilities by integrating robotic workflows with data-driven decision engines.',
    timeline: 'Status: Ongoing',
    impact: 'Optimizes factory floor efficiency by 40% and drastically reduces manual operational errors.',
    gallery: []
  },
  {
    id: 9,
    title: 'Academic Capstone Kits',
    category: 'Hardware Projects',
    status: 'Completed',
    image: '/capstone_kit.png',
    tech: ['Microcontrollers', 'Sensors', 'Educational Kits'],
    overview: 'Ready-to-use, comprehensive electronics kits tailored for engineering students to build, test, and present complex capstone projects with ease.',
    timeline: 'Status: Completed',
    impact: 'Empowers students with practical, hands-on learning experiences and accelerates their entry into the engineering industry.',
    gallery: []
  },
  {
    id: 10,
    title: 'GeoTrace Market Analytics',
    category: 'Software Projects',
    status: 'Completed',
    image: '/market_tracking.png',
    tech: ['Data Analytics', 'Geospatial Mapping', 'Big Data'],
    overview: 'A powerful market tracking software that aggregates spatial data and consumer trends into actionable insights through an intuitive 3D dashboard.',
    timeline: 'Status: Completed',
    impact: 'Enables businesses to make data-driven expansion decisions and pinpoint high-value market segments.',
    gallery: []
  },
  {
    id: 11,
    title: 'TalentConnect Staffing Portal',
    category: 'Software Projects',
    status: 'Ongoing',
    image: '/staffing_portal.png',
    tech: ['HR Tech', 'Machine Learning', 'Web App'],
    overview: 'An AI-powered recruitment platform that streamlines candidate sourcing, screening, and placement for modern enterprises.',
    timeline: 'Status: Ongoing',
    impact: 'Reduces time-to-hire by 50% and improves candidate quality match through algorithmic assessment.',
    gallery: []
  },
  {
    id: 12,
    title: 'Elevate Digital Marketing',
    category: 'Software Projects',
    status: 'Completed',
    image: '/digital_marketing.png',
    tech: ['SEO', 'Analytics', 'Marketing'],
    overview: 'A unified analytics dashboard that provides deep insights into campaign performance, SEO rankings, and social media growth metrics.',
    timeline: 'Status: Completed',
    impact: 'Maximizes ROI on marketing spend by highlighting the most effective digital channels and strategies.',
    gallery: []
  },
  {
    id: 13,
    title: 'Enterprise Resource Planner (ERP)',
    category: 'Software Projects',
    status: 'Completed',
    image: '/erp_system.png',
    tech: ['ERP', 'Finance', 'Supply Chain'],
    overview: 'A centralized enterprise management system integrating finance, human resources, and supply chain logistics into a single source of truth.',
    timeline: 'Status: Completed',
    impact: 'Eliminates data silos, ensuring seamless cross-departmental coordination and significantly boosting operational agility.',
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
    text: 'BECS transformed our manufacturing unit with their robust industrial automation solutions. The team is incredibly knowledgeable and delivered the project well ahead of schedule.',
    name: 'Rajesh Sharma',
    company: 'InnovateTech India',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    text: 'We have partnered with BECS for sourcing IoT components for our smart home projects. Their product quality and dedicated support are truly exceptional and unmatched.',
    name: 'Priya Desai',
    company: 'SmartHomes Bangalore',
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  },
  {
    text: 'The custom PCB design services provided by BECS helped us launch our latest medical device smoothly. Their attention to detail and strict adherence to compliance is phenomenal.',
    name: 'Amit Patel',
    company: 'Vidyut Controls',
    image:
      'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=200&q=80',
  },
  {
    text: 'BECS’s smart agriculture sensors gave us real-time data accuracy that completely optimized our farming operations. I highly recommend their expertise in IoT solutions.',
    name: 'Sneha Reddy',
    company: 'AgriTech Solutions',
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
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

const AutoCarousel = ({ children, speed = 1, alwaysScroll = false, showArrows = false }) => {
  const scrollRef = React.useRef(null);
  const isPausedRef = React.useRef(false);
  
  const childrenArray = React.Children.toArray(children);
  const shouldScroll = alwaysScroll || childrenArray.length >= 4;

  React.useEffect(() => {
    if (!shouldScroll) return;

    let animationFrameId;
    let pos = 0;
    
    const scrollLoop = () => {
      if (scrollRef.current && !isPausedRef.current) {
        if (pos === 0 || Math.abs(pos - scrollRef.current.scrollLeft) > 10) {
           pos = scrollRef.current.scrollLeft;
        }
        
        pos += speed;
        scrollRef.current.scrollLeft = pos;
        
        if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth / 2) {
           scrollRef.current.scrollLeft = 0;
           pos = 0;
        }
      } else if (scrollRef.current && isPausedRef.current) {
        pos = scrollRef.current.scrollLeft;
      }
      animationFrameId = requestAnimationFrame(scrollLoop);
    };

    animationFrameId = requestAnimationFrame(scrollLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [speed, shouldScroll]);

  const handleManualScroll = (dir) => {
    if (scrollRef.current) {
      isPausedRef.current = true;
      const scrollAmount = window.innerWidth < 768 ? 280 : 350;
      const newPos = scrollRef.current.scrollLeft + (dir === 'left' ? -scrollAmount : scrollAmount);
      scrollRef.current.scrollTo({ left: newPos, behavior: 'smooth' });
      
      setTimeout(() => {
        isPausedRef.current = false;
      }, 3000);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', padding: showArrows ? '0 60px' : '0' }}>
      {showArrows && shouldScroll && (
        <>
          <button 
            onClick={() => handleManualScroll('left')} 
            onMouseEnter={() => { isPausedRef.current = true; }}
            style={{ position: 'absolute', left: '0px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: '#fff', border: '1px solid var(--border)', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.15)', color: 'var(--navy)', fontSize: '1.2rem', transition: 'all 0.3s' }}
          >❮</button>
          <button 
            onClick={() => handleManualScroll('right')} 
            onMouseEnter={() => { isPausedRef.current = true; }}
            style={{ position: 'absolute', right: '0px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: '#fff', border: '1px solid var(--border)', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.15)', color: 'var(--navy)', fontSize: '1.2rem', transition: 'all 0.3s' }}
          >❯</button>
        </>
      )}
      <div 
        style={{ overflow: shouldScroll ? 'hidden' : 'auto', display: 'flex', width: '100%', borderRadius: '16px' }}
        ref={scrollRef}
        onMouseEnter={() => { isPausedRef.current = true; }}
        onMouseLeave={() => { isPausedRef.current = false; }}
      >
        <div style={{ display: 'flex', gap: '20px', padding: '10px', margin: shouldScroll ? '0' : '0 auto' }}>
          {children}
          {shouldScroll && children}
        </div>
      </div>
    </div>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
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
    setContactLoading(true);

    const submitPromise = sendContactMessage({
      name: contactName,
      email: contactEmail,
      subject: contactSubject,
      message: contactMessage,
    });

    toast.promise(
      submitPromise,
      {
        loading: 'Sending message...',
        success: (data) => {
          setContactName('');
          setContactEmail('');
          setContactSubject('');
          setContactMessage('');
          setContactLoading(false);
          return data.data?.message || 'Message sent successfully!';
        },
        error: (err) => {
          setContactLoading(false);
          return err.response?.data?.message || 'Failed to send message. Please try again.';
        },
      }
    );
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
            <img src="/logo.png" alt="BECS Logo" style={{ width: '56px', height: '56px', objectFit: 'contain', borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <span className="brand-name">BECS</span>
          </a>

          <nav className="main-nav">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#products">BECS Store</a>
            <div className="nav-dropdown-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
              <a href="#partners" className="nav-item-dropdown" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Partners</a>
              <div className="mega-dropdown" style={{ 
                position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', 
                background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(16px)', 
                borderRadius: '18px', padding: '24px', width: '380px', 
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.05)', 
                opacity: 0, visibility: 'hidden', transition: 'all 0.3s ease', zIndex: 1000 
              }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <img src="/krit-logo.png" alt="KRIT Consultancy" style={{ width: '60px', height: '60px', objectFit: 'contain', background: '#f8fafc', padding: '8px', borderRadius: '12px' }} onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=KRIT&background=2563EB&color=fff&size=60'; }} />
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', background: '#d1fae5', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Official Technology Partner</span>
                    <h4 style={{ margin: '8px 0 4px', fontSize: '1.2rem', color: 'var(--navy)' }}>KRIT Consultancy</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>AI, Cloud, Software Development, Data Analytics & Digital Transformation.</p>
                    <a href="https://kritconsultancy.com/" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '12px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent)', textDecoration: 'none' }}>Visit Website ↗</a>
                  </div>
                </div>
              </div>
            </div>
            <a href="#projects">Portfolio</a>
            <a href="/contact">Contact</a>
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
                  <div style={{ borderBottom: '1px solid var(--line)', paddingBottom: '12px', margin: '0 0 4px' }}>
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
            <div className="topbar-login" style={{ display: 'flex', gap: '10px' }}>
              <button className="pill-button pill-button--ghost" onClick={() => navigate('/login')}>
                Client Portal
              </button>
              <a href={trainingUrl} className="pill-button pill-button--solid" style={{ textDecoration: 'none' }}>
                BECS Eduverse
              </a>
            </div>
          )}

          <button className="hamburger-btn" onClick={() => setIsMobileMenuOpen(true)}>
            ☰
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <div className={`mobile-sidebar-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
      <div className={`mobile-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-sidebar-header">
          <a className="brand" href="#home" onClick={() => setIsMobileMenuOpen(false)}>
            <img src="/logo.png" alt="BECS Logo" style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <span className="brand-name">BECS</span>
          </a>
          <button className="close-btn" onClick={() => setIsMobileMenuOpen(false)}>✕</button>
        </div>
        <nav className="mobile-nav">
          <a href="#home" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
          <a href="#about" onClick={() => setIsMobileMenuOpen(false)}>About</a>
          <a href="#services" onClick={() => setIsMobileMenuOpen(false)}>Services</a>
          <a href={ecommerceUrl} onClick={(e) => { e.preventDefault(); window.location.href = ecommerceUrl; }}>BECS Store</a>
          <a href="#projects" onClick={() => setIsMobileMenuOpen(false)}>Portfolio</a>
          <a href={trainingUrl} onClick={(e) => { e.preventDefault(); window.location.href = trainingUrl; }}>BECS Eduverse</a>
          <a href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
          {!user && (
            <button className="pill-button pill-button--ghost" style={{ marginTop: '20px', width: '100%' }} onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }}>
              Client Portal
            </button>
          )}
        </nav>
      </div>

      <main>
        <section className="hero-section" id="home">
          <div className="container hero-grid">
            <div className="hero-copy fade-in-up">
              <span className="section-pill">Enterprise Technology Partner</span>
              <h1>
                Architecting Advanced Software, Digital Platforms & Smart IoT <span>for the Modern Enterprise.</span>
              </h1>
              <p>
                BECS provides comprehensive technology solutions ranging from scalable web and mobile applications, enterprise software, and cloud infrastructure, to cutting-edge IoT systems, hardware automation, and digital education.
              </p>

              <div className="hero-actions">
                <a className="pill-button pill-button--solid" href="#services">
                  Explore Services
                </a>
                <a className="pill-button pill-button--ghost" href={ecommerceUrl}>
                  Visit BECS Store
                </a>
                <a className="pill-button pill-button--ghost" href="/contact" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                  Contact Us
                </a>
              </div>

              <div className="hero-trust-metrics">
                <div className="trust-item"><span className="trust-check" style={{ color: '#10b981' }}>✓</span> Electronics Solutions</div>
                <div className="trust-item"><span className="trust-check" style={{ color: '#10b981' }}>✓</span> Automation Projects</div>
                <div className="trust-item"><span className="trust-check" style={{ color: '#10b981' }}>✓</span> Educational Programs</div>
                <div className="trust-item"><span className="trust-check" style={{ color: '#10b981' }}>✓</span> E-Commerce Platform</div>
                <div className="trust-item"><span className="trust-check" style={{ color: '#10b981' }}>✓</span> Software Solutions</div>
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
                <strong>7+</strong>
                <span>Products</span>
              </div>
              <div className="stat-box">
                <strong>20+</strong>
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

        <section style={{ backgroundColor: 'var(--navy)', color: '#fff', padding: '100px 20px', textAlign: 'center' }} id="about">
          <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ color: 'var(--accent)', fontSize: '4rem', lineHeight: 0.5, marginBottom: '20px', fontFamily: 'serif' }}>"</div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '40px', lineHeight: 1.4, color: '#fff' }}>
              Excellence in electronics starts with<br />innovation and education.
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              <img 
                src="/mr-banerjee-cartoon.png" 
                alt="Mr. Banerjee" 
                style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)' }} 
              />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>Mr. Banerjee</div>
                <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '2px' }}>CEO, BECS</div>
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
                      href={isTraining ? trainingUrl : "/contact"}
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

        <section className="section-cream store-showcase-section" id="products" style={{ padding: '60px 0' }}>
          <div className="container">
            <div className="store-showcase-grid">
              
              <div className="store-showcase-content">
                <span className="section-pill">Online Store</span>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '3rem', fontWeight: 900, textTransform: 'uppercase' }}>
                  <img src="/logo.png" alt="BECS Logo" style={{ width: '60px', height: '60px', objectFit: 'contain', borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  BECS Store
                </h2>
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

                <div className="store-cta-group" style={{ display: 'flex', marginTop: '20px' }}>
                  <a 
                    href={`${ecommerceUrl}/products`}
                    className="pill-button pill-button--solid"
                    style={{ padding: '16px 32px', fontSize: '1.1rem', letterSpacing: '0.5px' }}
                  >
                    Explore All Products ➔
                  </a>
                </div>
              </div>

              <div style={{ width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', height: '100%', padding: '20px 0' }}>
                <AutoCarousel speed={1} alwaysScroll={true}>
                  {/* Product 1 */}
                  <a href={ecommerceUrl} className="store-featured-card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', minWidth: '340px', maxWidth: '400px' }}>
                    <div className="featured-img-wrapper" style={{ height: '320px', flexShrink: 0 }}>
                      <img src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80" alt="Industrial Automation Kit" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="featured-info">
                      <span className="featured-badge">Best Seller</span>
                      <h4>Industrial Automation Kit</h4>
                      <div className="featured-price">₹12,999</div>
                    </div>
                  </a>

                  {/* Product 2 */}
                  <a href={ecommerceUrl} className="store-featured-card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', minWidth: '340px', maxWidth: '400px' }}>
                    <div className="featured-img-wrapper" style={{ height: '320px', flexShrink: 0 }}>
                      <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80" alt="Smart IoT Controller" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="featured-info">
                      <span className="featured-badge" style={{ background: 'rgba(249, 115, 22, 0.1)', color: '#f97316' }}>Trending</span>
                      <h4>Smart IoT Controller</h4>
                      <div className="featured-price">₹7,999</div>
                    </div>
                  </a>

                  {/* Product 3 */}
                  <a href={ecommerceUrl} className="store-featured-card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', minWidth: '340px', maxWidth: '400px' }}>
                    <div className="featured-img-wrapper" style={{ height: '320px', flexShrink: 0 }}>
                      <img src="https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=600&q=80" alt="Embedded Development Board" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="featured-info">
                      <span className="featured-badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>New Arrival</span>
                      <h4>Embedded Development Board</h4>
                      <div className="featured-price">₹4,999</div>
                    </div>
                  </a>
                </AutoCarousel>
              </div>
            </div>
          </div>
        </section>

        <section className="section-white" id="partners">
          <div className="container">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '60px', alignItems: 'center' }}>
              
              {/* Left Column (40%) */}
              <div style={{ flex: '1 1 35%', minWidth: '300px' }}>
                <div className="section-heading" style={{ textAlign: 'left', marginBottom: '32px' }}>
                  <span className="section-pill">Strategic Partners</span>
                  <h2>Our Strategic Technology Partner</h2>
                  <p>Collaborating with trusted technology leaders to deliver innovative digital solutions.</p>
                </div>
                <a href="/contact" className="pill-button pill-button--solid">
                  Become a Partner
                </a>
              </div>

              {/* Right Column (60%) */}
              <div style={{ flex: '1 1 55%', minWidth: '350px' }}>
                <article className="service-card" style={{ padding: '40px', transition: 'all 0.4s ease', cursor: 'default' }} 
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = 'var(--accent)'; }} 
                  onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-soft)'; e.currentTarget.style.borderColor = 'var(--line)'; }}>
                  
                  <img src="/krit-logo.png" alt="KRIT Consultancy Logo" style={{ width: '140px', height: '60px', objectFit: 'contain', marginBottom: '24px' }} />
                  
                  <span style={{ display: 'inline-block', fontSize: '0.8rem', fontWeight: 800, color: '#10b981', background: '#d1fae5', padding: '6px 12px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                    Official Technology Partner
                  </span>
                  
                  <h3 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>KRIT Consultancy</h3>
                  <p style={{ fontWeight: 600, color: 'var(--navy)', marginBottom: '8px' }}>Delivering expertise in:</p>
                  
                  <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                    <li>Artificial Intelligence</li>
                    <li>Cloud Computing</li>
                    <li>Custom Software Development</li>
                    <li>Data Analytics</li>
                    <li>DevOps</li>
                    <li>Digital Transformation</li>
                  </ul>
                  
                  <a href="https://kritconsultancy.com/" target="_blank" rel="noreferrer" style={{ marginTop: '32px' }}>
                    Visit Website ↗
                  </a>
                </article>
              </div>

            </div>
          </div>
        </section>

        <section className="section-cream">
          <div className="container">
            <div className="section-heading">
              <span className="section-pill">Expertise</span>
              <h2>Technology We Master</h2>
              <p>
                Cutting-edge domains where our engineers deliver world-class results and
                innovative solutions.
              </p>
            </div>

            <style>
              {`
                .mobile-tech-carousel { display: none; }
                @media (max-width: 768px) {
                  .desktop-tech-grid { display: none !important; }
                  .mobile-tech-carousel { display: block; overflow: hidden; width: 100vw; margin-left: -24px; padding: 0 24px; margin-top: 30px; }
                  .tech-card-mobile { width: 280px; flex-shrink: 0; white-space: normal; }
                }
              `}
            </style>

            <div className="tech-grid desktop-tech-grid">
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

            <div className="mobile-tech-carousel">
              <AutoCarousel speed={1}>
                {tech.map(([title, subtitle], index) => (
                  <article className="tech-card tech-card-mobile" key={title}>
                    <div className="soft-icon">
                      <Icon kind={`tech-${(index % 5) + 1}`} />
                    </div>
                    <h3>{title}</h3>
                    <span>{subtitle}</span>
                  </article>
                ))}
              </AutoCarousel>
            </div>
          </div>
        </section>

        <section className="section-white" id="projects">
          <div className="container">
            <div className="section-heading">
              <span className="section-pill">Our Work</span>
              <h2>BECS Project Portfolio</h2>
              <p>Explore our recent and ongoing deployments across IoT, Automation, Hardware, and Software.</p>
            </div>

            <style>
              {`
                .portfolio-tabs {
                  display: flex;
                  flex-wrap: wrap;
                  gap: 10px;
                  justify-content: center;
                  margin-bottom: 40px;
                  padding: 0 15px;
                }
                @media (max-width: 768px) {
                  .portfolio-tabs {
                    flex-wrap: nowrap;
                    justify-content: flex-start;
                    overflow-x: auto;
                    padding-bottom: 15px;
                    -webkit-overflow-scrolling: touch;
                    scrollbar-width: none; /* Firefox */
                  }
                  .portfolio-tabs::-webkit-scrollbar {
                    display: none; /* Chrome/Safari */
                  }
                }
              `}
            </style>
            <div className="portfolio-tabs">
              {['All', ...new Set(projects.map(p => p.category))].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setActiveProjectCategory(cat)}
                  style={{ 
                    padding: '10px 20px', borderRadius: '30px', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.3s',
                    background: activeProjectCategory === cat ? 'var(--accent)' : '#f8fafc',
                    color: activeProjectCategory === cat ? '#fff' : 'var(--navy)',
                    border: `1px solid ${activeProjectCategory === cat ? 'var(--accent)' : 'var(--line)'}`,
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div style={{ width: '100%', overflow: 'hidden', padding: '20px 0' }}>
              <AutoCarousel speed={1} showArrows={true}>
                {projects.filter(p => activeProjectCategory === 'All' || p.category === activeProjectCategory).map((project) => (
                  <article key={project.id} onClick={() => navigate(`/project/${project.id}`)} style={{ 
                    background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--line)', 
                    cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                    minWidth: '320px', maxWidth: '350px', height: '100%', display: 'flex', flexDirection: 'column'
                  }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 20px 30px rgba(0,0,0,0.1)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'; }}>
                    <div style={{ position: 'relative', height: '200px', flexShrink: 0, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px' }} />
                      <span style={{ 
                        position: 'absolute', top: '16px', right: '16px', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700,
                        background: project.status === 'Completed' ? '#10b981' : '#3b82f6', color: '#fff'
                      }}>{project.status}</span>
                    </div>
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <span style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{project.category}</span>
                      <h3 style={{ margin: '8px 0 16px', fontSize: '1.3rem', color: 'var(--navy)' }}>{project.title}</h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 'auto' }}>
                        {project.tech.map(t => <span key={t} style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>{t}</span>)}
                      </div>
                    </div>
                  </article>
                ))}
              </AutoCarousel>
            </div>
          </div>
        </section>




        <section className="section-cream" id="clients">
          <style>
            {`
              .mobile-only-carousel { display: none; margin-top: 40px; }
              @media (max-width: 768px) {
                .desktop-only-grid { display: none !important; }
                .mobile-only-carousel { display: block; }
              }
            `}
          </style>
          <div className="container">
            <div className="section-heading" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span className="section-pill">Our Clients</span>
              <h2 style={{ fontSize: '3rem', margin: '20px 0' }}>Trusted by Industry Leaders</h2>
              <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem', color: '#64748b' }}>
                We are proud to collaborate with forward-thinking organizations across the globe,
                delivering premium electronic solutions that drive innovation.
              </p>
            </div>

            <div className="client-divider" style={{ margin: '40px 0' }} />

            {/* DESKTOP GRID */}
            <div className="client-grid desktop-only-grid">
              {clientLogos.map(([name, category], index) => (
                <article className="client-card" key={`desktop-${name}`} style={{ textAlign: 'center' }}>
                  <div className={`client-logo client-logo--${(index % 8) + 1}`} style={{ margin: '0 auto 16px' }}>{name.slice(0, 1)}</div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{name}</h3>
                  <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{category}</span>
                </article>
              ))}
            </div>

            {/* MOBILE CAROUSEL */}
            <div className="mobile-only-carousel">
              <div style={{ width: '100%', overflow: 'hidden' }}>
                <AutoCarousel speed={1} alwaysScroll={true}>
                  {clientLogos.map(([name, category], index) => (
                    <article className="client-card" key={`mobile-${name}`} style={{ minWidth: '220px', textAlign: 'center', margin: '0 10px' }}>
                      <div className={`client-logo client-logo--${(index % 8) + 1}`} style={{ margin: '0 auto 16px' }}>{name.slice(0, 1)}</div>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{name}</h3>
                      <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{category}</span>
                    </article>
                  ))}
                </AutoCarousel>
              </div>
            </div>

            <style>
              {`
                .client-metrics-responsive {
                  display: flex;
                  justify-content: center;
                  gap: 40px;
                  margin-top: 80px; /* Add space between cards and metrics */
                  flex-wrap: wrap;
                  background: #fff;
                  padding: 40px;
                  border-radius: 24px;
                  box-shadow: 0 10px 40px rgba(0,0,0,0.03);
                }
                .client-metrics-responsive > div {
                  text-align: center;
                  min-width: 140px;
                }
                .client-metrics-responsive strong {
                  display: block;
                  font-size: 2.5rem;
                  color: var(--navy);
                  margin-bottom: 8px;
                  font-family: 'Outfit', sans-serif;
                }
                .client-metrics-responsive span {
                  color: var(--accent);
                  font-weight: 700;
                  font-size: 0.85rem;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                }
                @media (max-width: 768px) {
                  .client-metrics-responsive {
                    gap: 30px 20px;
                    padding: 30px 20px;
                    margin-top: 60px;
                  }
                  .client-metrics-responsive > div {
                    min-width: calc(50% - 20px);
                  }
                  .client-metrics-responsive strong {
                    font-size: 2rem;
                  }
                }
              `}
            </style>
            <div className="client-metrics-responsive">
              <div>
                <strong>10+</strong>
                <span>Global Clients</span>
              </div>
              <div>
                <strong>5+</strong>
                <span>Countries Served</span>
              </div>
              <div>
                <strong>98%</strong>
                <span>Client Satisfaction</span>
              </div>
              <div>
                <strong>1</strong>
                <span>Years of Trust</span>
              </div>
              <div>
                <strong>15+</strong>
                <span>Projects Delivered</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section-white testimonials-section">
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

      <footer className="footer" style={{ marginTop: 'auto', background: '#f8fafc', borderTop: '1px solid var(--line)', paddingTop: '60px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', paddingBottom: '40px', borderBottom: '1px solid var(--line)' }}>
          
          {/* Brand Column */}
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <img src="/logo.png" alt="BECS Logo" style={{ width: '56px', height: '56px', objectFit: 'contain', borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <h2 style={{ margin: 0, color: 'var(--accent)', fontSize: '1.8rem' }}>BECS.</h2>
            </div>
            <p style={{ color: '#475569', lineHeight: 1.6 }}>
              Banerjee Electronics Consultancy Services. Your trusted partner for
              innovative electronic solutions, automation, and premium tech supply.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="footer-col">
            <h3 style={{ fontSize: '1.2rem', color: 'var(--navy)', marginBottom: '20px' }}>Quick Links</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><a href="#" style={{ color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }}>Home</a></li>
              <li><a href="#services" style={{ color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }}>Services</a></li>
              <li><a href="#projects" style={{ color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }}>Portfolio</a></li>
              <li><a href="/contact" style={{ color: '#475569', textDecoration: 'none', transition: 'color 0.2s' }}>Contact Us</a></li>
            </ul>
          </div>

          {/* Contact Info Column */}
          <div className="footer-col">
            <h3 style={{ fontSize: '1.2rem', color: 'var(--navy)', marginBottom: '20px' }}>Contact Us</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#475569', lineHeight: 1.5 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px', color: 'var(--accent)' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                70/5, Banerjee Para Rd, Kamala Park, Sarsuna, Kolkata, West Bengal 700061
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: 'var(--accent)' }}><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                <a href="mailto:admin@becsofficial.com" style={{ color: '#475569', textDecoration: 'none' }}>admin@becsofficial.com</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0', color: '#64748b', fontSize: '0.9rem' }}>
          <span>&copy; {new Date().getFullYear()} BECS. All rights reserved.</span>
          <div className="socials" style={{ display: 'flex', gap: '16px' }}>
            <a href="https://www.linkedin.com/company/becselectronics" target="_blank" rel="noreferrer" style={{ color: '#64748b', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }} aria-label="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a href="https://www.facebook.com/BanerjeeElectronicsConsultancyServices/" target="_blank" rel="noreferrer" style={{ color: '#64748b', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }} aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="https://www.instagram.com/_b.e.c.s_/" target="_blank" rel="noreferrer" style={{ color: '#64748b', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }} aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
