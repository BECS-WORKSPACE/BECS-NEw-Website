import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { ShopContext, formatPrice } from '../context/ShopContext';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import API, { fetchProducts, fetchProduct, createOrder, fetchMyOrders, login as apiLogin, register as apiRegister, createPaymentIntent } from '../api';

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

export default Cart;
