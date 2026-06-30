import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaHome, FaSearch, FaUserPlus, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import NotificationBell from './NotificationBell';
import MessageIcon from './MessageIcon';

const Header = ({ user, onLogout }) => {
  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className="logo">
          <FaHeart className="icon-3d" size={24} /> BloodConnect
        </Link>
        <ul className="nav-links">
          <li><Link to="/"><FaHome className="icon-3d" size={16} /> Home</Link></li>
          <li><Link to="/search"><FaSearch className="icon-3d" size={16} /> Search</Link></li>
          <li><Link to="/register"><FaUserPlus className="icon-3d" size={16} /> Register</Link></li>
          <li><Link to="/donors"><FaUsers className="icon-3d" size={16} /> Donors</Link></li>
          {user && (
            <>
              <li><MessageIcon user={user} /></li>
              <li><NotificationBell user={user} /></li>
              <li>
                <button onClick={onLogout} className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.9rem' }}>
                  <FaSignOutAlt size={14} /> Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
