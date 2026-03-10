import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, login, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const openLogin = () => {
    setIsRegister(false);
    setError('');
    setUsername('');
    setPassword('');
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setError('');
  };

  const handleSubmit = async () => {
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const res = await axios.post(endpoint, { username, password });
      login(res.data);
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // let the user press Enter to submit
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          🌿 <span>GrowFlo</span>
        </Link>

        <ul className="navbar-links">
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/tracker">My Tracker</NavLink></li>
          <li><NavLink to="/easy-grows">Easy Grows</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>

          {user ? (
            <>
              <li>
                <span className="nav-username">Hi, {user.username}!</span>
              </li>
              <li>
                <button
                  className="btn-danger btn-sm"
                  onClick={logout}
                  style={{ cursor: 'pointer', fontFamily: 'Nunito', fontWeight: 700 }}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <button onClick={openLogin} className="navbar-links nav-auth-btn"
                style={{ cursor: 'pointer', fontFamily: 'Nunito', border: 'none', fontWeight: 700 }}>
                Login / Sign Up
              </button>
            </li>
          )}
        </ul>
      </nav>

      {showModal && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
            <button className="modal-close" onClick={handleClose}>✕</button>
            <h2>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>

            {error && <div className="modal-error">{error}</div>}

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Loading...' : isRegister ? 'Create Account' : 'Login'}
            </button>

            <p className="modal-toggle-text" style={{ marginTop: '0.8rem' }}>
              {isRegister ? 'Already have an account? ' : "Don't have an account? "}
              <button onClick={() => { setIsRegister(!isRegister); setError(''); }}>
                {isRegister ? 'Log in' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
