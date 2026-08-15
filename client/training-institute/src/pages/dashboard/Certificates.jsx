import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      // Endpoint from Phase 2
      const res = await axios.get('/api/certificates/mine', { withCredentials: true });
      setCertificates(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load certificates. Please try again.');
      setLoading(false);
    }
  };

  const downloadCertificate = (pdfUrl) => {
    if (!pdfUrl) return;
    const url = `http://localhost:5000${pdfUrl}`; // Assuming backend is on 5000
    const a = document.createElement('a');
    a.href = url;
    a.download = 'certificate.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copyVerificationLink = (verificationId) => {
    const url = `http://localhost:5173/verify/${verificationId}`;
    navigator.clipboard.writeText(url);
    alert('Verification link copied to clipboard!');
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading certificates...</div>;
  
  if (error) return <div style={{ padding: '40px', color: 'red' }}>{error}</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>My Certificates</h1>
          <p style={{ color: '#64748b' }}>View, download, and verify your earned credentials.</p>
        </div>
      </div>

      {certificates.length === 0 ? (
        <div style={{ background: 'white', padding: '60px 20px', borderRadius: '16px', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎓</div>
          <h3 style={{ fontSize: '1.2rem', color: '#334155', marginBottom: '8px' }}>No Certificates Yet</h3>
          <p style={{ color: '#94a3b8' }}>Complete a course or pass an exam to earn your first credential.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {certificates.map(cert => (
            <div key={cert._id} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column' }}>
              {/* Top Banner (Optional thumbnail fallback) */}
              <div style={{ height: '120px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', padding: '20px', textAlign: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>{cert.metadata.courseName}</h3>
              </div>
              
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    fontSize: '0.75rem', 
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    backgroundColor: cert.status === 'valid' ? '#dcfce7' : '#fee2e2',
                    color: cert.status === 'valid' ? '#166534' : '#991b1b'
                  }}>
                    {cert.status}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {new Date(cert.issuedAt).toLocaleDateString()}
                  </span>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>Certificate ID:</div>
                  <div style={{ fontFamily: 'monospace', fontWeight: 600, color: '#334155' }}>{cert.certificateNumber}</div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => downloadCertificate(cert.pdfUrl)}
                    disabled={!cert.pdfUrl || cert.status !== 'valid'}
                    style={{ flex: 1, background: '#2563eb', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 600, cursor: (cert.pdfUrl && cert.status === 'valid') ? 'pointer' : 'not-allowed', opacity: (cert.pdfUrl && cert.status === 'valid') ? 1 : 0.5 }}
                  >
                    Download PDF
                  </button>
                  <button 
                    onClick={() => copyVerificationLink(cert.verificationId)}
                    style={{ background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}
                    title="Copy Verification Link"
                  >
                    🔗
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Certificates;
