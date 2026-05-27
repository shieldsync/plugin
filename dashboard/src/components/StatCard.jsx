import React from 'react'

export default function StatCard({ title, value, subtitle, accent = '#dc2626' }) {
  return (
    <div className="ss-card" style={{
      background: '#fff',
      borderRadius: 12,
      padding: '24px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      border: '1px solid #e2e8f0',
      borderTop: `3px solid ${accent}`,
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
    }}>
      <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
        {title}
      </div>
      <div style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', lineHeight: 1, marginTop: 4 }}>
        {value ?? '—'}
      </div>
      {subtitle && (
        <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
          {subtitle}
        </div>
      )}
    </div>
  )
}
