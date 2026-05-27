import React, { useState, useEffect, useCallback } from 'react'
import { Shield, AlertTriangle, Ban, Activity, RefreshCw } from 'lucide-react'
import SecurityScore from './components/SecurityScore'
import StatCard from './components/StatCard'
import AttackChart from './components/AttackChart'
import AttackLogs from './components/AttackLogs'
import BlockedIPs from './components/BlockedIPs'
import { api } from './api/client'

const NAV = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'shield-sync-logs', label: 'Attack Logs' },
  { id: 'shield-sync-ips', label: 'Blocked IPs' },
]

export default function App({ page = 'shield-sync' }) {
  const [stats, setStats]       = useState(null)
  const [logs, setLogs]         = useState([])
  const [ips, setIps]           = useState([])
  const [loading, setLoading]   = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const fetchAll = useCallback(async () => {
    try {
      const [statsData, logsData, ipsData] = await Promise.all([
        api.getStats(),
        api.getLogs(),
        api.getBlockedIps(),
      ])
      setStats(statsData)
      setLogs(logsData)
      setIps(ipsData)
      setLastRefresh(new Date())
    } catch(e) {
      console.error('ShieldSync API error:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchAll, 30000)
    return () => clearInterval(interval)
  }, [fetchAll])

  const styles = {
    wrap: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      padding: '24px 0',
      maxWidth: 1200,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    title: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      margin: 0,
      fontSize: 22,
      color: '#1a1a2e',
      fontWeight: 700,
    },
    badge: {
      background: '#e53e3e',
      color: 'white',
      padding: '3px 10px',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
    },
    refreshBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      background: 'none',
      border: '1px solid #e2e8f0',
      borderRadius: 6,
      padding: '6px 12px',
      cursor: 'pointer',
      fontSize: 12,
      color: '#666',
    },
    grid4: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 16,
      marginBottom: 20,
    },
    grid2: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16,
      marginBottom: 20,
    },
  }

  if (loading) return (
    <div style={{ padding: 60, textAlign: 'center', color: '#666' }}>
      <Shield size={40} color="#e53e3e" />
      <p style={{ marginTop: 12 }}>Loading ShieldSync...</p>
    </div>
  )

  return (
    <div style={styles.wrap}>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          <Shield size={26} color="#e53e3e" />
          ShieldSync Security
          <span style={styles.badge}>ACTIVE</span>
        </h1>
        <button style={styles.refreshBtn} onClick={fetchAll}>
          <RefreshCw size={12} />
          Last updated {lastRefresh.toLocaleTimeString()}
        </button>
      </div>

      {/* Dashboard page */}
      {(page === 'shield-sync' || page === 'toplevel_page_shield-sync') && (
        <>
          {/* Stat cards */}
          <div style={styles.grid4}>
            <SecurityScore score={stats?.security_score ?? 100} />
            <StatCard
              title="Attacks Today"
              value={stats?.attacks_today ?? 0}
              icon={AlertTriangle}
              color="#e53e3e"
            />
            <StatCard
              title="Blocked IPs"
              value={stats?.blocked_ips ?? 0}
              icon={Ban}
              color="#d69e2e"
            />
            <StatCard
              title="Total Blocked"
              value={logs.length}
              icon={Activity}
              color="#38a169"
            />
          </div>

          {/* Chart + recent logs */}
          <div style={{ marginBottom: 20 }}>
            <AttackChart data={stats?.attacks_week ?? []} />
          </div>

          <AttackLogs logs={logs.slice(0, 10)} />
        </>
      )}

      {/* Logs page */}
      {page === 'shield-sync-logs' && (
        <AttackLogs logs={logs} />
      )}

      {/* Blocked IPs page */}
      {page === 'shield-sync-ips' && (
        <BlockedIPs ips={ips} onRefresh={fetchAll} />
      )}

    </div>
  )
}