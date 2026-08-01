import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext, formatPrice } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';

function SkeletonCard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '16px', background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
      <div className="shimmer" style={{ height: '220px', borderRadius: '12px', background: '#f1f5f9', marginBottom: '16px' }}></div>
      <div className="shimmer" style={{ height: '16px', width: '40%', borderRadius: '4px', background: '#f1f5f9', marginBottom: '12px' }}></div>
      <div className="shimmer" style={{ height: '24px', width: '80%', borderRadius: '4px', background: '#f1f5f9', marginBottom: '12px' }}></div>
      <div className="shimmer" style={{ height: '36px', width: '100%', borderRadius: '8px', background: '#f1f5f9', marginTop: 'auto' }}></div>
    </div>
  );
}

function Home() {
  const { products, loading, handleAddToCart, getInclusivePrice, cartItems, wishlistItems, handleToggleWishlist } = React.useContext(ShopContext);
  const navigate = useNavigate();

  // 1. Premium Hero Slider Data
  const [currentBanner, setCurrentBanner] = useState(0);
  const banners = [
    {
      id: 1,
      tag: 'New Generation',
      title: 'Smart Electronics',
      subtitle: 'Experience the future of IoT and Embedded systems with our premium modules and dev boards.',
      bg: '#e0e7ff', // Soft Indigo
      color: '#0f172a',
      accent: '#4f46e5',
      img: '/images/embedded_dev_board.png',
      badge: '20% OFF'
    },
    {
      id: 2,
      tag: 'Industrial Grade',
      title: 'Automation Made Simple',
      subtitle: 'Robust PLCs, smart relays, and contactors for heavy-duty industrial applications.',
      bg: '#fef3c7', // Soft Amber
      color: '#0f172a',
      accent: '#d97706',
      img: '/images/automation_controller.png',
      badge: 'Bestseller'
    },
    {
      id: 3,
      tag: 'Starter Kits',
      title: 'Learn & Build',
      subtitle: 'Everything you need to start building Arduino and Raspberry Pi projects today.',
      bg: '#dcfce7', // Soft Green
      color: '#0f172a',
      accent: '#059669',
      img: '/images/iot_starter_kit.png',
      badge: 'New Arrival'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentBanner((prev) => (prev + 1) % banners.length), 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const categories = [
    { name: 'Arduino', icon: '⚡', img: '/images/iot_starter_kit.png' },
    { name: 'Sensors', icon: '🌡️', img: '/images/circuit_tools_kit.png' },
    { name: 'Automation', icon: '⚙️', img: '/images/automation_controller.png' },
    { name: 'Power', icon: '🔋', img: '/images/power_backup_module.png' },
    { name: 'Displays', icon: '📺', img: '/images/pcb_design_console.png' },
    { name: 'Tools', icon: '🔧', img: '/images/security_camera_set.png' }
  ];

  const featuredProducts = useMemo(() => [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4), [products]);
  const bestSellers = useMemo(() => [...products].sort((a, b) => (b.price || 0) - (a.price || 0)).slice(0, 8), [products]);
  const recentlyAdded = useMemo(() => [...products].slice(-4).reverse(), [products]);

  const renderProductCard = (product) => {
    const inclusivePrice = getInclusivePrice(product.price);
    const inclusiveOriginal = getInclusivePrice(product.originalPrice || product.price);
    const discountPercent = Math.round(((inclusiveOriginal - inclusivePrice) / inclusiveOriginal) * 100);
    const isWishlisted = wishlistItems.some(item => item._id === product._id);
    const stock = product.stock !== undefined ? product.stock : 15;
    const cartItem = cartItems.find((item) => item._id === product._id);

    return (
      <div
        key={product._id}
        className="premium-product-card"
        style={{ display: 'flex', flexDirection: 'column', position: 'relative', background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden', transition: 'all 0.3s ease' }}
      >
        {/* Floating Actions on Hover (CSS handled) */}
        <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={(e) => { e.preventDefault(); handleToggleWishlist(product); }}
            style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', cursor: 'pointer', fontSize: '1.2rem', color: isWishlisted ? '#ef4444' : '#94a3b8', transition: 'all 0.2s' }}
            onMouseOver={e => e.currentTarget.style.color = '#ef4444'}
            onMouseOut={e => e.currentTarget.style.color = isWishlisted ? '#ef4444' : '#94a3b8'}
          >
            {isWishlisted ? '❤️' : '♡'}
          </button>
        </div>

        {discountPercent > 0 && <span style={{ position: 'absolute', top: '16px', left: '16px', background: '#ef4444', color: '#fff', padding: '4px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, zIndex: 10, letterSpacing: '0.5px' }}>-{discountPercent}%</span>}

        <Link to={`/product/${product._id}`} style={{ position: 'relative', overflow: 'hidden', padding: '30px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '240px' }}>
          <img
            className="product-img-zoom"
            src={product.image || '/images/iot_starter_kit.png'}
            onError={(e) => { e.target.onerror = null; e.target.src = '/images/iot_starter_kit.png'; }}
            alt={product.name}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transition: 'transform 0.4s ease' }}
          />
        </Link>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
            <span>{product.category}</span>
          </div>
          <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#0f172a', margin: '0 0 8px 0', lineHeight: 1.4, fontWeight: 700, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</h3>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '16px', fontSize: '0.85rem', color: '#fbbf24' }}>
            {'★'.repeat(Math.floor(product.rating || 5))}{'☆'.repeat(5 - Math.floor(product.rating || 5))}
            <span style={{ color: '#64748b', marginLeft: '4px' }}>({product.reviews || 12})</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'auto', marginBottom: '20px' }}>
            <strong style={{ fontSize: '1.3rem', color: '#0f172a', fontWeight: 800 }}>{formatPrice(inclusivePrice)}</strong>
            {discountPercent > 0 && <span style={{ fontSize: '0.9rem', color: '#94a3b8', textDecoration: 'line-through' }}>{formatPrice(inclusiveOriginal)}</span>}
          </div>

          <button
            style={{ width: '100%', padding: '12px', fontSize: '0.95rem', background: stock === 0 ? '#f1f5f9' : (cartItem ? '#6366f1' : '#0f172a'), color: stock === 0 ? '#94a3b8' : '#fff', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: stock === 0 ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
            onClick={(e) => { e.preventDefault(); handleAddToCart(product); }}
            disabled={stock === 0}
            onMouseOver={e => !stock === 0 && (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseOut={e => !stock === 0 && (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {stock === 0 ? 'Out of Stock' : (cartItem ? 'Added to Cart' : 'Add to Cart')}
          </button>
        </div>
        <style dangerouslySetInnerHTML={{
          __html: `
          .premium-product-card:hover { border-color: #cbd5e1; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1); }
          .premium-product-card:hover .product-img-zoom { transform: scale(1.08); }
        `}} />
      </div>
    );
  };

  return (
    <div style={{ background: '#fff', minHeight: '100vh', paddingBottom: '0' }}>

      {/* 1. Premium Apple/Nike Style Hero Slider */}
      <section style={{ position: 'relative', height: '620px', background: banners[currentBanner].bg, transition: 'background 0.8s ease', marginTop: '32px', borderRadius: '24px', overflow: 'hidden' }} className="container">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBanner}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 64px' }}
          >
            <div className="hero-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="hero-badge" style={{ color: banners[currentBanner].accent }}>
                {banners[currentBanner].tag}
              </motion.div>
              <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="hero-title" style={{ color: banners[currentBanner].color }}>
                {banners[currentBanner].title}
              </motion.h1>
              <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="hero-subtitle" style={{ color: banners[currentBanner].color, opacity: 0.8 }}>
                {banners[currentBanner].subtitle}
              </motion.p>
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="hero-actions" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <button className="action-button action-button--solid" onClick={() => navigate('/products?search=all')} style={{ padding: '18px 40px', fontSize: '1.1rem' }}>Shop Now</button>
                <button className="action-button action-button--ghost" onClick={() => navigate('/products?search=all')} style={{ padding: '18px 40px', fontSize: '1.1rem' }}>Explore Collection</button>
              </motion.div>
            </div>

            <div className="desktop-only" style={{ flex: 1, height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }} style={{ position: 'relative', width: '80%', height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={banners[currentBanner].img} alt="Product" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', mixBlendMode: 'multiply', filter: 'contrast(1.1)' }} />
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8, type: "spring" }} style={{ position: 'absolute', top: '10%', right: '0', background: banners[currentBanner].accent, color: '#fff', padding: '12px 24px', borderRadius: '50px', fontWeight: 800, fontSize: '1rem', boxShadow: '0 10px 20px rgba(0,0,0,0.15)', zIndex: 10 }}>
                    {banners[currentBanner].badge}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slider Controls */}
        <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '16px', zIndex: 10 }}>
          {banners.map((_, i) => (
            <button key={i} onClick={() => setCurrentBanner(i)} style={{ width: currentBanner === i ? '40px' : '12px', height: '12px', borderRadius: '6px', background: '#0f172a', opacity: currentBanner === i ? 1 : 0.2, border: 'none', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}></button>
          ))}
        </div>
      </section>

      {/* 2. Promotional Cards Section (Below Hero) */}
      <section className="container" style={{ padding: '60px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          {[
            { title: 'Free Shipping', desc: 'On orders above ₹499', icon: '🚚', bg: '#fef3c7', route: '/products?search=all' },
            { title: 'Arduino Kits', desc: 'Starting from ₹999', icon: '⚡', bg: '#e0e7ff', route: '/products?search=Arduino' },
            { title: 'Best Sellers', desc: 'Shop top rated items', icon: '🔥', bg: '#fee2e2', route: '/products?search=best' },
            { title: 'Educational Kits', desc: 'Learn electronics', icon: '📚', bg: '#dcfce7', route: '/products?search=Educational' }
          ].map(promo => (
            <div key={promo.title} onClick={() => navigate(promo.route)} style={{ background: promo.bg, padding: '30px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '2.5rem', background: '#fff', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>{promo.icon}</div>
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: '1.1rem', color: '#0f172a', fontWeight: 800 }}>{promo.title}</h4>
                <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem', fontWeight: 500 }}>{promo.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Shop By Category */}
      <section className="container" style={{ padding: '40px 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2.5rem', margin: '0 0 8px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>Shop by Category</h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Discover our wide range of electronic components</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px' }}>
          {categories.map((cat, i) => (
            <Link key={cat.name} to={`/products?search=${cat.name}`} style={{ textDecoration: 'none' }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ background: '#f8fafc', borderRadius: '16px', overflow: 'hidden', textAlign: 'center', paddingBottom: '20px', border: '1px solid #f1f5f9', transition: 'all 0.3s' }}
                onMouseOver={e => { e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                onMouseOut={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#f1f5f9'; }}
              >
                <div style={{ height: '140px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', position: 'relative' }}>
                  <img src={cat.img} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(248,250,252,1) 0%, rgba(248,250,252,0) 100%)' }}></div>
                  <div style={{ position: 'absolute', fontSize: '3rem', bottom: '10px' }}>{cat.icon}</div>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{cat.name}</div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured Products (Trending Now) */}
      <section className="container" style={{ padding: '0 24px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', margin: '0', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>Trending Now</h2>
          </div>
          <Link to="/products?search=trending" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 700, fontSize: '1rem' }}>View All →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {loading ? Array(4).fill().map((_, i) => <SkeletonCard key={i} />) : featuredProducts.map(product => renderProductCard(product))}
        </div>
      </section>

      {/* 5. Industrial Solutions Banner */}
      <section className="container" style={{ padding: '0 24px 80px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: '24px', padding: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff', overflow: 'hidden', position: 'relative' }}
        >
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '500px' }}>
            <div style={{ color: '#4ade80', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.9rem', marginBottom: '16px' }}>B2B Solutions</div>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, margin: '0 0 20px', lineHeight: 1.1, letterSpacing: '-1px' }}>Industrial Grade Components</h2>
            <p style={{ fontSize: '1.1rem', color: '#94a3b8', marginBottom: '32px', lineHeight: 1.6 }}>Equip your factory or next big automation project with our heavy-duty contactors, PLCs, and smart relays. Bulk discounts available.</p>
            <button onClick={() => navigate('/products?search=industrial')} style={{ background: '#fff', color: '#0f172a', border: 'none', padding: '16px 32px', borderRadius: '30px', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer' }}>Shop Industrial</button>
          </div>
          <div className="desktop-only" style={{ position: 'absolute', right: '0', top: '0', bottom: '0', width: '50%', background: 'url(/images/automation_controller.png) center/cover', opacity: 0.5, zIndex: 1, maskImage: 'linear-gradient(to right, transparent, black)' }}></div>
        </motion.div>
      </section>

      {/* 6. Best Sellers */}
      <section style={{ background: '#f8fafc', padding: '80px 0' }}>
        <div className="container" style={{ padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', margin: '0', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>Best Sellers</h2>
            </div>
            <Link to="/products?search=best" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 700, fontSize: '1rem' }}>View All →</Link>
          </div>
          <div className="product-grid-responsive">
            {loading ? Array(8).fill().map((_, i) => <SkeletonCard key={i} />) : bestSellers.map(product => renderProductCard(product))}
          </div>
        </div>
      </section>

      {/* 7. Why Shop With BECS & Newsletter (Integrated into Footer flow) */}
      <section className="container" style={{ padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.5rem', margin: '0 0 16px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>Why Shop With BECS?</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', textAlign: 'center' }}>
          {[
            { title: 'Quality Assured', desc: 'Every product is tested for strict quality control before shipping.', icon: '🛡️' },
            { title: 'Fast Delivery', desc: 'Express shipping across India with reliable courier partners.', icon: '⚡' },
            { title: 'Expert Support', desc: 'Technical guidance from engineers to help you build better.', icon: '👨‍💻' }
          ].map(feature => (
            <div key={feature.title}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>{feature.icon}</div>
              <h4 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 800, marginBottom: '12px' }}>{feature.title}</h4>
              <p style={{ color: '#64748b', lineHeight: 1.6 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default Home;
