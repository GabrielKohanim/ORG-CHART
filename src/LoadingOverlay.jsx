import React from 'react'

const LoadingOverlay = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        <h2 className="loading-title">AI is analyzing your org chart...</h2>
        <p className="loading-subtitle">This may take a few moments</p>
      </div>
    </div>
  )
}

export default LoadingOverlay 