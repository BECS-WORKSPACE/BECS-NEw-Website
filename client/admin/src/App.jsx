import React, { useState, useEffect, useCallback } from 'react';
import { login as apiLogin, fetchStats, fetchAllOrders, updateOrderStatus, fetchAllUsers, fetchAllProducts, updateProduct, createProduct, deleteProduct, bulkCreateProducts, fetchContacts, fetchEnquiries, fetchCourses, updateEnquiryStatus, deleteEnquiry as apiDeleteEnquiry, deleteContact as apiDeleteContact, createCourse as apiCreateCourse, updateCourse as apiUpdateCourse, deleteCourse as apiDeleteCourse } from './api';
import io from 'socket.io-client';
import DashboardOverview from './components/DashboardOverview';
import StoreOrders from './components/StoreOrders';

const formatPrice = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

const AddProductModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '', category: 'Smart Automation', price: '', originalPrice: '', stock: '', description: '', badge: '', delivery: 'Delivery by Tomorrow', image: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ ...formData, price: Number(formData.price), originalPrice: Number(formData.originalPrice), stock: Number(formData.stock) });
    setFormData({ name: '', category: 'Smart Automation', price: '', originalPrice: '', stock: '', description: '', badge: '', delivery: 'Delivery by Tomorrow', image: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h3>Add New Product</h3>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid-modal">
              <div className="form-group form-span-2">
                <label>Product Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Smart Hub Pro" required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '16px', borderRadius: '10px', border: '2px solid #e2e8f0', background: '#f8fafc' }}>
                  <option>Smart Automation</option>
                  <option>Industrial Control</option>
                  <option>Security Systems</option>
                  <option>IoT Kits</option>
                  <option>Power Backup</option>
                  <option>Lab Equipment</option>
                </select>
              </div>
              <div className="form-group">
                <label>Price (INR)</label>
                <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="5000" required />
              </div>
              <div className="form-group">
                <label>Original Price</label>
                <input type="number" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})} placeholder="6000" />
              </div>
              <div className="form-group">
                <label>Initial Stock</label>
                <input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} placeholder="100" required />
              </div>
              <div className="form-group">
                <label>Badge</label>
                <input type="text" value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} placeholder="New / Bestseller" />
              </div>
              <div className="form-group">
                <label>Delivery Message</label>
                <input type="text" value={formData.delivery} onChange={e => setFormData({...formData, delivery: e.target.value})} placeholder="Delivery in 2 Days" />
              </div>
              <div className="form-group form-span-2">
                <label>Image URL</label>
                <input type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://images.unsplash.com/..." required />
              </div>
              <div className="form-group form-span-2">
                <label>Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '16px', borderRadius: '10px', border: '2px solid #e2e8f0', background: '#f8fafc', height: '100px' }} placeholder="Product details..."></textarea>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Product</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Global State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [notification, setNotification] = useState(null); // Real-time notification

  const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'https://www.becsofficial.com';
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    // Socket.IO Setup
    const socket = io(apiUrl);
    
    socket.on('new_order', (data) => {
      setNotification(`🔔 New Order Received: #${data.orderId.slice(-8).toUpperCase()}`);
      setTimeout(() => setNotification(null), 5000);
      loadDashboardData(); // Refresh data silently
    });

    socket.on('order_updated', (data) => {
      if (data.order && data.order.status === 'Delivered') {
        setNotification(`🔔 Order Delivered: #${data.order._id.slice(-8).toUpperCase()}`);
        setTimeout(() => setNotification(null), 5000);
      }
      loadDashboardData(); // Refresh data silently
    });

    return () => socket.disconnect();
  }, [apiUrl]);

  useEffect(() => {
    const savedAdmin = localStorage.getItem('becs_admin');
    if (savedAdmin) {
      const parsed = JSON.parse(savedAdmin);
      if (parsed.isAdmin) {
        setIsAuthenticated(true);
        setAdminUser(parsed);
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        fetchStats(),
        fetchAllUsers(),
        fetchAllOrders(),
        fetchAllProducts(),
        fetchContacts(),
        fetchEnquiries(),
        fetchCourses()
      ]);
      
      // Check if any protected route returned 401 (stale token)
      const authFailed = results.some(r => r.status === 'rejected' && r.reason?.response?.status === 401);
      if (authFailed) {
        console.warn('Auth token expired or invalid. Logging out.');
        localStorage.removeItem('becs_admin');
        setIsAuthenticated(false);
        setAdminUser(null);
        setLoading(false);
        return;
      }

      const getValue = (idx) => results[idx].status === 'fulfilled' ? results[idx].value.data : null;
      if (getValue(0)) setStats(getValue(0));
      if (getValue(1)) setUsers(getValue(1));
      if (getValue(2)) setOrders(getValue(2));
      if (getValue(3)) setProducts(getValue(3));
      if (getValue(4)) setContacts(getValue(4));
      if (getValue(5)) setEnquiries(getValue(5));
      if (getValue(6)) setCourses(getValue(6));
    } catch (error) {
      console.error('Error loading admin data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await apiLogin(loginData);
      if (data.isAdmin) {
        localStorage.setItem('becs_admin', JSON.stringify(data));
        setAdminUser(data);
        setIsAuthenticated(true);
        setLoginError('');
      } else {
        setLoginError('Access denied. You are not an admin.');
      }
    } catch (error) {
      setLoginError(error.response?.data?.message || 'Login failed');
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('becs_admin');
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      loadDashboardData();
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const handleStockAction = async (id, delta) => {
    const product = products.find(p => p._id === id);
    if (!product) return;
    const newStock = Math.max(0, product.stock + delta);
    try {
      await updateProduct(id, { stock: newStock });
      setProducts(prev => prev.map(p => p._id === id ? { ...p, stock: newStock } : p));
    } catch (error) {
      console.error('Failed to update stock', error);
      alert('Failed to update stock: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleCreateProduct = async (productData) => {
    try {
      await createProduct(productData);
      setIsAddModalOpen(false);
      loadDashboardData();
    } catch (error) {
      console.error('Failed to create product', error);
    }
  };

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadStatus('Loading Excel parser...');
    
    try {
      const XLSX = await new Promise((resolve, reject) => {
        if (window.XLSX) {
          resolve(window.XLSX);
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
        script.onload = () => resolve(window.XLSX);
        script.onerror = () => reject(new Error('Failed to load Excel parser. Please check your connection.'));
        document.body.appendChild(script);
      });

      setUploadStatus('Reading file...');
      const reader = new FileReader();
      
      reader.onload = async (evt) => {
        try {
          const bstr = evt.target.result;
          const wb = XLSX.read(bstr, { type: 'binary' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          
          const rawData = XLSX.utils.sheet_to_json(ws, { header: 1 });
          if (rawData.length < 2) {
            alert('The uploaded file is empty or missing headers.');
            setUploadStatus('');
            return;
          }

          const headers = rawData[0].map(h => String(h).trim().toLowerCase());
          const rows = rawData.slice(1);
          
          const mappedProducts = rows.map((row) => {
            const getVal = (colName) => {
              const idx = headers.indexOf(colName.toLowerCase());
              return idx !== -1 ? row[idx] : undefined;
            };

            const name = getVal('name') || getVal('product name') || getVal('title');
            const category = getVal('category') || 'Smart Automation';
            const price = Number(getVal('price')) || 0;
            const originalPrice = Number(getVal('originalPrice') || getVal('original price') || getVal('original_price')) || price;
            const stock = Number(getVal('stock') || getVal('quantity') || getVal('qty')) || 0;
            const description = getVal('description') || getVal('details') || '';
            const badge = getVal('badge') || '';
            const delivery = getVal('delivery') || getVal('delivery message') || 'Delivery by Tomorrow';
            const image = getVal('image') || getVal('image url') || getVal('image_url') || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80';
            
            let specsVal = getVal('specs') || getVal('specifications') || '';
            let specs = [];
            if (specsVal) {
              if (typeof specsVal === 'string') {
                specs = specsVal.split(',').map(s => s.trim()).filter(Boolean);
              } else if (Array.isArray(specsVal)) {
                specs = specsVal;
              }
            }

            return { name, category, price, originalPrice, stock, description, badge, delivery, image, specs };
          }).filter(p => p.name);

          if (mappedProducts.length === 0) {
            alert('No valid products found. Ensure columns like "Name" and "Price" exist.');
            setUploadStatus('');
            return;
          }

          setUploadStatus(`Uploading ${mappedProducts.length} products...`);
          await bulkCreateProducts(mappedProducts);
          alert(`Successfully uploaded ${mappedProducts.length} products!`);
          loadDashboardData();
        } catch (err) {
          alert('Error processing Excel contents: ' + err.message);
        } finally {
          setUploadStatus('');
        }
      };

      reader.readAsBinaryString(file);
    } catch (err) {
      alert(err.message);
      setUploadStatus('');
    }
  };

  // --- VIEWS ---

  // Old DashboardView was removed, using imported component

  const UsersView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return (
      <div className="view-container">
        <header className="view-header">
          <div>
            <h2 className="view-title">Global Users Database</h2>
            <p className="view-subtitle">Manage accounts across the platform.</p>
          </div>
        </header>
        <section className="card">
          <div className="search-bar">
            <input type="text" placeholder="Search users by name or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>User ID</th><th>Client Details</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user._id}>
                    <td style={{fontWeight: 700}}>{user._id.slice(-6)}</td>
                    <td><strong>{user.name}</strong><span className="table-subtext">{user.email}</span></td>
                    <td>{user.isAdmin ? <span className="badge badge-success">Admin</span> : <span className="badge badge-primary">Customer</span>}</td>
                    <td style={{color: 'var(--text-light)'}}>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="btn-text" style={{color: 'var(--accent)', marginRight: '10px'}}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    );
  };

  // Old OrdersView was removed, using imported component

  const ProductsView = () => {
    return (
      <div className="view-container">
        <header className="view-header">
          <div>
            <h2 className="view-title">Ecommerce Inventory Control</h2>
            <p className="view-subtitle">Manage product catalog, pricing, and stock levels.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {uploadStatus && <span style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 600 }}>{uploadStatus}</span>}
            <label className="btn btn-secondary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', margin: 0, gap: '8px' }}>
              📥 Upload Excel
              <input 
                type="file" 
                accept=".xlsx,.xls,.csv" 
                style={{ display: 'none' }} 
                onChange={handleExcelUpload} 
              />
            </label>
            <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>+ Add New Product</button>
          </div>
        </header>
        <section className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Product Name</th><th>Category</th><th>Price</th><th>Stock Level</th><th>Status</th><th>Stock Action</th><th>Delete</th></tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id}>
                    <td><strong style={{display: 'block'}}>{product.name}</strong><span className="table-subtext">{product._id.slice(-6)}</span></td>
                    <td>{product.category}</td>
                    <td style={{fontWeight: 700}}>{formatPrice(product.price)}</td>
                    <td>
                      <span style={{ fontWeight: 800, fontSize: '1.1rem', color: product.stock === 0 ? '#ef4444' : product.stock < 10 ? '#f59e0b' : '#10b981' }}>
                        {product.stock} units
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'danger'}`}>
                        {product.stock > 10 ? 'Published' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button className="btn-icon" onClick={() => handleStockAction(product._id, -1)} disabled={product.stock === 0}>-</button>
                        <button className="btn-icon" onClick={() => handleStockAction(product._id, 1)}>+</button>
                      </div>
                    </td>
                    <td>
                      <button className="btn-text" style={{color: '#ef4444', fontWeight: 700}} onClick={() => { if (window.confirm('Delete this product?')) { deleteProduct(product._id).then(() => loadDashboardData()).catch(e => console.error(e)); } }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    );
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Delete this contact message?')) return;
    try { await apiDeleteContact(id); loadDashboardData(); } catch (e) { console.error(e); }
  };

  const ContactsView = () => (
    <div className="view-container">
      <header className="view-header">
        <div><h2 className="view-title">Main Website Leads</h2><p className="view-subtitle">Messages sent from the main website contact form.</p></div>
      </header>
      <section className="card">
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Date</th><th>Name</th><th>Email</th><th>Subject / Message</th><th>Action</th></tr></thead>
            <tbody>
              {contacts.length === 0 && <tr><td colSpan="5" style={{textAlign: 'center', padding: '40px', color: 'var(--text-light)'}}>No contact messages yet.</td></tr>}
              {contacts.map(c => (
                <tr key={c._id}>
                  <td style={{color: 'var(--text-light)'}}>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td style={{fontWeight: 700}}>{c.name}</td>
                  <td><a href={`mailto:${c.email}`} style={{color: 'var(--accent)'}}>{c.email}</a></td>
                  <td><strong>{c.subject}</strong><p style={{fontSize: '0.85rem', margin: '4px 0 0', color: 'var(--text-light)'}}>{c.message}</p></td>
                  <td><button className="btn-text" style={{color: '#ef4444', fontWeight: 700}} onClick={() => handleDeleteContact(c._id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );

  const handleEnquiryStatus = async (id, status) => {
    try { await updateEnquiryStatus(id, status); loadDashboardData(); } catch (error) { console.error(error); }
  };
  const handleDeleteEnquiry = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return;
    try { await apiDeleteEnquiry(id); loadDashboardData(); } catch (e) { console.error(e); }
  };

  const EnquiriesView = () => (
    <div className="view-container">
      <header className="view-header">
        <div><h2 className="view-title">Vidyapeeth Enquiries</h2><p className="view-subtitle">Student leads and material download requests. Update status to track follow-ups.</p></div>
      </header>
      <section className="card">
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Date</th><th>Student Name</th><th>Phone</th><th>Course Interest</th><th>Type</th><th>Status</th><th>Update</th><th>Action</th></tr></thead>
            <tbody>
              {enquiries.length === 0 && <tr><td colSpan="8" style={{textAlign: 'center', padding: '40px', color: 'var(--text-light)'}}>No student enquiries yet.</td></tr>}
              {enquiries.map(e => (
                <tr key={e._id}>
                  <td style={{color: 'var(--text-light)'}}>{new Date(e.createdAt).toLocaleDateString()}</td>
                  <td style={{fontWeight: 700}}>{e.name}</td>
                  <td>{e.phone}</td>
                  <td>{e.courseName || e.courseId || 'General'}</td>
                  <td><span className="badge badge-primary">{e.type}</span></td>
                  <td><span className={`badge badge-${e.status === 'Resolved' ? 'success' : e.status === 'Contacted' ? 'primary' : 'warning'}`}>{e.status}</span></td>
                  <td>
                    <select value={e.status} onChange={(ev) => handleEnquiryStatus(e._id, ev.target.value)} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.85rem' }}>
                      <option value="Pending">Pending</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td><button className="btn-text" style={{color: '#ef4444', fontWeight: 700}} onClick={() => handleDeleteEnquiry(e._id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );

  // --- Course CRUD ---
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const emptyCourse = { title: '', target: '', duration: '', mode: 'Offline', center: 'BECS HQ Kolkata', price: '', originalPrice: '', discount: '', description: '', schedule: '', faculty: '', image: '' };
  const [courseForm, setCourseForm] = useState(emptyCourse);

  const openAddCourse = () => { setEditingCourse(null); setCourseForm(emptyCourse); setIsCourseModalOpen(true); };
  const openEditCourse = (c) => { setEditingCourse(c); setCourseForm({ title: c.title, target: c.target, duration: c.duration, mode: c.mode || 'Offline', center: c.center || '', price: c.price, originalPrice: c.originalPrice || '', discount: c.discount || '', description: c.description || '', schedule: c.schedule || '', faculty: c.faculty || '', image: c.image || '' }); setIsCourseModalOpen(true); };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await apiUpdateCourse(editingCourse._id, courseForm);
      } else {
        await apiCreateCourse(courseForm);
      }
      setIsCourseModalOpen(false);
      loadDashboardData();
    } catch (error) {
      console.error('Failed to save course', error);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await apiDeleteCourse(id);
      loadDashboardData();
    } catch (error) {
      console.error('Failed to delete course', error);
    }
  };

  const CoursesView = () => (
    <div className="view-container">
      <header className="view-header">
        <div><h2 className="view-title">Vidyapeeth Course Catalog</h2><p className="view-subtitle">Manage offline courses and syllabus.</p></div>
        <button className="btn btn-primary" onClick={openAddCourse}>+ Add New Course</button>
      </header>
      <section className="card">
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Course Title</th><th>Target</th><th>Duration</th><th>Mode</th><th>Price</th><th>Actions</th></tr></thead>
            <tbody>
              {courses.length === 0 && <tr><td colSpan="6" style={{textAlign: 'center', padding: '40px', color: 'var(--text-light)'}}>No courses added yet. Click "+ Add New Course" to create one.</td></tr>}
              {courses.map(c => (
                <tr key={c._id}>
                  <td><strong>{c.title}</strong><span className="table-subtext">{c.description}</span></td>
                  <td>{c.target}</td>
                  <td>{c.duration}</td>
                  <td><span className="badge badge-primary">{c.mode}</span></td>
                  <td style={{fontWeight: 700, color: 'var(--accent)'}}>{c.price}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-text" style={{color: 'var(--accent)', fontWeight: 700}} onClick={() => openEditCourse(c)}>Edit</button>
                      <button className="btn-text" style={{color: '#ef4444', fontWeight: 700}} onClick={() => handleDeleteCourse(c._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {isCourseModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{editingCourse ? 'Edit Course' : 'Add New Course'}</h3>
              <button className="btn-close" onClick={() => setIsCourseModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleCourseSubmit}>
              <div className="modal-body">
                <div className="form-grid-modal">
                  <div className="form-group form-span-2">
                    <label>Course Title</label>
                    <input type="text" value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})} placeholder="e.g. JEE / NEET Preparation" required />
                  </div>
                  <div className="form-group">
                    <label>Target Audience</label>
                    <input type="text" value={courseForm.target} onChange={e => setCourseForm({...courseForm, target: e.target.value})} placeholder="e.g. Class 11-12 Students" required />
                  </div>
                  <div className="form-group">
                    <label>Duration</label>
                    <input type="text" value={courseForm.duration} onChange={e => setCourseForm({...courseForm, duration: e.target.value})} placeholder="e.g. 12 Months" required />
                  </div>
                  <div className="form-group">
                    <label>Mode</label>
                    <select value={courseForm.mode} onChange={e => setCourseForm({...courseForm, mode: e.target.value})} style={{ width: '100%', padding: '16px', borderRadius: '10px', border: '2px solid #e2e8f0', background: '#f8fafc' }}>
                      <option>Offline</option>
                      <option>Online</option>
                      <option>Offline + Online</option>
                      <option>Offline + Lab</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Center</label>
                    <input type="text" value={courseForm.center} onChange={e => setCourseForm({...courseForm, center: e.target.value})} placeholder="BECS HQ Kolkata" required />
                  </div>
                  <div className="form-group">
                    <label>Price</label>
                    <input type="text" value={courseForm.price} onChange={e => setCourseForm({...courseForm, price: e.target.value})} placeholder="₹15,000/year" required />
                  </div>
                  <div className="form-group">
                    <label>Original Price</label>
                    <input type="text" value={courseForm.originalPrice} onChange={e => setCourseForm({...courseForm, originalPrice: e.target.value})} placeholder="₹18,000" />
                  </div>
                  <div className="form-group">
                    <label>Discount</label>
                    <input type="text" value={courseForm.discount} onChange={e => setCourseForm({...courseForm, discount: e.target.value})} placeholder="17% OFF" />
                  </div>
                  <div className="form-group">
                    <label>Schedule</label>
                    <input type="text" value={courseForm.schedule} onChange={e => setCourseForm({...courseForm, schedule: e.target.value})} placeholder="Mon-Fri, 4:00 PM - 6:00 PM" />
                  </div>
                  <div className="form-group">
                    <label>Faculty</label>
                    <input type="text" value={courseForm.faculty} onChange={e => setCourseForm({...courseForm, faculty: e.target.value})} placeholder="Mr. Banerjee, Mrs. Das" />
                  </div>
                  <div className="form-group form-span-2">
                    <label>Image URL</label>
                    <input type="url" value={courseForm.image} onChange={e => setCourseForm({...courseForm, image: e.target.value})} placeholder="https://images.unsplash.com/..." />
                  </div>
                  <div className="form-group form-span-2">
                    <label>Description</label>
                    <textarea value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value})} style={{ width: '100%', padding: '16px', borderRadius: '10px', border: '2px solid #e2e8f0', background: '#f8fafc', height: '100px' }} placeholder="Course description..."></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsCourseModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingCourse ? 'Save Changes' : 'Create Course'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  // --- MAIN RENDER ---
  if (!isAuthenticated) {
    return (
      <div className="login-screen">
        <div className="login-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
        </div>
        <div className="login-container">
          <div className="login-visual">
            <div className="visual-content">
              <div className="visual-badge">Secure Access</div>
              <h1>BECS Command Center</h1>
              <p>Advanced telemetry, user management, and unified e-commerce control across the entire platform ecosystem.</p>
            </div>
          </div>
          <div className="login-box">
            <div className="login-header">
              <div className="login-logo" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'transparent' }}>
                <img src={`${import.meta.env.BASE_URL}logo.png`} alt="BECS Logo" style={{ width: '75px', height: '75px', objectFit: 'contain' }} />
              </div>
              <h2>Admin Sign In</h2>
              <p>Enter your credentials to continue</p>
            </div>
            
            {loginError && <div className="alert-box alert-danger">{loginError}</div>}
            
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label>Admin Email</label>
                <input type="email" value={loginData.email} onChange={(e) => setLoginData({...loginData, email: e.target.value})} placeholder="admin@becs.com" required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" value={loginData.password} onChange={(e) => setLoginData({...loginData, password: e.target.value})} placeholder="••••••••" required />
              </div>
              <button type="submit" className="btn login-submit">Access Dashboard</button>
              <a href={frontendUrl} className="back-link">← Return to Main Website</a>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const renderActiveView = () => {
    if (loading) return <div style={{ padding: '40px' }}>Loading real-time data...</div>;
    switch(activeTab) {
      case 'dashboard': return <DashboardOverview stats={stats} orders={orders} setActiveTab={setActiveTab} formatPrice={formatPrice} />;
      case 'users': return <UsersView />;
      case 'orders': return <StoreOrders orders={orders} handleStatusChange={handleStatusChange} formatPrice={formatPrice} />;
      case 'products': return <ProductsView />;
      case 'contacts': return <ContactsView />;
      case 'enquiries': return <EnquiriesView />;
      case 'courses': return <CoursesView />;
      default: return <DashboardOverview stats={stats} orders={orders} setActiveTab={setActiveTab} formatPrice={formatPrice} />;
    }
  };

  return (
    <div className="admin-layout">
      <AddProductModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleCreateProduct} 
      />
      
      {/* Mobile Sidebar Overlay */}
      <div className={`mobile-sidebar-overlay ${isMobileSidebarOpen ? 'open' : ''}`} onClick={() => setIsMobileSidebarOpen(false)}></div>
      
      <aside className={`sidebar ${isMobileSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="BECS Logo" style={{ width: '45px', height: '45px', objectFit: 'contain' }} /> 
          BECS Admin
          <button className="close-sidebar-btn mobile-only" onClick={() => setIsMobileSidebarOpen(false)}>✕</button>
        </div>
        <nav className="sidebar-nav">
          <div style={{ padding: '10px 15px', fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 800, marginTop: '10px' }}>E-Commerce</div>
          <button className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); setIsMobileSidebarOpen(false); }}>Dashboard Overview</button>
          <button className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => { setActiveTab('users'); setIsMobileSidebarOpen(false); }}>Global Users Database</button>
          <button className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => { setActiveTab('orders'); setIsMobileSidebarOpen(false); }}>Store Orders</button>
          <button className={`nav-link ${activeTab === 'products' ? 'active' : ''}`} onClick={() => { setActiveTab('products'); setIsMobileSidebarOpen(false); }}>Store Inventory</button>
          
          <div style={{ padding: '10px 15px', fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 800, marginTop: '20px' }}>Main Website</div>
          <button className={`nav-link ${activeTab === 'contacts' ? 'active' : ''}`} onClick={() => { setActiveTab('contacts'); setIsMobileSidebarOpen(false); }}>Contact Forms & Leads</button>

          <div style={{ padding: '10px 15px', fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 800, marginTop: '20px' }}>Vidyapeeth</div>
          <button className={`nav-link ${activeTab === 'enquiries' ? 'active' : ''}`} onClick={() => { setActiveTab('enquiries'); setIsMobileSidebarOpen(false); }}>Student Enquiries</button>
          <button className={`nav-link ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => { setActiveTab('courses'); setIsMobileSidebarOpen(false); }}>Course Catalog</button>
          
          <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
            <a href={frontendUrl} className="nav-link logout-link">← Exit to Frontend</a>
            <button className="nav-link logout-link" onClick={handleSignOut} style={{ color: '#ef4444', marginTop: '10px' }}>Sign Out</button>
          </div>
        </nav>
      </aside>

      <main className="main-content">
        <div className="mobile-header mobile-only">
          <button className="hamburger-btn" onClick={() => setIsMobileSidebarOpen(true)}>☰</button>
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--primary)' }}>BECS Admin</h2>
        </div>
        {notification && (
          <div className="toast-notification">
            {notification}
          </div>
        )}
        {renderActiveView()}
      </main>
    </div>
  );
};

export default AdminApp;
