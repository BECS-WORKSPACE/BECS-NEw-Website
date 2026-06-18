import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { ShopProvider, ShopContext } from './context/ShopContext';

import Navbar from './components/Navbar';


import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';

export default function App() {
  const routerBasename = import.meta.env.DEV ? '' : (import.meta.env.VITE_SUBDOMAIN_DEPLOY === 'true' ? '' : '/store');
  return (
    <ShopProvider>
      <Router basename={routerBasename}>
        <div className="shop-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <ShopContext.Consumer>
            {({ message }) => message && (
              <div className="toast-notification">
                <div className="toast-icon">✓</div>
                <div className="toast-content">{message}</div>
              </div>
            )}
          </ShopContext.Consumer>
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ShopProvider>
  );
}
