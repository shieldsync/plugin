import React from 'react'

const TYPES = {
  'SQL Injection':     { bg: '#fef2f2', color: '#dc2626', dot: '#dc2626' },
  'XSS Attack':        { bg: '#fffbeb', color: '#b45309', dot: '#d97706' },
  'Brute Force':       { bg: '#eff6ff', color: '#1d4ed8', dot: '#3b82f6' },
  'CSRF Attack':       { bg: '#f0fdf4', color: '#15803d', dot: '#22c55e' },
  'Malicious Upload':  { bg: '#faf5ff', color: '#7e22ce', dot: '#a855f7' },
  'IP Blocklist':      { bg: '#fef2f2', color: '#dc2626', dot: '#dc2626' },
}

export default function AttackBadge({ type }) {
  const s = TYPES[type] || { bg: '#f8fafc', color: '#475569', dot: '#94a3b8' }

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      background: s.bg,
      color: s.color,
      padding: '3px 10px 3px 7px',
      borderRadius: 99,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.02em',
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      {type}
    </span>
  )
}
