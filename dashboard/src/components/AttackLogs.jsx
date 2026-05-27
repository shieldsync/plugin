import React from 'react'
import AttackBadge from './AttackBadge'

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`
  return `${Math.floor(diff/86400)}d ago`
}

export default function AttackLogs({ logs }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 15, color: '#1a1a2e' }}>
        Recent Attacks
      </h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
            {['Time', 'IP Address', 'Attack Type', 'Score', 'URL'].map(h => (
              <th key={h} style={{
                textAlign: 'left', padding: '8px 12px',
                fontSize: 11, color: '#888',
                textTransform: 'uppercase', letterSpacing: '0.5px'
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: 32, color: '#999' }}>
                ✅ No attacks logged yet
              </td>
            </tr>
          ) : logs.map(log => (
            <tr key={log.id} style={{ borderBottom: '1px solid #f7f7f7' }}>
              <td style={{ padding: '10px 12px', color: '#666' }}>
                {timeAgo(log.created_at)}
              </td>
              <td style={{ padding: '10px 12px' }}>
                <code style={{ background: '#f7f7f7', padding: '2px 6px', borderRadius: 4 }}>
                  {log.ip_address}
                </code>
              </td>
              <td style={{ padding: '10px 12px' }}>
                <AttackBadge type={log.attack_type} />
              </td>
              <td style={{ padding: '10px 12px', color: '#e53e3e', fontWeight: 600 }}>
                {log.threat_score}/100
              </td>
              <td style={{ padding: '10px 12px', color: '#666', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {log.request_uri}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}