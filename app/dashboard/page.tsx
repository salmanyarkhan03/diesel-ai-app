'use client'

import { useState, useEffect } from 'react'
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

const MOCK_LOCATION = {
  name: 'Main Street #1',
  address: '1234 Main Street, Springfield, IL 62701',
}

const PRIORITY_STYLES: Record<InsightPriority, { bg: string; text: string; border: string }> = {
  HIGH: { bg: 'rgba(239,68,68,0.1)', text: '#f87171', border: 'rgba(239,68,68,0.25)' },
  MEDIUM: { bg: 'rgba(251,191,36,0.1)', text: '#fbbf24', border: 'rgba(251,191,36,0.25)' },
  LOW: { bg: 'rgba(34,197,94,0.1)', text: '#22c55e', border: 'rgba(34,197,94,0.25)' },
}

// ─── Shared modal styles ──────────────────────────────────────────────────────

const OVERLAY_STYLE: React.CSSProperties = {
  position: 'fixed', inset: 0, zIndex: 50,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: '0 16px',
  background: 'rgba(0,0,0,0.75)',
  backdropFilter: 'blur(6px)',
}

const MODAL_STYLE: React.CSSProperties = {
  width: '100%', maxWidth: 480,
  borderRadius: 20,
  padding: '28px 28px 24px',
  background: '#0d0f14',
  border: '1px solid rgba(255,255,255,0.1)',
  boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
  position: 'relative',
}

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10,
  padding: '10px 14px',
  color: '#f9fafb',
  fontFamily: "'Barlow', sans-serif",
  fontWeight: 300,
  fontSize: 14,
  outline: 'none',
}

const LABEL_STYLE: React.CSSProperties = {
  display: 'block',
  color: '#6b7280',
  fontFamily: "'Barlow', sans-serif",
  fontWeight: 400,
  fontSize: 12,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  marginBottom: 6,
}

const BTN_GREEN: React.CSSProperties = {
  background: 'rgba(34,197,94,0.15)',
  border: '1px solid rgba(34,197,94,0.4)',
  color: '#22c55e',
  borderRadius: 10,
  padding: '10px 18px',
  fontFamily: "'Barlow', sans-serif",
  fontWeight: 500,
  fontSize: 13,
  cursor: 'pointer',
  transition: 'all 0.15s',
}

const BTN_GHOST: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#6b7280',
  borderRadius: 10,
  padding: '10px 18px',
  fontFamily: "'Barlow', sans-serif",
  fontWeight: 400,
  fontSize: 13,
  cursor: 'pointer',
  transition: 'all 0.15s',
}

// ─── Delivery Modal ───────────────────────────────────────────────────────────

function DeliveryModal({ onClose, onScheduled }: { onClose: () => void; onScheduled: () => void }) {
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('jobber_contact')
    if (saved) {
      const { phone: p, email: e } = JSON.parse(saved)
      setPhone(p || '')
      setEmail(e || '')
    }
  }, [])

  const saveContact = () => {
    localStorage.setItem('jobber_contact', JSON.stringify({ phone, email }))
  }

  const handleScheduled = () => {
    saveContact()
    onScheduled()
    onClose()
  }

  const emailSubject = encodeURIComponent(`Fuel Delivery Request - ${MOCK_LOCATION.name}`)
  const emailBody = encodeURIComponent(
    `Hi, I need to schedule a fuel delivery. Tank levels are currently low. Please contact me to arrange delivery at ${MOCK_LOCATION.address}.`
  )

  return (
    <div style={OVERLAY_STYLE} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={MODAL_STYLE}>
        {/* Close */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}
        >
          ×
        </button>

        {/* Title */}
        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 22, letterSpacing: '0.04em', color: '#f9fafb', marginBottom: 6 }}>
          SCHEDULE FUEL DELIVERY
        </h2>
        <p style={{ color: '#6b7280', fontWeight: 300, fontSize: 13, lineHeight: 1.6, marginBottom: 24 }}>
          Call or email your jobber to schedule delivery. We&apos;ll track your request.
        </p>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          <div>
            <label style={LABEL_STYLE}>Jobber Phone</label>
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              style={INPUT_STYLE}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(34,197,94,0.5)')}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; saveContact() }}
            />
          </div>
          <div>
            <label style={LABEL_STYLE}>Jobber Email</label>
            <input
              type="email"
              placeholder="jobber@supplier.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={INPUT_STYLE}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(34,197,94,0.5)')}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; saveContact() }}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <a
              href={phone ? `tel:${phone.replace(/\s/g, '')}` : undefined}
              style={{
                ...BTN_GREEN,
                flex: 1,
                textAlign: 'center',
                textDecoration: 'none',
                display: 'block',
                opacity: phone ? 1 : 0.4,
                pointerEvents: phone ? 'auto' : 'none',
              }}
            >
              Call Jobber
            </a>
            <a
              href={email ? `mailto:${email}?subject=${emailSubject}&body=${emailBody}` : undefined}
              style={{
                ...BTN_GREEN,
                flex: 1,
                textAlign: 'center',
                textDecoration: 'none',
                display: 'block',
                opacity: email ? 1 : 0.4,
                pointerEvents: email ? 'auto' : 'none',
              }}
            >
              Email Jobber
            </a>
          </div>
          <button style={{ ...BTN_GREEN, width: '100%', background: 'rgba(34,197,94,0.22)', borderColor: 'rgba(34,197,94,0.6)' }} onClick={handleScheduled}>
            Mark as Scheduled
          </button>
          <button style={{ ...BTN_GHOST, width: '100%' }} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

// ─── Price Modal ──────────────────────────────────────────────────────────────

const DEFAULT_PRICES = { regular: '3.49', plus: '3.79', super: '3.99', diesel: '3.89' }

function PriceModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [prices, setPrices] = useState(DEFAULT_PRICES)

  useEffect(() => {
    const saved = localStorage.getItem('fuel_prices')
    if (saved) setPrices(JSON.parse(saved))
  }, [])

  const handleSave = () => {
    localStorage.setItem('fuel_prices', JSON.stringify(prices))
    onSaved()
    onClose()
  }

  const priceFields: { key: keyof typeof DEFAULT_PRICES; label: string }[] = [
    { key: 'regular', label: 'Regular' },
    { key: 'plus', label: 'Plus' },
    { key: 'super', label: 'Super' },
    { key: 'diesel', label: 'Diesel' },
  ]

  return (
    <div style={OVERLAY_STYLE} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={MODAL_STYLE}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}
        >
          ×
        </button>

        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 22, letterSpacing: '0.04em', color: '#f9fafb', marginBottom: 6 }}>
          UPDATE FUEL PRICE
        </h2>
        <p style={{ color: '#6b7280', fontWeight: 300, fontSize: 13, lineHeight: 1.6, marginBottom: 24 }}>
          Current prices per gallon
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          {priceFields.map(({ key, label }) => (
            <div key={key}>
              <label style={LABEL_STYLE}>{label}</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontFamily: "'Barlow', sans-serif", fontSize: 14 }}>$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={prices[key]}
                  onChange={e => setPrices(prev => ({ ...prev, [key]: e.target.value }))}
                  style={{ ...INPUT_STYLE, paddingLeft: 26 }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(34,197,94,0.5)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div style={{
          background: 'rgba(251,191,36,0.07)',
          border: '1px solid rgba(251,191,36,0.2)',
          borderRadius: 10,
          padding: '12px 14px',
          marginBottom: 20,
        }}>
          <p style={{ color: '#fbbf24', fontFamily: "'Barlow', sans-serif", fontWeight: 300, fontSize: 12, lineHeight: 1.6, margin: 0 }}>
            After updating prices here, remember to update them at the pump via your Gilbarco or Verifone system.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button style={{ ...BTN_GREEN, width: '100%', background: 'rgba(34,197,94,0.22)', borderColor: 'rgba(34,197,94,0.6)' }} onClick={handleSave}>
            Save Prices
          </button>
          <button style={{ ...BTN_GHOST, width: '100%' }} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

// ─── Generic Action Modal ─────────────────────────────────────────────────────

function GenericActionModal({ insight, onClose, onComplete }: { insight: MockInsight; onClose: () => void; onComplete: () => void }) {
  const [notes, setNotes] = useState('')

  const handleComplete = () => {
    onComplete()
    onClose()
  }

  return (
    <div style={OVERLAY_STYLE} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={MODAL_STYLE}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}
        >
          ×
        </button>

        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 22, letterSpacing: '0.04em', color: '#f9fafb', marginBottom: 6 }}>
          ACTION REQUIRED
        </h2>
        <p style={{ color: '#6b7280', fontWeight: 300, fontSize: 13, lineHeight: 1.6, marginBottom: 24 }}>
          {insight.title}
        </p>

        <div style={{ marginBottom: 20 }}>
          <label style={LABEL_STYLE}>Log what you did</label>
          <textarea
            placeholder="Describe the action you took..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={4}
            style={{ ...INPUT_STYLE, resize: 'vertical', lineHeight: 1.6 }}
            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(34,197,94,0.5)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button style={{ ...BTN_GREEN, width: '100%', background: 'rgba(34,197,94,0.22)', borderColor: 'rgba(34,197,94,0.6)' }} onClick={handleComplete}>
            Mark Complete
          </button>
          <button style={{ ...BTN_GHOST, width: '100%' }} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

// ─── Insight Card ─────────────────────────────────────────────────────────────

function InsightCard({
  insight,
  completedText,
  onAction,
}: {
  insight: MockInsight
  completedText: string | null
  onAction: (insight: MockInsight) => void
}) {
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

      {completedText ? (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: '#22c55e',
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 500,
            fontSize: 13,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6.5" stroke="#22c55e" strokeOpacity="0.4"/>
            <path d="M4 7L6.2 9.2L10 5" stroke="#22c55e" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {completedText}
        </span>
      ) : (
        <button
          onClick={() => onAction(insight)}
          className="inline-block text-xs px-4 py-1.5 rounded-lg transition-all duration-150"
          style={{
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.25)',
            color: '#22c55e',
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 500,
            cursor: 'pointer',
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
        </button>
      )}
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

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

// ─── Page ─────────────────────────────────────────────────────────────────────

type ModalType = 'delivery' | 'price' | 'generic' | null

export default function DashboardPage() {
  const [activeModal, setActiveModal] = useState<{ type: ModalType; insight: MockInsight | null }>({ type: null, insight: null })
  const [completedCards, setCompletedCards] = useState<Record<string, string>>({})

  const openModal = (insight: MockInsight) => {
    const label = insight.action_label.toLowerCase().trim()
    if (label === 'order delivery') {
      setActiveModal({ type: 'delivery', insight })
    } else if (label === 'update price') {
      setActiveModal({ type: 'price', insight })
    } else {
      setActiveModal({ type: 'generic', insight })
    }
  }

  const closeModal = () => setActiveModal({ type: null, insight: null })

  const markComplete = (id: string, text: string) => {
    setCompletedCards(prev => ({ ...prev, [id]: text }))
  }

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
                MOCK_INSIGHTS.map(insight => (
                  <InsightCard
                    key={insight.id}
                    insight={insight}
                    completedText={completedCards[insight.id] ?? null}
                    onAction={openModal}
                  />
                ))
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

      {/* Modals */}
      {activeModal.type === 'delivery' && (
        <DeliveryModal
          onClose={closeModal}
          onScheduled={() => markComplete(activeModal.insight!.id, 'Delivery Scheduled ✓')}
        />
      )}
      {activeModal.type === 'price' && (
        <PriceModal
          onClose={closeModal}
          onSaved={() => markComplete(activeModal.insight!.id, 'Price Updated ✓')}
        />
      )}
      {activeModal.type === 'generic' && activeModal.insight && (
        <GenericActionModal
          insight={activeModal.insight}
          onClose={closeModal}
          onComplete={() => markComplete(activeModal.insight!.id, 'Marked Complete ✓')}
        />
      )}
    </div>
  )
}
