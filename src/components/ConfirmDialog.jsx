// src/components/ConfirmDialog.jsx
import React from 'react'

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
}

const dialogStyle = {
  width: 'min(640px, 92vw)',
  background: '#fff',
  borderRadius: 12,
  boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
  overflow: 'hidden',
}

const headerStyle = {
  padding: '16px 20px',
  borderBottom: '1px solid #eee',
  fontWeight: 700,
  fontSize: 18,
}

const bodyStyle = {
  padding: 20,
}

const footerStyle = {
  padding: 16,
  display: 'flex',
  gap: 12,
  justifyContent: 'flex-end',
  borderTop: '1px solid #eee',
}

const btnBase = {
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid transparent',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: 14,
  minWidth: 120,
}

const btnPrimary = {
  ...btnBase,
  background: '#6b7280', // default muted grey
  borderColor: '#6b7280',
  color: '#fff',
}

const btnGhost = {
  ...btnBase,
  background: '#f9fafb',
  color: '#374151',
  border: '1px solid #e5e7eb',
}

export default function ConfirmDialog({
  open,
  title = 'Confirm',
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  confirmDisabled = false,
  variant = 'default', // 'default' | 'success' | 'danger'
  hideConfirm = false,
  hideCancel = false,
}) {
  if (!open) return null

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      onCancel?.()
    }
  }

  const confirmStyle = (() => {
    const base = { ...btnPrimary }
    if (variant === 'danger') {
      base.background = '#dc2626'
      base.borderColor = '#b91c1c'
    } else if (variant === 'success') {
      base.background = '#16a34a'
      base.borderColor = '#15803d'
    }
    if (confirmDisabled) {
      base.opacity = 0.6
      base.cursor = 'not-allowed'
    }
    return base
  })()

  return (
    <div style={overlayStyle} onClick={handleOverlayClick}>
      <div style={dialogStyle} role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <div style={headerStyle} id="confirm-title">{title}</div>
        <div style={bodyStyle}>{children}</div>
        <div style={footerStyle}>
          {!hideCancel && (
            <button type="button" onClick={onCancel} style={btnGhost}> {cancelText} </button>
          )}
          {!hideConfirm && (
            <button type="button" onClick={onConfirm} style={confirmStyle} disabled={confirmDisabled}>
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
