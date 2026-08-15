import React, { useState, useEffect } from 'react';
import { fetchSubscriptionPlans, createSubscriptionPlan, updateSubscriptionPlan } from '../api';

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '', originalPrice: '', discountedPrice: '', billingCycle: 'monthly', features: '', status: 'active'
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const { data } = await fetchSubscriptionPlans();
      setPlans(data);
    } catch (err) {
      console.error('Failed to load subscription plans', err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditingPlan(null);
    setFormData({ name: '', originalPrice: '', discountedPrice: '', billingCycle: 'monthly', features: '', status: 'active' });
    setIsModalOpen(true);
  };

  const openEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      originalPrice: plan.originalPrice,
      discountedPrice: plan.discountedPrice,
      billingCycle: plan.billingCycle,
      features: plan.features.join(', '),
      status: plan.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      features: formData.features.split(',').map(f => f.trim()).filter(Boolean)
    };
    
    try {
      if (editingPlan) {
        await updateSubscriptionPlan(editingPlan._id, payload);
      } else {
        await createSubscriptionPlan(payload);
      }
      setIsModalOpen(false);
      loadPlans();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save plan');
    }
  };

  return (
    <div className="view-container">
      <header className="view-header">
        <div>
          <h2 className="view-title">Subscription Plans</h2>
          <p className="view-subtitle">Manage premium tiers, pricing, and billing cycles dynamically.</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Create Plan</button>
      </header>

      <section className="card">
        <div className="table-wrapper">
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)' }}>Loading plans...</div>
          ) : plans.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)' }}>No subscription plans found. Create one to get started.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Plan Name</th>
                  <th>Billing Cycle</th>
                  <th>Active Price</th>
                  <th>Original Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map(plan => (
                  <tr key={plan._id}>
                    <td><strong>{plan.name}</strong></td>
                    <td style={{ textTransform: 'capitalize' }}>{plan.billingCycle}</td>
                    <td style={{ fontWeight: 700, color: 'var(--accent)' }}>₹{plan.discountedPrice}</td>
                    <td style={{ textDecoration: 'line-through', color: 'var(--text-light)' }}>₹{plan.originalPrice}</td>
                    <td>
                      <span className={`badge badge-${plan.status === 'active' ? 'success' : 'danger'}`}>
                        {plan.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn-text" style={{ color: 'var(--accent)', fontWeight: 700 }} onClick={() => openEdit(plan)}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{editingPlan ? 'Edit Plan' : 'Create New Plan'}</h3>
              <button className="btn-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid-modal">
                  <div className="form-group form-span-2">
                    <label>Plan Name</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Premium Access" />
                  </div>
                  <div className="form-group">
                    <label>Discounted (Active) Price ₹</label>
                    <input type="number" required value={formData.discountedPrice} onChange={e => setFormData({...formData, discountedPrice: e.target.value})} placeholder="4999" />
                  </div>
                  <div className="form-group">
                    <label>Original Price ₹</label>
                    <input type="number" required value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})} placeholder="7999" />
                  </div>
                  <div className="form-group">
                    <label>Billing Cycle</label>
                    <select value={formData.billingCycle} onChange={e => setFormData({...formData, billingCycle: e.target.value})} style={{ width: '100%', padding: '16px', borderRadius: '10px', border: '2px solid #e2e8f0', background: '#f8fafc' }}>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                      <option value="lifetime">Lifetime</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{ width: '100%', padding: '16px', borderRadius: '10px', border: '2px solid #e2e8f0', background: '#f8fafc' }}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div className="form-group form-span-2">
                    <label>Features (Comma separated)</label>
                    <textarea value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} placeholder="All Courses, Live Classes, Doubt Support..." style={{ width: '100%', padding: '16px', borderRadius: '10px', border: '2px solid #e2e8f0', background: '#f8fafc', height: '80px' }}></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingPlan ? 'Save Changes' : 'Create Plan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;
