import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const LeadModal = ({ lead, onClose, onSave }) => {
  const isEdit = !!lead;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'New',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing lead details if editing
  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        status: lead.status || 'New',
        notes: lead.notes || ''
      });
    }
  }, [lead]);

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Name is required';
    if (!formData.company.trim()) tempErrors.company = 'Company Name is required';
    if (!formData.phone.trim()) tempErrors.phone = 'Phone Number is required';
    
    // Email Validation
    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required';
    } else {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(formData.email)) {
        tempErrors.email = 'Please specify a valid email format';
      }
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error on change
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSave(formData);
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        submit: err.message || 'Error occurred while saving lead'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close when clicking overlay backdrop
  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Edit Lead Details' : 'Add New Customer Lead'}</h2>
          <button onClick={onClose} className="modal-close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errors.submit && (
              <div 
                style={{ 
                  backgroundColor: 'var(--danger-light)', 
                  color: 'var(--danger)', 
                  padding: '0.75rem', 
                  borderRadius: 'var(--radius-md)', 
                  marginBottom: '1.25rem',
                  fontSize: '0.85rem',
                  fontWeight: 500
                }}
              >
                {errors.submit}
              </div>
            )}

            <div className="form-grid">
              {/* Full Name */}
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              {/* Company Name */}
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input
                  type="text"
                  name="company"
                  className="form-input"
                  placeholder="e.g. Acme Corp"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                />
                {errors.company && <span className="form-error">{errors.company}</span>}
              </div>

              {/* Email Address */}
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              {/* Phone Number */}
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="text"
                  name="phone"
                  className="form-input"
                  placeholder="e.g. +1 (555) 019-2834"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>

              {/* Lead Status */}
              <div className="form-group form-grid-full">
                <label className="form-label">Lead Status *</label>
                <select
                  name="status"
                  className="form-input"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Converted">Converted</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>

              {/* Lead Notes */}
              <div className="form-group form-grid-full">
                <label className="form-label">Notes & Comments</label>
                <textarea
                  name="notes"
                  className="form-input form-textarea"
                  placeholder="Add details, background information, or logs of meetings/calls..."
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>


            </div>
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
