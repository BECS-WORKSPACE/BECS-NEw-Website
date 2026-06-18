import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { ShopContext, formatPrice } from '../context/ShopContext';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import API, { fetchProducts, fetchProduct, createOrder, fetchMyOrders, login as apiLogin, register as apiRegister, createPaymentIntent } from '../api';

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

export default ProductDetail;
