import React, { useState } from 'react';
import api from '../api';

const NotificationManager = () => {
  const [activeTab, setActiveTab] = useState('broadcast');
  const [broadcastForm, setBroadcastForm] = useState({ title: '', message: '', targetRole: 'all', actionText: '', actionLink: '' });
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg('');
    try {
      const res = await api.post('/admin/notifications/broadcast', broadcastForm);
      setStatusMsg(res.data.message);
      setBroadcastForm({ title: '', message: '', targetRole: 'all', actionText: '', actionLink: '' });
    } catch (error) {
      setStatusMsg(error.response?.data?.message || 'Failed to send broadcast');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Communication Center</h1>
        <p className="text-gray-500">Manage templates and send global broadcasts.</p>
      </div>

      <div className="flex space-x-4 border-b border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab('broadcast')}
          className={`pb-2 px-1 ${activeTab === 'broadcast' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-500'}`}
        >
          Send Broadcast
        </button>
        <button 
          onClick={() => setActiveTab('templates')}
          className={`pb-2 px-1 ${activeTab === 'templates' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-500'}`}
        >
          Email Templates
        </button>
      </div>

      {activeTab === 'broadcast' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-2xl">
          <form onSubmit={handleBroadcast} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
              <select 
                value={broadcastForm.targetRole}
                onChange={e => setBroadcastForm({...broadcastForm, targetRole: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Users (Students & Teachers)</option>
                <option value="student">Only Students</option>
                <option value="teacher">Only Teachers</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input 
                type="text" required
                value={broadcastForm.title}
                onChange={e => setBroadcastForm({...broadcastForm, title: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md" 
                placeholder="Important Announcement"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea 
                required rows="4"
                value={broadcastForm.message}
                onChange={e => setBroadcastForm({...broadcastForm, message: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md" 
                placeholder="Write your broadcast message here..."
              ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button Text (Optional)</label>
                <input 
                  type="text"
                  value={broadcastForm.actionText}
                  onChange={e => setBroadcastForm({...broadcastForm, actionText: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md" 
                  placeholder="View Details"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button Link (Optional)</label>
                <input 
                  type="text"
                  value={broadcastForm.actionLink}
                  onChange={e => setBroadcastForm({...broadcastForm, actionLink: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md" 
                  placeholder="https://..."
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              {loading ? 'Dispatching...' : 'Send Broadcast Notification'}
            </button>
            {statusMsg && <p className="mt-2 text-sm text-green-600 font-medium">{statusMsg}</p>}
          </form>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-center h-64">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Template Editor Coming Soon</h3>
            <p className="mt-1 text-sm text-gray-500">Currently using system default fallback templates.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationManager;
