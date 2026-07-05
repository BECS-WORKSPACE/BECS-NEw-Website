import React, { useState, forwardRef, useImperativeHandle } from 'react';

const MockPaymentUI = forwardRef(({ onSuccess, onBack, amount }, ref) => {
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

  useImperativeHandle(ref, () => ({
    submitPayment: handlePay,
    isProcessing,
    activeTab
  }));

  return (
    <div className="mock-payment-ui" style={{ width: '100%' }}>
      <div className="mock-payment-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--line)', paddingBottom: '10px' }}>
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
              marginBottom: '-11px',
              flex: 1
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
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '16px', textAlign: 'center' }}>Pay directly using your installed UPI apps</p>
            <div className="mock-app-icon-container" style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div className="mock-app-icon" onClick={handlePay} style={{ cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ width: '50px', height: '50px', background: '#f0f0f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '8px', margin: '0 auto' }}>G</div>
                <span style={{ fontSize: '0.8rem' }}>GPay</span>
              </div>
              <div className="mock-app-icon" onClick={handlePay} style={{ cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ width: '50px', height: '50px', background: '#5f259f', color: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '8px', margin: '0 auto' }}>P</div>
                <span style={{ fontSize: '0.8rem' }}>PhonePe</span>
              </div>
              <div className="mock-app-icon" onClick={handlePay} style={{ cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ width: '50px', height: '50px', background: '#002e6e', color: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '8px', margin: '0 auto' }}>Pay</div>
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
      
      <div className="step-actions desktop-only" style={{ marginTop: '30px' }}>
        <button className="action-button action-button--ghost" style={{ minHeight: '56px', padding: '0 32px' }} type="button" onClick={onBack} disabled={isProcessing}>Back</button>
        <button className="action-button action-button--solid" style={{ minHeight: '56px', padding: '0 40px', flex: 1 }} type="button" onClick={handlePay} disabled={isProcessing}>
          {isProcessing ? 'Processing Payment...' : activeTab === 'qr' ? `I have scanned & paid ₹${amount}` : `Pay ₹${amount}`}
        </button>
      </div>
    </div>
  );
});

export default MockPaymentUI;
