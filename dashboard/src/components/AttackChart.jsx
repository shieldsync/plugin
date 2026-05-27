import React from 'react'
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#0f172a',
      color: '#fff',
      padding: '8px 14px',
      borderRadius: 8,
      fontSize: 13,
      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
    }}>
      <div style={{ color: '#94a3b8', fontSize: 11, marginBottom: 2 }}>{label}</div>
      <div style={{ fontWeight: 700 }}>{payload[0].value} attacks</div>
    </div>
  )
}

export default function AttackChart({ data }) {
  const hasData = data && data.length > 0

  return (
    <div className="ss-card" style={{
      background: '#fff',
      borderRadius: 12,
      padding: '24px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      border: '1px solid #e2e8f0',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Attack Trend</div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Last 7 days</div>
        </div>
        {hasData && (
          <div style={{
            fontSize: 12, color: '#dc2626', background: '#fef2f2',
            padding: '4px 10px', borderRadius: 99, fontWeight: 600,
          }}>
            {data.reduce((s, d) => s + (d.count || 0), 0)} total
          </div>
        )}
      </div>

      {!hasData ? (
        <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 13 }}>
          No attack data for the past 7 days
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="ssGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#dc2626" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#dc2626" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={v => {
                try { return new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' }) }
                catch { return v }
              }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#dc2626"
              fill="url(#ssGrad)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: '#dc2626', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
