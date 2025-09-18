import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUsers, FaMapMarkerAlt, FaPhone, FaEnvelope, FaFilter, FaUser, FaWeight, FaBirthdayCake, FaEdit } from 'react-icons/fa';
import { MdBloodtype } from 'react-icons/md';
import EditDonorModal from '../components/EditDonorModal';

const DonorList = () => {
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    bloodGroup: '',
    city: '',
    available: ''
  });
  const [editingDonor, setEditingDonor] = useState(null);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    fetchDonors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [donors, filters]);

  const fetchDonors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/donors');
      setDonors(response.data);
    } catch (error) {
      console.error('Error fetching donors:', error);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = donors;

    if (filters.bloodGroup) {
      filtered = filtered.filter(donor => donor.bloodGroup === filters.bloodGroup);
    }

    if (filters.city) {
      filtered = filtered.filter(donor => 
        donor.location.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    if (filters.available !== '') {
      filtered = filtered.filter(donor => 
        donor.isAvailable === (filters.available === 'true')
      );
    }

    setFilteredDonors(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleEditDonor = (donor) => {
    setEditingDonor(donor);
  };

  const handleUpdateDonor = (updatedDonor) => {
    setDonors(donors.map(donor => 
      donor._id === updatedDonor._id ? updatedDonor : donor
    ));
    setEditingDonor(null);
  };

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <p>Loading donors...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <FaUsers className="icon-3d" size={28} color="#dc2626" /> All Registered Donors ({filteredDonors.length})
        </h2>
        
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><FaFilter className="icon-3d" size={20} />Filters</h3>
          <div className="form-row">
            <div className="form-group">
              <label><MdBloodtype className="icon-3d" size={16} />Blood Group</label>
              <select
                name="bloodGroup"
                className="form-control"
                value={filters.bloodGroup}
                onChange={handleFilterChange}
              >
                <option value="">All Blood Groups</option>
                {bloodGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label><FaMapMarkerAlt className="icon-3d" size={16} />City</label>
              <input
                type="text"
                name="city"
                className="form-control"
                placeholder="Filter by city"
                value={filters.city}
                onChange={handleFilterChange}
              />
            </div>
            <div className="form-group">
              <label><FaUsers className="icon-3d" size={16} />Availability</label>
              <select
                name="available"
                className="form-control"
                value={filters.available}
                onChange={handleFilterChange}
              >
                <option value="">All Donors</option>
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {filteredDonors.length > 0 ? (
        <div className="search-results">
          {filteredDonors.map(donor => (
            <div key={donor._id} className="donor-card">
              <div className="blood-group">{donor.bloodGroup}</div>
              <div className="donor-info">
                <h3><FaUser className="icon-3d" size={16} /> {donor.name}</h3>
                <p><FaBirthdayCake className="icon-3d" size={14} /><strong>Age:</strong> {donor.age} years</p>
                <p><FaWeight className="icon-3d" size={14} /><strong>Weight:</strong> {donor.weight} kg</p>
                <p><FaMapMarkerAlt className="icon-3d" size={14} /> {donor.location.city}, {donor.location.state}</p>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>{donor.location.address}</p>
                
                <div style={{ 
                  display: 'inline-block', 
                  padding: '4px 12px', 
                  borderRadius: '15px', 
                  fontSize: '0.8rem',
                  backgroundColor: donor.isAvailable ? '#27ae60' : '#e74c3c',
                  color: 'white',
                  marginBottom: '1rem',
                  fontWeight: 'bold'
                }}>
                  {donor.isAvailable ? '✓ Available' : '✗ Not Available'}
                </div>
                
                <div className="contact-info">
                  <p><FaPhone className="icon-3d" size={14} /> <a href={`tel:${donor.phone}`} style={{ color: '#dc2626', textDecoration: 'none' }}>{donor.phone}</a></p>
                  <p><FaEnvelope className="icon-3d" size={14} /> <a href={`mailto:${donor.email}`} style={{ color: '#dc2626', textDecoration: 'none' }}>{donor.email}</a></p>
                  {donor.lastDonation && (
                    <p style={{ fontSize: '0.9rem', color: '#666' }}>
                      <strong>Last Donation:</strong> {new Date(donor.lastDonation).toLocaleDateString()}
                    </p>
                  )}
                  <p style={{ fontSize: '0.9rem', color: '#666' }}>
                    <strong>Registered:</strong> {new Date(donor.createdAt).toLocaleDateString()}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button 
                      className="btn-edit"
                      onClick={() => handleEditDonor(donor)}
                    >
                      <FaEdit className="icon-3d" size={12} /> Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center' }}>
          <h3>No Donors Found</h3>
          <p>No donors found matching the current filters.</p>
        </div>
      )}

      {editingDonor && (
        <EditDonorModal 
          donor={editingDonor}
          onClose={() => setEditingDonor(null)}
          onUpdate={handleUpdateDonor}
        />
      )}
    </div>
  );
};

export default DonorList;