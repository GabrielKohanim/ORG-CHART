import React from 'react'
import PropTypes from 'prop-types'

const actionLabel = (action, employeeId) => {
  if (action === 'replaced') return `Replaced Staff (${employeeId})`
  if (action === 'added') return `Added New Staff (${employeeId})`
  if (action === 'removed') return `Removed Staff (${employeeId})`
  return `${action.charAt(0).toUpperCase() + action.slice(1)} (${employeeId})`
}

const AIDecisionPopup = ({ change, idx, total, onDecision }) => {
  // Keyboard accessibility: Enter/Space = Accept, Esc = Reject
  React.useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onDecision(true)
      } else if (e.key === 'Escape') {
        onDecision(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onDecision])

  return (
    <div className="ai-popup-backdrop">
      <div className="ai-popup-card" role="dialog" aria-modal="true" aria-labelledby="ai-popup-title">
        <div className="ai-popup-header">
          <span className="ai-popup-title" id="ai-popup-title">Virtual Staff Update</span>
          <span className="ai-popup-step">{idx + 1} / {total}</span>
        </div>
        <div className="ai-popup-body">
          <div className="ai-popup-action">{actionLabel(change.action, change.employeeId)}</div>
          <div className="ai-popup-reason">{change.reason}</div>
        </div>
        <div className="ai-popup-btn-row">
          <button className="ai-popup-btn accept" onClick={() => onDecision(true)} autoFocus>Accept</button>
          <button className="ai-popup-btn reject" onClick={() => onDecision(false)}>Reject</button>
        </div>
      </div>
    </div>
  )
}

AIDecisionPopup.propTypes = {
  change: PropTypes.shape({
    employeeId: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
    reason: PropTypes.string.isRequired,
  }).isRequired,
  idx: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onDecision: PropTypes.func.isRequired,
}

export default AIDecisionPopup 