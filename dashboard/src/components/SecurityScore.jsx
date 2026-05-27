import React from 'react'
import { Shield } from 'lucide-react'

export default function SecurityScore({ score }) {
  const color = score >= 80 ? '#38a169' : score >= 50 ? '#d69e2e' : '#e53e3e'
  const label = score >= 80 ? 'Good' : score >= 50 ? 'Fair' : 'Critical'

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    }}>
      <div style={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        border: `6px solid ${color}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <Shield size={32} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>Security Score</div>
        <div style={{ fontSize: 42, fontWeight: 700, color, lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: 13, color, marginTop: 4, fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  )
}