import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { ShopContext, formatPrice } from '../context/ShopContext';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import API, { fetchProducts, fetchProduct, createOrder, fetchMyOrders, login as apiLogin, register as apiRegister, createPaymentIntent } from '../api';

function Orders() {
  const { orders, user } = React.useContext(ShopContext);
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('All Time');
  const [statusFilter, setStatusFilter] = useState('All');
  const [amountFilter, setAmountFilter] = useState('All Amounts');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return sortedOrders.filter(order => {
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      let dateMatch = true;
      if (dateFilter === 'Today') {
        dateMatch = orderDate.toDateString() === now.toDateString();
      } else if (dateFilter === 'Last 7 Days') {
        dateMatch = (now - orderDate) <= 7 * 24 * 60 * 60 * 1000;
      } else if (dateFilter === 'Last 30 Days') {
        dateMatch = (now - orderDate) <= 30 * 24 * 60 * 60 * 1000;
      } else if (dateFilter === 'Last 3 Months') {
        dateMatch = (now - orderDate) <= 90 * 24 * 60 * 60 * 1000;
      } else if (dateFilter === 'Last 6 Months') {
        dateMatch = (now - orderDate) <= 180 * 24 * 60 * 60 * 1000;
      } else if (dateFilter === 'This Year') {
        dateMatch = orderDate.getFullYear() === now.getFullYear();
      }

      let amountMatch = true;
      const amount = order.totalPrice;
      if (amountFilter === '₹0 - ₹1,000') amountMatch = amount >= 0 && amount <= 1000;
      else if (amountFilter === '₹1,000 - ₹5,000') amountMatch = amount > 1000 && amount <= 5000;
      else if (amountFilter === '₹5,000 - ₹10,000') amountMatch = amount > 5000 && amount <= 10000;
      else if (amountFilter === '₹10,000 - ₹25,000') amountMatch = amount > 10000 && amount <= 25000;
      else if (amountFilter === '₹25,000+') amountMatch = amount > 25000;

      const statusMatch = statusFilter === 'All' || order.status === statusFilter;
      
      let payStatus = order.isPaid ? 'Paid' : 'Pending';
      if (order.status === 'Cancelled' && order.isPaid) payStatus = 'Refunded'; 
      const paymentStatusMatch = paymentStatusFilter === 'All' || payStatus === paymentStatusFilter;

      const paymentMethodMatch = paymentMethodFilter === 'All' || order.paymentMethod === paymentMethodFilter;

      const searchMatch = !searchTerm || 
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

      return dateMatch && amountMatch && statusMatch && paymentStatusMatch && paymentMethodMatch && searchMatch;
    });
  }, [sortedOrders, dateFilter, amountFilter, statusFilter, paymentStatusFilter, paymentMethodFilter, searchTerm]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = useMemo(() => {
    let total = orders.length;
    let pending = 0;
    let delivered = 0;
    let cancelled = 0;
    let spent = 0;
    orders.forEach(o => {
      if (o.status === 'Delivered') delivered++;
      else if (o.status === 'Pending' || o.status === 'Processing') pending++;
      else if (o.status === 'Cancelled') cancelled++;
      
      if (o.status !== 'Cancelled') spent += o.totalPrice;
    });
    return { total, pending, delivered, cancelled, spent };
  }, [orders]);

  const generateInvoice = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('BECS Ecommerce', 14, 22);
    doc.setFontSize(10);
    doc.text('Premium Electronics Store', 14, 28);
    
    doc.setFontSize(14);
    doc.text('INVOICE', 160, 22);
    doc.setFontSize(10);
    doc.text(`Invoice No: INV-${order._id.slice(-6).toUpperCase()}`, 160, 28);
    doc.text(`Order No: ${order._id}`, 160, 34);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, 160, 40);
    doc.text(`Status: ${order.status}`, 160, 46);
    
    doc.text('Bill To:', 14, 45);
    doc.text(`${order.shippingDetails?.name || 'Customer'}`, 14, 51);
    doc.text(`${order.shippingDetails?.address || ''}`, 14, 57);
    doc.text(`${order.shippingDetails?.city || ''}, ${order.shippingDetails?.state || ''} ${order.shippingDetails?.pincode || ''}`, 14, 63);
    doc.text(`Email: ${order.shippingDetails?.email || ''}`, 14, 69);
    doc.text(`Phone: ${order.shippingDetails?.phone || ''}`, 14, 75);

    const tableData = order.items.map(item => {
      const sp = Math.round(item.price / 1.18);
      const mrp = Math.round(sp * 1.25);
      const gst = item.price - sp;
      return [
        item.name,
        item.quantity,
        `Rs ${mrp}`,
        `Rs ${mrp - item.price}`,
        `Rs ${gst}`,
        `Rs ${item.price * item.quantity}`
      ];
    });

    autoTable(doc, {
      startY: 85,
      head: [['Product Name', 'Qty', 'Unit MRP', 'Discount', 'GST', 'Total']],
      body: tableData,
    });

    const finalY = doc.lastAutoTable.finalY || 85;
    
    let calcSubtotal = 0;
    let calcMrpTotal = 0;
    let calcDiscount = 0;
    order.items.forEach(item => {
      const sp = item.price;
      const mrp = Math.round((sp / 1.18) * 1.25 * 1.18); 
      calcSubtotal += sp * item.quantity;
      calcMrpTotal += mrp * item.quantity;
      calcDiscount += (mrp - sp) * item.quantity;
    });

    doc.text(`Total MRP: Rs ${calcMrpTotal}`, 140, finalY + 10);
    doc.text(`Discount: - Rs ${calcDiscount}`, 140, finalY + 16);
    doc.text(`Shipping: Rs ${order.shippingPrice || 0}`, 140, finalY + 22);
    doc.setFontSize(12);
    doc.text(`Grand Total: Rs ${order.totalPrice}`, 140, finalY + 30);
    
    doc.save(`Invoice-${order._id}.pdf`);
  };

  const getOrderStatusIndex = (status) => {
    if(status === 'Pending') return 0;
    if(status === 'Processing') return 1;
    if(status === 'Packed') return 2;
    if(status === 'Shipped') return 3;
    if(status === 'Out for Delivery') return 4;
    if(status === 'Delivered') return 5;
    return -1;
  };

  return (
    <div className="container app-shell" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      <section style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Statistics Dashboard */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          {[{label: 'Total Orders', val: stats.total, color: '#3b82f6'}, {label: 'Delivered', val: stats.delivered, color: '#10b981'}, {label: 'Pending', val: stats.pending, color: '#f59e0b'}, {label: 'Cancelled', val: stats.cancelled, color: '#ef4444'}, {label: 'Total Spent', val: formatPrice(stats.spent), color: '#8b5cf6'}].map(s => (
            <div key={s.label} className="panel" style={{ padding: '20px', textAlign: 'center', borderTop: `4px solid ${s.color}` }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 600 }}>{s.label}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginTop: '8px' }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Filters Panel */}
        <div className="panel" style={{ padding: '24px', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="shop-search-wrap" style={{ flex: '1 1 300px' }}>
              <input type="text" placeholder="Search by Order ID or Product Name..." value={searchTerm} onChange={e => {setSearchTerm(e.target.value); setCurrentPage(1);}} />
            </div>
            <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--line)', background: '#fff' }} value={dateFilter} onChange={e => {setDateFilter(e.target.value); setCurrentPage(1);}}>
              <option>All Time</option><option>Today</option><option>Last 7 Days</option><option>Last 30 Days</option><option>Last 3 Months</option><option>Last 6 Months</option><option>This Year</option>
            </select>
            <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--line)', background: '#fff' }} value={amountFilter} onChange={e => {setAmountFilter(e.target.value); setCurrentPage(1);}}>
              <option>All Amounts</option><option>₹0 - ₹1,000</option><option>₹1,000 - ₹5,000</option><option>₹5,000 - ₹10,000</option><option>₹10,000 - ₹25,000</option><option>₹25,000+</option>
            </select>
            <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--line)', background: '#fff' }} value={statusFilter} onChange={e => {setStatusFilter(e.target.value); setCurrentPage(1);}}>
              <option value="All">All Statuses</option><option>Pending</option><option>Processing</option><option>Packed</option><option>Shipped</option><option>Out for Delivery</option><option>Delivered</option><option>Cancelled</option><option>Returned</option>
            </select>
            <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--line)', background: '#fff' }} value={paymentStatusFilter} onChange={e => {setPaymentStatusFilter(e.target.value); setCurrentPage(1);}}>
              <option value="All">All Payment Status</option><option>Paid</option><option>Pending</option><option>Failed</option><option>Refunded</option>
            </select>
            <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--line)', background: '#fff' }} value={paymentMethodFilter} onChange={e => {setPaymentMethodFilter(e.target.value); setCurrentPage(1);}}>
              <option value="All">All Payment Methods</option><option>UPI</option><option>Credit Card</option><option>Debit Card</option><option>Net Banking</option><option>Wallet</option><option>Cash on Delivery</option>
            </select>
          </div>
        </div>

        {/* Order List */}
        <div className="orders-list">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Showing {filteredOrders.length} Orders</h2>
            <span style={{ color: 'var(--muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>Newest Orders First</span>
          </div>
          
          {paginatedOrders.length ? paginatedOrders.map((order) => {
            const firstItem = order.items?.[0];
            const otherItemsCount = order.items?.length - 1;
            return (
              <article className="panel order-item" key={order._id} style={{ padding: '24px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--line)' }}>
                  <div>
                    <div style={{ marginBottom: '4px' }}>
                      <strong style={{ fontSize: '1.1rem' }}>Order #{order._id.slice(-8).toUpperCase()}</strong>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text)', marginBottom: '8px' }}>{formatPrice(order.totalPrice)}</div>
                    <span style={{ background: order.status === 'Delivered' ? '#d1fae5' : order.status === 'Cancelled' ? '#fee2e2' : '#e0e7ff', color: order.status === 'Delivered' ? '#065f46' : order.status === 'Cancelled' ? '#991b1b' : '#3730a3', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.8rem' }}>{order.status}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  {firstItem && (
                    <img src={firstItem.image || 'https://via.placeholder.com/80'} alt={firstItem.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--line)' }} />
                  )}
                  <div style={{ flex: 1 }}>
                    {firstItem && <h4 style={{ margin: '0 0 4px', fontSize: '1.1rem' }}>{firstItem.name}</h4>}
                    {otherItemsCount > 0 && <span style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>+ {otherItemsCount} other item{otherItemsCount > 1 ? 's' : ''}</span>}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingTop: '16px', borderTop: '1px solid var(--line)' }}>
                  <button className="action-button action-button--solid" style={{ padding: '8px 20px', fontSize: '0.9rem' }} onClick={() => setSelectedOrder(order)}>Track Order</button>
                  <button className="action-button action-button--ghost" style={{ padding: '8px 20px', fontSize: '0.9rem' }} onClick={(e) => { e.stopPropagation(); generateInvoice(order); }}>Download Invoice</button>
                  <button className="action-button action-button--ghost" style={{ padding: '8px 20px', fontSize: '0.9rem' }} onClick={() => setSelectedOrder(order)}>Buy Again</button>
                  {(order.status === 'Delivered') && (
                    <button className="action-button action-button--ghost" style={{ padding: '8px 20px', fontSize: '0.9rem', color: '#ef4444', borderColor: '#ef4444' }}>Return Order</button>
                  )}
                </div>
              </article>
            );
          }) : (
            <div className="panel empty-panel" style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📦</div>
              <h3>No orders found</h3>
              <p>Adjust your filters or start exploring our catalog.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '30px', alignItems: 'center' }}>
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(c => c - 1)} className="action-button action-button--ghost" style={{ minHeight: '36px', padding: '0 16px', opacity: currentPage === 1 ? 0.5 : 1 }}>Prev</button>
              <span style={{ padding: '8px 16px', fontWeight: 'bold' }}>Page {currentPage} of {totalPages}</span>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(c => c + 1)} className="action-button action-button--ghost" style={{ minHeight: '36px', padding: '0 16px', opacity: currentPage === totalPages ? 0.5 : 1 }}>Next</button>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <div className="panel" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '0', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa', position: 'sticky', top: 0, zIndex: 10 }}>
                <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Order Details</h2>
                <button onClick={() => setSelectedOrder(null)} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--muted)' }}>✕</button>
              </div>
              
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                  <button className="action-button action-button--solid" onClick={() => generateInvoice(selectedOrder)}>Download Invoice PDF</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '30px' }}>
                  <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid var(--line)' }}>
                    <h3 style={{ marginTop: 0, fontSize: '1.1rem', marginBottom: '16px', color: '#111' }}>Order Information</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: 'var(--muted)' }}>Order ID</span><strong>{selectedOrder._id}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: 'var(--muted)' }}>Date</span><strong>{new Date(selectedOrder.createdAt).toLocaleString('en-IN')}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: 'var(--muted)' }}>Payment Method</span><strong>{selectedOrder.paymentMethod}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: 'var(--muted)' }}>Payment Status</span><strong style={{ color: selectedOrder.isPaid ? 'var(--success)' : '#d97706' }}>{selectedOrder.isPaid ? 'Paid' : 'Pending'}</strong></div>
                  </div>
                  
                  <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid var(--line)' }}>
                    <h3 style={{ marginTop: 0, fontSize: '1.1rem', marginBottom: '16px', color: '#111' }}>Customer Information</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: 'var(--muted)' }}>Name</span><strong>{selectedOrder.shippingDetails?.name}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: 'var(--muted)' }}>Email</span><strong>{selectedOrder.shippingDetails?.email}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ color: 'var(--muted)' }}>Phone</span><strong>{selectedOrder.shippingDetails?.phone}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'flex-start' }}><span style={{ color: 'var(--muted)' }}>Address</span><strong style={{ textAlign: 'right', maxWidth: '60%' }}>{selectedOrder.shippingDetails?.address}, {selectedOrder.shippingDetails?.city}, {selectedOrder.shippingDetails?.state} {selectedOrder.shippingDetails?.pincode}</strong></div>
                  </div>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', borderBottom: '2px solid var(--line)', paddingBottom: '10px' }}>Order Timeline</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', padding: '20px 0', overflowX: 'auto' }}>
                    <div style={{ position: 'absolute', top: '35px', left: '30px', right: '30px', height: '4px', background: 'var(--line)', zIndex: 1, minWidth: '400px' }}></div>
                    {['Order Placed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'].map((step, idx) => {
                      const currentIdx = getOrderStatusIndex(selectedOrder.status);
                      const isCompleted = currentIdx >= idx;
                      const isCancelled = selectedOrder.status === 'Cancelled';
                      const isReturned = selectedOrder.status === 'Returned';
                      
                      if (isCancelled || isReturned) return null;

                      return (
                        <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, minWidth: '100px' }}>
                          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: isCompleted ? 'var(--success)' : '#fff', border: `3px solid ${isCompleted ? 'var(--success)' : 'var(--line)'}`, display: 'grid', placeItems: 'center', marginBottom: '10px' }}>
                            {isCompleted && <span style={{ color: '#fff', fontSize: '14px' }}>✓</span>}
                          </div>
                          <span style={{ fontSize: '0.8rem', textAlign: 'center', fontWeight: isCompleted ? 700 : 500, color: isCompleted ? 'var(--text)' : 'var(--muted)' }}>{step}</span>
                        </div>
                      )
                    })}
                    {(selectedOrder.status === 'Cancelled' || selectedOrder.status === 'Returned') && (
                      <div style={{ width: '100%', textAlign: 'center', zIndex: 2 }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#dc2626', display: 'grid', placeItems: 'center', margin: '0 auto 10px' }}>
                           <span style={{ color: '#fff', fontSize: '14px' }}>✕</span>
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#dc2626' }}>{selectedOrder.status === 'Cancelled' ? 'Order Cancelled' : 'Order Returned'}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Product Information</h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--line)', background: '#f8f9fa' }}>
                          <th style={{ padding: '12px', color: 'var(--muted)', fontWeight: 600 }}>Product</th>
                          <th style={{ padding: '12px', color: 'var(--muted)', fontWeight: 600 }}>SKU</th>
                          <th style={{ padding: '12px', color: 'var(--muted)', fontWeight: 600 }}>Unit Price</th>
                          <th style={{ padding: '12px', color: 'var(--muted)', fontWeight: 600 }}>Qty</th>
                          <th style={{ padding: '12px', color: 'var(--muted)', fontWeight: 600, textAlign: 'right' }}>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map(item => (
                          <tr key={item._id || item.product} style={{ borderBottom: '1px solid var(--line)' }}>
                            <td style={{ padding: '16px 12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <img src={item.image || 'https://via.placeholder.com/50'} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--line)' }} />
                              <strong style={{ fontSize: '0.95rem' }}>{item.name}</strong>
                            </td>
                            <td style={{ padding: '16px 12px', color: 'var(--muted)' }}>{item.product.slice(-8).toUpperCase()}</td>
                            <td style={{ padding: '16px 12px' }}>{formatPrice(item.price)}</td>
                            <td style={{ padding: '16px 12px' }}>{item.quantity}</td>
                            <td style={{ padding: '16px 12px', textAlign: 'right', fontWeight: 700 }}>{formatPrice(item.price * item.quantity)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ width: '350px', background: '#f8f9fa', padding: '24px', borderRadius: '8px', border: '1px solid var(--line)' }}>
                    <h3 style={{ marginTop: 0, fontSize: '1.2rem', marginBottom: '16px', color: '#111' }}>Pricing Breakdown</h3>
                    
                    {(() => {
                      let calcSubtotal = 0;
                      let calcMrpTotal = 0;
                      let calcDiscount = 0;
                      selectedOrder.items.forEach(item => {
                        const sp = item.price;
                        const mrp = Math.round((sp / 1.18) * 1.25 * 1.18); 
                        calcSubtotal += sp * item.quantity;
                        calcMrpTotal += mrp * item.quantity;
                        calcDiscount += (mrp - sp) * item.quantity;
                      });

                      return (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><span style={{ color: 'var(--muted)' }}>MRP (Inclusive of GST)</span><strong>{formatPrice(calcMrpTotal)}</strong></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><span style={{ color: 'var(--muted)' }}>Discount</span><strong style={{ color: 'var(--success)' }}>- {formatPrice(calcDiscount)}</strong></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><span style={{ color: 'var(--muted)' }}>Shipping Charges</span><strong>{formatPrice(selectedOrder.shippingPrice || 0)}</strong></div>
                          <div style={{ borderTop: '1px solid #ccc', margin: '16px 0' }}></div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Total Paid</span>
                            <strong style={{ fontSize: '1.5rem', color: 'var(--accent-deep)' }}>{formatPrice(selectedOrder.totalPrice)}</strong>
                          </div>
                        </>
                      )
                    })()}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </section>
    </div>
  );
}

export default Orders;
