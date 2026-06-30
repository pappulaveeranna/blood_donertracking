import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaCheckCircle, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaWeight, FaBirthdayCake, FaEdit, FaSave } from 'react-icons/fa';
import { MdBloodtype, MdMedicalServices } from 'react-icons/md';

const Register = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    bloodGroup: '',
    age: '',
    weight: '',
    location: { address: '', city: '', state: '', pincode: '' },
    medicalHistory: '',
    isAvailable: true
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    // Check if user already registered
    const donors = JSON.parse(localStorage.getItem('bloodapp_donors') || '[]');
    const existing = donors.find(d => d.email === user?.email);
    if (existing) {
      setAlreadyRegistered(true);
      setFormData(existing);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      setFormData({ ...formData, location: { ...formData.location, [field]: value } });
    } else {
      setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await new Promise(r => setTimeout(r, 800));

    const donors = JSON.parse(localStorage.getItem('bloodapp_donors') || '[]');

    if (isEditing) {
      // Update existing donor
      const updated = donors.map(d => d.email === user.email ? { ...formData, updatedAt: new Date().toISOString() } : d);
      localStorage.setItem('bloodapp_donors', JSON.stringify(updated));
      setIsEditing(false);
      setAlreadyRegistered(true);
    } else {
      // New registration
      const newDonor = {
        ...formData,
        _id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      donors.push(newDonor);
      localStorage.setItem('bloodapp_donors', JSON.stringify(donors));
      setAlreadyRegistered(true);
      setSuccess(true);
    }

    setLoading(false);
  };

  // Already registered - show their details with edit option
  if (alreadyRegistered && !isEditing) {
    return (
      <div className="card">
        {success && (
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <FaCheckCircle size={64} color="#00b894" style={{ marginBottom: '1rem' }} />
            <h2>Registration Successful!</h2>
            <p>Thank you for registering as a blood donor. You're now part of our life-saving community.</p>
          </div>
        )}

        <h2 style={{ textAlign: 'center', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <FaUser size={28} color="#dc2626" /> Your Donor Profile
        </h2>

        <div style={{ background: '#fff5f5', borderRadius: '12px', padding: '1.5rem', border: '1px solid #fca5a5' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div><strong>Name:</strong> {formData.name}</div>
            <div><strong>Email:</strong> {formData.email}</div>
            <div><strong>Phone:</strong> {formData.phone}</div>
            <div><strong>Blood Group:</strong> <span style={{ color: '#dc2626', fontWeight: 'bold' }}>{formData.bloodGroup}</span></div>
            <div><strong>Age:</strong> {formData.age} years</div>
            <div><strong>Weight:</strong> {formData.weight} kg</div>
            <div><strong>City:</strong> {formData.location.city}</div>
            <div><strong>State:</strong> {formData.location.state}</div>
            <div><strong>Address:</strong> {formData.location.address}</div>
            <div><strong>Pincode:</strong> {formData.location.pincode}</div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <span style={{
              display: 'inline-block',
              padding: '4px 14px',
              borderRadius: '15px',
              fontSize: '0.85rem',
              backgroundColor: formData.isAvailable ? '#27ae60' : '#e74c3c',
              color: 'white',
              fontWeight: 'bold'
            }}>
              {formData.isAvailable ? '✓ Available for Donation' : '✗ Not Available'}
            </span>
          </div>
          {formData.medicalHistory && (
            <div style={{ marginTop: '1rem' }}><strong>Medical History:</strong> {formData.medicalHistory}</div>
          )}
        </div>

        <button
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '1.5rem' }}
          onClick={() => { setIsEditing(true); setSuccess(false); }}
        >
          <FaEdit size={16} /> Edit My Details
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        {isEditing
          ? <><FaEdit size={28} color="#dc2626" /> Edit Your Donor Details</>
          : <><FaUserPlus size={28} color="#dc2626" /> Register as Blood Donor</>
        }
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label><FaUser size={16} /> Full Name *</label>
            <input type="text" name="name" className="form-control"
              placeholder="Enter your full name"
              value={formData.name} onChange={handleChange} required
            />
          </div>
          <div className="form-group">
            <label><FaEnvelope size={16} /> Email *</label>
            <input type="email" name="email" className="form-control"
              value={formData.email}
              readOnly
              style={{ background: '#f3f4f6', cursor: 'not-allowed' }}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label><FaPhone size={16} /> Phone Number *</label>
            <input type="tel" name="phone" className="form-control"
              placeholder="Enter your phone number"
              value={formData.phone} onChange={handleChange} required
            />
          </div>
          <div className="form-group">
            <label><MdBloodtype size={18} /> Blood Group *</label>
            <select name="bloodGroup" className="form-control"
              value={formData.bloodGroup} onChange={handleChange} required
            >
              <option value="">Select Blood Group</option>
              {bloodGroups.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label><FaBirthdayCake size={16} /> Age *</label>
            <input type="number" name="age" className="form-control"
              placeholder="Age (18-65)" min="18" max="65"
              value={formData.age} onChange={handleChange} required
            />
          </div>
          <div className="form-group">
            <label><FaWeight size={16} /> Weight (kg) *</label>
            <input type="number" name="weight" className="form-control"
              placeholder="Weight (min 50kg)" min="50"
              value={formData.weight} onChange={handleChange} required
            />
          </div>
        </div>

        <div className="form-group">
          <label><FaMapMarkerAlt size={16} /> Address *</label>
          <input type="text" name="location.address" className="form-control"
            placeholder="Enter your full address"
            value={formData.location.address} onChange={handleChange} required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label><FaMapMarkerAlt size={16} /> City *</label>
            <input type="text" name="location.city" className="form-control"
              placeholder="Enter your city"
              value={formData.location.city} onChange={handleChange} required
            />
          </div>
          <div className="form-group">
            <label><FaMapMarkerAlt size={16} /> State *</label>
            <input type="text" name="location.state" className="form-control"
              placeholder="Enter your state"
              value={formData.location.state} onChange={handleChange} required
            />
          </div>
        </div>

        <div className="form-group">
          <label><FaMapMarkerAlt size={16} /> Pincode *</label>
          <input type="text" name="location.pincode" className="form-control"
            placeholder="Enter your pincode"
            value={formData.location.pincode} onChange={handleChange} required
          />
        </div>

        <div className="form-group">
          <label><MdMedicalServices size={18} /> Medical History (Optional)</label>
          <textarea name="medicalHistory" className="form-control" rows="3"
            placeholder="Any relevant medical history..."
            value={formData.medicalHistory} onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" name="isAvailable"
              checked={formData.isAvailable} onChange={handleChange}
              style={{ width: 'auto', margin: 0 }}
            />
            Available for donation
          </label>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
            {loading ? 'Saving...' : isEditing
              ? <><FaSave size={16} /> Update My Details</>
              : <><FaUserPlus size={16} /> Register as Donor</>
            }
          </button>
          {isEditing && (
            <button type="button" className="btn btn-secondary"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Register;
