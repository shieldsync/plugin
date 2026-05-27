import React from 'react'
import AttackBadge from './AttackBadge'

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60)    return `${diff}s ago`
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function ScoreBar({ score }) {
  const color = score >= 90 ? '#dc2626' : score >= 70 ? '#d97706' : '#2563eb'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 56, height: 5, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden',
      }}>
        <div style={{
          width: `${score}%`, height: '100%', background: color,
          borderRadius: 99, transition: 'width 0.4s ease',
        }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 28 }}>
        {score}
      </span>
    </div>
  )
}

const TH = { fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, padding: '10px 16px', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }
const TD = { padding: '12px 16px', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle' }

export default function AttackLogs({ logs }) {
  return (
    <div className="ss-card ss-fade" style={{
      background: '#fff',
      borderRadius: 12,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '20px 24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Attack Logs</div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
            {logs.length === 0 ? 'No events recorded' : `${logs.length} event${logs.length !== 1 ? 's' : ''}`}
          </div>
        </div>
      </div>

      {/* Empty state */}
      {logs.length === 0 ? (
        <div style={{ padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f0fdf4', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L12.4 7.2H18L13.3 10.8L15.1 16L10 12.5L4.9 16L6.7 10.8L2 7.2H7.6L10 2Z" fill="#16a34a" />
            </svg>
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#15803d' }}>All clear</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>No attacks have been logged yet</div>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['Time', 'IP Address', 'Attack Type', 'Threat Score', 'Request URI'].map(h => (
                  <th key={h} style={TH}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={log.id ?? i} className="ss-row">
                  <td style={{ ...TD, color: '#94a3b8', fontSize: 12, whiteSpace: 'nowrap' }}>
                    {timeAgo(log.created_at)}
                  </td>
                  <td style={TD}>
                    <span style={{
                      fontFamily: "'SF Mono','Fira Code',monospace",
                      fontSize: 12,
                      background: '#f1f5f9',
                      color: '#334155',
                      padding: '3px 8px',
                      borderRadius: 6,
                    }}>
                      {log.ip_address}
                    </span>
                  </td>
                  <td style={TD}>
                    <AttackBadge type={log.attack_type} />
                  </td>
                  <td style={TD}>
                    <ScoreBar score={log.threat_score} />
                  </td>
                  <td style={{ ...TD, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#64748b', fontSize: 12 }}
                      title={log.request_uri}>
                    {log.request_uri || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
