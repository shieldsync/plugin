import React from 'react'

export default function SecurityScore({ score }) {
  const r        = 52
  const circ     = 2 * Math.PI * r          // 326.73
  const offset   = circ * (1 - score / 100)
  const color    = score >= 80 ? '#16a34a' : score >= 50 ? '#d97706' : '#dc2626'
  const bg       = score >= 80 ? '#f0fdf4'  : score >= 50 ? '#fffbeb'  : '#fef2f2'
  const label    = score >= 80 ? 'Protected' : score >= 50 ? 'At Risk'  : 'Critical'

  return (
    <div className="ss-card" style={{
      background: '#fff',
      borderRadius: 12,
      padding: '28px 24px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      border: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      gap: 20,
    }}>
      {/* SVG ring */}
      <svg viewBox="0 0 120 120" width={108} height={108} style={{ flexShrink: 0 }}>
        {/* Track */}
        <circle cx={60} cy={60} r={r} fill="none" stroke="#e2e8f0" strokeWidth={9} />
        {/* Arc */}
        <circle
          className="ss-ring"
          cx={60} cy={60} r={r}
          fill="none"
          stroke={color}
          strokeWidth={9}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
        {/* Score number */}
        <text
          x="50%" y="46%"
          dominantBaseline="middle" textAnchor="middle"
          fontSize="26" fontWeight="700" fill={color}
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        >
          {score}
        </text>
        {/* /100 */}
        <text
          x="50%" y="64%"
          dominantBaseline="middle" textAnchor="middle"
          fontSize="10" fill="#94a3b8"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        >
          / 100
        </text>
      </svg>

      {/* Label block */}
      <div>
        <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 8 }}>
          Security Score
        </div>
        <div style={{
          display: 'inline-block',
          background: bg,
          color,
          fontSize: 12,
          fontWeight: 700,
          padding: '4px 12px',
          borderRadius: 99,
          letterSpacing: '0.04em',
        }}>
          {label}
        </div>
        <div style={{ marginTop: 12, fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>
          {score >= 80
            ? 'No active threats detected.'
            : score >= 50
            ? 'Some threats detected today.'
            : 'High threat activity. Review logs.'}
        </div>
      </div>
    </div>
  )
}
