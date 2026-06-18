import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import API, { fetchProducts, fetchProduct, createOrder, fetchMyOrders, login as apiLogin, register as apiRegister, createPaymentIntent } from '../api';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';


const STORAGE_KEYS = {
  cart: 'becs_ecommerce_cart',
  user: 'becs_user',
  wishlist: 'becs_ecommerce_wishlist',
};

const defaultCheckout = {
  name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '',
  payment: 'Cash on Delivery', cardName: '', cardNumber: '', expiry: '', cvv: '',
};

const formatPrice = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

const safeRead = (key, fallback) => {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const getInclusivePrice = (price) => Math.round(price * 1.18);

const calculateEDD = (speed, pincode) => {
  const now = new Date();
  const cutoffHour = 14; // 2:00 PM
  let processingDays = now.getHours() >= cutoffHour ? 1 : 0;
  
  // Skip Sundays for processing start
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() + processingDays);
  if (startDate.getDay() === 0) startDate.setDate(startDate.getDate() + 1);
  
  // Transit Time Mock based on pincode first digit and speed
  // Speed factor: Standard (3-5), Express (2-3), Priority (1-2)
  let baseTransitMin = 3;
  let baseTransitMax = 5;
  
  if (speed === 'Priority Delivery') {
    baseTransitMin = 1;
    baseTransitMax = 2;
  } else if (speed === 'Express Delivery') {
    baseTransitMin = 2;
    baseTransitMax = 3;
  }
  
  // Operational buffer: 1 day
  const buffer = 1;
  
  const minDate = new Date(startDate);
  minDate.setDate(minDate.getDate() + baseTransitMin);
  if (minDate.getDay() === 0) minDate.setDate(minDate.getDate() + 1); // Skip Sunday delivery
  
  const maxDate = new Date(startDate);
  maxDate.setDate(maxDate.getDate() + baseTransitMax + buffer);
  if (maxDate.getDay() === 0) maxDate.setDate(maxDate.getDate() + 1);

  // Time remaining for cutoff
  let hoursLeft = cutoffHour - now.getHours() - 1;
  let minutesLeft = 60 - now.getMinutes();
  if (hoursLeft < 0) {
    hoursLeft += 24;
    // if ordered tomorrow before cutoff
  }
  
  return {
    minStr: minDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    maxStr: maxDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    countdown: `${hoursLeft}h ${minutesLeft}m`,
    isAfterCutoff: now.getHours() >= cutoffHour
  };
};

const ShopContext = React.createContext();

function ShopProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState(() => safeRead(STORAGE_KEYS.cart, []));
  const [wishlistItems, setWishlistItems] = useState(() => safeRead(STORAGE_KEYS.wishlist, []));
  const [addresses, setAddresses] = useState(() => safeRead('becs_ecommerce_addresses', []));
  const [orders, setOrders] = useState([]);
  const [checkout, setCheckout] = useState(defaultCheckout);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(() => safeRead(STORAGE_KEYS.user, null));
  const [shippingSpeed, setShippingSpeed] = useState('Standard Delivery');

  useEffect(() => {
    const getProducts = async () => {
      try {
        const { data } = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  useEffect(() => {
    if (user) {
      const getOrders = async () => {
        try {
          const { data } = await fetchMyOrders();
          setOrders(data);
        } catch (error) {
          console.error('Failed to fetch orders', error);
        }
      };
      getOrders();
    }
  }, [user]);

  useEffect(() => { window.localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cartItems)); }, [cartItems]);
  useEffect(() => { window.localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(wishlistItems)); }, [wishlistItems]);
  useEffect(() => { window.localStorage.setItem('becs_ecommerce_addresses', JSON.stringify(addresses)); }, [addresses]);
  useEffect(() => { 
    if (user) {
      window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(STORAGE_KEYS.user);
    }
  }, [user]);

  useEffect(() => {
    if (!message) return undefined;
    const timer = window.setTimeout(() => setMessage(''), 2500);
    return () => window.clearTimeout(timer);
  }, [message]);

  const cartSummary = useMemo(() => {
    let subtotal = 0;
    let mrpTotal = 0;
    let discount = 0;
    
    cartItems.forEach(item => {
      const itemSellingPrice = getInclusivePrice(item.price);
      const itemMRP = item.mrp ? getInclusivePrice(item.mrp) : Math.round(itemSellingPrice * 1.25); // 20% mock discount
      
      subtotal += itemSellingPrice * item.quantity;
      mrpTotal += itemMRP * item.quantity;
      discount += (itemMRP - itemSellingPrice) * item.quantity;
    });
    
    let shipping = 0;
    if (cartItems.length > 0) {
      let totalChargeableWeight = 0;
      cartItems.forEach(item => {
        const actualWeight = item.quantity * 1.2;
        const volumetricWeight = item.quantity * 1.5;
        totalChargeableWeight += Math.max(actualWeight, volumetricWeight);
      });
      
      const baseRate = 20;
      const distanceFactor = 50;
      const speedFactor = shippingSpeed === 'Priority Delivery' ? 200 : (shippingSpeed === 'Express Delivery' ? 100 : 0);
      
      shipping = Math.round((totalChargeableWeight * baseRate) + distanceFactor + speedFactor);
    }
    
    const tax = 0; // Tax is inclusive in prices now
    const total = subtotal + shipping + tax;
    const quantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal, mrpTotal, discount, shipping, tax, total, quantity };
  }, [cartItems, shippingSpeed]);

  const handleAddToCart = (product) => {
    setCartItems((current) => {
      const existing = current.find((item) => item._id === product._id);
      if (existing) {
        return current.map((item) => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...current, { _id: product._id, name: product.name, price: product.price, image: product.image, quantity: 1, delivery: product.delivery }];
    });
    setMessage(`${product.name} added to cart.`);
  };

  const handleQuantityChange = (productId, delta) => {
    setCartItems((current) => current.map((item) => item._id === productId ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0));
  };

  const handleRemoveItem = (productId) => {
    setCartItems((current) => current.filter((item) => item._id !== productId));
  };

  const handleToggleWishlist = (product) => {
    setWishlistItems((current) => {
      const exists = current.find((item) => item._id === product._id);
      if (exists) {
        setMessage(`${product.name} removed from wishlist.`);
        return current.filter((item) => item._id !== product._id);
      } else {
        setMessage(`${product.name} added to wishlist.`);
        return [...current, { _id: product._id, name: product.name, price: product.price, image: product.image, rating: product.rating }];
      }
    });
  };

  const handleLogin = async (credentials) => {
    try {
      const { data } = await apiLogin(credentials);
      setUser(data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const handleRegister = async (userData) => {
    try {
      const { data } = await apiRegister(userData);
      setUser(data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCartItems([]);
    setOrders([]);
    window.localStorage.removeItem(STORAGE_KEYS.user);
  };

  return (
    <ShopContext.Provider value={{
      products, loading, cartItems, setCartItems, wishlistItems, setWishlistItems, addresses, setAddresses, orders, setOrders, checkout, setCheckout,
      cartSummary, handleAddToCart, handleQuantityChange, handleRemoveItem, handleToggleWishlist,
      message, setMessage, defaultCheckout, user, setUser, handleLogin, handleRegister, handleLogout,
      getInclusivePrice, shippingSpeed, setShippingSpeed, calculateEDD
    }}>
      {children}
    </ShopContext.Provider>
  );
}
export { ShopContext, ShopProvider, formatPrice };
