import React, { useState, useMemo } from 'react';
import { Search, Filter, X, ChevronRight, Package, Truck, CheckCircle, XCircle } from 'lucide-react';

const StoreOrders = ({ orders, handleStatusChange, formatPrice }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // 1. Sort orders (Newest first)
  // 2. Filter orders
  const filteredOrders = useMemo(() => {
    let sorted = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    if (statusFilter !== 'All') {
      sorted = sorted.filter(o => o.status === statusFilter);
    }
    
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      sorted = sorted.filter(o => 
        o._id.toLowerCase().includes(lower) ||
        (o.shippingDetails?.name || '').toLowerCase().includes(lower) ||
        (o.user?.email || '').toLowerCase().includes(lower)
      );
    }
    
    return sorted;
  }, [orders, statusFilter, searchTerm]);

  const stats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'Processing').length,
      delivered: orders.filter(o => o.status === 'Delivered').length,
      cancelled: orders.filter(o => o.status === 'Cancelled').length
    };
  }, [orders]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'success';
      case 'Processing': return 'warning';
      case 'Cancelled': return 'danger';
      case 'Shipped': return 'info';
      default: return 'primary';
    }
  };

  return (
    <div className="view-container">
      <header className="view-header">
        <div>
          <h2 className="view-title">Ecommerce Orders Control</h2>
          <p className="view-subtitle">Track and update the status of active store orders.</p>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="stats-grid" style={{ marginBottom: '20px' }}>
        <div className="stat-card" style={{ padding: '15px' }}>
          <h3 style={{ fontSize: '0.85rem' }}>Total Orders</h3>
          <div className="value" style={{ fontSize: '1.5rem' }}>{stats.total}</div>
        </div>
        <div className="stat-card" style={{ padding: '15px' }}>
          <h3 style={{ fontSize: '0.85rem' }}>Processing</h3>
          <div className="value" style={{ fontSize: '1.5rem', color: '#f59e0b' }}>{stats.pending}</div>
        </div>
        <div className="stat-card" style={{ padding: '15px' }}>
          <h3 style={{ fontSize: '0.85rem' }}>Delivered</h3>
          <div className="value" style={{ fontSize: '1.5rem', color: '#10b981' }}>{stats.delivered}</div>
        </div>
        <div className="stat-card" style={{ padding: '15px' }}>
          <h3 style={{ fontSize: '0.85rem' }}>Cancelled</h3>
          <div className="value" style={{ fontSize: '1.5rem', color: '#ef4444' }}>{stats.cancelled}</div>
        </div>
      </div>

      {/* Filters & Search */}
      <section className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', padding: '10px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Search by Order ID, Customer Name, or Email..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
            />
          </div>
          <div>
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc', fontWeight: 600 }}
            >
              <option value="All">All Statuses</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </section>

      {/* Orders Table */}
      <section className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date & Time</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No orders found matching your filters.</td>
                </tr>
              ) : filteredOrders.map(order => (
                <tr key={order._id} className="clickable-row" onClick={() => setSelectedOrder(order)}>
                  <td style={{ color: 'var(--accent)', fontWeight: 700 }}>{order._id.slice(-8).toUpperCase()}</td>
                  <td style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}<br/>
                    {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td>
                    <strong>{order.shippingDetails?.name || order.user?.name}</strong>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{order.user?.email || 'Guest'}</div>
                  </td>
                  <td style={{ fontWeight: 700 }}>{formatPrice(order.totalPrice)}</td>
                  <td>
                    {order.isPaid ? (
                      <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.85rem' }}>Paid</span>
                    ) : (
                      <span style={{ color: '#f59e0b', fontWeight: 600, fontSize: '0.85rem' }}>Pending</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge badge-${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <select 
                      value={order.status} 
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.85rem', fontWeight: 600 }}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Side Drawer for Order Details */}
      {selectedOrder && (
        <div className="drawer-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="drawer-content" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Order Details</h3>
              <button className="btn-close" onClick={() => setSelectedOrder(null)}><X size={20} /></button>
            </div>
            <div className="drawer-body">
              
              <div className="drawer-section">
                <h4 style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Order ID: #{selectedOrder._id.slice(-8).toUpperCase()}</span>
                  <span className={`badge badge-${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span>
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '5px' }}>
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                </p>
              </div>

              <div className="drawer-section">
                <h4>Customer Information</h4>
                <div className="info-grid">
                  <div>
                    <label>Name</label>
                    <p>{selectedOrder.shippingDetails?.name || selectedOrder.user?.name}</p>
                  </div>
                  <div>
                    <label>Email</label>
                    <p>{selectedOrder.user?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <label>Phone</label>
                    <p>{selectedOrder.shippingDetails?.phone || 'N/A'}</p>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label>Shipping Address</label>
                    <p>{selectedOrder.shippingDetails?.address}, {selectedOrder.shippingDetails?.city}, {selectedOrder.shippingDetails?.state} - {selectedOrder.shippingDetails?.pincode}</p>
                  </div>
                </div>
              </div>

              <div className="drawer-section">
                <h4>Order Timeline</h4>
                <div className="timeline">
                  <div className={`timeline-item ${selectedOrder.createdAt ? 'active' : ''}`}>
                    <div className="timeline-icon"><Package size={16} /></div>
                    <div className="timeline-content">
                      <strong>Order Placed</strong>
                      <span>{new Date(selectedOrder.createdAt).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div className={`timeline-item ${selectedOrder.isPaid ? 'active' : ''}`}>
                    <div className="timeline-icon"><CheckCircle size={16} /></div>
                    <div className="timeline-content">
                      <strong>Payment Confirmed</strong>
                      <span>{selectedOrder.isPaid ? new Date(selectedOrder.paidAt).toLocaleString('en-IN') : 'Pending'}</span>
                    </div>
                  </div>
                  <div className={`timeline-item ${['Shipped', 'Delivered'].includes(selectedOrder.status) ? 'active' : ''}`}>
                    <div className="timeline-icon"><Truck size={16} /></div>
                    <div className="timeline-content">
                      <strong>Shipped</strong>
                      <span>Courier Partner</span>
                    </div>
                  </div>
                  <div className={`timeline-item ${selectedOrder.status === 'Delivered' ? 'active' : ''}`}>
                    <div className="timeline-icon"><CheckCircle size={16} /></div>
                    <div className="timeline-content">
                      <strong>Delivered</strong>
                      <span>{selectedOrder.status === 'Delivered' ? new Date(selectedOrder.deliveredAt || Date.now()).toLocaleString('en-IN') : 'Expected'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="drawer-section">
                <h4>Products Ordered</h4>
                <table className="mini-table">
                  <tbody>
                    {selectedOrder.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td><img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} /></td>
                        <td>
                          <strong>{item.name}</strong>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Qty: {item.quantity} × {formatPrice(item.price)}</div>
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatPrice(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #e2e8f0', fontWeight: 800, fontSize: '1.1rem' }}>
                  <span>Total Paid</span>
                  <span style={{ color: 'var(--accent)' }}>{formatPrice(selectedOrder.totalPrice)}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreOrders;
