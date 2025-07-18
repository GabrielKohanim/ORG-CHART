import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import LoadingOverlay from './LoadingOverlay'

const ChatModal = ({ open, onClose, onSubmit, loading, error, orgChart, onPromptChange, prompt }) => {
  const [inputMode, setInputMode] = useState('text') // 'text' or 'image_and_text'
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleImageUpload = (file) => {
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      setImageFile(file)
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => setImagePreview(e.target.result)
        reader.readAsDataURL(file)
      } else {
        setImagePreview(null)
      }
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0])
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = () => {
    if (inputMode === 'text') {
      onSubmit(prompt, 'text')
    } else if (inputMode === 'image_and_text' && imageFile) {
      // Convert image to base64
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64Data = e.target.result.split(',')[1] // Remove data URL prefix
        onSubmit(prompt, 'image_and_text', base64Data)
      }
      reader.readAsDataURL(imageFile)
    }
  }

  const resetForm = () => {
    setInputMode('text')
    setImageFile(null)
    setImagePreview(null)
    setDragActive(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!open) return null

  return (
    <div className="modal-backdrop" style={{ zIndex: 3000 }} onClick={handleClose}>
      <div
        className={classNames('modal', 'chat-modal')}
        style={{ 
          minWidth: 500, 
          maxWidth: 600, 
          borderRadius: 18, 
          boxShadow: '0 8px 32px rgba(0,85,164,0.16)', 
          fontFamily: 'Inter, sans-serif', 
          background: '#fff', 
          animation: 'scaleIn 0.25s' 
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2 className="modal-title" style={{ color: '#0055A4', fontWeight: 700, fontSize: 22, marginBottom: 18 }}>
          AI Org Chart Assistant
        </h2>

        {/* Input Mode Toggle */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 8, background: '#F5F7FA', borderRadius: 12, padding: 4 }}>
            <button
              onClick={() => setInputMode('text')}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: 8,
                border: 'none',
                background: inputMode === 'text' ? '#0055A4' : 'transparent',
                color: inputMode === 'text' ? 'white' : '#6C757D',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              📝 Text Only
            </button>
            <button
              onClick={() => setInputMode('image_and_text')}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: 8,
                border: 'none',
                background: inputMode === 'image_and_text' ? '#0055A4' : 'transparent',
                color: inputMode === 'image_and_text' ? 'white' : '#6C757D',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              🖼️ Image + Text
            </button>
          </div>
        </div>

        {/* Text Input */}
        <div style={{ width: '100%', marginBottom: 16 }}>
          <label htmlFor="ai-prompt" style={{ fontWeight: 600, color: '#333', fontSize: 15, marginBottom: 8, display: 'block' }}>
            {inputMode === 'text' ? 'Describe your org chart:' : 'Describe what you want to modify or add:'}
          </label>
          <textarea
            id="ai-prompt"
            value={prompt}
            onChange={e => onPromptChange(e.target.value)}
            className="form-textarea"
            placeholder={
              inputMode === 'text' 
                ? "e.g. Create a legal team with a managing partner, two associates, and a virtual assistant"
                : "e.g. Add a senior associate and reorganize the hierarchy"
            }
            rows={3}
            style={{ 
              width: '100%', 
              fontSize: 15, 
              borderRadius: 12, 
              border: '2px solid #E1E5E9', 
              padding: '12px 16px', 
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
            disabled={loading}
            autoFocus
          />
        </div>

        {/* Image Upload Section */}
        {inputMode === 'image_and_text' && (
          <div style={{ width: '100%', marginBottom: 16 }}>
            <label style={{ fontWeight: 600, color: '#333', fontSize: 15, marginBottom: 8, display: 'block' }}>
              Upload an org chart image:
            </label>
            
            {!imageFile ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                style={{
                  border: `2px dashed ${dragActive ? '#0055A4' : '#E1E5E9'}`,
                  borderRadius: 12,
                  padding: '40px 20px',
                  textAlign: 'center',
                  background: dragActive ? '#F0F8FF' : '#F8F9FA',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <div style={{ fontSize: 48, marginBottom: 12 }}>📁</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#0055A4', marginBottom: 8 }}>
                  Drop your image here or click to browse
                </div>
                <div style={{ fontSize: 14, color: '#6C757D' }}>
                  Supports PNG, JPG, PDF files
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileInput}
                  style={{ display: 'none' }}
                />
              </div>
            ) : (
              <div style={{
                border: '2px solid #E1E5E9',
                borderRadius: 12,
                padding: '16px',
                background: '#F8F9FA'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {imagePreview && (
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{ 
                        width: 60, 
                        height: 60, 
                        objectFit: 'cover', 
                        borderRadius: 8 
                      }} 
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#333' }}>{imageFile.name}</div>
                    <div style={{ fontSize: 14, color: '#6C757D' }}>
                      {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                  <button
                    onClick={removeImage}
                    style={{
                      background: '#FEE2E2',
                      color: '#DC2626',
                      border: 'none',
                      borderRadius: 8,
                      padding: '8px 12px',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div style={{ 
            background: '#FEE2E2', 
            color: '#DC2626', 
            borderRadius: 10, 
            padding: '12px 16px', 
            margin: '12px 0', 
            fontWeight: 500, 
            textAlign: 'center' 
          }}>
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 12, marginTop: 18, justifyContent: 'center' }}>
          <button
            className="btn-primary"
            style={{ minWidth: 140, fontSize: 16, borderRadius: 12 }}
            onClick={handleSubmit}
            disabled={loading || !prompt.trim() || (inputMode === 'image_and_text' && !imageFile)}
          >
            {loading ? 'Generating...' : 'Generate Org Chart'}
          </button>
          <button 
            className="btn-secondary" 
            style={{ minWidth: 100, fontSize: 16, borderRadius: 12 }} 
            onClick={handleClose} 
            disabled={loading}
          >
            Cancel
          </button>
        </div>

        {loading && <LoadingOverlay />}
      </div>
    </div>
  )
}

ChatModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  orgChart: PropTypes.object,
  onPromptChange: PropTypes.func.isRequired,
  prompt: PropTypes.string.isRequired,
}

export default ChatModal 