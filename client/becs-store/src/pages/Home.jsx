import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { ShopContext, formatPrice } from '../context/ShopContext';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import API, { fetchProducts, fetchProduct, createOrder, fetchMyOrders, login as apiLogin, register as apiRegister, createPaymentIntent } from '../api';

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

export default Home;
