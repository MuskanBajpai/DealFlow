import React, { useState } from 'react';

const SettingsView = () => {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('crm_profile_settings');
    return saved ? JSON.parse(saved) : {
      name: 'Jayesh Sharma',
      email: 'jayesh@example.com',
      phone: '9876543210',
      designation: 'Admin',
      company: 'DealFlow',
      timezone: '(GMT+05:30) Asia/Kolkata'
    };
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('crm_profile_settings', JSON.stringify(profile));
    alert("Profile Settings saved successfully!");
    // Reload the page to reflect the new profile name in the top navbar header
    window.location.reload();
  };

  return (
    <div>
      {/* Header section */}
      <div className="greeting-row">
        <div className="greeting-text">
          <h2>Settings</h2>
          <p>Manage your account preferences.</p>
        </div>
      </div>

      <div className="settings-container" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        {/* Central Forms Panel */}
        <div className="card-panel">
          <h3 className="panel-title" style={{ marginBottom: '1.5rem' }}>Profile Settings</h3>
          
          <form onSubmit={handleSave}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" 
                  alt="Jayesh Sharma" 
                  style={{ width: '70px', height: '70px', borderRadius: '50%', border: '3px solid var(--primary-light)', objectFit: 'cover' }}
                />
                <div>
                  <button type="button" className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }} onClick={() => alert("Upload dialog opened")}>
                    Change Photo
                  </button>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-light)', display: 'block', marginTop: '4px' }}>
                    JPG, GIF or PNG. Max size of 800K
                  </span>
                </div>
              </div>

              <div className="form-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    className="form-input" 
                    style={{ backgroundColor: '#FFFFFF' }}
                    value={profile.name} 
                    onChange={handleProfileChange} 
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    className="form-input" 
                    style={{ backgroundColor: '#FFFFFF' }}
                    value={profile.email} 
                    onChange={handleProfileChange} 
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="text" 
                    name="phone" 
                    className="form-input" 
                    style={{ backgroundColor: '#FFFFFF' }}
                    value={profile.phone} 
                    onChange={handleProfileChange} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Designation</label>
                  <input 
                    type="text" 
                    name="designation" 
                    className="form-input" 
                    style={{ backgroundColor: '#FFFFFF' }}
                    value={profile.designation} 
                    onChange={handleProfileChange} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input 
                    type="text" 
                    name="company" 
                    className="form-input" 
                    style={{ backgroundColor: '#FFFFFF' }}
                    value={profile.company} 
                    onChange={handleProfileChange} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Timezone</label>
                  <select 
                    name="timezone" 
                    className="form-input" 
                    style={{ backgroundColor: '#FFFFFF' }}
                    value={profile.timezone} 
                    onChange={handleProfileChange}
                  >
                    <option value="(GMT+05:30) Asia/Kolkata">(GMT+05:30) Asia/Kolkata</option>
                    <option value="(GMT+00:00) GMT / UTC">(GMT+00:00) GMT / UTC</option>
                    <option value="(GMT-05:00) EST (Eastern Standard Time)">(GMT-05:00) EST (Eastern Standard Time)</option>
                    <option value="(GMT-08:00) PST (Pacific Standard Time)">(GMT-08:00) PST (Pacific Standard Time)</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary">
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
