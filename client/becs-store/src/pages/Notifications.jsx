import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import API, { fetchProducts, fetchProduct, createOrder, fetchMyOrders, login as apiLogin, register as apiRegister, createPaymentIntent } from '../api';

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

export default Notifications;
