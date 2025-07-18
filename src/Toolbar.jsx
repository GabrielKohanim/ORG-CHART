import React, { useRef, useState } from 'react'
import classNames from 'classnames'

const Toolbar = ({ 
  onAddNode, 
  onProposeChanges,
  onSaveChart,
  onLoadChart,
  onOpenAIAssistant, // new prop
  onUploadLogo // new prop
}) => {
  const fileInputRef = useRef(null)
  const logoInputRef = useRef(null)
  const [showLoadModal, setShowLoadModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [logoUploading, setLogoUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [logoError, setLogoError] = useState('')
  const [showLogoModal, setShowLogoModal] = useState(false)
  const [selectedLogoFile, setSelectedLogoFile] = useState(null)

  const handleSave = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await onSaveChart()
      setSuccess('Org chart saved!')
      setTimeout(() => setSuccess(''), 2000)
    } catch (e) {
      setError('Failed to save org chart.')
      setTimeout(() => setError(''), 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleLoadClick = () => {
    setShowLoadModal(true)
  }

  const handleFileChange = async (e) => {
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const file = e.target.files[0]
      if (!file) return
      await onLoadChart(file)
      setSuccess('Org chart loaded!')
      setShowLoadModal(false)
      setTimeout(() => setSuccess(''), 2000)
    } catch (e) {
      setError('Invalid org chart file.')
      setTimeout(() => setError(''), 3000)
    } finally {
      setLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const closeModal = () => {
    setShowLoadModal(false)
    setError('')
  }

  const handleLogoClick = () => {
    setLogoError('')
    setShowLogoModal(true)
    if (!logoUploading && logoInputRef.current) logoInputRef.current.value = '';
  }
  const handleLogoChange = async (e) => {
    setLogoError('')
    const file = e.target.files[0]
    if (!file) return
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml']
    if (!allowed.includes(file.type)) {
      setLogoError('Only PNG, JPG, or SVG files allowed.')
      if (logoInputRef.current) logoInputRef.current.value = ''
      return
    }
    setLogoUploading(true)
    try {
      await onUploadLogo(file)
      setShowLogoModal(false)
    } catch (err) {
      setLogoError(err.message || 'Failed to upload logo.')
    } finally {
      setLogoUploading(false)
      if (logoInputRef.current) logoInputRef.current.value = ''
    }
  }
  const handleLogoUpload = async () => {
    if (!selectedLogoFile) return
    setLogoUploading(true)
    setLogoError('')
    try {
      await onUploadLogo(selectedLogoFile)
      setShowLogoModal(false)
      setSelectedLogoFile(null)
    } catch (err) {
      setLogoError(err.message || 'Failed to upload logo.')
    } finally {
      setLogoUploading(false)
      if (logoInputRef.current) logoInputRef.current.value = ''
    }
  }
  const closeLogoModal = () => {
    setShowLogoModal(false)
    setLogoError('')
    setSelectedLogoFile(null)
    if (logoInputRef.current) logoInputRef.current.value = ''
  }

  return (
    <div className="toolbar">
      <div className="toolbar-header">
        <h1 className="app-title">Org Chart Builder</h1>
        <div className="toolbar-controls">
          <button 
            className="toolbar-btn primary"
            onClick={onAddNode}
          >
            + Add Employee
          </button>
          <button 
            className="toolbar-btn secondary"
            onClick={onProposeChanges}
          >
            🤖 Propose AI Changes
          </button>
          <button
            className="toolbar-btn primary"
            style={{ boxShadow: '0 2px 8px rgba(0,85,164,0.08)' }}
            onClick={handleSave}
            disabled={loading}
          >
            💾 Save Org Chart
          </button>
          <button
            className="toolbar-btn secondary"
            style={{ boxShadow: '0 2px 8px rgba(0,85,164,0.08)' }}
            onClick={handleLoadClick}
            disabled={loading}
          >
            📂 Load Org Chart
          </button>
          <button
            className="toolbar-btn secondary"
            style={{ boxShadow: '0 2px 8px rgba(0,85,164,0.08)' }}
            onClick={handleLogoClick}
            disabled={logoUploading}
          >
            🖼️ Upload Logo
          </button>
          <button
            className="toolbar-btn primary"
            style={{ boxShadow: '0 2px 8px rgba(0,85,164,0.08)' }}
            onClick={onOpenAIAssistant}
          >
            💡 AI Org Chart Assistant
          </button>
        </div>
      </div>
      {showLoadModal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Load Org Chart</h2>
            <input
              type="file"
              accept="application/json"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="modal-file-input"
            />
            <button className="btn-primary" onClick={closeModal} style={{marginTop:12}}>Cancel</button>
            {error && <div className="modal-error">{error}</div>}
          </div>
        </div>
      )}
      {showLogoModal && (
        <div className="modal-backdrop" onClick={closeLogoModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Upload Logo</h2>
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/svg+xml"
              ref={logoInputRef}
              onChange={handleLogoChange}
              className="modal-file-input"
              disabled={logoUploading}
            />
            <button className="btn-primary" onClick={closeLogoModal} style={{marginTop:12}}>Cancel</button>
            {logoError && <div className="modal-error">{logoError}</div>}
          </div>
        </div>
      )}
      {(loading || error || success) && (
        <div className={classNames('toast', { 'toast-error': error, 'toast-success': success })}>
          {loading ? 'Processing...' : error || success}
        </div>
      )}
      {logoUploading && (
        <div className="toast">Uploading logo...</div>
      )}
      {logoError && (
        <div className="toast toast-error">{logoError}</div>
      )}
    </div>
  )
}

export default Toolbar 