import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUserPlus, FaHeart, FaHandHoldingHeart, FaMapMarkerAlt } from 'react-icons/fa';
import { MdBloodtype } from 'react-icons/md';

const Home = () => {
  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Save Lives, Donate Blood</h1>
            <p>Connect blood donors with those in need. Every donation counts.</p>
            <div className="hero-buttons">
              <Link to="/search" className="btn btn-primary">
                <FaSearch className="icon-3d" size={18} /> Find Donors
              </Link>
              <Link to="/register" className="btn btn-secondary">
                <FaUserPlus className="icon-3d" size={18} /> Become a Donor
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <img src="/hero-image.jpg" alt="Blood donation" />
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="stat-card">
          <div className="stat-number">1000+</div>
          <div className="stat-label">Registered Donors</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">500+</div>
          <div className="stat-label">Lives Saved</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">50+</div>
          <div className="stat-label">Cities Covered</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">24/7</div>
          <div className="stat-label">Available</div>
        </div>
      </section>

      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <FaHeart className="icon-3d" size={32} color="#dc2626" /> How It Works
        </h2>
        <div className="feature-grid">
          <div className="feature-card">
            <MdBloodtype className="feature-icon icon-3d" color="#dc2626" />
            <h3>Search</h3>
            <p>Find blood donors by blood group and location</p>
          </div>
          <div className="feature-card">
            <FaHandHoldingHeart className="feature-icon icon-3d" color="#ef4444" />
            <h3>Connect</h3>
            <p>Get contact details of available donors</p>
          </div>
          <div className="feature-card">
            <FaMapMarkerAlt className="feature-icon icon-3d" color="#f87171" />
            <h3>Save Lives</h3>
            <p>Help save lives through blood donation</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;