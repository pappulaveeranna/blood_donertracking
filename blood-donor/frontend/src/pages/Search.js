import React, { useState } from 'react';
import axios from 'axios';
import { FaSearch, FaMapMarkerAlt, FaPhone, FaEnvelope, FaUser, FaWeight, FaBirthdayCake, FaEdit } from 'react-icons/fa';
import { MdBloodtype } from 'react-icons/md';
import EditDonorModal from '../components/EditDonorModal';

const Search = () => {
  const [searchParams, setSearchParams] = useState({
    bloodGroup: '',
    city: '',
    state: ''
  });
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [editingDonor, setEditingDonor] = useState(null);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchParams.bloodGroup) {
      alert('Please select a blood group');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      let url = `http://localhost:5000/api/donors`;
      const params = new URLSearchParams();
      
      params.append('bloodGroup', searchParams.bloodGroup);
      
      if (searchParams.city) {
        params.append('city', searchParams.city);
      }
      if (searchParams.state) {
        params.append('state', searchParams.state);
      }
      
      const response = await axios.get(`${url}?${params.toString()}`);
      setDonors(response.data);
    } catch (error) {
      console.error('Search error:', error);
      alert('Error searching donors. Please try again.');
    }
    setLoading(false);
  };

  const clearSearch = () => {
    setSearchParams({ bloodGroup: '', city: '', state: '' });
    setDonors([]);
    setSearched(false);
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

  return (
    <div>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <FaSearch className="icon-3d" size={28} color="#dc2626" /> Find Blood Donors
        </h2>
        
        <form onSubmit={handleSearch}>
          <div className="form-row">
            <div className="form-group">
              <label><MdBloodtype className="icon-3d" size={18} />Blood Group *</label>
              <select
                className="form-control"
                value={searchParams.bloodGroup}
                onChange={(e) => setSearchParams({...searchParams, bloodGroup: e.target.value})}
                required
              >
                <option value="">Select Blood Group</option>
                {bloodGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label><FaMapMarkerAlt className="icon-3d" size={16} />City (Optional)</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter city name"
                value={searchParams.city}
                onChange={(e) => setSearchParams({...searchParams, city: e.target.value})}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label><FaMapMarkerAlt className="icon-3d" size={16} />State (Optional)</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter state name"
              value={searchParams.state}
              onChange={(e) => setSearchParams({...searchParams, state: e.target.value})}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Searching...' : <><FaSearch className="icon-3d" size={16} /> Search Donors</>}
            </button>
            {searched && (
              <button type="button" className="btn btn-secondary" onClick={clearSearch}>
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {donors.length > 0 && (
        <div className="search-results">
          {donors.map(donor => (
            <div key={donor._id} className="donor-card">
              <div className="blood-group">{donor.bloodGroup}</div>
              <div className="donor-info">
                <h3><FaUser className="icon-3d" size={16} /> {donor.name}</h3>
                <p><FaBirthdayCake className="icon-3d" size={14} /><strong>Age:</strong> {donor.age} years</p>
                <p><FaWeight className="icon-3d" size={14} /><strong>Weight:</strong> {donor.weight} kg</p>
                <p><FaMapMarkerAlt className="icon-3d" size={14} /> {donor.location.city}, {donor.location.state}</p>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>{donor.location.address}</p>
                
                <div className="contact-info">
                  <p><FaPhone className="icon-3d" size={14} /> <a href={`tel:${donor.phone}`} style={{ color: '#dc2626', textDecoration: 'none' }}>{donor.phone}</a></p>
                  <p><FaEnvelope className="icon-3d" size={14} /> <a href={`mailto:${donor.email}`} style={{ color: '#dc2626', textDecoration: 'none' }}>{donor.email}</a></p>
                  {donor.lastDonation && (
                    <p style={{ fontSize: '0.9rem', color: '#666' }}>
                      <strong>Last Donation:</strong> {new Date(donor.lastDonation).toLocaleDateString()}
                    </p>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <div style={{ 
                      display: 'inline-block', 
                      padding: '4px 12px', 
                      borderRadius: '15px', 
                      fontSize: '0.8rem',
                      backgroundColor: donor.isAvailable ? '#00b894' : '#e17055',
                      color: 'white'
                    }}>
                      {donor.isAvailable ? '✓ Available' : '✗ Not Available'}
                    </div>
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
      )}

      {searched && donors.length === 0 && !loading && (
        <div className="card" style={{ textAlign: 'center', marginTop: '2rem' }}>
          <h3>No Donors Found</h3>
          <p>No donors found for {searchParams.bloodGroup} blood group{searchParams.city && ` in ${searchParams.city}`}{searchParams.state && `, ${searchParams.state}`}.</p>
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

export default Search;