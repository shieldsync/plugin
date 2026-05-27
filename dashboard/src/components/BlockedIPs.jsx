import React, { useState } from 'react'
import { api } from '../api/client'

const TH = { fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, padding: '10px 16px', textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }
const TD = { padding: '13px 16px', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle' }

function SourceBadge({ source }) {
  const isManual = source === 'manual'
  return (
    <span style={{
      fontSize: 11, fontWeight: 600,
      padding: '3px 9px', borderRadius: 99,
      background: isManual ? '#eff6ff' : '#fff7ed',
      color: isManual ? '#1d4ed8' : '#c2410c',
    }}>
      {source ?? 'auto'}
    </span>
  )
}

export default function BlockedIPs({ ips, onRefresh }) {
  const [ip, setIp]         = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading]   = useState(false)
  const [feedback, setFeedback] = useState(null)   // { type: 'ok'|'err', msg }
  const [removing, setRemoving] = useState(null)

  const showFeedback = (type, msg) => {
    setFeedback({ type, msg })
    setTimeout(() => setFeedback(null), 3500)
  }

  const handleBlock = async () => {
    if (!ip.trim()) return
    setLoading(true)
    try {
      await api.blockIp(ip.trim(), reason.trim())
      setIp(''); setReason('')
      showFeedback('ok', `${ip} has been blocked.`)
      onRefresh()
    } catch {
      showFeedback('err', 'Failed to block IP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleUnblock = async (addr) => {
    setRemoving(addr)
    try {
      await api.unblockIp(addr)
      showFeedback('ok', `${addr} has been unblocked.`)
      onRefresh()
    } catch {
      showFeedback('err', 'Failed to unblock IP.')
    } finally {
      setRemoving(null)
    }
  }

  return (
    <div className="ss-fade" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Feedback toast */}
      {feedback && (
        <div style={{
          padding: '12px 16px',
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 500,
          background: feedback.type === 'ok' ? '#f0fdf4' : '#fef2f2',
          color:      feedback.type === 'ok' ? '#15803d' : '#dc2626',
          border: `1px solid ${feedback.type === 'ok' ? '#bbf7d0' : '#fecaca'}`,
        }}>
          {feedback.msg}
        </div>
      )}

      {/* Block IP form */}
      <div className="ss-card" style={{
        background: '#fff',
        borderRadius: 12,
        padding: '24px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        border: '1px solid #e2e8f0',
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Block an IP Address</div>
        <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 20 }}>
          Manually add an IP to the blocklist. It will be blocked immediately.
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input
            className="ss-input"
            type="text"
            value={ip}
            onChange={e => setIp(e.target.value)}
            placeholder="192.168.1.1"
            onKeyDown={e => e.key === 'Enter' && handleBlock()}
            style={{
              flex: '1 1 160px',
              padding: '9px 14px',
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              fontSize: 13,
              color: '#0f172a',
              background: '#fff',
              fontFamily: "'SF Mono','Fira Code',monospace",
            }}
          />
          <input
            className="ss-input"
            type="text"
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Reason (optional)"
            onKeyDown={e => e.key === 'Enter' && handleBlock()}
            style={{
              flex: '2 1 220px',
              padding: '9px 14px',
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              fontSize: 13,
              color: '#0f172a',
              background: '#fff',
            }}
          />
          <button
            className="ss-btn-primary"
            onClick={handleBlock}
            disabled={loading || !ip.trim()}
            style={{
              background: '#dc2626',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '9px 20px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'background 0.15s',
            }}
          >
            {loading ? 'Blocking…' : 'Block IP'}
          </button>
        </div>
      </div>

      {/* IP list */}
      <div className="ss-card" style={{
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Blocked IPs</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
              {ips.length === 0 ? 'No IPs blocked' : `${ips.length} IP${ips.length !== 1 ? 's' : ''} currently blocked`}
            </div>
          </div>
        </div>

        {ips.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
            No IPs are currently blocked
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['IP Address', 'Threat Score', 'Source', 'Blocked Since', 'Action'].map(h => (
                    <th key={h} style={TH}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ips.map((row, i) => {
                  const isRemoving = removing === row.ip_address
                  return (
                    <tr key={row.id ?? i} className="ss-row" style={{ opacity: isRemoving ? 0.5 : 1 }}>
                      <td style={TD}>
                        <span style={{
                          fontFamily: "'SF Mono','Fira Code',monospace",
                          fontSize: 12,
                          background: '#f1f5f9',
                          color: '#334155',
                          padding: '3px 8px',
                          borderRadius: 6,
                        }}>
                          {row.ip_address}
                        </span>
                      </td>
                      <td style={TD}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 48, height: 5, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                            <div style={{ width: `${row.threat_score}%`, height: '100%', background: '#dc2626', borderRadius: 99 }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#dc2626' }}>{row.threat_score}</span>
                        </div>
                      </td>
                      <td style={TD}>
                        <SourceBadge source={row.source} />
                      </td>
                      <td style={{ ...TD, color: '#64748b', fontSize: 12 }}>
                        {row.updated_at ? new Date(row.updated_at).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                      </td>
                      <td style={TD}>
                        <button
                          className="ss-btn-danger"
                          onClick={() => handleUnblock(row.ip_address)}
                          disabled={isRemoving}
                          style={{
                            background: 'none',
                            border: '1px solid #e2e8f0',
                            borderRadius: 7,
                            padding: '5px 12px',
                            cursor: 'pointer',
                            fontSize: 12,
                            fontWeight: 600,
                            color: '#64748b',
                            transition: 'all 0.15s',
                          }}
                        >
                          {isRemoving ? 'Removing…' : 'Unblock'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
