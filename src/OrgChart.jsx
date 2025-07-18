import React, { useState, useRef, useCallback } from 'react'
import { Handle, Position } from 'react-flow-renderer'
import classNames from 'classnames'

const OrgChart = ({ data, selected }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(data)
  const inputRef = useRef(null)

  const handleDoubleClick = () => {
    setIsEditing(true)
    setEditData(data)
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 100)
  }

  const handleSave = () => {
    setIsEditing(false)
    // The parent component will handle the actual update
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData(data)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
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
      'Unassigned': '#9E9E9E'
    }
    return colors[department] || '#34495E'
  }

  // Render image-node
  if (data.type === 'image') {
    return (
      <div className={classNames('org-node', { 'selected': selected })}>
        <Handle type="target" position={Position.Top} className="handle" />
        <div
          className="org-node-card image-node-card"
          style={{
            border: 'none',
            boxShadow: selected ? '0 0 0 3px rgba(0,85,164,0.2)' : '0 4px 12px rgba(0,0,0,0.10)',
            cursor: 'pointer',
            transition: 'transform 0.18s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 300,
            minHeight: 300,
            width: 320,
            height: 320,
            background: 'transparent',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 24,
            padding: 0
          }}
          tabIndex={0}
        >
          {data.src ? (
            <img
              src={data.src}
              alt={data.title || 'Logo'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center',
                borderRadius: 24,
                background: 'transparent',
                boxShadow: 'none',
                border: 'none',
                display: 'block',
                transition: 'transform 0.18s',
                ...(selected ? { transform: 'scale(1.04)' } : {})
              }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#E1E5E9', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0055A4', fontSize: 64 }}>🖼️</div>
          )}
        </div>
        <Handle type="source" position={Position.Bottom} className="handle" />
      </div>
    )
  }

  return (
    <div className={classNames('org-node', { 'selected': selected })}>
      <Handle type="target" position={Position.Top} className="handle" />
      
      <div 
        className="org-node-card"
        onDoubleClick={handleDoubleClick}
        style={{ borderColor: getDepartmentColor(data.department) }}
      >
        {isEditing ? (
          <div className="edit-form">
            <input
              ref={inputRef}
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              onKeyDown={handleKeyPress}
              className="edit-input"
              placeholder="Name"
            />
            <input
              type="text"
              value={editData.role}
              onChange={(e) => setEditData({ ...editData, role: e.target.value })}
              onKeyDown={handleKeyPress}
              className="edit-input"
              placeholder="Role"
            />
            <select
              value={editData.department}
              onChange={(e) => setEditData({ ...editData, department: e.target.value })}
              className="edit-select"
            >
              <option value="Executive">Executive</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
              <option value="Sales">Sales</option>
              <option value="General">General</option>
              <option value="Other">Other</option>
            </select>
            {editData.department === 'Other' && (
              <input
                type="text"
                placeholder="Enter custom department name"
                value={editData.customDepartment || ''}
                onChange={(e) => setEditData({ ...editData, customDepartment: e.target.value })}
                className="edit-input"
              />
            )}
            <div className="edit-buttons">
              <button onClick={handleSave} className="save-btn">Save</button>
              <button onClick={handleCancel} className="cancel-btn">Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <div className="avatar">
              {data.avatar ? (
                <img src={data.avatar} alt={data.name} />
              ) : (
                <div className="avatar-placeholder">
                  {data.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="node-content">
              <h3 className="node-name">{data.name}</h3>
              <p className="node-role">{data.role}</p>
                          <span className="node-department" style={{ backgroundColor: getDepartmentColor(data.department) }}>
              {data.department === 'Other' && data.customDepartment
                ? data.customDepartment
                : data.department
              }
            </span>
            </div>
          </>
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="handle" />
    </div>
  )
}

export default OrgChart 