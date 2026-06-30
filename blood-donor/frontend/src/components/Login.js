import React, { useState } from 'react';
import { FaUser, FaLock, FaHeart, FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const getUsers = () => {
    const users = localStorage.getItem('bloodapp_users');
    return users ? JSON.parse(users) : [];
  };

  const saveUser = (user) => {
    const users = getUsers();
    users.push(user);
    localStorage.setItem('bloodapp_users', JSON.stringify(users));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    await new Promise(r => setTimeout(r, 800));

    if (isLogin) {
      // LOGIN
      const users = getUsers();
      const found = users.find(
        u => u.email === formData.email && u.password === formData.password
      );
      if (found) {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => onLogin(found), 800);
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } else {
      // REGISTER
      if (!formData.name || !formData.email || !formData.password) {
        setError('All fields are required.');
        setLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters.');
        setLoading(false);
        return;
      }
      const users = getUsers();
      const exists = users.find(u => u.email === formData.email);
      if (exists) {
        setError('Email already registered. Please login.');
        setLoading(false);
        return;
      }
      const newUser = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        password: formData.password
      };
      saveUser(newUser);
      setSuccess('Account created successfully! Please login.');
      setTimeout(() => {
        setIsLogin(true);
        setFormData({ name: '', email: '', password: '' });
        setSuccess('');
      }, 1500);
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <FaHeart className="icon-3d" size={48} color="#dc2626" style={{ marginBottom: '1rem' }} />
          <h2>{isLogin ? 'Welcome Back' : 'Join BloodConnect'}</h2>
          <p>{isLogin ? 'Sign in to your account' : 'Create your account today'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label><FaUser className="icon-3d" size={16} /> Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
          )}

          <div className="form-group">
            <label><MdEmail className="icon-3d" size={16} /> Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label><FaLock className="icon-3d" size={16} /> Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              className="form-control"
              placeholder={isLogin ? 'Enter your password' : 'Min 6 characters'}
              value={formData.password}
              onChange={handleChange}
              required
              style={{ paddingRight: '45px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '38px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>

          {error && (
            <div style={{
              background: '#fee2e2',
              color: '#dc2626',
              padding: '10px 14px',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.9rem',
              border: '1px solid #fca5a5'
            }}>
              ❌ {error}
            </div>
          )}

          {success && (
            <div style={{
              background: '#dcfce7',
              color: '#16a34a',
              padding: '10px 14px',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.9rem',
              border: '1px solid #86efac'
            }}>
              ✅ {success}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Please wait...' : (isLogin ? '🔑 Sign In' : '✨ Create Account')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccess('');
              setFormData({ name: '', email: '', password: '' });
            }}
          >
            {isLogin ? '📝 Sign Up' : '🔑 Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
