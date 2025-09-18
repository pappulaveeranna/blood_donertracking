import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaWeight, FaBirthdayCake, FaTimes, FaSave } from 'react-icons/fa';
import { MdBloodtype, MdMedicalServices } from 'react-icons/md';

const EditDonorModal = ({ donor, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: donor.name,
    email: donor.email,
    phone: donor.phone,
    bloodGroup: donor.bloodGroup,
    age: donor.age,
    weight: donor.weight,
    location: {
      address: donor.location.address,
      city: donor.location.city,
      state: donor.location.state,
      pincode: donor.location.pincode
    },
    medicalHistory: donor.medicalHistory || '',
    isAvailable: donor.isAvailable
  });
  const [loading, setLoading] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
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
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.put(`http://localhost:5000/api/donors/${donor._id}`, formData);
      onUpdate(response.data);
    } catch (error) {
      console.error('Update error:', error);
      alert('Error updating donor. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaUser className="icon-3d" size={24} color="#dc2626" />
            Edit Donor Details
          </h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes className="icon-3d" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label><FaUser className="icon-3d" size={16} />Full Name *</label>
              <input
                type="text"
                name="name"
                className="form-control"
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
              value={formData.location.pincode}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><MdMedicalServices className="icon-3d" size={18} />Medical History</label>
            <textarea
              name="medicalHistory"
              className="form-control"
              rows="3"
              value={formData.medicalHistory}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                style={{ width: 'auto', margin: 0 }}
              />
              Available for donation
            </label>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Updating...' : <><FaSave className="icon-3d" size={16} /> Update Details</>}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDonorModal;