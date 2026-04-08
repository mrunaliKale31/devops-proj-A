import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Login = () => {
  const [enrollment, setEnrollment] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, loading } = useAppContext();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!enrollment || !phone) {
      setError('Please fill in both fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    // Simulate network delay for animation effect
    setTimeout(() => {
      const result = login(enrollment, phone);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
        setIsSubmitting(false);
      }
    }, 1500);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <Loader2 size={48} className="pulse-active" style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
        <h2>Waking up Smart Assistant...</h2>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', position: 'relative', overflow: 'hidden'
    }}>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
      {/* Decorative blobs */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40vw', height: '40vw', background: 'var(--primary)', filter: 'blur(100px)', opacity: 0.2, borderRadius: '50%' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40vw', height: '40vw', background: 'var(--success)', filter: 'blur(100px)', opacity: 0.15, borderRadius: '50%' }}></div>

      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
        
        {isSubmitting ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 0', gap: '1.5rem' }}>
            <Loader2 size={64} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
            <h2 className="title" style={{ fontSize: '1.5rem', textAlign: 'center' }}>Authenticating...</h2>
            <p className="subtitle">Securely fetching your attendance logs.</p>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ width: '64px', height: '64px', background: 'var(--primary)', color: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)' }}>
                <LogIn size={32} />
              </div>
              <h1 className="title" style={{ fontSize: '1.75rem' }}>Welcome Back</h1>
              <p className="subtitle">School of Computing (IT CORE)</p>
            </div>

            {error && (
              <div className="animate-fade-in" style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Enrollment Number</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. MITU19IT101"
                  value={enrollment}
                  onChange={(e) => setEnrollment(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Phone Number (Password)</label>
                <input 
                  type="password" 
                  className="input-field" 
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '1rem', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} disabled={isSubmitting}>
                Sign In to Tracker
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <p>Mock Credentials for testing:</p>
              <p>MITU19IT101 / 9876543210</p>
              <p>MITU19IT102 / 9876543211</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
