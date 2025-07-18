import React from 'react'
import PropTypes from 'prop-types'

const SummaryModal = ({ decisionLog, onExport, onClose }) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ minWidth: 360, maxWidth: 480 }}>
        <h2 className="modal-title">AI Recommendation Summary</h2>
        <div style={{ maxHeight: 320, overflowY: 'auto', width: '100%' }}>
          {decisionLog.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#888', margin: '2rem 0' }}>No changes reviewed.</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {decisionLog.map((d, i) => (
                <li key={i} style={{
                  background: d.accepted ? '#E6F4FF' : '#FEE2E2',
                  color: d.accepted ? '#0055A4' : '#DC2626',
                  borderRadius: 10,
                  marginBottom: 12,
                  padding: '12px 16px',
                  fontWeight: 500,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4
                }}>
                  <span style={{ fontSize: 15 }}>
                    <b>{d.action.charAt(0).toUpperCase() + d.action.slice(1)}</b> ({d.employeeId}) — <span style={{ fontWeight: 700 }}>{d.accepted ? 'Accepted' : 'Rejected'}</span>
                  </span>
                  <span style={{ fontSize: 14, color: '#333', fontWeight: 400 }}>{d.reason}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'center' }}>
          <button className="btn-primary" onClick={onExport}>Export Log</button>
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

SummaryModal.propTypes = {
  decisionLog: PropTypes.arrayOf(PropTypes.shape({
    employeeId: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
    reason: PropTypes.string.isRequired,
    accepted: PropTypes.bool.isRequired,
  })).isRequired,
  onExport: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default SummaryModal 