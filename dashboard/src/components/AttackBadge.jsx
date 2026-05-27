import React from 'react'

const colors = {
  'SQL Injection':    { bg: '#fff5f5', text: '#c53030' },
  'XSS Attack':      { bg: '#fffbeb', text: '#b7791f' },
  'Brute Force':     { bg: '#ebf8ff', text: '#2b6cb0' },
  'CSRF Attack':     { bg: '#f0fff4', text: '#276749' },
  'Malicious Upload':{ bg: '#faf5ff', text: '#6b46c1' },
  'IP Blocklist':    { bg: '#fff5f5', text: '#c53030' },
}

export default function AttackBadge({ type }) {
  const style = colors[type] || { bg: '#f7f7f7', text: '#444' }

  return (
    <span style={{
      background: style.bg,
      color: style.text,
      padding: '3px 10px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: 600,
    }}>
      {type}
    </span>
  )
}