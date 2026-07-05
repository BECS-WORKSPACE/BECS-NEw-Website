import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { ShopContext, formatPrice } from '../context/ShopContext';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import API, { fetchProducts, fetchProduct, createOrder, fetchMyOrders, login as apiLogin, register as apiRegister, createPaymentIntent } from '../api';
import MockPaymentUI from '../components/MockPaymentUI';

function Checkout() {
  const { cartItems, cartSummary, checkout, setCheckout, setOrders, defaultCheckout, setCartItems, setMessage, user, getInclusivePrice, shippingSpeed, setShippingSpeed, calculateEDD, addresses, setAddresses } = React.useContext(ShopContext);
  const navigate = useNavigate();
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [latestOrder, setLatestOrder] = useState(null);
  const [showTaxes, setShowTaxes] = useState(false);
  const paymentRef = useRef();
  
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
        name: checkout.name || user?.name || 'Customer', 
        email: checkout.email || user?.email || 'customer@example.com', 
        phone: checkout.phone || '0000000000', 
        address: checkout.address || 'N/A', 
        city: checkout.city || 'N/A', 
        state: checkout.state || 'N/A', 
        pincode: checkout.pincode || '000000',
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
      const errMsg = error.response?.data?.message || error.message;
      setMessage(`Failed to initialize order: ${errMsg}`);
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
      <div className={`checkout-shell ${checkoutStep === 4 ? 'checkout-shell-done' : ''}`}>
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
                <div className="addresses-grid">
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
            <section className="panel review-panel">
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
            <section className="panel payment-panel">
              <div className="panel-header"><div><span className="eyebrow">Payment Step</span><h2>Complete your payment</h2></div></div>
              <MockPaymentUI ref={paymentRef} onSuccess={handlePaymentSuccess} onBack={handleBackStep} amount={cartSummary.total} />
            </section>
          )}

          {checkoutStep === 4 && (
            <section className="panel panel--success success-panel">
              <div className="success-badge" style={{ transform: 'scale(1.5)', marginBottom: '30px' }}>🎉 Order Confirmed</div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Thank you for your purchase!</h2>
              <p style={{ fontSize: '1.2rem', marginBottom: '40px' }}>Your order has been successfully placed and is being processed.</p>
              {latestOrder && (
                <div className="success-order">
                  <p><strong>Order Number:</strong> #{latestOrder._id}</p>
                  <p><strong>Payment Method:</strong> {latestOrder.paymentMethod}</p>
                  <p><strong>Payment Status:</strong> <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>{latestOrder.isPaid ? 'Paid' : 'Pending'}</span></p>
                  <p><strong>Delivery Estimate:</strong> Arrives between {edd.minStr} – {edd.maxStr}</p>
                  <p><strong>Shipping Address:</strong><br />{latestOrder.shippingDetails?.address}, {latestOrder.shippingDetails?.city}</p>
                  <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button className="action-button action-button--ghost" style={{ padding: '8px 16px', fontSize: '0.9rem', flex: 1 }}>Download Invoice</button>
                    <button className="action-button action-button--solid" style={{ padding: '8px 16px', fontSize: '0.9rem', flex: 1 }}>Track Order</button>
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
            <div className="step-actions desktop-only" style={{ marginTop: '30px' }}>
              <button className="action-button action-button--ghost" style={{ minHeight: '56px', padding: '0 32px' }} type="button" onClick={handleBackStep}>Back</button>
              {checkoutStep === 2 ? <button className="action-button action-button--solid" style={{ minHeight: '56px', padding: '0 40px' }} type="button" onClick={handleProceedToPayment}>Proceed to Payment</button> : <button className="action-button action-button--solid" style={{ minHeight: '56px', padding: '0 40px' }} type="button" onClick={handleNextStep}>Continue</button>}
            </div>
          )}
        </div>

        {checkoutStep < 4 && (
          <aside className="summary-sidebar summary-sidebar--checkout">
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
                  <span>{cartSummary.shipping === 0 ? 'Free' : formatPrice(cartSummary.shipping)}</span>
                </div>
                
                <div style={{ textAlign: 'right', marginTop: '4px' }}>
                  <button className="text-button" type="button" onClick={() => setShowTaxes(!showTaxes)} style={{ fontSize: '0.75rem' }}>View tax breakdown ▼</button>
                </div>
                {showTaxes && (
                  <div style={{ background: '#f9f9f9', padding: '8px 12px', borderRadius: '4px', fontSize: '0.8rem', marginTop: '8px' }}>
                    <div className="summary-line"><span>Item Amount:</span><span>{formatPrice(cartSummary.total * 0.82)}</span></div>
                    <div className="summary-line"><span>IGST (18%):</span><span>{formatPrice(cartSummary.total * 0.18)}</span></div>
                  </div>
                )}
              </div>
              
              <div className="summary-total" style={{ borderTop: '1px solid #d5d9d9', paddingTop: '16px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '1rem', color: '#0f1111' }}>Order Total:</strong>
                <div style={{ textAlign: 'right' }}>
                  <strong style={{ fontSize: '1.4rem', color: '#B12704' }}>{formatPrice(cartSummary.total)}</strong>
                  <div style={{ fontSize: '0.7rem', color: '#565959' }}>(Inclusive of all taxes)</div>
                </div>
              </div>
              
              {cartSummary.discount > 0 && (
                <div style={{ marginTop: '16px', padding: '8px', background: '#ecf9ec', color: '#007600', borderRadius: '4px', textAlign: 'center', fontSize: '0.8rem', fontWeight: '500', border: '1px solid #c9e8c9' }}>
                  Yay! Your total savings are {formatPrice(cartSummary.discount)}
                </div>
              )}

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
        
        {checkoutStep < 4 && (
          <div className="step-actions mobile-only" style={{ marginTop: '20px', width: '100%' }}>
            <button className="action-button action-button--ghost" style={{ minHeight: '56px', padding: '0 32px', flex: 1 }} type="button" onClick={handleBackStep}>Back</button>
            {checkoutStep === 1 && <button className="action-button action-button--solid" style={{ minHeight: '56px', padding: '0 40px', flex: 1 }} type="button" onClick={handleNextStep}>Continue</button>}
            {checkoutStep === 2 && <button className="action-button action-button--solid" style={{ minHeight: '56px', padding: '0 40px', flex: 1 }} type="button" onClick={handleProceedToPayment}>Proceed to Payment</button>}
            {checkoutStep === 3 && (
              <button 
                className="action-button action-button--solid" 
                style={{ minHeight: '56px', padding: '0 40px', flex: 1 }} 
                type="button" 
                onClick={() => paymentRef.current?.submitPayment()}
                disabled={paymentRef.current?.isProcessing}
              >
                {paymentRef.current?.isProcessing ? 'Processing...' : paymentRef.current?.activeTab === 'qr' ? `I have scanned & paid ₹${cartSummary.total}` : `Pay ₹${cartSummary.total}`}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;
