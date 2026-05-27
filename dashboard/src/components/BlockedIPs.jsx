import React, { useState } from 'react'
import { Trash2, Plus } from 'lucide-react'
import { api } from '../api/client'

export default function BlockedIPs({ ips, onRefresh }) {
  const [newIp, setNewIp] = useState('')
  const [loading, setLoading] = useState(false)

  const handleBlock = async () => {
    if (!newIp) return
    setLoading(true)
    await api.blockIp(newIp)
    setNewIp('')
    setLoading(false)
    onRefresh()
  }

  const handleUnblock = async (ip) => {
    await api.unblockIp(ip)
    onRefresh()
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 15, color: '#1a1a2e' }}>
        Blocked IPs
      </h3>

      {/* Add IP form */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input
          type="text"
          value={newIp}
          onChange={e => setNewIp(e.target.value)}
          placeholder="Enter IP address to block"
          style={{
            flex: 1, padding: '8px 12px', borderRadius: 6,
            border: '1px solid #e2e8f0', fontSize: 13, outline: 'none'
          }}
          onKeyDown={e => e.key === 'Enter' && handleBlock()}
        />
        <button
          onClick={handleBlock}
          disabled={loading || !newIp}
          style={{
            background: '#e53e3e', color: 'white', border: 'none',
            borderRadius: 6, padding: '8px 16px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6, fontSize: 13
          }}
        >
          <Plus size={14} /> Block IP
        </button>
      </div>

      {/* IP list */}
      {ips.length === 0 ? (
        <p style={{ color: '#999', fontSize: 13, textAlign: 'center', padding: 24 }}>
          No IPs blocked yet
        </p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
              {['IP Address', 'Threat Score', 'Source', 'Blocked Since', 'Action'].map(h => (
                <th key={h} style={{
                  textAlign: 'left', padding: '8px 12px',
                  fontSize: 11, color: '#888', textTransform: 'uppercase'
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ips.map(ip => (
              <tr key={ip.id} style={{ borderBottom: '1px solid #f7f7f7' }}>
                <td style={{ padding: '10px 12px' }}>
                  <code style={{ background: '#f7f7f7', padding: '2px 6px', borderRadius: 4 }}>
                    {ip.ip_address}
                  </code>
                </td>
                <td style={{ padding: '10px 12px', color: '#e53e3e', fontWeight: 600 }}>
                  {ip.threat_score}/100
                </td>
                <td style={{ padding: '10px 12px', color: '#666' }}>
                  {ip.source}
                </td>
                <td style={{ padding: '10px 12px', color: '#666' }}>
                  {new Date(ip.updated_at).toLocaleDateString()}
                </td>
                <td style={{ padding: '10px 12px' }}>
                  <button
                    onClick={() => handleUnblock(ip.ip_address)}
                    style={{
                      background: 'none', border: '1px solid #e2e8f0',
                      borderRadius: 6, padding: '4px 8px',
                      cursor: 'pointer', color: '#e53e3e',
                      display: 'flex', alignItems: 'center', gap: 4
                    }}
                  >
                    <Trash2 size={13} /> Unblock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}