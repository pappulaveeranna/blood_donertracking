import React, { useState } from 'react';
import axios from 'axios';
import { FaUserPlus, FaCheckCircle, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaWeight, FaBirthdayCake } from 'react-icons/fa';
import { MdBloodtype, MdMedicalServices } from 'react-icons/md';
import API_BASE_URL from '../config';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bloodGroup: '',
    age: '',
    weight: '',
    location: {
      address: '',
      city: '',
      state: '',
      pincode: ''
    },
    medicalHistory: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [locationField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post(`${API_BASE_URL}/api/donors`, formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        bloodGroup: '',
        age: '',
        weight: '',
        location: {
          address: '',
          city: '',
          state: '',
          pincode: ''
        },
        medicalHistory: ''
      });
    } catch (error) {
      console.error('Registration error:', error);
      alert('Error registering donor. Please try again.');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <FaCheckCircle className="icon-3d" size={64} color="#00b894" style={{ marginBottom: '1rem' }} />
        <h2>Registration Successful!</h2>
        <p>Thank you for registering as a blood donor. You're now part of our life-saving community.</p>
        <button 
          className="btn btn-primary" 
          onClick={() => setSuccess(false)}
          style={{ marginTop: '1rem' }}
        >
          Register Another Donor
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        <FaUserPlus className="icon-3d" size={28} color="#dc2626" /> Register as Blood Donor
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label><FaUser className="icon-3d" size={16} />Full Name *</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label><FaEnvelope className="icon-3d" size={16} />Email *</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label><FaPhone className="icon-3d" size={16} />Phone Number *</label>
            <input
              type="tel"
              name="phone"
              className="form-control"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label><MdBloodtype className="icon-3d" size={18} />Blood Group *</label>
            <select
              name="bloodGroup"
              className="form-control"
              value={formData.bloodGroup}
              onChange={handleChange}
              required
            >
              <option value="">Select Blood Group</option>
              {bloodGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label><FaBirthdayCake className="icon-3d" size={16} />Age *</label>
            <input
              type="number"
              name="age"
              className="form-control"
              placeholder="Age (18-65)"
              min="18"
              max="65"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label><FaWeight className="icon-3d" size={16} />Weight (kg) *</label>
            <input
              type="number"
              name="weight"
              className="form-control"
              placeholder="Weight (min 50kg)"
              min="50"
              value={formData.weight}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label><FaMapMarkerAlt className="icon-3d" size={16} />Address *</label>
          <input
            type="text"
            name="location.address"
            className="form-control"
            placeholder="Enter your full address"
            value={formData.location.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label><FaMapMarkerAlt className="icon-3d" size={16} />City *</label>
            <input
              type="text"
              name="location.city"
              className="form-control"
              placeholder="Enter your city"
              value={formData.location.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label><FaMapMarkerAlt className="icon-3d" size={16} />State *</label>
            <input
              type="text"
              name="location.state"
              className="form-control"
              placeholder="Enter your state"
              value={formData.location.state}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label><FaMapMarkerAlt className="icon-3d" size={16} />Pincode *</label>
          <input
            type="text"
            name="location.pincode"
            className="form-control"
            placeholder="Enter your pincode"
            value={formData.location.pincode}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label><MdMedicalServices className="icon-3d" size={18} />Medical History (Optional)</label>
          <textarea
            name="medicalHistory"
            className="form-control"
            rows="3"
            placeholder="Any relevant medical history..."
            value={formData.medicalHistory}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Registering...' : <><FaUserPlus className="icon-3d" size={16} /> Register as Donor</>}
        </button>
      </form>
    </div>
  );
};

export default Register;