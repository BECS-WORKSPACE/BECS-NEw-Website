import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RolesManagement = () => {
  return (
    <div className="view-container">
      <header className="view-header">
        <div>
          <h2 className="view-title">Roles & Permissions</h2>
          <p className="view-subtitle">Configure system access levels and manage role assignments.</p>
        </div>
        <button className="btn btn-primary">+ Create Role</button>
      </header>
      <section className="card">
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-light)' }}>
          <p>Role management interface connected to the new Role and Permission APIs will be built here.</p>
          <div style={{ marginTop: '20px' }}>
            <span className="badge badge-primary" style={{ margin: '0 5px' }}>Super Admin</span>
            <span className="badge badge-success" style={{ margin: '0 5px' }}>Admin</span>
            <span className="badge badge-warning" style={{ margin: '0 5px' }}>Course Coordinator</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RolesManagement;
