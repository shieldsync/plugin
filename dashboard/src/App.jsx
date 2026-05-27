import React, { useState, useEffect, useCallback } from 'react'
import SecurityScore from './components/SecurityScore'
import StatCard      from './components/StatCard'
import AttackChart   from './components/AttackChart'
import AttackLogs    from './components/AttackLogs'
import BlockedIPs    from './components/BlockedIPs'
import { api }       from './api/client'

/* ── helpers ─────────────────────────────────────────────── */
function pageId(raw = '') {
  if (raw.includes('shield-sync-ips'))  return 'ips'
  if (raw.includes('shield-sync-logs')) return 'logs'
  return 'dashboard'
}

/* ── loading skeleton ────────────────────────────────────── */
function Skeleton() {
  const box = (w, h, r = 8) => (
    <div style={{ width: w, height: h, borderRadius: r, background: '#f1f5f9', animation: 'ss-shimmer 1.5s infinite' }} />
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {box(80, 10)}
            {box(60, 32)}
          </div>
        ))}
      </div>
      <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0' }}>
        {box('60%', 12, 6)}
        <div style={{ marginTop: 20 }}>{box('100%', 160, 8)}</div>
      </div>
    </div>
  )
}

/* ── main app ────────────────────────────────────────────── */
export default function App({ page: rawPage = 'shield-sync' }) {
  const tab  = pageId(rawPage)

  const [stats,   setStats]   = useState(null)
  const [logs,    setLogs]    = useState([])
  const [ips,     setIps]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(false)
  const [refresh, setRefresh] = useState(new Date())

  const fetchAll = useCallback(async () => {
    setError(false)
    try {
      const [s, l, i] = await Promise.all([api.getStats(), api.getLogs(), api.getBlockedIps()])
      setStats(s); setLogs(l); setIps(i)
      setRefresh(new Date())
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
    const t = setInterval(fetchAll, 30_000)
    return () => clearInterval(t)
  }, [fetchAll])

  /* ── layout shell ── */
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: 1200,
      paddingBottom: 40,
      color: '#0f172a',
    }}>

      {/* ── top header ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 28,
        paddingBottom: 20,
        borderBottom: '1px solid #e2e8f0',
      }}>
        {/* Wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Shield mark — pure SVG, no lib */}
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <path d="M15 2L4 7V15C4 21.1 8.8 26.8 15 28C21.2 26.8 26 21.1 26 15V7L15 2Z" fill="#dc2626" />
            <path d="M12 15.5L14 17.5L18.5 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a' }}>
            ShieldSync
          </span>
          {/* Active dot */}
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '3px 10px', borderRadius: 99, marginLeft: 4 }}>
            <span className="ss-pulse" />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#15803d', letterSpacing: '0.04em' }}>ACTIVE</span>
          </span>
        </div>

        {/* Refresh */}
        <button
          onClick={fetchAll}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', border: '1px solid #e2e8f0',
            borderRadius: 8, padding: '7px 14px',
            cursor: 'pointer', fontSize: 12, color: '#64748b',
            transition: 'all 0.15s',
          }}
          className="ss-btn-ghost"
        >
          {/* Refresh icon — pure SVG */}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          Updated {refresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </button>
      </div>

      {/* ── tab bar (display only — WP menu handles real routing) ── */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 28, borderBottom: '1px solid #e2e8f0' }}>
        {[
          { id: 'dashboard', label: 'Overview',    href: '?page=shield-sync' },
          { id: 'logs',      label: 'Attack Logs', href: '?page=shield-sync-logs' },
          { id: 'ips',       label: 'Blocked IPs', href: '?page=shield-sync-ips' },
        ].map(t => (
          <a
            key={t.id}
            href={t.href}
            className={`ss-tab${tab === t.id ? ' active' : ''}`}
            style={{
              display: 'block',
              padding: '10px 18px',
              fontSize: 13,
              fontWeight: 600,
              color: tab === t.id ? '#dc2626' : '#64748b',
              textDecoration: 'none',
              borderBottom: `2px solid ${tab === t.id ? '#dc2626' : 'transparent'}`,
              marginBottom: -1,
              transition: 'all 0.15s',
            }}
          >
            {t.label}
          </a>
        ))}
      </div>

      {/* ── error banner ── */}
      {error && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fecaca',
          color: '#dc2626', borderRadius: 8,
          padding: '12px 16px', fontSize: 13, fontWeight: 500,
          marginBottom: 20,
        }}>
          Could not connect to the ShieldSync API. Check that the plugin is active and your session is valid.
        </div>
      )}

      {/* ── content ── */}
      {loading ? <Skeleton /> : (
        <>
          {/* DASHBOARD */}
          {tab === 'dashboard' && (
            <div className="ss-fade" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Stat row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px,1.4fr) repeat(3,1fr)', gap: 16 }}>
                <SecurityScore score={stats?.security_score ?? 100} />
                <StatCard
                  title="Attacks Today"
                  value={stats?.attacks_today ?? 0}
                  subtitle="Blocked automatically"
                  accent="#dc2626"
                />
                <StatCard
                  title="Blocked IPs"
                  value={stats?.blocked_ips ?? 0}
                  subtitle="Currently on blocklist"
                  accent="#d97706"
                />
                <StatCard
                  title="Events Logged"
                  value={logs.length}
                  subtitle="Total in database"
                  accent="#2563eb"
                />
              </div>

              {/* Attack breakdown + chart */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 16, alignItems: 'start' }}>
                <AttackChart data={stats?.attacks_week ?? []} />

                {/* Attack type breakdown */}
                <div className="ss-card" style={{
                  background: '#fff',
                  borderRadius: 12,
                  padding: '24px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  border: '1px solid #e2e8f0',
                }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>By Type</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>Today's breakdown</div>

                  {(!stats?.attack_types || stats.attack_types.length === 0) ? (
                    <div style={{ fontSize: 13, color: '#94a3b8', padding: '16px 0', textAlign: 'center' }}>No attacks today</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {stats.attack_types.map(t => {
                        const max = Math.max(...stats.attack_types.map(x => x.count))
                        const pct = max > 0 ? (t.count / max) * 100 : 0
                        return (
                          <div key={t.attack_type}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                              <span style={{ fontSize: 12, color: '#334155', fontWeight: 500 }}>{t.attack_type}</span>
                              <span style={{ fontSize: 12, fontWeight: 700, color: '#dc2626' }}>{t.count}</span>
                            </div>
                            <div style={{ height: 4, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                              <div style={{ width: `${pct}%`, height: '100%', background: '#dc2626', borderRadius: 99, transition: 'width 0.4s ease' }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent logs preview */}
              <AttackLogs logs={logs.slice(0, 10)} />
            </div>
          )}

          {/* ATTACK LOGS */}
          {tab === 'logs' && <AttackLogs logs={logs} />}

          {/* BLOCKED IPs */}
          {tab === 'ips' && <BlockedIPs ips={ips} onRefresh={fetchAll} />}
        </>
      )}
    </div>
  )
}
