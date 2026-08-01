import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ShopContext, formatPrice } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';

function SkeletonProduct() {
  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px', '@media(min-width: 900px)': { gridTemplateColumns: '1fr 1fr' } }}>
        <div>
          <div className="shimmer" style={{ height: '500px', borderRadius: '24px', background: '#e2e8f0', marginBottom: '20px' }}></div>
          <div style={{ display: 'flex', gap: '16px' }}>
            {[1, 2, 3, 4].map(i => <div key={i} className="shimmer" style={{ width: '80px', height: '80px', borderRadius: '12px', background: '#e2e8f0' }}></div>)}
          </div>
        </div>
        <div>
          <div className="shimmer" style={{ height: '24px', width: '30%', borderRadius: '8px', background: '#e2e8f0', marginBottom: '16px' }}></div>
          <div className="shimmer" style={{ height: '48px', width: '80%', borderRadius: '12px', background: '#e2e8f0', marginBottom: '24px' }}></div>
          <div className="shimmer" style={{ height: '60px', width: '40%', borderRadius: '12px', background: '#e2e8f0', marginBottom: '32px' }}></div>
          <div className="shimmer" style={{ height: '150px', width: '100%', borderRadius: '16px', background: '#e2e8f0', marginBottom: '32px' }}></div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="shimmer" style={{ height: '64px', flex: 1, borderRadius: '16px', background: '#e2e8f0' }}></div>
            <div className="shimmer" style={{ height: '64px', flex: 1, borderRadius: '16px', background: '#e2e8f0' }}></div>
          </div>
        </div>
      </div>
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
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState('description');
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Simulate API fetch delay for skeleton loading demo
    const getProduct = async () => {
      try {
        const { fetchProduct } = await import('../api');
        const { data } = await fetchProduct(id);
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product', error);
      } finally {
        setTimeout(() => setLoading(false), 500); // Artificial delay to show beautiful skeletons
      }
    };
    getProduct();
  }, [id]);

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

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  if (loading) return <SkeletonProduct />;
  
  if (!product) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#0f172a', marginBottom: '16px' }}>Product not found</h1>
        <p style={{ color: '#64748b', marginBottom: '32px' }}>The product you are looking for might have been removed or is temporarily unavailable.</p>
        <Link to="/" style={{ background: '#0f172a', color: '#fff', textDecoration: 'none', padding: '16px 32px', borderRadius: '12px', fontWeight: 600 }}>Return to Shop</Link>
      </div>
    );
  }

  const inclusivePrice = getInclusivePrice(product.price);
  const inclusiveOriginal = getInclusivePrice(product.originalPrice || product.price);
  const discountAmount = inclusiveOriginal - inclusivePrice;
  const discountPercent = Math.round((discountAmount / inclusiveOriginal) * 100);
  const isWishlisted = wishlistItems.some(item => item._id === product._id);
  const stock = product.stock !== undefined ? product.stock : 15;

  // Use product images if available, else duplicate the main image to mock a gallery
  const images = product.images?.length > 0 ? product.images : [product.image, product.image, product.image];

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '120px' }}>
      
      {/* Breadcrumbs */}
      <div style={{ background: '#fff', borderBottom: '1px solid #f1f5f9', padding: '16px 0' }}>
        <div className="container" style={{ display: 'flex', gap: '8px', fontSize: '0.9rem', color: '#64748b' }}>
          <Link to="/" style={{ color: '#64748b', textDecoration: 'none' }}>Home</Link> / 
          <Link to={`/products?search=${product.category}`} style={{ color: '#64748b', textDecoration: 'none' }}>{product.category}</Link> / 
          <span style={{ color: '#0f172a', fontWeight: 500 }}>{product.name}</span>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', alignItems: 'start' }}>
          
          {/* Left Column: Image Gallery */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              style={{ background: '#fff', borderRadius: '24px', padding: '40px', marginBottom: '24px', position: 'relative', overflow: 'hidden', cursor: isZoomed ? 'zoom-out' : 'zoom-in', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' }}
              onClick={() => setIsZoomed(!isZoomed)}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setIsZoomed(false)}
            >
              {discountPercent > 0 && <span style={{ position: 'absolute', top: '24px', left: '24px', background: '#ef4444', color: '#fff', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, zIndex: 10 }}>{discountPercent}% OFF</span>}
              
              <div style={{ width: '100%', paddingBottom: '100%', position: 'relative' }}>
                <img 
                  src={images[activeImage]} 
                  alt={product.name} 
                  style={{ 
                    position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', 
                    transform: isZoomed ? 'scale(2)' : 'scale(1)', 
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`, 
                    transition: isZoomed ? 'none' : 'transform 0.3s ease' 
                  }} 
                />
              </div>
            </motion.div>
            
            {/* Thumbnails */}
            <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '10px' }}>
              {images.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  style={{ width: '80px', height: '80px', background: '#fff', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', border: activeImage === idx ? '2px solid #6366f1' : '2px solid transparent', opacity: activeImage === idx ? 1 : 0.6, transition: 'all 0.2s ease', flexShrink: 0, padding: '8px' }}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Column: Product Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <span style={{ display: 'inline-block', color: '#6366f1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem', marginBottom: '12px' }}>{product.category}</span>
            <h1 style={{ fontSize: '2.8rem', margin: '0 0 16px', color: '#0f172a', lineHeight: 1.1, fontWeight: 800, letterSpacing: '-0.5px' }}>{product.name}</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', fontSize: '1rem', color: '#64748b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24' }}>
                {'★'.repeat(Math.floor(product.rating || 5))}{'☆'.repeat(5 - Math.floor(product.rating || 5))}
                <span style={{ color: '#0f172a', fontWeight: 600, marginLeft: '4px' }}>{product.rating || 5.0}</span>
              </div>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#cbd5e1' }}></span>
              <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>{(product.reviews || 0) + 124} Reviews</span>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#cbd5e1' }}></span>
              <span style={{ color: stock > 0 ? '#10b981' : '#ef4444', fontWeight: 700 }}>{stock > 0 ? '✓ In Stock' : 'Out of Stock'}</span>
            </div>
            
            <div style={{ background: '#fff', padding: '32px', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', marginBottom: '32px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
                  <strong style={{ fontSize: '3rem', color: '#0f172a', lineHeight: 1 }}>{formatPrice(inclusivePrice)}</strong>
                  {discountPercent > 0 && <span style={{ fontSize: '1.5rem', color: '#94a3b8', textDecoration: 'line-through' }}>{formatPrice(inclusiveOriginal)}</span>}
                </div>
                <small style={{ color: '#64748b', fontSize: '0.9rem' }}>Inclusive of all taxes</small>
              </div>
              
              {/* Actions */}
              <div style={{ gap: '16px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <button 
                    style={{ flex: 1, padding: '20px', fontSize: '1.1rem', background: stock === 0 ? '#e2e8f0' : '#f1f5f9', color: stock === 0 ? '#94a3b8' : '#0f172a', borderRadius: '16px', border: 'none', fontWeight: 700, cursor: stock === 0 ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }} 
                    onClick={() => handleAddToCart(product)}
                    disabled={stock === 0}
                    onMouseOver={e => !stock === 0 && (e.currentTarget.style.background = '#e2e8f0')}
                    onMouseOut={e => !stock === 0 && (e.currentTarget.style.background = '#f1f5f9')}
                  >
                    Add to Cart
                  </button>
                  <button 
                    style={{ width: '64px', height: '64px', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', cursor: 'pointer', transition: 'all 0.2s' }}
                    onClick={() => handleToggleWishlist(product)}
                    onMouseOver={e => e.currentTarget.style.border = '1px solid #cbd5e1'}
                    onMouseOut={e => e.currentTarget.style.border = '1px solid #e2e8f0'}
                  >
                    {isWishlisted ? <span style={{ color: '#ef4444' }}>❤️</span> : <span style={{ color: '#94a3b8' }}>♡</span>}
                  </button>
                </div>
                <button 
                  style={{ width: '100%', padding: '20px', fontSize: '1.1rem', background: stock === 0 ? '#e2e8f0' : '#0f172a', color: stock === 0 ? '#94a3b8' : '#fff', borderRadius: '16px', border: 'none', fontWeight: 700, cursor: stock === 0 ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: '0 10px 15px -3px rgba(15,23,42,0.2)' }} 
                  onClick={() => { handleAddToCart(product); navigate('/cart'); }}
                  disabled={stock === 0}
                  onMouseOver={e => !stock === 0 && (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseOut={e => !stock === 0 && (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Delivery & Assurance */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '1.5rem' }}>🚚</span>
                <div>
                  <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>Fast Delivery</div>
                  <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{product.delivery || 'Usually within 3-5 days'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '1.5rem' }}>🛡️</span>
                <div>
                  <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>Secure Payment</div>
                  <div style={{ color: '#64748b', fontSize: '0.8rem' }}>SSL Encrypted Checkout</div>
                </div>
              </div>
            </div>

            {/* Tabs for Details */}
            <div>
              <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
                {['description', 'specifications'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{ background: 'none', border: 'none', padding: '0 0 12px', fontSize: '1.1rem', fontWeight: 600, color: activeTab === tab ? '#0f172a' : '#94a3b8', borderBottom: activeTab === tab ? '2px solid #0f172a' : '2px solid transparent', cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s' }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  {activeTab === 'description' && (
                    <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.8 }}>
                      {product.description}
                    </p>
                  )}
                  {activeTab === 'specifications' && (
                    <ul style={{ paddingLeft: '20px', color: '#475569', fontSize: '1.1rem', lineHeight: 2 }}>
                      {product.specs?.length > 0 ? product.specs.map((spec, i) => (
                        <li key={i} style={{ marginBottom: '8px' }}>{spec}</li>
                      )) : (
                        <>
                          <li>Premium build quality</li>
                          <li>Compatible with standard setups</li>
                          <li>1 Year Manufacturer Warranty</li>
                          <li>Includes user manual and accessories</li>
                        </>
                      )}
                    </ul>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Share & Affiliate Section */}
            <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid #e2e8f0' }}>
              <h4 style={{ marginBottom: '16px', fontSize: '1.1rem', color: '#0f172a', fontWeight: 700 }}>Share & Earn</h4>
              
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <button onClick={() => handleShare('copy')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: '#334155' }}>🔗 Copy Link</button>
                <button onClick={() => handleShare('whatsapp')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>WhatsApp</button>
                <button onClick={() => handleShare('facebook')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#1877F2', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Facebook</button>
              </div>
              
              <div style={{ background: '#f1f5f9', padding: '24px', borderRadius: '16px' }}>
                <h5 style={{ margin: '0 0 12px', fontSize: '1rem', color: '#0f172a' }}>BECS Affiliate Program</h5>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '16px' }}>Generate a unique link and earn 5% commission on every sale made through your link.</p>
                {affiliateLink ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="text" readOnly value={affiliateLink} style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', outline: 'none', color: '#334155' }} />
                    <button onClick={() => { navigator.clipboard.writeText(affiliateLink); alert('Copied!'); }} style={{ padding: '0 24px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Copy</button>
                  </div>
                ) : (
                  <button onClick={handleGenerateAffiliate} style={{ padding: '12px 24px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', color: '#0f172a' }}>Generate My Link</button>
                )}
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
