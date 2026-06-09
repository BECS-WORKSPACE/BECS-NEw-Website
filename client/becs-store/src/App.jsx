import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import API, { fetchProducts, fetchProduct, createOrder, fetchMyOrders, login as apiLogin, register as apiRegister } from './api';

const STORAGE_KEYS = {
  cart: 'becs_ecommerce_cart',
  user: 'becs_user',
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

const ShopContext = React.createContext();

function ShopProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState(() => safeRead(STORAGE_KEYS.cart, []));
  const [orders, setOrders] = useState([]);
  const [checkout, setCheckout] = useState(defaultCheckout);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(() => safeRead(STORAGE_KEYS.user, null));

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
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = cartItems.length ? 249 : 0;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;
    const quantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal, shipping, tax, total, quantity };
  }, [cartItems]);

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
      products, loading, cartItems, setCartItems, orders, setOrders, checkout, setCheckout,
      cartSummary, handleAddToCart, handleQuantityChange, handleRemoveItem,
      message, setMessage, defaultCheckout, user, handleLogin, handleRegister, handleLogout
    }}>
      {children}
    </ShopContext.Provider>
  );
}

function Navbar() {
  const { cartSummary, user, handleLogout } = React.useContext(ShopContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/?search=${searchTerm}`);
    }
  };

  return (
    <header className="shop-topbar">
      <div className="container shop-topbar-inner">
        <Link className="shop-brand" to="/">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="BECS Logo" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
          <div>
            <strong>BECS Ecommerce</strong>
            <span>Premium Electronics Store</span>
          </div>
        </Link>
        <div className="shop-search-wrap">
          <input 
            type="text" 
            placeholder="Search products... (Press Enter)" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            onKeyDown={handleSearch}
          />
        </div>
        <div className="shop-topbar-actions">
          <Link className={`topbar-tab ${location.pathname === '/' ? 'topbar-tab--active' : ''}`} to="/">Shop</Link>
          <Link className={`topbar-tab ${location.pathname === '/cart' ? 'topbar-tab--active' : ''}`} to="/cart">Cart ({cartSummary.quantity})</Link>
          <Link className={`topbar-tab ${location.pathname === '/orders' ? 'topbar-tab--active' : ''}`} to="/orders">Orders</Link>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text)', fontWeight: 800 }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent-deep))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(255, 112, 72, 0.3)' }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                {user.name}
              </div>
              <button onClick={handleLogout} className="action-button action-button--ghost" style={{ padding: '0 16px', height: '44px', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>Logout</button>
            </div>
          ) : (
            <Link to="/login" className="action-button action-button--solid" style={{ marginLeft: '8px', textDecoration: 'none', display: 'flex', alignItems: 'center', height: '44px', padding: '0 20px' }}>Login</Link>
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
  const { products, loading, handleAddToCart } = React.useContext(ShopContext);
  const [activeCategory, setActiveCategory] = useState('All');
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  const categories = useMemo(() => ['All', ...new Set(products.map((product) => product.category))], [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
      const term = searchQuery.trim().toLowerCase();
      const matchesSearch = !term || product.name.toLowerCase().includes(term) || product.category.toLowerCase().includes(term) || product.description.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, products]);

  if (loading) return <div className="container" style={{ textAlign: 'center', padding: '100px' }}><h2>Loading products...</h2></div>;

  return (
    <div className="container app-shell" style={{ paddingTop: '20px' }}>
      <div className="catalog-header" style={{ marginBottom: '30px', textAlign: 'center' }}>
        <span className="eyebrow" style={{ marginBottom: '10px' }}>Storefront</span>
        <h1>Featured Electronics</h1>
        <p>Browse our selection of premium automation controllers, IoT kits, and smart devices.</p>
      </div>
      
      <div className="chip-row" style={{ justifyContent: 'center', marginBottom: '40px' }}>
        {categories.map((category) => (
          <button className={`chip ${activeCategory === category ? 'chip--active' : ''}`} key={category} type="button" onClick={() => setActiveCategory(category)}>{category}</button>
        ))}
      </div>
      
      <div className="results-bar">
        <span>{filteredProducts.length} products found {searchQuery && `for "${searchQuery}"`}</span>
      </div>

      <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
        {filteredProducts.map((product) => (
          <article className="product-card" key={product._id} style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="product-badge">{product.badge}</span>
            <Link to={`/product/${product._id}`} className="product-image">
              <img src={product.image} alt={product.name} />
            </Link>
            <div className="product-meta"><span>{product.category}</span><span>⭐ {product.rating}/5</span></div>
            <Link to={`/product/${product._id}`}><h3>{product.name}</h3></Link>
            <p style={{ flexGrow: 1 }}>{product.description}</p>
            <div className="price-row" style={{ marginTop: 'auto', paddingTop: '20px' }}>
              <strong>{formatPrice(product.price)}</strong>
              <span>{formatPrice(product.originalPrice)}</span>
            </div>
            <div className="card-actions">
              <Link to={`/product/${product._id}`} className="action-button action-button--ghost" style={{ flex: 1, display: 'grid', placeItems: 'center' }}>View Details</Link>
              <button className="action-button action-button--solid" style={{ flex: 1 }} type="button" onClick={() => handleAddToCart(product)}>Add to Cart</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const { handleAddToCart } = React.useContext(ShopContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  return (
    <div className="container app-shell" style={{ paddingTop: '40px' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '30px', color: 'var(--muted)', fontWeight: 700, fontSize: '1.1rem' }}>← Back to Products</Link>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
        <div className="product-image" style={{ height: '600px', borderRadius: '30px' }}>
          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        
        <div className="detail-card" style={{ border: 'none', boxShadow: 'none', padding: '0', background: 'transparent' }}>
          <span className="eyebrow">{product.category}</span>
          <h1 style={{ fontSize: '3rem', margin: '16px 0', fontFamily: 'Outfit, sans-serif', lineHeight: 1.1 }}>{product.name}</h1>
          <div className="detail-meta" style={{ marginBottom: '30px', fontSize: '1.1rem' }}>
            <span>⭐ {product.rating}/5 ({product.reviews} reviews)</span>
            <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
          </div>
          
          <div className="detail-price-row" style={{ justifyContent: 'flex-start', gap: '20px', marginBottom: '40px' }}>
            <strong style={{ fontSize: '2.5rem' }}>{formatPrice(product.price)}</strong>
            <span style={{ fontSize: '1.4rem' }}>{formatPrice(product.originalPrice)}</span>
          </div>
          
          <p style={{ fontSize: '1.2rem', marginBottom: '40px', color: 'var(--muted)', lineHeight: 1.8 }}>{product.description}</p>
          
          <h4 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>Key Specifications</h4>
          <ul className="spec-list" style={{ marginBottom: '50px' }}>
            {product.specs?.map((spec) => (<li key={spec} style={{ fontSize: '1.1rem', marginBottom: '10px' }}>{spec}</li>))}
          </ul>
          
          <div className="detail-actions" style={{ gap: '20px', display: 'flex' }}>
            <button className="action-button action-button--solid" style={{ flex: 1, minHeight: '64px', fontSize: '1.2rem' }} type="button" onClick={() => handleAddToCart(product)}>Add to Cart</button>
            <button className="action-button action-button--ghost" style={{ flex: 1, minHeight: '64px', fontSize: '1.2rem' }} type="button" onClick={() => { handleAddToCart(product); navigate('/cart'); }}>Buy Now</button>
          </div>
          <div className="delivery-note" style={{ marginTop: '24px', fontSize: '1.1rem' }}>🚚 {product.delivery}</div>
        </div>
      </div>
    </div>
  );
}

function Cart() {
  const { cartItems, cartSummary, handleQuantityChange, handleRemoveItem } = React.useContext(ShopContext);
  const navigate = useNavigate();

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
                      <strong style={{ fontSize: '1.4rem' }}>{formatPrice(item.price)}</strong>
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
              <div className="summary-row" style={{ fontSize: '1.1rem' }}><span>Tax (18%)</span><strong>{formatPrice(cartSummary.tax)}</strong></div>
              <div className="summary-row summary-row--total" style={{ marginTop: '24px', paddingTop: '24px' }}><span>Total Amount</span><strong style={{ fontSize: '2rem' }}>{formatPrice(cartSummary.total)}</strong></div>
              <button className="action-button action-button--solid action-button--full" style={{ marginTop: '30px', minHeight: '64px', fontSize: '1.2rem' }} type="button" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
            </section>
          </aside>
        )}
      </div>
    </div>
  );
}

function Checkout() {
  const { cartItems, cartSummary, checkout, setCheckout, setOrders, defaultCheckout, setCartItems, setMessage, user } = React.useContext(ShopContext);
  const navigate = useNavigate();
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [latestOrder, setLatestOrder] = useState(null);

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

  const validatePayment = () => {
    const nextErrors = {};
    if (checkout.payment !== 'Cash on Delivery') {
      if (!checkout.cardName.trim()) nextErrors.cardName = 'Name on card is required.';
      if (!/^\d{16}$/.test(checkout.cardNumber.replace(/\s/g, ''))) nextErrors.cardNumber = 'Enter a valid 16 digit card number.';
      if (!/^\d{2}\/\d{2}$/.test(checkout.expiry)) nextErrors.expiry = 'Use MM/YY format.';
      if (!/^\d{3}$/.test(checkout.cvv)) nextErrors.cvv = 'Enter a valid 3 digit CVV.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNextStep = () => {
    if (checkoutStep === 1) {
      if (!validateShipping()) return;
      setCheckoutStep(2);
      return;
    }
    if (checkoutStep === 2) {
      if (!validatePayment()) return;
      setCheckoutStep(3);
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

  const handlePlaceOrder = async () => {
    const orderData = {
      items: cartItems.map(item => ({ product: item._id, name: item.name, quantity: item.quantity, price: item.price, image: item.image })),
      shippingDetails: {
        name: checkout.name,
        email: checkout.email,
        phone: checkout.phone,
        address: checkout.address,
        city: checkout.city,
        state: checkout.state,
        pincode: checkout.pincode,
      },
      paymentMethod: checkout.payment,
      totalPrice: cartSummary.total,
      taxPrice: cartSummary.tax,
      shippingPrice: cartSummary.shipping,
    };

    try {
      const { data } = await createOrder(orderData);
      setOrders((current) => [data, ...current]);
      setLatestOrder(data);
      setCartItems([]);
      setCheckout(defaultCheckout);
      setCheckoutStep(4);
      setErrors({});
      setMessage('Order placed successfully.');
    } catch (error) {
      console.error('Order failed', error);
      setMessage('Failed to place order. Please try again.');
    }
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
              <div className="panel-header"><div><span className="eyebrow">Shipping Details</span><h2>Delivery Information</h2></div></div>
              <div className="form-grid form-grid--two">
                <label><span>Full Name</span><input name="name" value={checkout.name} onChange={handleCheckoutChange} />{errors.name && <small>{errors.name}</small>}</label>
                <label><span>Email</span><input name="email" value={checkout.email} onChange={handleCheckoutChange} />{errors.email && <small>{errors.email}</small>}</label>
                <label><span>Phone Number</span><input name="phone" value={checkout.phone} onChange={handleCheckoutChange} />{errors.phone && <small>{errors.phone}</small>}</label>
                <label><span>City</span><input name="city" value={checkout.city} onChange={handleCheckoutChange} />{errors.city && <small>{errors.city}</small>}</label>
                <label><span>State</span><input name="state" value={checkout.state} onChange={handleCheckoutChange} />{errors.state && <small>{errors.state}</small>}</label>
                <label><span>Pincode</span><input name="pincode" value={checkout.pincode} onChange={handleCheckoutChange} />{errors.pincode && <small>{errors.pincode}</small>}</label>
                <label className="form-grid-span"><span>Full Address</span><textarea name="address" rows="3" value={checkout.address} onChange={handleCheckoutChange} />{errors.address && <small>{errors.address}</small>}</label>
              </div>
            </section>
          )}

          {checkoutStep === 2 && (
            <section className="panel" style={{ padding: '30px' }}>
              <div className="panel-header"><div><span className="eyebrow">Payment Step</span><h2>Select Payment Method</h2></div></div>
              <div className="payment-options">
                {['Cash on Delivery', 'UPI', 'Card Payment', 'Net Banking'].map((method) => (
                  <label className={`payment-card ${checkout.payment === method ? 'payment-card--active' : ''}`} key={method}>
                    <input checked={checkout.payment === method} name="payment" type="radio" value={method} onChange={handleCheckoutChange} /><span>{method}</span>
                  </label>
                ))}
              </div>
              {checkout.payment !== 'Cash on Delivery' && (
                <div className="form-grid form-grid--two payment-form" style={{ marginTop: '30px' }}>
                  <label><span>Name On Card</span><input name="cardName" value={checkout.cardName} onChange={handleCheckoutChange} />{errors.cardName && <small>{errors.cardName}</small>}</label>
                  <label><span>Card Number</span><input name="cardNumber" value={checkout.cardNumber} onChange={handleCheckoutChange} />{errors.cardNumber && <small>{errors.cardNumber}</small>}</label>
                  <label><span>Expiry</span><input name="expiry" placeholder="MM/YY" value={checkout.expiry} onChange={handleCheckoutChange} />{errors.expiry && <small>{errors.expiry}</small>}</label>
                  <label><span>CVV</span><input name="cvv" value={checkout.cvv} onChange={handleCheckoutChange} />{errors.cvv && <small>{errors.cvv}</small>}</label>
                </div>
              )}
            </section>
          )}

          {checkoutStep === 3 && (
            <section className="panel" style={{ padding: '30px' }}>
              <div className="panel-header"><div><span className="eyebrow">Review Order</span><h2>Confirm Details</h2></div></div>
              <div className="review-grid">
                <article className="review-card"><strong>Shipping To</strong><p>{checkout.name}<br />{checkout.address}<br />{checkout.city}, {checkout.state} - {checkout.pincode}<br />{checkout.phone}</p></article>
                <article className="review-card"><strong>Payment Method</strong><p>{checkout.payment}</p></article>
                <article className="review-card review-card--wide"><strong>Items</strong>
                  <div className="review-items">
                    {cartItems.map((item) => <div className="review-item" key={item._id}><span>{item.name} x {item.quantity}</span><strong>{formatPrice(item.price * item.quantity)}</strong></div>)}
                  </div>
                </article>
              </div>
            </section>
          )}

          {checkoutStep === 4 && (
            <section className="panel panel--success" style={{ padding: '80px 40px', maxWidth: '800px', margin: '0 auto' }}>
              <div className="success-badge" style={{ transform: 'scale(1.5)', marginBottom: '30px' }}>🎉 Order Confirmed</div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Thank you for your purchase!</h2>
              <p style={{ fontSize: '1.2rem', marginBottom: '40px' }}>Your order has been successfully placed and is being processed.</p>
              {latestOrder && (
                <div className="success-order" style={{ textAlign: 'left', padding: '30px' }}>
                  <p><strong>Order ID:</strong> {latestOrder._id}</p>
                  <p><strong>Total Paid:</strong> {formatPrice(latestOrder.totalPrice)}</p>
                  <p><strong>Status:</strong> <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>{latestOrder.status}</span></p>
                  <p><strong>Shipping To:</strong> {latestOrder.shippingDetails?.address}</p>
                </div>
              )}
              <div className="success-actions" style={{ justifyContent: 'center', marginTop: '40px' }}>
                <button className="action-button action-button--solid" style={{ minHeight: '56px', padding: '0 32px' }} type="button" onClick={() => navigate('/')}>Continue Shopping</button>
                <button className="action-button action-button--ghost" style={{ minHeight: '56px', padding: '0 32px' }} type="button" onClick={() => navigate('/orders')}>View My Orders</button>
              </div>
            </section>
          )}

          {checkoutStep < 4 && (
            <div className="step-actions" style={{ marginTop: '30px' }}>
              <button className="action-button action-button--ghost" style={{ minHeight: '56px', padding: '0 32px' }} type="button" onClick={handleBackStep}>Back</button>
              {checkoutStep === 3 ? <button className="action-button action-button--solid" style={{ minHeight: '56px', padding: '0 40px' }} type="button" onClick={handlePlaceOrder}>Place Order</button> : <button className="action-button action-button--solid" style={{ minHeight: '56px', padding: '0 40px' }} type="button" onClick={handleNextStep}>Continue</button>}
            </div>
          )}
        </div>

        {checkoutStep < 4 && (
          <aside className="summary-sidebar" style={{ marginTop: '144px' }}>
            <section className="panel" style={{ padding: '30px' }}>
              <div className="panel-header"><div><span className="eyebrow">Order Summary</span><h2>{cartSummary.quantity} items</h2></div></div>
              <div className="summary-row"><span>Subtotal</span><strong>{formatPrice(cartSummary.subtotal)}</strong></div>
              <div className="summary-row"><span>Shipping</span><strong>{formatPrice(cartSummary.shipping)}</strong></div>
              <div className="summary-row"><span>Tax (18%)</span><strong>{formatPrice(cartSummary.tax)}</strong></div>
              <div className="summary-row summary-row--total" style={{ marginTop: '20px', paddingTop: '20px' }}><span>Total Amount</span><strong style={{ fontSize: '1.6rem' }}>{formatPrice(cartSummary.total)}</strong></div>
            </section>
          </aside>
        )}
      </div>
    </div>
  );
}

function Orders() {
  const { orders, user } = React.useContext(ShopContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  return (
    <div className="container app-shell" style={{ paddingTop: '40px' }}>
      <section className="panel" style={{ maxWidth: '900px', margin: '0 auto', padding: '40px' }}>
        <div className="panel-header" style={{ marginBottom: '40px' }}>
          <div><span className="eyebrow">Order History</span><h1 style={{ fontSize: '2.5rem', marginTop: '10px' }}>Your Recent Orders</h1></div>
        </div>
        <div className="orders-list">
          {orders.length ? orders.map((order) => (
            <article className="order-item" key={order._id} style={{ padding: '24px', marginBottom: '20px' }}>
              <div className="order-top" style={{ marginBottom: '16px' }}>
                <strong style={{ fontSize: '1.2rem' }}>{order._id}</strong>
                <span style={{ background: '#d1fae5', color: '#065f46', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold' }}>{order.status}</span>
              </div>
              <p style={{ color: 'var(--text)', fontSize: '1.1rem' }}>{order.items?.length} items shipped to <strong>{order.shippingDetails?.name}</strong></p>
              <p style={{ color: 'var(--muted)', marginBottom: '20px' }}>{order.shippingDetails?.address}</p>
              <div className="order-bottom" style={{ borderTop: '1px solid var(--line)', paddingTop: '20px', marginTop: '20px' }}>
                <span>Ordered on {new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                <strong style={{ fontSize: '1.4rem' }}>{formatPrice(order.totalPrice)}</strong>
              </div>
            </article>
          )) : (
            <div className="empty-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📦</div>
              <h3>No orders yet</h3>
              <p>You haven't placed any orders. Start exploring our catalog.</p>
              <Link to="/" className="action-button action-button--solid" style={{ display: 'inline-block', marginTop: '20px', padding: '12px 32px' }}>Start Shopping</Link>
            </div>
          )}
        </div>
      </section>
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
              <div className="container" style={{ position: 'sticky', top: '100px', zIndex: 50 }}>
                <div className="flash-message" style={{ boxShadow: 'var(--shadow-soft)' }}>{message}</div>
              </div>
            )}
          </ShopContext.Consumer>
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ShopProvider>
  );
}
