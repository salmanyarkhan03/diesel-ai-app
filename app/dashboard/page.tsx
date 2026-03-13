'use client'

import Link from 'next/link'
import NavBar from '@/components/NavBar'
import Sidebar from '@/components/Sidebar'
import { InsightPriority } from '@/types'

interface MockInsight {
  id: string
  priority: InsightPriority
  title: string
  description: string
  action_label: string
  action_url: string
  timestamp: string
}

const MOCK_INSIGHTS: MockInsight[] = [
  {
    id: '1',
    priority: 'HIGH',
    title: 'Competitor price drop detected',
    description: 'Shell on 5th Ave dropped unleaded by $0.08. You are now $0.11 above market. Consider adjusting to avoid volume loss.',
    action_label: 'Update Price',
    action_url: '/pricing',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    priority: 'HIGH',
    title: 'Diesel inventory below threshold',
    description: 'Tank 3 (diesel) is at 18% capacity. At current burn rate you have ~14 hours before running dry. Schedule delivery.',
    action_label: 'Order Delivery',
    action_url: '/orders',
    timestamp: '4 hours ago',
  },
  {
    id: '3',
    priority: 'MEDIUM',
    title: 'Weekend demand surge expected',
    description: 'Historical data shows 23% volume increase this Saturday. Ensure all pumps are operational and consider premium pricing.',
    action_label: 'View Forecast',
    action_url: '/pricing',
    timestamp: '6 hours ago',
  },
  {
    id: '4',
    priority: 'MEDIUM',
    title: 'Pump 4 idle time above average',
    description: 'Pump 4 has 34% more idle time than pumps 1–3 this week. Potential maintenance issue or poor queue routing.',
    action_label: 'Review Data',
    action_url: '/locations',
    timestamp: '1 day ago',
  },
  {
    id: '5',
    priority: 'LOW',
    title: 'Monthly report ready',
    description: 'Your October performance report is compiled. Revenue up 4.2% MoM. Full breakdown available.',
    action_label: 'Download Report',
    action_url: '/orders',
    timestamp: '1 day ago',
  },
]

const PRIORITY_STYLES: Record<InsightPriority, { bg: string; text: string; border: string }> = {
  HIGH: { bg: 'rgba(239,68,68,0.1)', text: '#f87171', border: 'rgba(239,68,68,0.25)' },
  MEDIUM: { bg: 'rgba(251,191,36,0.1)', text: '#fbbf24', border: 'rgba(251,191,36,0.25)' },
  LOW: { bg: 'rgba(34,197,94,0.1)', text: '#22c55e', border: 'rgba(34,197,94,0.25)' },
}

function InsightCard({ insight }: { insight: MockInsight }) {
  const pStyle = PRIORITY_STYLES[insight.priority]
  return (
    <div
      className="rounded-xl p-5 transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(34,197,94,0.3)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <span
            className="text-xs px-2 py-0.5 rounded-md"
            style={{
              background: pStyle.bg,
              color: pStyle.text,
              border: `1px solid ${pStyle.border}`,
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900,
              letterSpacing: '0.08em',
              fontSize: '11px',
            }}
          >
            {insight.priority}
          </span>
          <span className="text-xs" style={{ color: '#4b5563', fontWeight: 300 }}>
            {insight.timestamp}
          </span>
        </div>
      </div>
      <h3
        className="text-base mb-1.5"
        style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, letterSpacing: '0.03em', color: '#f9fafb' }}
      >
        {insight.title}
      </h3>
      <p className="text-sm mb-4" style={{ color: '#6b7280', fontWeight: 300, lineHeight: 1.6 }}>
        {insight.description}
      </p>
      <Link
        href={insight.action_url}
        className="inline-block text-xs px-4 py-1.5 rounded-lg transition-all duration-150"
        style={{
          background: 'rgba(34,197,94,0.1)',
          border: '1px solid rgba(34,197,94,0.25)',
          color: '#22c55e',
          fontFamily: "'Barlow', sans-serif",
          fontWeight: 500,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(34,197,94,0.2)'
          e.currentTarget.style.borderColor = 'rgba(34,197,94,0.5)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(34,197,94,0.1)'
          e.currentTarget.style.borderColor = 'rgba(34,197,94,0.25)'
        }}
      >
        {insight.action_label} →
      </Link>
    </div>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}
    >
      <p className="text-xs mb-1" style={{ color: '#6b7280', fontWeight: 300, letterSpacing: '0.06em' }}>
        {label.toUpperCase()}
      </p>
      <p
        className="text-2xl"
        style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, color: '#f9fafb' }}
      >
        {value}
      </p>
      {sub && (
        <p className="text-xs mt-0.5" style={{ color: '#22c55e', fontWeight: 300 }}>
          {sub}
        </p>
      )}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div style={{ backgroundColor: '#080910', minHeight: '100vh' }}>
      <NavBar />
      <Sidebar />

      <main className="pt-14 pl-14 sm:pl-52">
        <div className="px-6 py-8 max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-3xl sm:text-4xl mb-1"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, letterSpacing: '0.05em' }}
            >
              TODAY&apos;S INSIGHTS
            </h1>
            <p style={{ color: '#6b7280', fontWeight: 300, fontSize: '14px' }}>
              Friday, March 13, 2026 · Main Street #1
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Feed */}
            <div className="flex-1 flex flex-col gap-4">
              {MOCK_INSIGHTS.length === 0 ? (
                <div
                  className="rounded-2xl p-12 text-center"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z" stroke="#22c55e" strokeWidth="1.4" fill="none"/>
                    </svg>
                  </div>
                  <h3
                    className="text-lg mb-2"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900 }}
                  >
                    NO INSIGHTS YET
                  </h3>
                  <p style={{ color: '#6b7280', fontWeight: 300, fontSize: '14px' }}>
                    Upload your first daily report to start receiving AI-powered insights.
                  </p>
                </div>
              ) : (
                MOCK_INSIGHTS.map(insight => <InsightCard key={insight.id} insight={insight} />)
              )}
            </div>

            {/* Sidebar stats */}
            <div className="lg:w-64 flex flex-col gap-4">
              <h2
                className="text-sm"
                style={{ color: '#6b7280', fontWeight: 300, letterSpacing: '0.1em', textTransform: 'uppercase' }}
              >
                Quick Stats
              </h2>
              <StatCard label="Today's Revenue" value="$14,280" sub="+6.2% vs yesterday" />
              <StatCard label="Gallons Sold" value="3,841" sub="Unleaded · 2,104 gal" />
              <StatCard label="Active Alerts" value="2" sub="1 high · 1 medium" />

              {/* Alert feed */}
              <div
                className="rounded-xl p-4 mt-2"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <h3
                  className="text-xs mb-3"
                  style={{ color: '#6b7280', fontWeight: 300, letterSpacing: '0.1em', textTransform: 'uppercase' }}
                >
                  Recent Alerts
                </h3>
                <div className="flex flex-col gap-2.5">
                  {[
                    { type: 'Price Alert', msg: 'Competitor drop detected', color: '#f87171' },
                    { type: 'Inventory', msg: 'Diesel low — Tank 3', color: '#fbbf24' },
                  ].map((a, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: a.color, marginTop: 4, flexShrink: 0 }} />
                      <div>
                        <p className="text-xs" style={{ color: '#d1d5db', fontWeight: 400 }}>{a.type}</p>
                        <p className="text-xs" style={{ color: '#6b7280', fontWeight: 300 }}>{a.msg}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
