import React, { useState, useEffect } from 'react'
import classNames from 'classnames'

const EmployeeInfoPanel = ({ selectedNode, onUpdateNode, onClose, onRemoveNode }) => {
  const [employeeData, setEmployeeData] = useState({
    name: '',
    role: '',
    department: 'General',
    customDepartment: '',
    email: '',
    phone: '',
    skills: '',
    notes: '',
    ...selectedNode?.data
  })

  useEffect(() => {
    if (selectedNode) {
      setEmployeeData({
        name: selectedNode.data.name || '',
        role: selectedNode.data.role || '',
        department: selectedNode.data.department || 'General',
        customDepartment: selectedNode.data.customDepartment || '',
        email: selectedNode.data.email || '',
        phone: selectedNode.data.phone || '',
        skills: selectedNode.data.skills || '',
        notes: selectedNode.data.notes || '',
        title: selectedNode.data.title || '',
        description: selectedNode.data.description || '',
        ...selectedNode.data
      })
    }
  }, [selectedNode])

  const handleInputChange = (field, value) => {
    const updatedData = { ...employeeData, [field]: value }
    setEmployeeData(updatedData)
    onUpdateNode(selectedNode.id, { [field]: value })
  }

  const getDepartmentColor = (department) => {
    const colors = {
      'Executive': '#0055A4',
      'Technology': '#2E8B57',
      'Finance': '#FF6B35',
      'Marketing': '#9B59B6',
      'HR': '#E74C3C',
      'Sales': '#F39C12',
      'General': '#34495E',
      'Unassigned': '#9E9E9E',
      'Other': '#E74C3C'
    }
    return colors[department] || '#34495E'
  }

  if (!selectedNode) return null

  // If image-node, show image fields
  if (selectedNode.data.type === 'image') {
    return (
      <div className="employee-info-panel" style={{ animation: 'slideInRight 0.4s cubic-bezier(0.4,0,0.2,1)' }}>
        <div className="panel-header">
          <div className="header-content">
            <h2 className="panel-title">Company Logo</h2>
            <button onClick={onClose} className="close-btn" aria-label="Close panel">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
        <div className="panel-content">
          <div className="employee-header-card" style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            {selectedNode.data.src ? (
              <img src={selectedNode.data.src} alt={employeeData.title || 'Logo'} className="employee-avatar" style={{ width: 72, height: 72, objectFit: 'contain', borderRadius: 16, background: '#fff', border: '1.5px solid #E1E5E9' }} />
            ) : (
              <div className="avatar-placeholder" style={{ width: 72, height: 72, fontSize: 32 }}>🖼️</div>
            )}
          </div>
          <div className="info-card">
            <h4 className="card-title">Logo Details</h4>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="title">Name / Title</label>
                <input
                  id="title"
                  type="text"
                  value={employeeData.title}
                  onChange={e => handleInputChange('title', e.target.value)}
                  placeholder="Company Name"
                  className="form-input"
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: 15 }}
                />
              </div>
              <div className="form-field full-width">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={employeeData.description}
                  onChange={e => handleInputChange('description', e.target.value)}
                  placeholder="Optional description about company"
                  className="form-textarea"
                  rows={3}
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: 15 }}
                />
              </div>
            </div>
          </div>
          <div className="action-buttons">
            <button 
              onClick={() => { onRemoveNode(selectedNode.id); onClose(); }}
              className="btn-danger"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}>
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
              </svg>
              Remove Logo
            </button>
            <button onClick={onClose} className="btn-secondary">Close Panel</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="employee-info-panel">
      <div className="panel-header">
        <div className="header-content">
          <h2 className="panel-title">Employee Details</h2>
          <button 
            onClick={onClose}
            className="close-btn"
            aria-label="Close panel"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="panel-content">
        {/* Employee Header Card */}
        <div className="employee-header-card">
          <div className="avatar-section">
            {selectedNode.data.avatar ? (
              <img src={selectedNode.data.avatar} alt={selectedNode.data.name} className="employee-avatar" />
            ) : (
              <div className="avatar-placeholder">
                {selectedNode.data.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="employee-info">
            <h3 className="employee-name">{selectedNode.data.name}</h3>
            <p className="employee-role">{selectedNode.data.role}</p>
            <div className="department-chip" style={{ backgroundColor: getDepartmentColor(selectedNode.data.department) }}>
              {selectedNode.data.department === 'Other' && selectedNode.data.customDepartment
                ? selectedNode.data.customDepartment
                : selectedNode.data.department
              }
            </div>
          </div>
        </div>

        {/* Personal Information Card */}
        <div className="info-card">
          <h4 className="card-title">Personal Information</h4>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                value={employeeData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Employee full name"
                className="form-input"
              />
            </div>

            <div className="form-field">
              <label htmlFor="role">Role / Title</label>
              <input
                id="role"
                type="text"
                value={employeeData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                placeholder="Job title or role"
                className="form-input"
              />
            </div>

            <div className="form-field">
              <label htmlFor="department">Department</label>
              <select
                id="department"
                value={employeeData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className="form-select"
                style={{ borderColor: getDepartmentColor(employeeData.department) }}
              >
                <option value="Unassigned">Unassigned</option>
                <option value="Executive">Executive</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="HR">HR</option>
                <option value="Sales">Sales</option>
                <option value="General">General</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {employeeData.department === 'Other' && (
              <div className="form-field">
                <label htmlFor="customDepartment">Custom Department</label>
                <input
                  id="customDepartment"
                  type="text"
                  placeholder="Enter custom department name"
                  value={employeeData.customDepartment || ''}
                  onChange={(e) => handleInputChange('customDepartment', e.target.value)}
                  className="form-input"
                />
              </div>
            )}
          </div>
        </div>

        {/* Contact Information Card */}
        <div className="info-card">
          <h4 className="card-title">Contact Information</h4>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={employeeData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="email@company.com"
                className="form-input"
              />
            </div>

            <div className="form-field">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                value={employeeData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Additional Information Card */}
        <div className="info-card">
          <h4 className="card-title">Additional Information</h4>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="skills">Skills & Expertise</label>
              <input
                id="skills"
                type="text"
                value={employeeData.skills}
                onChange={(e) => handleInputChange('skills', e.target.value)}
                placeholder="JavaScript, React, Project Management"
                className="form-input"
              />
            </div>

            <div className="form-field full-width">
              <label htmlFor="notes">Notes / Bio</label>
              <textarea
                id="notes"
                value={employeeData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Additional notes, achievements, or bio..."
                className="form-textarea"
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            onClick={() => onRemoveNode(selectedNode.id)}
            className="btn-danger"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
            </svg>
            Remove Employee
          </button>
          <button 
            onClick={onClose}
            className="btn-secondary"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmployeeInfoPanel 