import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'

const ACCEPTED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/svg+xml'
]

const ImageDropZone = ({ onImageDrop, children }) => {
  const [dragActive, setDragActive] = useState(false)
  const overlayRef = useRef(null)

  // Get mouse position relative to overlay
  const getDropPosition = (e) => {
    const rect = overlayRef.current.getBoundingClientRect()
    let x, y
    if (e.type.startsWith('touch')) {
      const touch = e.changedTouches[0]
      x = touch.clientX - rect.left
      y = touch.clientY - rect.top
    } else {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }
    return { x, y }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }
  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    let file
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      file = e.dataTransfer.files[0]
    }
    if (file && ACCEPTED_TYPES.includes(file.type)) {
      const pos = getDropPosition(e)
      onImageDrop(file, pos)
    }
  }

  return (
    <div
      ref={overlayRef}
      className={`image-drop-zone${dragActive ? ' active' : ''}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 10,
        pointerEvents: dragActive ? 'all' : 'none',
        background: dragActive ? 'rgba(0,85,164,0.08)' : 'transparent',
        border: dragActive ? '2px dashed #0055A4' : 'none',
        borderRadius: 18,
        transition: 'background 0.2s, border 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif',
        color: '#0055A4',
        fontSize: 18,
        fontWeight: 600,
        opacity: dragActive ? 1 : 0,
        pointerEvents: dragActive ? 'all' : 'none',
        animation: dragActive ? 'fadeIn 0.2s' : undefined
      }}
    >
      {dragActive && (
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0,85,164,0.10)',
          padding: '2.5rem 3rem',
          border: '2px dashed #0055A4',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          animation: 'scaleIn 0.2s'
        }}>
          <span style={{ fontSize: 48, marginBottom: 8 }}>🖼️</span>
          <span>Drop a PNG, JPG, or SVG logo here</span>
        </div>
      )}
      {children}
    </div>
  )
}

ImageDropZone.propTypes = {
  onImageDrop: PropTypes.func.isRequired,
  children: PropTypes.node
}

export default ImageDropZone 