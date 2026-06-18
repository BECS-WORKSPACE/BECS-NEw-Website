import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import API, { fetchProducts, fetchProduct, createOrder, fetchMyOrders, login as apiLogin, register as apiRegister, createPaymentIntent } from '../api';

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

export default Wishlist;
