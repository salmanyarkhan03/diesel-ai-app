'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import Sidebar from '@/components/Sidebar'

type Stage = 'idle' | 'selected' | 'processing' | 'success'

const PROCESSING_STEPS = [
  'Reading your data...',
  'Analyzing fuel margins...',
  'Checking tank levels...',
  'Generating insights...',
]

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ─── Fuel Pump Icon ───────────────────────────────────────────────────────────

function FuelPumpIcon({ size = 48, color = '#22c55e' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Pump body */}
      <rect x="6" y="16" width="22" height="28" rx="3" stroke={color} strokeWidth="1.8" fill="none" opacity="0.9"/>
      {/* Display screen */}
      <rect x="10" y="20" width="14" height="8" rx="1.5" stroke={color} strokeWidth="1.4" fill="none" opacity="0.5"/>
      {/* Nozzle hook */}
      <path d="M28 20 L36 20 Q40 20 40 24 L40 30 Q40 34 36 34 L34 34" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      {/* Nozzle */}
      <path d="M28 32 L34 32 L34 36 L26 36" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Hose squiggle */}
      <path d="M28 24 Q26 27 28 30 Q30 33 28 36" stroke={color} strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.5"/>
      {/* Base */}
      <line x1="4" y1="44" x2="30" y2="44" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.6"/>
    </svg>
  )
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
      <circle cx="20" cy="20" r="16" stroke="rgba(34,197,94,0.15)" strokeWidth="3"/>
      <path d="M20 4 A16 16 0 0 1 36 20" stroke="#22c55e" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  )
}

// ─── Success Checkmark ────────────────────────────────────────────────────────

function SuccessCheck() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <circle
        cx="32" cy="32" r="28"
        stroke="#22c55e" strokeWidth="2"
        fill="rgba(34,197,94,0.08)"
        style={{ animation: 'scaleIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275)' }}
      />
      <path
        d="M20 32 L28 40 L44 24"
        stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        fill="none"
        style={{ animation: 'drawCheck 0.4s ease 0.2s both' }}
      />
    </svg>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UploadPage() {
  const [stage, setStage] = useState<Stage>('idle')
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [processingStep, setProcessingStep] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragCounter = useRef(0)

  const ACCEPTED = ['.csv', '.xlsx']

  const isValidFile = (f: File) =>
    f.name.endsWith('.csv') || f.name.endsWith('.xlsx') ||
    f.type === 'text/csv' || f.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

  const handleFile = useCallback((f: File) => {
    if (!isValidFile(f)) return
    setFile(f)
    setStage('selected')
  }, [])

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current++
    setDragging(true)
  }
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current--
    if (dragCounter.current === 0) setDragging(false)
  }
  const onDragOver = (e: React.DragEvent) => e.preventDefault()
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current = 0
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
  }

  const handleGenerate = () => {
    setStage('processing')
    setProcessingStep(0)

    let step = 0
    const interval = setInterval(() => {
      step++
      if (step < PROCESSING_STEPS.length) {
        setProcessingStep(step)
      } else {
        clearInterval(interval)
        setTimeout(() => setStage('success'), 400)
      }
    }, 700)
  }

  const handleReset = () => {
    setStage('idle')
    setFile(null)
    setProcessingStep(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div style={{ backgroundColor: '#080910', minHeight: '100vh' }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scaleIn { from { transform: scale(0.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes drawCheck { from { stroke-dashoffset: 40; } to { stroke-dashoffset: 0; } }
        @keyframes fadeUp { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .draw-check { stroke-dasharray: 40; }
        .fade-up { animation: fadeUp 0.4s ease both; }
      `}</style>

      <NavBar />
      <Sidebar />

      <main className="pt-14 pl-14 sm:pl-52">
        <div className="px-6 py-8 max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-3xl sm:text-4xl mb-1"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, letterSpacing: '0.05em', color: '#f9fafb' }}
            >
              UPLOAD REPORT
            </h1>
            <p style={{ color: '#6b7280', fontWeight: 300, fontSize: 14 }}>
              Upload your MercuryOne daily export to generate today&apos;s insights
            </p>
          </div>

          {/* Card */}
          <div
            className="rounded-2xl p-8"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}
          >

            {/* ── IDLE ── */}
            {stage === 'idle' && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx"
                  style={{ display: 'none' }}
                  onChange={onInputChange}
                />
                <div
                  onDragEnter={onDragEnter}
                  onDragLeave={onDragLeave}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-xl transition-all duration-200"
                  style={{
                    border: `2px dashed ${dragging ? 'rgba(34,197,94,0.7)' : 'rgba(255,255,255,0.12)'}`,
                    background: dragging ? 'rgba(34,197,94,0.05)' : 'transparent',
                    padding: '64px 32px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: dragging ? '0 0 32px rgba(34,197,94,0.08)' : 'none',
                  }}
                  onMouseEnter={e => {
                    if (stage !== 'idle') return
                    e.currentTarget.style.borderColor = 'rgba(34,197,94,0.5)'
                    e.currentTarget.style.background = 'rgba(34,197,94,0.03)'
                  }}
                  onMouseLeave={e => {
                    if (dragging) return
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <div
                    className="mb-5"
                    style={{
                      width: 80, height: 80, borderRadius: '50%',
                      background: 'rgba(34,197,94,0.08)',
                      border: '1px solid rgba(34,197,94,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <FuelPumpIcon size={40} color={dragging ? '#4ade80' : '#22c55e'} />
                  </div>
                  <p
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 900,
                      fontSize: 20,
                      letterSpacing: '0.04em',
                      color: '#f9fafb',
                      marginBottom: 8,
                      textAlign: 'center',
                    }}
                  >
                    Drop your MercuryOne export here
                  </p>
                  <p style={{ color: '#6b7280', fontWeight: 300, fontSize: 13, marginBottom: 16, textAlign: 'center' }}>
                    Supports .csv and .xlsx files
                  </p>
                  <span
                    style={{
                      color: '#22c55e',
                      fontFamily: "'Barlow', sans-serif",
                      fontWeight: 500,
                      fontSize: 13,
                      textDecoration: 'underline',
                      textUnderlineOffset: 3,
                      opacity: 0.8,
                    }}
                  >
                    or browse files
                  </span>
                </div>
              </>
            )}

            {/* ── SELECTED ── */}
            {stage === 'selected' && file && (
              <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* File info */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '16px 20px',
                    borderRadius: 12,
                    background: 'rgba(34,197,94,0.06)',
                    border: '1px solid rgba(34,197,94,0.2)',
                  }}
                >
                  {/* Checkmark */}
                  <div
                    style={{
                      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                      background: 'rgba(34,197,94,0.15)',
                      border: '1px solid rgba(34,197,94,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8L6.5 11.5L13 5" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: "'Barlow', sans-serif",
                        fontWeight: 500,
                        fontSize: 14,
                        color: '#f9fafb',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {file.name}
                    </p>
                    <p style={{ color: '#6b7280', fontWeight: 300, fontSize: 12, marginTop: 2 }}>
                      {formatBytes(file.size)}
                    </p>
                  </div>
                  {/* Remove */}
                  <button
                    onClick={handleReset}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#6b7280', fontSize: 20, lineHeight: 1, padding: '2px 6px',
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
                  >
                    ×
                  </button>
                </div>

                {/* Generate button */}
                <button
                  onClick={handleGenerate}
                  style={{
                    width: '100%',
                    padding: '14px 0',
                    borderRadius: 12,
                    background: 'rgba(34,197,94,0.2)',
                    border: '1px solid rgba(34,197,94,0.5)',
                    color: '#22c55e',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 900,
                    fontSize: 16,
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(34,197,94,0.3)'
                    e.currentTarget.style.borderColor = 'rgba(34,197,94,0.7)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(34,197,94,0.2)'
                    e.currentTarget.style.borderColor = 'rgba(34,197,94,0.5)'
                  }}
                >
                  GENERATE INSIGHTS
                </button>

                <p style={{ color: '#4b5563', fontWeight: 300, fontSize: 13, textAlign: 'center', marginTop: -8 }}>
                  Our AI will analyze your data and add insights to your dashboard
                </p>
              </div>
            )}

            {/* ── PROCESSING ── */}
            {stage === 'processing' && (
              <div
                className="fade-up"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, padding: '32px 0' }}
              >
                <Spinner />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 280 }}>
                  {PROCESSING_STEPS.map((step, i) => (
                    <div
                      key={step}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        opacity: i <= processingStep ? 1 : 0.25,
                        transition: 'opacity 0.4s ease',
                      }}
                    >
                      <div
                        style={{
                          width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                          background: i < processingStep ? '#22c55e' : i === processingStep ? '#22c55e' : '#374151',
                          boxShadow: i === processingStep ? '0 0 8px rgba(34,197,94,0.6)' : 'none',
                          transition: 'all 0.4s ease',
                        }}
                      />
                      <p
                        style={{
                          fontFamily: "'Barlow', sans-serif",
                          fontWeight: i === processingStep ? 500 : 300,
                          fontSize: 14,
                          color: i === processingStep ? '#f9fafb' : '#6b7280',
                          transition: 'all 0.4s ease',
                        }}
                      >
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── SUCCESS ── */}
            {stage === 'success' && (
              <div
                className="fade-up"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '32px 0' }}
              >
                <SuccessCheck />
                <div style={{ textAlign: 'center' }}>
                  <p
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 900,
                      fontSize: 24,
                      letterSpacing: '0.04em',
                      color: '#f9fafb',
                      marginBottom: 6,
                    }}
                  >
                    5 NEW INSIGHTS GENERATED
                  </p>
                  <p style={{ color: '#6b7280', fontWeight: 300, fontSize: 13 }}>
                    Your dashboard has been updated
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 320, marginTop: 8 }}>
                  <Link
                    href="/dashboard"
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '13px 0',
                      borderRadius: 12,
                      background: 'rgba(34,197,94,0.2)',
                      border: '1px solid rgba(34,197,94,0.5)',
                      color: '#22c55e',
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 900,
                      fontSize: 15,
                      letterSpacing: '0.08em',
                      textAlign: 'center',
                      textDecoration: 'none',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(34,197,94,0.3)'
                      e.currentTarget.style.borderColor = 'rgba(34,197,94,0.7)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(34,197,94,0.2)'
                      e.currentTarget.style.borderColor = 'rgba(34,197,94,0.5)'
                    }}
                  >
                    VIEW DASHBOARD →
                  </Link>
                  <button
                    onClick={handleReset}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#6b7280',
                      borderRadius: 12,
                      padding: '12px 0',
                      fontFamily: "'Barlow', sans-serif",
                      fontWeight: 400,
                      fontSize: 13,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                      e.currentTarget.style.color = '#9ca3af'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                      e.currentTarget.style.color = '#6b7280'
                    }}
                  >
                    Upload another file
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Accepted formats note — only on idle */}
          {stage === 'idle' && (
            <p style={{ color: '#374151', fontWeight: 300, fontSize: 12, textAlign: 'center', marginTop: 16 }}>
              Accepted formats: .csv · .xlsx &nbsp;·&nbsp; Max 50 MB
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
