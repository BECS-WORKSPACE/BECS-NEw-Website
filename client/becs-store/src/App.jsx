import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import API, { fetchProducts, fetchProduct, createOrder, fetchMyOrders, login as apiLogin, register as apiRegister, createPaymentIntent } from './api';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

const STORAGE_KEYS = {
  cart: 'becs_ecommerce_cart',
  user: 'becs_user',
  wishlist: 'becs_ecommerce_wishlist',
};

const defaultCheckout = {
  name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '',
  payment: 'Cash on Delivery', cardName: '', cardNumber: '', expiry: '', cvv: '',
};

const formatPrice = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

const safeRead = (key, fallback) => {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const getInclusivePrice = (price) => Math.round(price * 1.18);

const calculateEDD = (speed, pincode) => {
  const now = new Date();
  const cutoffHour = 14; // 2:00 PM
  let processingDays = now.getHours() >= cutoffHour ? 1 : 0;
  
  // Skip Sundays for processing start
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() + processingDays);
  if (startDate.getDay() === 0) startDate.setDate(startDate.getDate() + 1);
  
  // Transit Time Mock based on pincode first digit and speed
  // Speed factor: Standard (3-5), Express (2-3), Priority (1-2)
  let baseTransitMin = 3;
  let baseTransitMax = 5;
  
  if (speed === 'Priority Delivery') {
    baseTransitMin = 1;
    baseTransitMax = 2;
  } else if (speed === 'Express Delivery') {
    baseTransitMin = 2;
    baseTransitMax = 3;
  }
  
  // Operational buffer: 1 day
  const buffer = 1;
  
  const minDate = new Date(startDate);
  minDate.setDate(minDate.getDate() + baseTransitMin);
  if (minDate.getDay() === 0) minDate.setDate(minDate.getDate() + 1); // Skip Sunday delivery
  
  const maxDate = new Date(startDate);
  maxDate.setDate(maxDate.getDate() + baseTransitMax + buffer);
  if (maxDate.getDay() === 0) maxDate.setDate(maxDate.getDate() + 1);

  // Time remaining for cutoff
  let hoursLeft = cutoffHour - now.getHours() - 1;
  let minutesLeft = 60 - now.getMinutes();
  if (hoursLeft < 0) {
    hoursLeft += 24;
    // if ordered tomorrow before cutoff
  }
  
  return {
    minStr: minDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    maxStr: maxDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    countdown: `${hoursLeft}h ${minutesLeft}m`,
    isAfterCutoff: now.getHours() >= cutoffHour
  };
};

const ShopContext = React.createContext();

function ShopProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState(() => safeRead(STORAGE_KEYS.cart, []));
  const [wishlistItems, setWishlistItems] = useState(() => safeRead(STORAGE_KEYS.wishlist, []));
  const [addresses, setAddresses] = useState(() => safeRead('becs_ecommerce_addresses', []));
  const [orders, setOrders] = useState([]);
  const [checkout, setCheckout] = useState(defaultCheckout);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(() => safeRead(STORAGE_KEYS.user, null));
  const [shippingSpeed, setShippingSpeed] = useState('Standard Delivery');

  useEffect(() => {
    const getProducts = async () => {
      try {
        const { data } = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  useEffect(() => {
    if (user) {
      const getOrders = async () => {
        try {
          const { data } = await fetchMyOrders();
          setOrders(data);
        } catch (error) {
          console.error('Failed to fetch orders', error);
        }
      };
      getOrders();
    }
  }, [user]);

  useEffect(() => { window.localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cartItems)); }, [cartItems]);
  useEffect(() => { window.localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(wishlistItems)); }, [wishlistItems]);
  useEffect(() => { window.localStorage.setItem('becs_ecommerce_addresses', JSON.stringify(addresses)); }, [addresses]);
  useEffect(() => { 
    if (user) {
      window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(STORAGE_KEYS.user);
    }
  }, [user]);

  useEffect(() => {
    if (!message) return undefined;
    const timer = window.setTimeout(() => setMessage(''), 2500);
    return () => window.clearTimeout(timer);
  }, [message]);

  const cartSummary = useMemo(() => {
    let subtotal = 0;
    let mrpTotal = 0;
    let discount = 0;
    
    cartItems.forEach(item => {
      const itemSellingPrice = getInclusivePrice(item.price);
      const itemMRP = item.mrp ? getInclusivePrice(item.mrp) : Math.round(itemSellingPrice * 1.25); // 20% mock discount
      
      subtotal += itemSellingPrice * item.quantity;
      mrpTotal += itemMRP * item.quantity;
      discount += (itemMRP - itemSellingPrice) * item.quantity;
    });
    
    let shipping = 0;
    if (cartItems.length > 0) {
      let totalChargeableWeight = 0;
      cartItems.forEach(item => {
        const actualWeight = item.quantity * 1.2;
        const volumetricWeight = item.quantity * 1.5;
        totalChargeableWeight += Math.max(actualWeight, volumetricWeight);
      });
      
      const baseRate = 20;
      const distanceFactor = 50;
      const speedFactor = shippingSpeed === 'Priority Delivery' ? 200 : (shippingSpeed === 'Express Delivery' ? 100 : 0);
      
      shipping = Math.round((totalChargeableWeight * baseRate) + distanceFactor + speedFactor);
    }
    
    const tax = 0; // Tax is inclusive in prices now
    const total = subtotal + shipping + tax;
    const quantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal, mrpTotal, discount, shipping, tax, total, quantity };
  }, [cartItems, shippingSpeed]);

  const handleAddToCart = (product) => {
    setCartItems((current) => {
      const existing = current.find((item) => item._id === product._id);
      if (existing) {
        return current.map((item) => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...current, { _id: product._id, name: product.name, price: product.price, image: product.image, quantity: 1, delivery: product.delivery }];
    });
    setMessage(`${product.name} added to cart.`);
  };

  const handleQuantityChange = (productId, delta) => {
    setCartItems((current) => current.map((item) => item._id === productId ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0));
  };

  const handleRemoveItem = (productId) => {
    setCartItems((current) => current.filter((item) => item._id !== productId));
  };

  const handleToggleWishlist = (product) => {
    setWishlistItems((current) => {
      const exists = current.find((item) => item._id === product._id);
      if (exists) {
        setMessage(`${product.name} removed from wishlist.`);
        return current.filter((item) => item._id !== product._id);
      } else {
        setMessage(`${product.name} added to wishlist.`);
        return [...current, { _id: product._id, name: product.name, price: product.price, image: product.image, rating: product.rating }];
      }
    });
  };

  const handleLogin = async (credentials) => {
    try {
      const { data } = await apiLogin(credentials);
      setUser(data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const handleRegister = async (userData) => {
    try {
      const { data } = await apiRegister(userData);
      setUser(data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCartItems([]);
    setOrders([]);
    window.localStorage.removeItem(STORAGE_KEYS.user);
  };

  return (
    <ShopContext.Provider value={{
      products, loading, cartItems, setCartItems, wishlistItems, setWishlistItems, addresses, setAddresses, orders, setOrders, checkout, setCheckout,
      cartSummary, handleAddToCart, handleQuantityChange, handleRemoveItem, handleToggleWishlist,
      message, setMessage, defaultCheckout, user, setUser, handleLogin, handleRegister, handleLogout,
      getInclusivePrice, shippingSpeed, setShippingSpeed, calculateEDD
    }}>
      {children}
    </ShopContext.Provider>
  );
}

function Navbar() {
  const { cartSummary, user, handleLogout, wishlistItems } = React.useContext(ShopContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/?search=${searchTerm}`);
    }
  };

  return (
    <header className="shop-topbar" style={{ padding: '16px 0', borderBottom: '1px solid var(--line)', background: '#fff', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '40px' }}>
        <Link className="shop-brand" to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="BECS Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
          <div style={{ color: 'var(--navy)' }}>
            <strong style={{ display: 'block', fontSize: '1.2rem', lineHeight: 1.2 }}>BECS</strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Store</span>
          </div>
        </Link>
        
        <div style={{ flex: 1, maxWidth: '600px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '8px', padding: '0 16px', border: '1px solid transparent', transition: 'border 0.2s ease' }} onFocus={(e) => e.currentTarget.style.border = '1px solid var(--accent)'} onBlur={(e) => e.currentTarget.style.border = '1px solid transparent'}>
            <span style={{ fontSize: '1.2rem', color: 'var(--muted)', marginRight: '8px' }}>🔍</span>
            <input 
              type="text" 
              placeholder="Search products, categories, brands..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              onKeyDown={handleSearch}
              style={{ width: '100%', padding: '12px 0', border: 'none', background: 'transparent', outline: 'none', fontSize: '1rem' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link to="/wishlist" style={{ textDecoration: 'none', color: 'var(--navy)', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>♡</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Wishlist</span>
            {wishlistItems.length > 0 && <span style={{ position: 'absolute', top: '-6px', right: '-4px', background: 'var(--accent)', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{wishlistItems.length}</span>}
          </Link>
          
          <Link to="/orders" style={{ textDecoration: 'none', color: 'var(--navy)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>📦</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Orders</span>
          </Link>

          <Link to="/cart" style={{ textDecoration: 'none', color: 'var(--navy)', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>🛒</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Cart</span>
            {cartSummary.quantity > 0 && <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--accent)', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartSummary.quantity}</span>}
          </Link>

          {user ? (
            <div style={{ position: 'relative' }}>
              <div 
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', marginBottom: '2px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 'bold', marginBottom: '2px' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Profile</span>
              </div>
              
              {showDropdown && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '16px', background: '#fff', width: '260px', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.12)', border: '1px solid var(--line)', padding: '16px 0', zIndex: 110 }}>
                  <div style={{ padding: '0 20px 16px', borderBottom: '1px solid var(--line)', marginBottom: '8px' }}>
                    <strong style={{ display: 'block', color: 'var(--navy)', fontSize: '1.1rem' }}>{user.name}</strong>
                    <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{user.email}</span>
                  </div>
                  <Link to="/profile" onClick={() => setShowDropdown(false)} style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', textDecoration: 'none', color: 'var(--text)', gap: '12px', fontSize: '0.95rem' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}><span>👤</span> My Profile</Link>
                  <Link to="/orders" onClick={() => setShowDropdown(false)} style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', textDecoration: 'none', color: 'var(--text)', gap: '12px', fontSize: '0.95rem' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}><span>📦</span> Orders</Link>
                  <Link to="/wishlist" onClick={() => setShowDropdown(false)} style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', textDecoration: 'none', color: 'var(--text)', gap: '12px', fontSize: '0.95rem' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}><span>❤️</span> Wishlist</Link>
                  <Link to="/cart" onClick={() => setShowDropdown(false)} style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', textDecoration: 'none', color: 'var(--text)', gap: '12px', fontSize: '0.95rem' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}><span>🛒</span> Cart</Link>
                  <Link to="/profile" onClick={() => setShowDropdown(false)} style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', textDecoration: 'none', color: 'var(--text)', gap: '12px', fontSize: '0.95rem' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}><span>📍</span> Saved Addresses</Link>
                  <Link to="/notifications" onClick={() => setShowDropdown(false)} style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', textDecoration: 'none', color: 'var(--text)', gap: '12px', fontSize: '0.95rem' }} onMouseOver={e => e.currentTarget.style.background = '#f8fafc'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}><span>🔔</span> Notifications</Link>
                  <div style={{ borderTop: '1px solid var(--line)', margin: '8px 0 0', paddingTop: '8px' }}>
                    <button onClick={() => { handleLogout(); setShowDropdown(false); }} style={{ width: '100%', textAlign: 'left', padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontWeight: 600, display: 'flex', gap: '12px', fontSize: '0.95rem' }} onMouseOver={e => e.currentTarget.style.background = '#fef2f2'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}><span>🚪</span> Logout</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="action-button action-button--solid" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', height: '40px', padding: '0 24px', borderRadius: '20px', fontSize: '0.95rem' }}>Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}

function LoginPage() {
  const { handleLogin, handleRegister } = React.useContext(ShopContext);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    let result;
    if (isLogin) {
      result = await handleLogin({ email, password });
    } else {
      result = await handleRegister({ name, email, password });
    }

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', margin: '100px auto' }}>
      <div className="panel" style={{ padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="BECS Logo" style={{ width: '85px', height: '85px', objectFit: 'contain' }} />
        </div>
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>{isLogin ? 'Login to BECS' : 'Create Account'}</h2>
        {error && <div className="flash-message" style={{ background: '#fee2e2', color: '#991b1b', marginBottom: '20px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--line)' }} placeholder="John Doe" />
            </div>
          )}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--line)' }} placeholder="john@example.com" />
          </div>
          <div className="form-group" style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--line)' }} placeholder="••••••••" />
          </div>
          <button type="submit" className="action-button action-button--solid action-button--full" style={{ minHeight: '50px' }}>
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <div style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-light)' }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 'bold', marginLeft: '8px', cursor: 'pointer' }}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Home() {
  const { products, loading, handleAddToCart, getInclusivePrice, cartItems, handleQuantityChange, wishlistItems, handleToggleWishlist } = React.useContext(ShopContext);
  
  // Banner state
  const [currentBanner, setCurrentBanner] = useState(0);
  const banners = [
    { id: 1, title: 'Smart Automation Systems', subtitle: 'Industrial Controllers', discount: 'Up To 30% Off', cta: 'Shop Now', bg: 'linear-gradient(135deg, rgba(30,58,138,0.85), rgba(59,130,246,0.85))', bgImg: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80', img: 'https://via.placeholder.com/300/1e3a8a/ffffff?text=Automation' },
    { id: 2, title: 'IoT Development Kits', subtitle: 'ESP32, Arduino, Sensors', discount: 'Starting ₹499', cta: 'Explore Kits', bg: 'linear-gradient(135deg, rgba(15,118,110,0.85), rgba(20,184,166,0.85))', bgImg: 'https://images.unsplash.com/photo-1677092419414-e974582c492c?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', img: 'https://via.placeholder.com/300/0f766e/ffffff?text=IoT+Kits' },
    { id: 3, title: 'Industrial Electronics', subtitle: 'Best Seller Collection', discount: 'Free Shipping', cta: 'View Collection', bg: 'linear-gradient(135deg, rgba(55,65,81,0.85), rgba(107,114,128,0.85))', bgImg: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1920&q=80', img: 'https://via.placeholder.com/300/374151/ffffff?text=Industrial' },
    { id: 4, title: 'Smart Home Collection', subtitle: 'Limited Time Offer', discount: 'Flat 20% Off', cta: 'Upgrade Home', bg: 'linear-gradient(135deg, rgba(76,29,149,0.85), rgba(139,92,246,0.85))', bgImg: 'https://plus.unsplash.com/premium_photo-1661297461253-ae1968b5d46c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', img: 'https://via.placeholder.com/300/4c1d95/ffffff?text=Smart+Home' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [banners.length]);

  // Quick Categories
  const quickCategories = [
    { name: 'Automation', icon: '⚙️' },
    { name: 'IoT', icon: '🌐' },
    { name: 'Security', icon: '🔒' },
    { name: 'Industrial', icon: '🏭' },
    { name: 'Educational Kits', icon: '🧰' },
    { name: 'Networking', icon: '📡' },
    { name: 'Power Backup', icon: '🔋' },
    { name: 'Sensors', icon: '🌡️' }
  ];

  // Filtering State
  const [activeCategory, setActiveCategory] = useState([]);
  const [priceRange, setPriceRange] = useState(50000);
  const [availability, setAvailability] = useState(false);
  const [minRating, setMinRating] = useState('All');
  const [activeDiscount, setActiveDiscount] = useState('All');
  const [brandSearch, setBrandSearch] = useState('');
  const [sortBy, setSortBy] = useState('Newest');

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  const categoriesList = useMemo(() => [...new Set(products.map((p) => p.category))], [products]);

  const toggleCategory = (c) => {
    if (activeCategory.includes(c)) setActiveCategory(activeCategory.filter(cat => cat !== c));
    else setActiveCategory([...activeCategory, c]);
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory = activeCategory.length === 0 || activeCategory.includes(product.category);
      const term = searchQuery.trim().toLowerCase();
      const matchesSearch = !term || product.name.toLowerCase().includes(term) || product.category.toLowerCase().includes(term) || product.description.toLowerCase().includes(term);
      
      const price = getInclusivePrice(product.price);
      const matchesPrice = price <= priceRange;

      const stock = product.stock !== undefined ? product.stock : 15;
      const matchesAvailability = !availability || stock > 0;

      let matchesRating = true;
      if (minRating === '4★ & above') matchesRating = product.rating >= 4;
      else if (minRating === '3★ & above') matchesRating = product.rating >= 3;

      let matchesDiscount = true;
      const inclusiveOriginal = getInclusivePrice(product.originalPrice || product.price);
      const discountPercent = Math.round(((inclusiveOriginal - price) / inclusiveOriginal) * 100);
      if (activeDiscount === '10%+ ') matchesDiscount = discountPercent >= 10;
      else if (activeDiscount === '20%+ ') matchesDiscount = discountPercent >= 20;
      else if (activeDiscount === '30%+ ') matchesDiscount = discountPercent >= 30;
      else if (activeDiscount === '40%+ ') matchesDiscount = discountPercent >= 40;

      let matchesBrand = true;
      if (brandSearch) {
         matchesBrand = (product.brand || 'Generic').toLowerCase().includes(brandSearch.toLowerCase());
      }

      return matchesCategory && matchesSearch && matchesPrice && matchesAvailability && matchesRating && matchesDiscount && matchesBrand;
    });

    if (sortBy === 'Price: Low to High') result.sort((a, b) => getInclusivePrice(a.price) - getInclusivePrice(b.price));
    else if (sortBy === 'Price: High to Low') result.sort((a, b) => getInclusivePrice(b.price) - getInclusivePrice(a.price));
    else if (sortBy === 'Highest Rated') result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'Most Reviews') result.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));

    return result;
  }, [activeCategory, searchQuery, priceRange, availability, minRating, activeDiscount, brandSearch, sortBy, products, getInclusivePrice]);

  const clearFilters = () => {
    setActiveCategory([]);
    setPriceRange(50000);
    setAvailability(false);
    setMinRating('All');
    setActiveDiscount('All');
    setBrandSearch('');
  };

  const trendingProducts = useMemo(() => [...products].sort((a,b) => (b.rating || 0) - (a.rating || 0)).slice(0, 6), [products]);
  const bestSellers = useMemo(() => [...products].sort((a,b) => (b.price || 0) - (a.price || 0)).slice(0, 4), [products]);
  const newArrivals = useMemo(() => [...products].slice(-4).reverse(), [products]);

  if (loading) return <div className="container" style={{ textAlign: 'center', padding: '100px' }}><h2>Loading products...</h2></div>;

  const renderProductCard = (product) => {
    const inclusivePrice = getInclusivePrice(product.price);
    const inclusiveOriginal = getInclusivePrice(product.originalPrice || product.price);
    const discountAmount = inclusiveOriginal - inclusivePrice;
    const discountPercent = Math.round((discountAmount / inclusiveOriginal) * 100);

    const cartItem = cartItems.find((item) => item._id === product._id);
    const stock = product.stock !== undefined ? product.stock : 15;
    const isPreOrder = product.isPreOrder || false;
    const isWishlisted = wishlistItems.some(item => item._id === product._id);

    return (
      <article className="product-card" key={product._id} style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <button 
          onClick={() => handleToggleWishlist(product)} 
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', cursor: 'pointer', zIndex: 10, fontSize: '1.2rem', color: isWishlisted ? '#ef4444' : '#9ca3af' }}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          {isWishlisted ? '❤️' : '♡'}
        </button>
        {discountPercent > 0 && <span className="product-badge" style={{ background: '#ef4444' }}>{discountPercent}% OFF</span>}
        
        <Link to={`/product/${product._id}`} className="product-image" style={{ position: 'relative', overflow: 'hidden' }}>
          <img src={product.image} alt={product.name} style={{ transition: 'transform 0.3s ease' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
        </Link>
        <div className="product-meta"><span>{product.category}</span><span>⭐ {product.rating}/5</span></div>
        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}><h3 style={{ fontSize: '1.1rem', color: 'var(--navy)' }}>{product.name}</h3></Link>
        
        <div style={{ marginTop: '10px' }}>
          {stock === 0 ? (
            <div style={{ color: '#dc2626', fontWeight: 600, fontSize: '0.85rem' }}>Out Of Stock</div>
          ) : isPreOrder ? (
            <div style={{ color: '#3b82f6', fontWeight: 600, fontSize: '0.85rem' }}>Available For Pre Order</div>
          ) : stock <= 5 ? (
            <div style={{ color: '#ea580c', fontWeight: 600, fontSize: '0.85rem' }}>Only {stock} Left</div>
          ) : (
            <div style={{ color: '#16a34a', fontWeight: 600, fontSize: '0.85rem' }}>✓ In Stock</div>
          )}
        </div>

        <div className="price-row" style={{ marginTop: '12px', paddingTop: '16px', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <strong style={{ fontSize: '1.4rem' }}>{formatPrice(inclusivePrice)}</strong>
            {discountPercent > 0 && <span className="mrp-strikethrough" style={{ fontSize: '0.9rem' }}>{formatPrice(inclusiveOriginal)}</span>}
          </div>
        </div>
        
        <div className="card-actions" style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
          <Link to={`/product/${product._id}`} className="action-button action-button--ghost" style={{ flex: 1, padding: '8px', fontSize: '0.9rem', textAlign: 'center' }}>Quick View</Link>
          <button 
            className="action-button action-button--solid" 
            style={{ flex: 1, padding: '8px', fontSize: '0.9rem', opacity: stock === 0 ? 0.5 : 1, cursor: stock === 0 ? 'not-allowed' : 'pointer' }} 
            onClick={() => handleAddToCart(product)}
            disabled={stock === 0}
          >
            {cartItem ? 'Add More' : 'Quick Add'}
          </button>
        </div>
      </article>
    );
  };

  return (
    <div className="app-shell" style={{ paddingBottom: '80px' }}>
      
      {/* SECTION 1: Store Banner Carousel */}
      <section style={{ position: 'relative', overflow: 'hidden', height: '400px', background: '#000' }}>
        {banners.map((banner, idx) => (
          <div key={banner.id} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: currentBanner === idx ? 1 : 0, transition: 'opacity 0.8s ease', zIndex: currentBanner === idx ? 1 : 0 }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${banner.bgImg})`, backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 1 }}></div>
            <div style={{ position: 'absolute', inset: 0, background: banner.bg, zIndex: 2 }}></div>
            
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 5%', justifyContent: 'space-between', zIndex: 3 }}>
              <div style={{ color: '#fff', maxWidth: '500px' }}>
                <div style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px', color: 'rgba(255,255,255,0.8)' }}>{banner.discount}</div>
                <h2 style={{ fontSize: '3rem', margin: '0 0 16px', lineHeight: 1.1 }}>{banner.title}</h2>
                <p style={{ fontSize: '1.2rem', marginBottom: '30px', color: 'rgba(255,255,255,0.9)' }}>{banner.subtitle}</p>
                <button className="action-button action-button--solid" style={{ background: '#fff', color: '#000', padding: '14px 32px', fontSize: '1.1rem' }}>{banner.cta}</button>
              </div>
              <div style={{ display: 'none', '@media (min-width: 768px)': { display: 'block' } }}>
                <img src={banner.img} alt={banner.title} style={{ width: '300px', height: '300px', objectFit: 'contain', mixBlendMode: 'luminosity' }} />
              </div>
            </div>
          </div>
        ))}
        <div style={{ position: 'absolute', bottom: '20px', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '10px', zIndex: 10 }}>
          {banners.map((_, idx) => (
            <button key={idx} onClick={() => setCurrentBanner(idx)} style={{ width: '10px', height: '10px', borderRadius: '50%', background: currentBanner === idx ? '#fff' : 'rgba(255,255,255,0.4)', border: 'none', cursor: 'pointer', transition: 'background 0.3s' }}></button>
          ))}
        </div>
        <button onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.3)', color: '#fff', border: 'none', width: '40px', height: '40px', borderRadius: '50%', fontSize: '1.2rem', cursor: 'pointer', zIndex: 10 }}>←</button>
        <button onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.3)', color: '#fff', border: 'none', width: '40px', height: '40px', borderRadius: '50%', fontSize: '1.2rem', cursor: 'pointer', zIndex: 10 }}>→</button>
      </section>

      {/* SECTION 2: Quick Categories */}
      <section className="container" style={{ marginTop: '40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '20px' }}>
          {quickCategories.map(cat => (
            <div key={cat.name} style={{ background: '#fff', border: '1px solid var(--line)', padding: '24px 16px', borderRadius: '16px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'} onClick={() => { setActiveCategory([cat.name]); document.getElementById('shop-section').scrollIntoView({ behavior: 'smooth' }); }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{cat.icon}</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--navy)' }}>{cat.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: Trending Products */}
      <section className="container" style={{ marginTop: '60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '2rem', margin: 0 }}>Trending Products</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="action-button action-button--ghost" style={{ padding: '8px 16px' }}>←</button>
            <button className="action-button action-button--ghost" style={{ padding: '8px 16px' }}>→</button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '20px', scrollSnapType: 'x mandatory' }}>
          {trendingProducts.map(product => (
            <div key={product._id} style={{ minWidth: '280px', scrollSnapAlign: 'start' }}>
              {renderProductCard(product)}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: Store Statistics */}
      <section style={{ background: 'var(--navy)', color: '#fff', padding: '60px 0', marginTop: '60px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', textAlign: 'center' }}>
          <div><div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '8px', color: 'var(--accent)' }}>100+</div><div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Products</div></div>
          <div><div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '8px', color: 'var(--accent)' }}>10+</div><div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Categories</div></div>
          <div><div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '8px', color: 'var(--accent)' }}>500+</div><div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Orders Delivered</div></div>
          <div><div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '8px', color: 'var(--accent)' }}>24/7</div><div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Fast Delivery</div></div>
        </div>
      </section>

      {/* SECTION 4 & 5: Best Sellers & New Arrivals Preview */}
      <section className="container" style={{ marginTop: '60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '24px' }}>Best Sellers</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
              {bestSellers.map(product => renderProductCard(product))}
            </div>
          </div>
        </div>
      </section>

      {/* MAIN SHOP SECTION (Improved Filters & Product Grid) */}
      <section id="shop-section" className="container" style={{ marginTop: '80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="eyebrow">Complete Catalog</span>
          <h2 style={{ fontSize: '2.5rem', margin: '10px 0' }}>Explore All Products</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '40px', alignItems: 'start' }}>
          
          {/* Enhanced Sticky Sidebar Filters */}
          <aside style={{ position: 'sticky', top: '100px', background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--line)' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Filters</h3>
              <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }}>Clear All</button>
            </div>

            {/* Active Filter Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
              {activeCategory.map(c => <span key={c} style={{ background: '#e0e7ff', color: '#3730a3', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>{c} <span onClick={() => toggleCategory(c)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>✕</span></span>)}
              {availability && <span style={{ background: '#d1fae5', color: '#065f46', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>In Stock <span onClick={() => setAvailability(false)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>✕</span></span>}
              {minRating !== 'All' && <span style={{ background: '#fef3c7', color: '#b45309', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>{minRating} <span onClick={() => setMinRating('All')} style={{ cursor: 'pointer', fontWeight: 'bold' }}>✕</span></span>}
            </div>

            {/* Category Checkboxes */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>Category ▼</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto' }}>
                {categoriesList.map(c => (
                  <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={activeCategory.includes(c)} onChange={() => toggleCategory(c)} style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }} />
                    <span style={{ fontSize: '0.95rem' }}>{c}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--line)' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>Max Price ▼</h4>
              <input type="range" min="0" max="50000" step="500" value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600, marginTop: '8px' }}>
                <span>₹0</span>
                <span>₹{priceRange.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Availability Toggle */}
            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--line)' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>Availability ▼</h4>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={availability} onChange={(e) => setAvailability(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }} />
                <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>✓ In Stock Only</span>
              </label>
            </div>

            {/* Ratings */}
            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--line)' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>Rating ▼</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['All', '4★ & above', '3★ & above'].map(r => (
                  <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input type="radio" name="rating" checked={minRating === r} onChange={() => setMinRating(r)} style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }} />
                    <span style={{ fontSize: '0.95rem' }}>{r}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Search */}
            <div style={{ marginBottom: '10px' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>Brand ▼</h4>
              <input type="text" placeholder="Search brands..." value={brandSearch} onChange={(e) => setBrandSearch(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '0.9rem' }} />
            </div>

          </aside>

          {/* Product Grid Area */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid var(--line)' }}>
              <span style={{ fontSize: '1rem', color: 'var(--navy)' }}>Showing <strong>{filteredProducts.length}</strong> products</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: 'var(--muted)', fontSize: '0.95rem', fontWeight: 600 }}>Sort By:</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--line)', background: 'white', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                  {['Newest', 'Price: Low to High', 'Price: High to Low', 'Highest Rated', 'Most Reviews'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', background: '#f8fafc', borderRadius: '16px', border: '1px dashed var(--line)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>No products found</h3>
                <p style={{ color: 'var(--muted)' }}>Try adjusting your filters or search terms.</p>
                <button onClick={clearFilters} className="action-button action-button--solid" style={{ marginTop: '20px', padding: '10px 24px' }}>Clear All Filters</button>
              </div>
            ) : (
              <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {filteredProducts.map(product => renderProductCard(product))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 9 & 10: Recommended & Recently Viewed */}
      <section className="container" style={{ marginTop: '80px', paddingTop: '60px', borderTop: '1px solid var(--line)' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '24px' }}>Recommended For You</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          {newArrivals.map(product => renderProductCard(product))}
        </div>
      </section>

    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const { handleAddToCart, getInclusivePrice, wishlistItems, handleToggleWishlist, user } = React.useContext(ShopContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [affiliateLink, setAffiliateLink] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const navigate = useNavigate();

  const handleGenerateAffiliate = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const link = `${window.location.origin}/product/${product._id}?ref=${user._id || user.id || 'AFF' + Math.floor(Math.random()*10000)}`;
    setAffiliateLink(link);
  };

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out ${product.name} at BECS Store!`);
    let shareUrl = '';
    
    switch (platform) {
      case 'whatsapp': shareUrl = `https://api.whatsapp.com/send?text=${text} ${url}`; break;
      case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
      case 'telegram': shareUrl = `https://t.me/share/url?url=${url}&text=${text}`; break;
      case 'email': shareUrl = `mailto:?subject=${text}&body=${url}`; break;
      case 'copy': 
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
        return;
    }
    if (shareUrl) window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  useEffect(() => {
    const getProduct = async () => {
      try {
        const { data } = await fetchProduct(id);
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product', error);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

  if (loading) return <div className="container" style={{ textAlign: 'center', padding: '100px' }}><h2>Loading product details...</h2></div>;
  if (!product) return <div className="container app-shell"><div style={{ textAlign: 'center', padding: '100px' }}><h1>Product not found</h1><Link to="/" className="action-button action-button--solid" style={{ display: 'inline-block', marginTop: '20px', padding: '12px 24px' }}>Return to Shop</Link></div></div>;

  const inclusivePrice = getInclusivePrice(product.price);
  const inclusiveOriginal = getInclusivePrice(product.originalPrice || product.price);
  const discountAmount = inclusiveOriginal - inclusivePrice;
  const discountPercent = Math.round((discountAmount / inclusiveOriginal) * 100);
  const isWishlisted = wishlistItems.some(item => item._id === product._id);

  const images = product.images || [
    product.image,
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1558089687-f282ffcbc0d4?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80'
  ];

  return (
    <div className="container app-shell" style={{ paddingTop: '40px' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '30px', color: 'var(--muted)', fontWeight: 700, fontSize: '1.1rem' }}>← Back to Products</Link>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
        <div>
          <div className="product-image" style={{ height: '500px', borderRadius: '30px', marginBottom: '20px', overflow: 'hidden', cursor: 'zoom-in' }}>
            <img 
              src={images[activeImage]} 
              alt={product.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} 
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.15)'} 
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            />
          </div>
          <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '10px' }}>
            {images.map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setActiveImage(idx)}
                style={{ width: '100px', height: '100px', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', border: activeImage === idx ? '3px solid var(--accent)' : '3px solid transparent', opacity: activeImage === idx ? 1 : 0.6, transition: 'all 0.2s ease', flexShrink: 0 }}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>
        
        <div className="detail-card" style={{ border: 'none', boxShadow: 'none', padding: '0', background: 'transparent' }}>
          <span className="eyebrow">{product.category}</span>
          <h1 style={{ fontSize: '3rem', margin: '16px 0', fontFamily: 'Outfit, sans-serif', lineHeight: 1.1 }}>{product.name}</h1>
          <div className="detail-meta" style={{ marginBottom: '30px', fontSize: '1.1rem' }}>
            <span>⭐ {product.rating}/5 ({product.reviews} reviews)</span>
            <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
          </div>
          
          <div className="detail-price-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <strong style={{ fontSize: '3rem' }}>{formatPrice(inclusivePrice)}</strong>
              {discountPercent > 0 && <span className="mrp-strikethrough" style={{ fontSize: '1.5rem' }}>{formatPrice(inclusiveOriginal)}</span>}
            </div>
            {discountPercent > 0 && <div className="save-amount" style={{ fontSize: '1.2rem', marginTop: '4px' }}>You Save: {formatPrice(discountAmount)} ({discountPercent}% OFF)</div>}
            <small style={{ color: 'var(--muted)', fontSize: '1rem', marginTop: '4px' }}>MRP (Inclusive of all taxes)</small>
          </div>
          
          <p style={{ fontSize: '1.2rem', marginBottom: '40px', color: 'var(--muted)', lineHeight: 1.8 }}>{product.description}</p>
          
          <h4 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>Key Specifications</h4>
          <ul className="spec-list" style={{ marginBottom: '50px' }}>
            {product.specs?.map((spec) => (<li key={spec} style={{ fontSize: '1.1rem', marginBottom: '10px' }}>{spec}</li>))}
          </ul>
          
          <div className="detail-actions" style={{ gap: '20px', display: 'flex', marginBottom: '30px' }}>
            <button className="action-button action-button--solid" style={{ flex: 1, minHeight: '64px', fontSize: '1.2rem' }} type="button" onClick={() => handleAddToCart(product)}>Add to Cart</button>
            <button className="action-button action-button--ghost" style={{ flex: 1, minHeight: '64px', fontSize: '1.2rem' }} type="button" onClick={() => { handleAddToCart(product); navigate('/cart'); }}>Buy Now</button>
            <button 
              className="action-button action-button--ghost" 
              style={{ width: '64px', minHeight: '64px', fontSize: '1.8rem', display: 'grid', placeItems: 'center', color: isWishlisted ? '#ef4444' : 'inherit' }} 
              type="button" 
              onClick={() => handleToggleWishlist(product)}
              title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              {isWishlisted ? '❤️' : '♡'}
            </button>
          </div>
          
          {/* Share & Affiliate Section */}
          <div className="product-share-section" style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--line)' }}>
            <h4 style={{ marginBottom: '12px', fontSize: '1rem', color: 'var(--navy)' }}>Share this product</h4>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <button onClick={() => handleShare('copy')} style={{ padding: '8px 16px', background: 'white', border: '1px solid var(--line)', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>🔗 Copy Link</button>
              <button onClick={() => handleShare('whatsapp')} style={{ padding: '8px 16px', background: '#25D366', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>WhatsApp</button>
              <button onClick={() => handleShare('facebook')} style={{ padding: '8px 16px', background: '#1877F2', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Facebook</button>
              <button onClick={() => handleShare('telegram')} style={{ padding: '8px 16px', background: '#0088cc', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Telegram</button>
              <button onClick={() => handleShare('email')} style={{ padding: '8px 16px', background: 'var(--muted)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Email</button>
            </div>
            
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
              <h4 style={{ marginBottom: '12px', fontSize: '1rem', color: 'var(--navy)' }}>Earn with BECS</h4>
              {affiliateLink ? (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input type="text" readOnly value={affiliateLink} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid var(--line)', background: 'white' }} />
                  <button onClick={() => { navigator.clipboard.writeText(affiliateLink); alert('Affiliate Link Copied!'); }} className="action-button action-button--solid" style={{ padding: '0 20px', height: '42px' }}>Copy</button>
                </div>
              ) : (
                <button onClick={handleGenerateAffiliate} className="action-button action-button--ghost" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>Generate Affiliate Link</button>
              )}
            </div>
          </div>
          
          <div className="delivery-note" style={{ marginTop: '24px', fontSize: '1.1rem' }}>🚚 {product.delivery}</div>
        </div>
      </div>
    </div>
  );
}

function Cart() {
  const { cartItems, cartSummary, handleQuantityChange, handleRemoveItem, getInclusivePrice, shippingSpeed, setShippingSpeed, calculateEDD } = React.useContext(ShopContext);
  const navigate = useNavigate();
  const edd = calculateEDD(shippingSpeed, '000000');

  return (
    <div className="container app-shell" style={{ paddingTop: '40px' }}>
      <div className="checkout-shell" style={{ gridTemplateColumns: 'minmax(0, 1.2fr) 400px' }}>
        <div className="checkout-main">
          <div className="checkout-header">
            <span className="eyebrow">Shopping Cart</span>
            <h1 style={{ fontSize: '2.5rem' }}>Your Shopping Cart</h1>
          </div>
          <section className="panel" style={{ marginTop: '30px' }}>
            <div className="cart-list">
              {cartItems.length ? cartItems.map((item) => (
                <article className="cart-item" key={item._id} style={{ gridTemplateColumns: '140px 1fr', padding: '20px' }}>
                  <Link to={`/product/${item._id}`}><img src={item.image} alt={item.name} style={{ width: '140px', height: '140px', borderRadius: '16px' }} /></Link>
                  <div className="cart-item-info" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Link to={`/product/${item._id}`}><strong style={{ fontSize: '1.3rem' }}>{item.name}</strong></Link>
                    <span style={{ marginTop: '8px' }}>{item.delivery}</span>
                    <div className="cart-item-bottom" style={{ marginTop: '24px' }}>
                      <strong style={{ fontSize: '1.4rem' }}>{formatPrice(getInclusivePrice(item.price))}</strong>
                      <div className="qty-controls">
                        <button type="button" onClick={() => handleQuantityChange(item._id, -1)}>-</button>
                        <span style={{ padding: '0 16px', fontWeight: 'bold', fontSize: '1.1rem' }}>{item.quantity}</span>
                        <button type="button" onClick={() => handleQuantityChange(item._id, 1)}>+</button>
                      </div>
                      <button className="text-button" style={{ marginLeft: 'auto', fontSize: '1rem' }} type="button" onClick={() => handleRemoveItem(item._id)}>Remove</button>
                    </div>
                  </div>
                </article>
              )) : (
                <div className="empty-panel" style={{ textAlign: 'center', padding: '80px 20px' }}>
                  <div style={{ fontSize: '5rem', marginBottom: '24px' }}>🛒</div>
                  <h3 style={{ margin: '0 0 16px', fontSize: '1.8rem' }}>Your cart is empty</h3>
                  <p style={{ fontSize: '1.1rem' }}>Looks like you haven't added any electronics to your cart yet.</p>
                  <button className="action-button action-button--solid" style={{ margin: '30px auto 0', display: 'inline-block', minHeight: '56px', padding: '0 32px' }} type="button" onClick={() => navigate('/')}>Continue Shopping</button>
                </div>
              )}
            </div>
          </section>
        </div>
        
        {cartItems.length > 0 && (
          <aside className="summary-sidebar" style={{ marginTop: '136px' }}>
            <section className="panel" style={{ padding: '30px' }}>
              <div className="panel-header"><div><span className="eyebrow">Order Summary</span><h2 style={{ fontSize: '1.8rem' }}>{cartSummary.quantity} items</h2></div></div>
              <div className="summary-row" style={{ fontSize: '1.1rem' }}><span>Subtotal</span><strong>{formatPrice(cartSummary.subtotal)}</strong></div>
              <div className="summary-row" style={{ fontSize: '1.1rem' }}><span>Shipping</span><strong>{formatPrice(cartSummary.shipping)}</strong></div>
              
              <div className="shipping-selector" style={{ margin: '16px 0', borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', color: 'var(--text)' }}>Shipping Speed</h4>
                <select value={shippingSpeed} onChange={(e) => setShippingSpeed(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '0.9rem' }}>
                  <option value="Standard Delivery">Standard Delivery</option>
                  <option value="Express Delivery">Express Delivery</option>
                  <option value="Priority Delivery">Priority Delivery</option>
                </select>
                <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(15, 143, 93, 0.08)', borderRadius: '8px', borderLeft: '4px solid var(--success)' }}>
                  <strong style={{ display: 'block', color: 'var(--success)', marginBottom: '4px', fontSize: '0.9rem' }}>Estimated Delivery:</strong>
                  <p style={{ margin: 0, color: 'var(--text)', fontWeight: 600 }}>Arrives between {edd.minStr} – {edd.maxStr}</p>
                  {!edd.isAfterCutoff && <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--muted)' }}>Get it by {edd.minStr} if ordered within {edd.countdown}</p>}
                </div>
                <ul style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '12px', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li>✓ Ships from BECS Store Warehouse</li>
                  <li>✓ Real-time delivery estimate</li>
                  <li>✓ Delivery dates exclude public holidays</li>
                </ul>
                <p style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: '1.4', marginTop: '12px' }}>
                  Shipping charges are calculated based on whichever is higher between the package's actual weight and volumetric weight, along with delivery distance and selected delivery speed.
                </p>
              </div>

              <div className="summary-row" style={{ fontSize: '1.1rem' }}><span>Taxes</span><strong style={{ fontSize: '1rem', color: 'var(--success)' }}>Included</strong></div>
              <div className="summary-row summary-row--total" style={{ marginTop: '16px', paddingTop: '24px' }}><span>Total Amount</span><strong style={{ fontSize: '2rem' }}>{formatPrice(cartSummary.total)}</strong></div>
              <button className="action-button action-button--solid action-button--full" style={{ marginTop: '30px', minHeight: '64px', fontSize: '1.2rem' }} type="button" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
            </section>
          </aside>
        )}
      </div>
    </div>
  );
}

function MockPaymentUI({ onSuccess, onBack, amount }) {
  const [activeTab, setActiveTab] = useState('upi-id');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState(null);

  const handlePay = (e) => {
    e?.preventDefault();
    if (activeTab === 'upi-id' && !upiId) {
      setMessage('Please enter a valid UPI ID');
      return;
    }
    
    setIsProcessing(true);
    setMessage(null);

    // Simulate payment processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setMessage('Payment Successful');
      setTimeout(() => {
        onSuccess();
      }, 1000);
    }, 2500);
  };

  return (
    <div className="mock-payment-ui" style={{ width: '100%' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--line)', paddingBottom: '10px' }}>
        {['upi-id', 'apps', 'qr'].map(tab => (
          <button 
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            style={{ 
              background: 'none', border: 'none', padding: '8px 16px', cursor: 'pointer',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
              color: activeTab === tab ? 'var(--accent)' : 'var(--text)',
              borderBottom: activeTab === tab ? '2px solid var(--accent)' : 'none',
              marginBottom: '-11px'
            }}
          >
            {tab === 'upi-id' ? 'UPI ID' : tab === 'apps' ? 'UPI Apps' : 'Scan QR'}
          </button>
        ))}
      </div>

      <div style={{ minHeight: '150px' }}>
        {activeTab === 'upi-id' && (
          <form onSubmit={handlePay}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--muted)' }}>Enter your UPI ID (e.g., example@oksbi)</label>
            <input 
              type="text" 
              placeholder="username@bank" 
              value={upiId} 
              onChange={(e) => setUpiId(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '1rem', marginBottom: '16px' }}
            />
          </form>
        )}

        {activeTab === 'apps' && (
          <div>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '16px' }}>Pay directly using your installed UPI apps</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '20px' }}>
              <div className="mock-app-icon" onClick={handlePay} style={{ cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ width: '50px', height: '50px', background: '#f0f0f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '8px' }}>G</div>
                <span style={{ fontSize: '0.8rem' }}>GPay</span>
              </div>
              <div className="mock-app-icon" onClick={handlePay} style={{ cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ width: '50px', height: '50px', background: '#5f259f', color: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '8px' }}>P</div>
                <span style={{ fontSize: '0.8rem' }}>PhonePe</span>
              </div>
              <div className="mock-app-icon" onClick={handlePay} style={{ cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ width: '50px', height: '50px', background: '#002e6e', color: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '8px' }}>Pay</div>
                <span style={{ fontSize: '0.8rem' }}>Paytm</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'qr' && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '16px' }}>Scan this QR code using any UPI app</p>
            <div style={{ width: '150px', height: '150px', background: '#f9f9f9', border: '1px solid var(--line)', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              {/* Mock QR Code Pattern */}
              <div style={{ width: '120px', height: '120px', background: 'repeating-conic-gradient(#000 0% 25%, transparent 0% 50%) 50% / 20px 20px', opacity: 0.8 }}></div>
            </div>
          </div>
        )}
      </div>

      {message && <div style={{ color: message === 'Payment Successful' ? 'var(--success)' : '#d94343', marginTop: '16px', fontWeight: 'bold', textAlign: 'center' }}>{message}</div>}
      
      <div className="step-actions" style={{ marginTop: '30px' }}>
        <button className="action-button action-button--ghost" style={{ minHeight: '56px', padding: '0 32px' }} type="button" onClick={onBack} disabled={isProcessing}>Back</button>
        <button className="action-button action-button--solid" style={{ minHeight: '56px', padding: '0 40px', flex: 1 }} type="button" onClick={handlePay} disabled={isProcessing}>
          {isProcessing ? 'Processing Payment...' : activeTab === 'qr' ? `I have scanned & paid ₹${amount}` : `Pay ₹${amount}`}
        </button>
      </div>
    </div>
  );
}

function Checkout() {
  const { cartItems, cartSummary, checkout, setCheckout, setOrders, defaultCheckout, setCartItems, setMessage, user, getInclusivePrice, shippingSpeed, setShippingSpeed, calculateEDD, addresses, setAddresses } = React.useContext(ShopContext);
  const navigate = useNavigate();
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [latestOrder, setLatestOrder] = useState(null);
  const [showTaxes, setShowTaxes] = useState(false);
  
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const edd = calculateEDD(shippingSpeed, checkout.pincode);

  useEffect(() => {
    if (addresses.length === 0) setIsAddingNewAddress(true);
    else if (!selectedAddressId && addresses.length > 0) {
      setSelectedAddressId(addresses[0].id);
      setCheckout((current) => ({ ...current, ...addresses[0] }));
    }
  }, [addresses, selectedAddressId, setCheckout]);

  useEffect(() => {
    if (!user) navigate('/login');
    if (cartItems.length === 0 && checkoutStep !== 4) {
      navigate('/cart');
    }
  }, [cartItems, checkoutStep, navigate, user]);

  const handleCheckoutChange = (event) => {
    const { name, value } = event.target;
    setCheckout((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const validateShipping = () => {
    const nextErrors = {};
    if (!checkout.name.trim()) nextErrors.name = 'Full name is required.';
    if (!checkout.email.trim() || !/\S+@\S+\.\S+/.test(checkout.email)) nextErrors.email = 'Enter a valid email.';
    if (!checkout.phone.trim() || checkout.phone.replace(/\D/g, '').length < 10) nextErrors.phone = 'Enter a valid phone number.';
    if (!checkout.address.trim()) nextErrors.address = 'Address is required.';
    if (!checkout.city.trim()) nextErrors.city = 'City is required.';
    if (!checkout.state.trim()) nextErrors.state = 'State is required.';
    if (!/^\d{6}$/.test(checkout.pincode)) nextErrors.pincode = 'Enter a valid 6 digit pincode.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNextStep = async () => {
    if (checkoutStep === 1) {
      if (isAddingNewAddress) {
        if (!validateShipping()) return;
        const newAddr = {
          id: Date.now().toString(),
          name: checkout.name,
          email: checkout.email,
          phone: checkout.phone,
          address: checkout.address,
          city: checkout.city,
          state: checkout.state,
          pincode: checkout.pincode,
        };
        setAddresses((prev) => [...prev, newAddr]);
        setSelectedAddressId(newAddr.id);
        setIsAddingNewAddress(false);
      } else {
        const selected = addresses.find(a => a.id === selectedAddressId);
        if (selected) setCheckout((prev) => ({ ...prev, ...selected }));
      }
      setCheckoutStep(2);
      return;
    }
  };

  const handleBackStep = () => {
    setErrors({});
    if (checkoutStep === 1) {
      navigate('/cart');
    } else {
      setCheckoutStep((current) => Math.max(1, current - 1));
    }
  };

  const handleProceedToPayment = async () => {
    if (latestOrder) {
      setCheckoutStep(3);
      return;
    }
    const orderData = {
      items: cartItems.map(item => ({ product: item._id, name: item.name, quantity: item.quantity, price: getInclusivePrice(item.price), image: item.image })),
      shippingDetails: {
        name: checkout.name, email: checkout.email, phone: checkout.phone, address: checkout.address, city: checkout.city, state: checkout.state, pincode: checkout.pincode,
      },
      paymentMethod: 'UPI / Card',
      totalPrice: cartSummary.total,
      taxPrice: 0,
      shippingPrice: cartSummary.shipping,
      status: 'Pending'
    };

    try {
      const { data } = await createOrder(orderData);
      setLatestOrder(data);
      setCheckoutStep(3);
    } catch (error) {
      console.error('Failed to initialize order', error);
      setMessage('Failed to initialize order. Please try again.');
    }
  };

  const handlePaymentSuccess = () => {
    // In demo mode, we just update local state to pretend it was paid.
    // In a real flow, Stripe webhook would update the DB and we'd fetch the latest status.
    const completedOrder = { ...latestOrder, isPaid: true, paymentMethod: 'UPI' };
    setLatestOrder(completedOrder);
    setOrders((current) => [completedOrder, ...current]);
    setCartItems([]);
    setCheckout(defaultCheckout);
    setCheckoutStep(4);
    setErrors({});
  };

  return (
    <div className="container app-shell" style={{ paddingTop: '40px' }}>
      <div className="checkout-shell" style={{ gridTemplateColumns: checkoutStep === 4 ? '1fr' : 'minmax(0, 1.2fr) 400px' }}>
        <div className="checkout-main">
          {checkoutStep < 4 && (
            <>
              <div className="checkout-header">
                <span className="eyebrow">Secure Checkout</span>
                <h1>Complete your order.</h1>
              </div>
              <div className="stepper" style={{ marginBottom: '40px' }}>
                {['Shipping', 'Payment', 'Review', 'Done'].map((step, index) => (
                  <div className={`stepper-item ${index + 1 === checkoutStep ? 'stepper-item--active' : index + 1 < checkoutStep ? 'stepper-item--done' : ''}`} key={step}>
                    <span>{index + 1}</span><strong>{step}</strong>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {checkoutStep === 1 && (
            <section className="panel" style={{ padding: '30px' }}>
              <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><span className="eyebrow">Shipping Details</span><h2>Delivery Information</h2></div>
                {!isAddingNewAddress && (
                  <button className="action-button action-button--ghost" style={{ padding: '8px 16px', fontSize: '0.9rem' }} onClick={() => { setIsAddingNewAddress(true); setCheckout(defaultCheckout); }}>+ Add New Address</button>
                )}
              </div>

              {!isAddingNewAddress ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  {addresses.map((addr) => (
                    <div 
                      key={addr.id} 
                      onClick={() => { setSelectedAddressId(addr.id); setCheckout((prev) => ({ ...prev, ...addr })); }}
                      style={{ padding: '20px', border: selectedAddressId === addr.id ? '2px solid var(--accent)' : '1px solid var(--line)', borderRadius: '12px', cursor: 'pointer', position: 'relative', background: selectedAddressId === addr.id ? 'rgba(0, 86, 210, 0.02)' : '#fff' }}
                    >
                      {selectedAddressId === addr.id && <div style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--accent)', fontWeight: 'bold' }}>✓ Selected</div>}
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>{addr.name}</h4>
                      <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                        {addr.address}<br />
                        {addr.city}, {addr.state} - {addr.pincode}<br />
                        Phone: {addr.phone}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {addresses.length > 0 && (
                    <button className="text-button" style={{ marginBottom: '20px', color: 'var(--muted)' }} onClick={() => setIsAddingNewAddress(false)}>← Back to Saved Addresses</button>
                  )}
                  <div className="form-grid form-grid--two">
                    <label><span>Full Name</span><input name="name" value={checkout.name} onChange={handleCheckoutChange} />{errors.name && <small>{errors.name}</small>}</label>
                    <label><span>Email</span><input name="email" value={checkout.email} onChange={handleCheckoutChange} />{errors.email && <small>{errors.email}</small>}</label>
                    <label><span>Phone Number</span><input name="phone" value={checkout.phone} onChange={handleCheckoutChange} />{errors.phone && <small>{errors.phone}</small>}</label>
                    <label><span>City</span><input name="city" value={checkout.city} onChange={handleCheckoutChange} />{errors.city && <small>{errors.city}</small>}</label>
                    <label><span>State</span><input name="state" value={checkout.state} onChange={handleCheckoutChange} />{errors.state && <small>{errors.state}</small>}</label>
                    <label><span>Pincode</span><input name="pincode" value={checkout.pincode} onChange={handleCheckoutChange} />{errors.pincode && <small>{errors.pincode}</small>}</label>
                    <label className="form-grid-span"><span>Full Address</span><textarea name="address" rows="3" value={checkout.address} onChange={handleCheckoutChange} />{errors.address && <small>{errors.address}</small>}</label>
                  </div>
                </>
              )}
            </section>
          )}

          {checkoutStep === 2 && (
            <section className="panel" style={{ padding: '30px' }}>
              <div className="panel-header"><div><span className="eyebrow">Review Order</span><h2>Confirm Details</h2></div></div>
              <div className="review-grid">
                <article className="review-card"><strong>Shipping To</strong><p>{checkout.name}<br />{checkout.address}<br />{checkout.city}, {checkout.state} - {checkout.pincode}<br />{checkout.phone}</p></article>
                <article className="review-card"><strong>Delivery Estimate</strong><p>Arrives between {edd.minStr} – {edd.maxStr}<br />Speed: {shippingSpeed}</p></article>
                <article className="review-card review-card--wide"><strong>Items</strong>
                  <div className="review-items">
                    {cartItems.map((item) => <div className="review-item" key={item._id}><span>{item.name} x {item.quantity}</span><strong>{formatPrice(getInclusivePrice(item.price) * item.quantity)}</strong></div>)}
                  </div>
                </article>
              </div>
            </section>
          )}

          {checkoutStep === 3 && (
            <section className="panel" style={{ padding: '30px' }}>
              <div className="panel-header"><div><span className="eyebrow">Payment Step</span><h2>Complete your payment</h2></div></div>
              <MockPaymentUI onSuccess={handlePaymentSuccess} onBack={handleBackStep} amount={cartSummary.total} />
            </section>
          )}

          {checkoutStep === 4 && (
            <section className="panel panel--success" style={{ padding: '80px 40px', maxWidth: '800px', margin: '0 auto' }}>
              <div className="success-badge" style={{ transform: 'scale(1.5)', marginBottom: '30px' }}>🎉 Order Confirmed</div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Thank you for your purchase!</h2>
              <p style={{ fontSize: '1.2rem', marginBottom: '40px' }}>Your order has been successfully placed and is being processed.</p>
              {latestOrder && (
                <div className="success-order" style={{ textAlign: 'left', padding: '30px' }}>
                  <p><strong>Order Number:</strong> #{latestOrder._id}</p>
                  <p><strong>Payment Method:</strong> {latestOrder.paymentMethod}</p>
                  <p><strong>Payment Status:</strong> <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>{latestOrder.isPaid ? 'Paid' : 'Pending'}</span></p>
                  <p><strong>Delivery Estimate:</strong> Arrives between {edd.minStr} – {edd.maxStr}</p>
                  <p><strong>Shipping Address:</strong><br />{latestOrder.shippingDetails?.address}, {latestOrder.shippingDetails?.city}</p>
                  <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button className="action-button action-button--ghost" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Download Invoice</button>
                    <button className="action-button action-button--solid" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Track Order</button>
                  </div>
                </div>
              )}
              <div className="success-actions" style={{ justifyContent: 'center', marginTop: '40px' }}>
                <button className="action-button action-button--solid" style={{ minHeight: '56px', padding: '0 32px' }} type="button" onClick={() => navigate('/')}>Continue Shopping</button>
                <button className="action-button action-button--ghost" style={{ minHeight: '56px', padding: '0 32px' }} type="button" onClick={() => navigate('/orders')}>View My Orders</button>
              </div>
            </section>
          )}

          {checkoutStep < 3 && (
            <div className="step-actions" style={{ marginTop: '30px' }}>
              <button className="action-button action-button--ghost" style={{ minHeight: '56px', padding: '0 32px' }} type="button" onClick={handleBackStep}>Back</button>
              {checkoutStep === 2 ? <button className="action-button action-button--solid" style={{ minHeight: '56px', padding: '0 40px' }} type="button" onClick={handleProceedToPayment}>Proceed to Payment</button> : <button className="action-button action-button--solid" style={{ minHeight: '56px', padding: '0 40px' }} type="button" onClick={handleNextStep}>Continue</button>}
            </div>
          )}
        </div>

        {checkoutStep < 4 && (
          <aside className="summary-sidebar" style={{ marginTop: '144px' }}>
            <div className="premium-summary-card">
              <h3>Order Summary</h3>
              <div className="summary-details">
                <div className="summary-line" style={{ color: '#565959' }}>
                  <span>Total MRP:</span>
                  <span style={{ textDecoration: 'line-through' }}>{formatPrice(cartSummary.mrpTotal)}</span>
                </div>
                <div className="summary-line" style={{ color: '#007600', fontWeight: '500' }}>
                  <span>Discount on MRP:</span>
                  <span>- {formatPrice(cartSummary.discount)}</span>
                </div>
                <div className="summary-line">
                  <span>Shipping Fee:</span>
                  <span>{cartSummary.shipping === 0 ? <span style={{color: '#007600'}}>FREE</span> : formatPrice(cartSummary.shipping)}</span>
                </div>
                
                <div style={{ textAlign: 'right', marginTop: '4px' }}>
                  <span 
                    onClick={() => setShowTaxes(!showTaxes)} 
                    style={{ fontSize: '0.75rem', color: '#007185', cursor: 'pointer', textDecoration: 'none' }}
                  >
                    View tax breakdown {showTaxes ? '▲' : '▼'}
                  </span>
                </div>

                {showTaxes && (
                  <div className="summary-expanded-content" style={{ padding: '10px', background: '#f8f9fa', borderRadius: '4px', fontSize: '0.8rem', color: '#565959', marginTop: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span>Base Amount:</span><span>{formatPrice(cartSummary.subtotal / 1.18)}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span>CGST (9%):</span><span>{formatPrice((cartSummary.subtotal - (cartSummary.subtotal / 1.18)) / 2)}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span>SGST (9%):</span><span>{formatPrice((cartSummary.subtotal - (cartSummary.subtotal / 1.18)) / 2)}</span></div>
                    <div style={{ borderTop: '1px dashed #ccc', marginTop: '6px', paddingTop: '6px', fontSize: '0.75rem' }}>GST Registration No: 27AADCB2230M1Z2</div>
                  </div>
                )}
              </div>
              
              <div className="summary-total" style={{ borderTop: '1px solid #e7e7e7', marginTop: '12px', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#0f1111' }}>Order Total:</span>
                  <span style={{ fontWeight: 800, fontSize: '1.5rem', color: '#B12704' }}>{formatPrice(cartSummary.total)}</span>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#565959', marginTop: '2px' }}>(Inclusive of all taxes)</div>
              </div>
              
              <div className="savings-callout" style={{ color: '#007600', background: '#f6fdf6', padding: '10px 12px', borderRadius: '4px', fontWeight: '600', fontSize: '0.9rem', marginTop: '16px', border: '1px solid #a3d9a5', textAlign: 'center' }}>
                Yay! Your total savings are {formatPrice(cartSummary.discount)}
              </div>

              <div style={{ marginTop: '16px', padding: '12px', background: '#f0f2f2', borderRadius: '8px', borderLeft: '4px solid #007185' }}>
                  <strong style={{ display: 'block', color: '#007185', marginBottom: '4px', fontSize: '0.9rem' }}>Estimated Delivery:</strong>
                  <p style={{ margin: 0, color: '#0f1111', fontWeight: 600, fontSize: '0.95rem' }}>Arrives between {edd.minStr} – {edd.maxStr}</p>
              </div>

              <div className="trust-badges" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: '#565959' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#007185" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  <span><strong>100% Safe & Secure Payments.</strong> We use industry-standard encryption to protect your data.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '4px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#007185" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                  <span><strong>Authentic Products.</strong> Genuine items sourced directly from manufacturers.</span>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function Orders() {
  const { orders, user } = React.useContext(ShopContext);
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('All Time');
  const [statusFilter, setStatusFilter] = useState('All');
  const [amountFilter, setAmountFilter] = useState('All Amounts');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return sortedOrders.filter(order => {
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      let dateMatch = true;
      if (dateFilter === 'Today') {
        dateMatch = orderDate.toDateString() === now.toDateString();
      } else if (dateFilter === 'Last 7 Days') {
        dateMatch = (now - orderDate) <= 7 * 24 * 60 * 60 * 1000;
      } else if (dateFilter === 'Last 30 Days') {
        dateMatch = (now - orderDate) <= 30 * 24 * 60 * 60 * 1000;
      } else if (dateFilter === 'Last 3 Months') {
        dateMatch = (now - orderDate) <= 90 * 24 * 60 * 60 * 1000;
      } else if (dateFilter === 'Last 6 Months') {
        dateMatch = (now - orderDate) <= 180 * 24 * 60 * 60 * 1000;
      } else if (dateFilter === 'This Year') {
        dateMatch = orderDate.getFullYear() === now.getFullYear();
      }

      let amountMatch = true;
      const amount = order.totalPrice;
      if (amountFilter === '₹0 - ₹1,000') amountMatch = amount >= 0 && amount <= 1000;
      else if (amountFilter === '₹1,000 - ₹5,000') amountMatch = amount > 1000 && amount <= 5000;
      else if (amountFilter === '₹5,000 - ₹10,000') amountMatch = amount > 5000 && amount <= 10000;
      else if (amountFilter === '₹10,000 - ₹25,000') amountMatch = amount > 10000 && amount <= 25000;
      else if (amountFilter === '₹25,000+') amountMatch = amount > 25000;

      const statusMatch = statusFilter === 'All' || order.status === statusFilter;
      
      let payStatus = order.isPaid ? 'Paid' : 'Pending';
      if (order.status === 'Cancelled' && order.isPaid) payStatus = 'Refunded'; 
      const paymentStatusMatch = paymentStatusFilter === 'All' || payStatus === paymentStatusFilter;

      const paymentMethodMatch = paymentMethodFilter === 'All' || order.paymentMethod === paymentMethodFilter;

      const searchMatch = !searchTerm || 
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

      return dateMatch && amountMatch && statusMatch && paymentStatusMatch && paymentMethodMatch && searchMatch;
    });
  }, [sortedOrders, dateFilter, amountFilter, statusFilter, paymentStatusFilter, paymentMethodFilter, searchTerm]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = useMemo(() => {
    let total = orders.length;
    let pending = 0;
    let delivered = 0;
    let cancelled = 0;
    let spent = 0;
    orders.forEach(o => {
      if (o.status === 'Delivered') delivered++;
      else if (o.status === 'Pending' || o.status === 'Processing') pending++;
      else if (o.status === 'Cancelled') cancelled++;
      
      if (o.status !== 'Cancelled') spent += o.totalPrice;
    });
    return { total, pending, delivered, cancelled, spent };
  }, [orders]);

  const generateInvoice = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('BECS Ecommerce', 14, 22);
    doc.setFontSize(10);
    doc.text('Premium Electronics Store', 14, 28);
    
    doc.setFontSize(14);
    doc.text('INVOICE', 160, 22);
    doc.setFontSize(10);
    doc.text(`Invoice No: INV-${order._id.slice(-6).toUpperCase()}`, 160, 28);
    doc.text(`Order No: ${order._id}`, 160, 34);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, 160, 40);
    doc.text(`Status: ${order.status}`, 160, 46);
    
    doc.text('Bill To:', 14, 45);
    doc.text(`${order.shippingDetails?.name || 'Customer'}`, 14, 51);
    doc.text(`${order.shippingDetails?.address || ''}`, 14, 57);
    doc.text(`${order.shippingDetails?.city || ''}, ${order.shippingDetails?.state || ''} ${order.shippingDetails?.pincode || ''}`, 14, 63);
    doc.text(`Email: ${order.shippingDetails?.email || ''}`, 14, 69);
    doc.text(`Phone: ${order.shippingDetails?.phone || ''}`, 14, 75);

    const tableData = order.items.map(item => {
      const sp = Math.round(item.price / 1.18);
      const mrp = Math.round(sp * 1.25);
      const gst = item.price - sp;
      return [
        item.name,
        item.quantity,
        `Rs ${mrp}`,
        `Rs ${mrp - item.price}`,
        `Rs ${gst}`,
        `Rs ${item.price * item.quantity}`
      ];
    });

    autoTable(doc, {
      startY: 85,
      head: [['Product Name', 'Qty', 'Unit MRP', 'Discount', 'GST', 'Total']],
      body: tableData,
    });

    const finalY = doc.lastAutoTable.finalY || 85;
    
    let calcSubtotal = 0;
    let calcMrpTotal = 0;
    let calcDiscount = 0;
    order.items.forEach(item => {
      const sp = item.price;
      const mrp = Math.round((sp / 1.18) * 1.25 * 1.18); 
      calcSubtotal += sp * item.quantity;
      calcMrpTotal += mrp * item.quantity;
      calcDiscount += (mrp - sp) * item.quantity;
    });

    doc.text(`Total MRP: Rs ${calcMrpTotal}`, 140, finalY + 10);
    doc.text(`Discount: - Rs ${calcDiscount}`, 140, finalY + 16);
    doc.text(`Shipping: Rs ${order.shippingPrice || 0}`, 140, finalY + 22);
    doc.setFontSize(12);
    doc.text(`Grand Total: Rs ${order.totalPrice}`, 140, finalY + 30);
    
    doc.save(`Invoice-${order._id}.pdf`);
  };

  const getOrderStatusIndex = (status) => {
    if(status === 'Pending') return 0;
    if(status === 'Processing') return 1;
    if(status === 'Packed') return 2;
    if(status === 'Shipped') return 3;
    if(status === 'Out for Delivery') return 4;
    if(status === 'Delivered') return 5;
    return -1;
  };

  return (
    <div className="container app-shell" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      <section style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Statistics Dashboard */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          {[{label: 'Total Orders', val: stats.total, color: '#3b82f6'}, {label: 'Delivered', val: stats.delivered, color: '#10b981'}, {label: 'Pending', val: stats.pending, color: '#f59e0b'}, {label: 'Cancelled', val: stats.cancelled, color: '#ef4444'}, {label: 'Total Spent', val: formatPrice(stats.spent), color: '#8b5cf6'}].map(s => (
            <div key={s.label} className="panel" style={{ padding: '20px', textAlign: 'center', borderTop: `4px solid ${s.color}` }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 600 }}>{s.label}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginTop: '8px' }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Filters Panel */}
        <div className="panel" style={{ padding: '24px', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="shop-search-wrap" style={{ flex: '1 1 300px' }}>
              <input type="text" placeholder="Search by Order ID or Product Name..." value={searchTerm} onChange={e => {setSearchTerm(e.target.value); setCurrentPage(1);}} />
            </div>
            <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--line)', background: '#fff' }} value={dateFilter} onChange={e => {setDateFilter(e.target.value); setCurrentPage(1);}}>
              <option>All Time</option><option>Today</option><option>Last 7 Days</option><option>Last 30 Days</option><option>Last 3 Months</option><option>Last 6 Months</option><option>This Year</option>
            </select>
            <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--line)', background: '#fff' }} value={amountFilter} onChange={e => {setAmountFilter(e.target.value); setCurrentPage(1);}}>
              <option>All Amounts</option><option>₹0 - ₹1,000</option><option>₹1,000 - ₹5,000</option><option>₹5,000 - ₹10,000</option><option>₹10,000 - ₹25,000</option><option>₹25,000+</option>
            </select>
            <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--line)', background: '#fff' }} value={statusFilter} onChange={e => {setStatusFilter(e.target.value); setCurrentPage(1);}}>
              <option value="All">All Statuses</option><option>Pending</option><option>Processing</option><option>Packed</option><option>Shipped</option><option>Out for Delivery</option><option>Delivered</option><option>Cancelled</option><option>Returned</option>
            </select>
            <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--line)', background: '#fff' }} value={paymentStatusFilter} onChange={e => {setPaymentStatusFilter(e.target.value); setCurrentPage(1);}}>
              <option value="All">All Payment Status</option><option>Paid</option><option>Pending</option><option>Failed</option><option>Refunded</option>
            </select>
            <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--line)', background: '#fff' }} value={paymentMethodFilter} onChange={e => {setPaymentMethodFilter(e.target.value); setCurrentPage(1);}}>
              <option value="All">All Payment Methods</option><option>UPI</option><option>Credit Card</option><option>Debit Card</option><option>Net Banking</option><option>Wallet</option><option>Cash on Delivery</option>
            </select>
          </div>
        </div>

        {/* Order List */}
        <div className="orders-list">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Showing {filteredOrders.length} Orders</h2>
            <span style={{ color: 'var(--muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>Newest Orders First</span>
          </div>
          
          {paginatedOrders.length ? paginatedOrders.map((order) => {
            const firstItem = order.items?.[0];
            const otherItemsCount = order.items?.length - 1;
            return (
              <article className="panel order-item" key={order._id} style={{ padding: '24px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--line)' }}>
                  <div>
                    <div style={{ marginBottom: '4px' }}>
                      <strong style={{ fontSize: '1.1rem' }}>Order #{order._id.slice(-8).toUpperCase()}</strong>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text)', marginBottom: '8px' }}>{formatPrice(order.totalPrice)}</div>
                    <span style={{ background: order.status === 'Delivered' ? '#d1fae5' : order.status === 'Cancelled' ? '#fee2e2' : '#e0e7ff', color: order.status === 'Delivered' ? '#065f46' : order.status === 'Cancelled' ? '#991b1b' : '#3730a3', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.8rem' }}>{order.status}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  {firstItem && (
                    <img src={firstItem.image || 'https://via.placeholder.com/80'} alt={firstItem.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--line)' }} />
                  )}
                  <div style={{ flex: 1 }}>
                    {firstItem && <h4 style={{ margin: '0 0 4px', fontSize: '1.1rem' }}>{firstItem.name}</h4>}
                    {otherItemsCount > 0 && <span style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>+ {otherItemsCount} other item{otherItemsCount > 1 ? 's' : ''}</span>}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingTop: '16px', borderTop: '1px solid var(--line)' }}>
                  <button className="action-button action-button--solid" style={{ padding: '8px 20px', fontSize: '0.9rem' }} onClick={() => setSelectedOrder(order)}>Track Order</button>
                  <button className="action-button action-button--ghost" style={{ padding: '8px 20px', fontSize: '0.9rem' }} onClick={(e) => { e.stopPropagation(); generateInvoice(order); }}>Download Invoice</button>
                  <button className="action-button action-button--ghost" style={{ padding: '8px 20px', fontSize: '0.9rem' }} onClick={() => setSelectedOrder(order)}>Buy Again</button>
                  {(order.status === 'Delivered') && (
                    <button className="action-button action-button--ghost" style={{ padding: '8px 20px', fontSize: '0.9rem', color: '#ef4444', borderColor: '#ef4444' }}>Return Order</button>
                  )}
                </div>
              </article>
            );
          }) : (
            <div className="panel empty-panel" style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📦</div>
              <h3>No orders found</h3>
              <p>Adjust your filters or start exploring our catalog.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '30px', alignItems: 'center' }}>
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(c => c - 1)} className="action-button action-button--ghost" style={{ minHeight: '36px', padding: '0 16px', opacity: currentPage === 1 ? 0.5 : 1 }}>Prev</button>
              <span style={{ padding: '8px 16px', fontWeight: 'bold' }}>Page {currentPage} of {totalPages}</span>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(c => c + 1)} className="action-button action-button--ghost" style={{ minHeight: '36px', padding: '0 16px', opacity: currentPage === totalPages ? 0.5 : 1 }}>Next</button>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <div className="panel" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '0', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa', position: 'sticky', top: 0, zIndex: 10 }}>
                <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Order Details</h2>
                <button onClick={() => setSelectedOrder(null)} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--muted)' }}>✕</button>
              </div>
              
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                  <button className="action-button action-button--solid" onClick={() => generateInvoice(selectedOrder)}>Download Invoice PDF</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '30px' }}>
                  <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid var(--line)' }}>
                    <h3 style={{ marginTop: 0, fontSize: '1.1rem', marginBottom: '16px', color: '#111' }}>Order Information</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: 'var(--muted)' }}>Order ID</span><strong>{selectedOrder._id}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: 'var(--muted)' }}>Date</span><strong>{new Date(selectedOrder.createdAt).toLocaleString('en-IN')}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: 'var(--muted)' }}>Payment Method</span><strong>{selectedOrder.paymentMethod}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: 'var(--muted)' }}>Payment Status</span><strong style={{ color: selectedOrder.isPaid ? 'var(--success)' : '#d97706' }}>{selectedOrder.isPaid ? 'Paid' : 'Pending'}</strong></div>
                  </div>
                  
                  <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid var(--line)' }}>
                    <h3 style={{ marginTop: 0, fontSize: '1.1rem', marginBottom: '16px', color: '#111' }}>Customer Information</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: 'var(--muted)' }}>Name</span><strong>{selectedOrder.shippingDetails?.name}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: 'var(--muted)' }}>Email</span><strong>{selectedOrder.shippingDetails?.email}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: 'var(--muted)' }}>Phone</span><strong>{selectedOrder.shippingDetails?.phone}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'flex-start' }}><span style={{ color: 'var(--muted)' }}>Address</span><strong style={{ textAlign: 'right', maxWidth: '60%' }}>{selectedOrder.shippingDetails?.address}, {selectedOrder.shippingDetails?.city}, {selectedOrder.shippingDetails?.state} {selectedOrder.shippingDetails?.pincode}</strong></div>
                  </div>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '2px solid var(--line)', paddingBottom: '10px' }}>Order Timeline</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', padding: '20px 0', overflowX: 'auto' }}>
                    <div style={{ position: 'absolute', top: '35px', left: '30px', right: '30px', height: '4px', background: 'var(--line)', zIndex: 1, minWidth: '400px' }}></div>
                    {['Order Placed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'].map((step, idx) => {
                      const currentIdx = getOrderStatusIndex(selectedOrder.status);
                      const isCompleted = currentIdx >= idx;
                      const isCancelled = selectedOrder.status === 'Cancelled';
                      const isReturned = selectedOrder.status === 'Returned';
                      
                      if (isCancelled || isReturned) return null;

                      return (
                        <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, minWidth: '100px' }}>
                          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: isCompleted ? 'var(--success)' : '#fff', border: `3px solid ${isCompleted ? 'var(--success)' : 'var(--line)'}`, display: 'grid', placeItems: 'center', marginBottom: '10px' }}>
                            {isCompleted && <span style={{ color: '#fff', fontSize: '14px' }}>✓</span>}
                          </div>
                          <span style={{ fontSize: '0.8rem', textAlign: 'center', fontWeight: isCompleted ? 700 : 500, color: isCompleted ? 'var(--text)' : 'var(--muted)' }}>{step}</span>
                        </div>
                      )
                    })}
                    {(selectedOrder.status === 'Cancelled' || selectedOrder.status === 'Returned') && (
                      <div style={{ width: '100%', textAlign: 'center', zIndex: 2 }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#dc2626', display: 'grid', placeItems: 'center', margin: '0 auto 10px' }}>
                           <span style={{ color: '#fff', fontSize: '14px' }}>✕</span>
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#dc2626' }}>{selectedOrder.status === 'Cancelled' ? 'Order Cancelled' : 'Order Returned'}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Product Information</h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--line)', background: '#f8f9fa' }}>
                          <th style={{ padding: '12px', color: 'var(--muted)', fontWeight: 600 }}>Product</th>
                          <th style={{ padding: '12px', color: 'var(--muted)', fontWeight: 600 }}>SKU</th>
                          <th style={{ padding: '12px', color: 'var(--muted)', fontWeight: 600 }}>Unit Price</th>
                          <th style={{ padding: '12px', color: 'var(--muted)', fontWeight: 600 }}>Qty</th>
                          <th style={{ padding: '12px', color: 'var(--muted)', fontWeight: 600, textAlign: 'right' }}>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map(item => (
                          <tr key={item._id || item.product} style={{ borderBottom: '1px solid var(--line)' }}>
                            <td style={{ padding: '16px 12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <img src={item.image || 'https://via.placeholder.com/50'} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--line)' }} />
                              <strong style={{ fontSize: '0.95rem' }}>{item.name}</strong>
                            </td>
                            <td style={{ padding: '16px 12px', color: 'var(--muted)' }}>{item.product.slice(-8).toUpperCase()}</td>
                            <td style={{ padding: '16px 12px' }}>{formatPrice(item.price)}</td>
                            <td style={{ padding: '16px 12px' }}>{item.quantity}</td>
                            <td style={{ padding: '16px 12px', textAlign: 'right', fontWeight: 700 }}>{formatPrice(item.price * item.quantity)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ width: '350px', background: '#f8f9fa', padding: '24px', borderRadius: '8px', border: '1px solid var(--line)' }}>
                    <h3 style={{ marginTop: 0, fontSize: '1.2rem', marginBottom: '16px', color: '#111' }}>Pricing Breakdown</h3>
                    
                    {(() => {
                      let calcSubtotal = 0;
                      let calcMrpTotal = 0;
                      let calcDiscount = 0;
                      selectedOrder.items.forEach(item => {
                        const sp = item.price;
                        const mrp = Math.round((sp / 1.18) * 1.25 * 1.18); 
                        calcSubtotal += sp * item.quantity;
                        calcMrpTotal += mrp * item.quantity;
                        calcDiscount += (mrp - sp) * item.quantity;
                      });

                      return (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><span style={{ color: 'var(--muted)' }}>MRP (Inclusive of GST)</span><strong>{formatPrice(calcMrpTotal)}</strong></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><span style={{ color: 'var(--muted)' }}>Discount</span><strong style={{ color: 'var(--success)' }}>- {formatPrice(calcDiscount)}</strong></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><span style={{ color: 'var(--muted)' }}>Shipping Charges</span><strong>{formatPrice(selectedOrder.shippingPrice || 0)}</strong></div>
                          <div style={{ borderTop: '1px solid #ccc', margin: '16px 0' }}></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Total Paid</span>
                            <strong style={{ fontSize: '1.5rem', color: 'var(--accent-deep)' }}>{formatPrice(selectedOrder.totalPrice)}</strong>
                          </div>
                        </>
                      )
                    })()}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </section>
    </div>
  );
}

function Wishlist() {
  const { wishlistItems, handleAddToCart, handleToggleWishlist } = React.useContext(ShopContext);

  if (wishlistItems.length === 0) {
    return (
      <div className="container app-shell" style={{ textAlign: 'center', paddingTop: '100px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>❤️</div>
        <h1>Your Wishlist is Empty</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '30px' }}>Save items you love here to easily find them later.</p>
        <Link to="/" className="action-button action-button--solid" style={{ display: 'inline-block', padding: '12px 30px' }}>Continue Shopping</Link>
      </div>
    );
  }

  const handleShareWishlist = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Wishlist link copied to clipboard!');
  };

  return (
    <div className="container app-shell" style={{ paddingTop: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div className="catalog-header" style={{ marginBottom: 0, textAlign: 'left' }}>
          <span className="eyebrow">My Saved Items</span>
          <h1 style={{ fontSize: '2.5rem' }}>Wishlist</h1>
        </div>
        <button onClick={handleShareWishlist} className="action-button action-button--ghost" style={{ padding: '8px 20px' }}>🔗 Share Wishlist</button>
      </div>

      <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
        {wishlistItems.map((product) => (
          <article className="product-card" key={product._id} style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <button 
              onClick={() => handleToggleWishlist(product)} 
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', cursor: 'pointer', zIndex: 10, fontSize: '1.2rem', color: '#ef4444' }}
              title="Remove from Wishlist"
            >
              ❤️
            </button>
            <Link to={`/product/${product._id}`} className="product-image">
              <img src={product.image} alt={product.name} />
            </Link>
            <div className="product-meta"><span>⭐ {product.rating}/5</span></div>
            <Link to={`/product/${product._id}`}><h3>{product.name}</h3></Link>
            <div className="price-row" style={{ marginTop: 'auto', paddingTop: '16px' }}>
              <strong style={{ fontSize: '1.4rem' }}>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price)}</strong>
            </div>
            <div className="card-actions" style={{ marginTop: '20px' }}>
              <button 
                className="action-button action-button--solid" 
                style={{ flex: 1 }} 
                type="button" 
                onClick={() => { handleAddToCart(product); handleToggleWishlist(product); }}
              >
                Move to Cart
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Profile() {
  const { user, setUser, handleLogout, addresses, setAddresses } = React.useContext(ShopContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  
  const presetAvatars = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Nala',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Missy',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam',
  ];

  const handleUpdateAvatar = (url) => {
    setUser({ ...user, avatar: url });
    setShowAvatarModal(false);
    setCustomAvatarUrl('');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container app-shell" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '40px', alignItems: 'start' }}>
        
        {/* Account Sidebar */}
        <aside style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid var(--line)' }}>
             {user.avatar ? (
               <img src={user.avatar} alt="User Avatar" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--line)' }} />
             ) : (
               <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent-deep))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 'bold' }}>
                 {user.name.charAt(0).toUpperCase()}
               </div>
             )}
             <div>
               <strong style={{ display: 'block', fontSize: '1.2rem', color: 'var(--navy)' }}>{user.name}</strong>
               <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{user.email}</span>
             </div>
          </div>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button onClick={() => setActiveTab('profile')} style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '8px', background: activeTab === 'profile' ? 'rgba(0, 86, 210, 0.05)' : 'transparent', color: activeTab === 'profile' ? 'var(--accent)' : 'var(--text)', fontWeight: activeTab === 'profile' ? 700 : 500, border: 'none', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '12px' }}><span>👤</span> My Profile</button>
            <button onClick={() => navigate('/orders')} style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '8px', background: 'transparent', color: 'var(--text)', fontWeight: 500, border: 'none', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '12px' }}><span>📦</span> My Orders</button>
            <button onClick={() => setActiveTab('addresses')} style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '8px', background: activeTab === 'addresses' ? 'rgba(0, 86, 210, 0.05)' : 'transparent', color: activeTab === 'addresses' ? 'var(--accent)' : 'var(--text)', fontWeight: activeTab === 'addresses' ? 700 : 500, border: 'none', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '12px' }}><span>📍</span> Saved Addresses</button>
            <button onClick={() => setActiveTab('cards')} style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '8px', background: activeTab === 'cards' ? 'rgba(0, 86, 210, 0.05)' : 'transparent', color: activeTab === 'cards' ? 'var(--accent)' : 'var(--text)', fontWeight: activeTab === 'cards' ? 700 : 500, border: 'none', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '12px' }}><span>💳</span> Saved Cards & Wallet</button>
            <button onClick={() => navigate('/notifications')} style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '8px', background: 'transparent', color: 'var(--text)', fontWeight: 500, border: 'none', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '12px' }}><span>🔔</span> Notifications</button>
            <div style={{ height: '1px', background: 'var(--line)', margin: '10px 0' }}></div>
            <button onClick={handleLogout} style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '8px', background: 'transparent', color: '#ef4444', fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '12px' }}><span>🚪</span> Logout</button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <div style={{ padding: '30px', border: '1px solid var(--line)', borderRadius: '16px', minHeight: '600px' }}>
          {activeTab === 'profile' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '16px', borderBottom: '1px solid var(--line)' }}>
                <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Personal Information</h2>
                <button onClick={() => setShowAvatarModal(true)} className="action-button action-button--ghost" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Edit Avatar</button>
              </div>

              {showAvatarModal && (
                <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--line)', marginBottom: '30px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Choose your Avatar</h3>
                    <button onClick={() => setShowAvatarModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '16px' }}>
                    {presetAvatars.map((url, idx) => (
                      <img 
                        key={idx} 
                        src={url} 
                        alt="Preset Avatar" 
                        onClick={() => handleUpdateAvatar(url)}
                        style={{ width: '60px', height: '60px', borderRadius: '50%', cursor: 'pointer', border: user.avatar === url ? '3px solid var(--accent)' : '1px solid var(--line)', background: '#fff', flexShrink: 0 }} 
                      />
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input 
                      type="text" 
                      placeholder="Or paste an image URL..." 
                      value={customAvatarUrl} 
                      onChange={(e) => setCustomAvatarUrl(e.target.value)} 
                      style={{ flex: 1, padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--line)' }}
                    />
                    <button 
                      onClick={() => { if(customAvatarUrl) handleUpdateAvatar(customAvatarUrl); }} 
                      className="action-button action-button--solid" 
                      style={{ padding: '0 20px' }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '8px' }}>Full Name</label>
                  <input type="text" value={user.name} readOnly style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--line)', background: '#f8fafc', fontSize: '1rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '8px' }}>Email Address</label>
                  <input type="email" value={user.email} readOnly style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--line)', background: '#f8fafc', fontSize: '1rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '8px' }}>Phone Number</label>
                  <input type="tel" placeholder="+91 xxxxx xxxxx" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '1rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '8px' }}>Date of Birth</label>
                  <input type="date" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '1rem' }} />
                </div>
              </div>
              <button className="action-button action-button--solid" style={{ marginTop: '40px', padding: '12px 30px' }}>Save Changes</button>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '16px', borderBottom: '1px solid var(--line)' }}>
                <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Saved Addresses</h2>
                <button className="action-button action-button--ghost" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>+ Add New Address</button>
              </div>
              
              {addresses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📍</div>
                  <h3 style={{ margin: '0 0 10px', fontSize: '1.2rem' }}>No Addresses Saved</h3>
                  <p style={{ color: 'var(--muted)' }}>You haven't saved any addresses yet.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  {addresses.map((addr, idx) => (
                    <div key={addr.id} style={{ border: '1px solid var(--line)', borderRadius: '12px', padding: '20px', position: 'relative' }}>
                      {idx === 0 && <span style={{ position: 'absolute', top: '20px', right: '20px', background: '#f1f5f9', color: 'var(--navy)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>Default</span>}
                      <h4 style={{ margin: '0 0 12px', fontSize: '1.1rem' }}>{addr.name}</h4>
                      <p style={{ margin: '0 0 16px', color: 'var(--muted)', lineHeight: '1.5', fontSize: '0.95rem' }}>
                        {addr.address}<br />
                        {addr.city}, {addr.state} - {addr.pincode}<br />
                        {addr.phone}
                      </p>
                      <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
                        <button style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 600, cursor: 'pointer', padding: 0 }}>Edit</button>
                        <button style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 600, cursor: 'pointer', padding: 0 }} onClick={() => setAddresses(prev => prev.filter(a => a.id !== addr.id))}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'cards' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '16px', borderBottom: '1px solid var(--line)' }}>
                <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Saved Cards & Wallets</h2>
                <button className="action-button action-button--ghost" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>+ Add New Card</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: 'white', borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
                  <h4 style={{ margin: '0 0 24px', fontSize: '1.2rem', fontWeight: 500, letterSpacing: '2px' }}>**** **** **** 4567</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Name on Card</span>
                      <span style={{ fontSize: '1rem', textTransform: 'uppercase' }}>{user.name}</span>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Expires</span>
                      <span style={{ fontSize: '1rem' }}>12/28</span>
                    </div>
                  </div>
                </div>

                <div style={{ border: '1px solid var(--line)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>UPI</div>
                    <div>
                      <h4 style={{ margin: '0 0 4px', fontSize: '1rem' }}>{user.name}</h4>
                      <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem' }}>{user.email.split('@')[0]}@oksbi</p>
                    </div>
                  </div>
                  <button style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 600, cursor: 'pointer', textAlign: 'left', padding: 0 }}>Remove</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Notifications() {
  const notifications = [
    { id: 1, type: 'order', title: 'Order Shipped', text: 'Your order #ORD-12345 has been shipped and is on its way.', date: 'Today, 10:30 AM', read: false },
    { id: 2, type: 'offer', title: 'Offer Alert', text: 'Get 20% off on all Smart Automation Kits today! Use code SMART20.', date: 'Yesterday, 02:15 PM', read: true },
    { id: 3, type: 'stock', title: 'Back In Stock', text: 'The "PCB Design Console" you added to your wishlist is back in stock.', date: '15 Jun, 09:00 AM', read: true },
    { id: 4, type: 'system', title: 'Welcome to BECS Store', text: 'Thank you for creating an account with us. Happy shopping!', date: '10 Jun, 11:45 AM', read: true }
  ];

  return (
    <div className="container app-shell" style={{ paddingTop: '40px', paddingBottom: '80px', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.2rem', margin: 0 }}>Notifications</h1>
        <button style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}>Mark all as read</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {notifications.map(n => (
          <div key={n.id} style={{ display: 'flex', gap: '20px', padding: '24px', background: n.read ? '#fff' : 'rgba(0, 86, 210, 0.03)', borderRadius: '12px', border: '1px solid var(--line)', position: 'relative' }}>
            {!n.read && <span style={{ position: 'absolute', top: '24px', right: '24px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent)' }}></span>}
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
              {n.type === 'order' ? '📦' : n.type === 'offer' ? '🎉' : n.type === 'stock' ? '⚡' : '👋'}
            </div>
            <div>
              <h4 style={{ margin: '0 0 6px', fontSize: '1.1rem', color: 'var(--navy)' }}>{n.title}</h4>
              <p style={{ margin: '0 0 10px', color: 'var(--text)', lineHeight: '1.5', fontSize: '0.95rem' }}>{n.text}</p>
              <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{n.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const routerBasename = import.meta.env.DEV ? '' : (import.meta.env.VITE_SUBDOMAIN_DEPLOY === 'true' ? '' : '/store');
  return (
    <ShopProvider>
      <Router basename={routerBasename}>
        <div className="shop-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <ShopContext.Consumer>
            {({ message }) => message && (
              <div className="toast-notification">
                <div className="toast-icon">✓</div>
                <div className="toast-content">{message}</div>
              </div>
            )}
          </ShopContext.Consumer>
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ShopProvider>
  );
}
