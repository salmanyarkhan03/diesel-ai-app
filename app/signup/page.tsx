'use client'

import { useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { supabase } from '@/lib/supabase'

// ─── Password rules ───────────────────────────────────────────────────────────
const RULES = [
  { id: 'length',    label: 'At least 8 characters',      test: (p: string) => p.length >= 8 },
  { id: 'upper',     label: 'One uppercase letter',        test: (p: string) => /[A-Z]/.test(p) },
  { id: 'lower',     label: 'One lowercase letter',        test: (p: string) => /[a-z]/.test(p) },
  { id: 'number',    label: 'One number',                  test: (p: string) => /[0-9]/.test(p) },
  { id: 'special',   label: 'One special character',       test: (p: string) => /[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>/?`~]/.test(p) },
]

// ─── Fuel gauge SVG ───────────────────────────────────────────────────────────
function FuelGauge({ strength }: { strength: number }) {
  const cx = 100
  const cy = 92
  const r = 68
  const totalArcLength = Math.PI * r          // half-circle circumference ≈ 213.6
  const dashOffset = totalArcLength * (1 - strength / 5)
  const needleRotation = -90 + (strength / 5) * 180

  const gaugeColor =
    strength === 0 ? 'rgba(255,255,255,0.08)'
    : strength < 3  ? '#ef4444'
    : strength < 5  ? '#fbbf24'
    : '#22c55e'

  const glowColor =
    strength === 0 ? 'transparent'
    : strength < 3  ? 'rgba(239,68,68,0.35)'
    : strength < 5  ? 'rgba(251,191,36,0.35)'
    : 'rgba(34,197,94,0.35)'

  // Tick positions: E, 1/4, 1/2, 3/4, F
  const ticks = [0, 1, 2, 3, 4, 5].map(i => {
    const angleDeg = 180 - (i / 5) * 180
    const angleRad = (angleDeg * Math.PI) / 180
    const inner = r - 7
    const outer = r + 7
    return {
      x1: cx + inner * Math.cos(angleRad),
      y1: cy + inner * Math.sin(angleRad),
      x2: cx + outer * Math.cos(angleRad),
      y2: cy + outer * Math.sin(angleRad),
    }
  })

  return (
    <svg
      width="200"
      height="116"
      viewBox="0 0 200 116"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <filter id="gaugeGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Track arc */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* Filled arc — animated via strokeDashoffset */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke={gaugeColor}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={totalArcLength}
        strokeDashoffset={dashOffset}
        filter={strength > 0 ? 'url(#gaugeGlow)' : undefined}
        style={{
          transition: 'stroke-dashoffset 0.45s cubic-bezier(0.4,0,0.2,1), stroke 0.3s ease',
        }}
      />

      {/* Outer glow ring */}
      {strength > 0 && (
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={glowColor}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={totalArcLength}
          strokeDashoffset={dashOffset}
          style={{
            transition: 'stroke-dashoffset 0.45s cubic-bezier(0.4,0,0.2,1), stroke 0.3s ease',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Tick marks */}
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1} y1={t.y1}
          x2={t.x2} y2={t.y2}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}

      {/* Needle */}
      <g
        style={{
          transformOrigin: `${cx}px ${cy}px`,
          transform: `rotate(${needleRotation}deg)`,
          transition: 'transform 0.45s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Needle shadow */}
        <line
          x1={cx} y1={cy + 10}
          x2={cx} y2={cy - 54}
          stroke="rgba(0,0,0,0.4)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Needle body */}
        <line
          x1={cx} y1={cy + 8}
          x2={cx} y2={cy - 54}
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Needle tip accent */}
        <line
          x1={cx} y1={cy - 40}
          x2={cx} y2={cy - 54}
          stroke={strength > 0 ? gaugeColor : '#ffffff'}
          strokeWidth="2"
          strokeLinecap="round"
          style={{ transition: 'stroke 0.3s ease' }}
        />
      </g>

      {/* Center hub */}
      <circle cx={cx} cy={cy} r="7" fill="#0d0f14" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r="3.5" fill="rgba(255,255,255,0.7)" />

      {/* E label */}
      <text
        x={cx - r - 6}
        y={cy + 16}
        fontFamily="'Barlow Condensed', sans-serif"
        fontWeight="900"
        fontSize="12"
        fill="rgba(255,255,255,0.35)"
        textAnchor="middle"
      >
        E
      </text>

      {/* F label */}
      <text
        x={cx + r + 6}
        y={cy + 16}
        fontFamily="'Barlow Condensed', sans-serif"
        fontWeight="900"
        fontSize="12"
        fill="rgba(255,255,255,0.35)"
        textAnchor="middle"
      >
        F
      </text>

      {/* Fuel pump icon */}
      <g transform={`translate(${cx - 7}, 2)`}>
        <rect x="1" y="0" width="9" height="13" rx="1.5" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2"/>
        <path d="M10 3 Q14 3 14 6 L14 12" stroke="rgba(255,255,255,0.25)" strokeWidth="1.1" strokeLinecap="round" fill="none"/>
        <rect x="11" y="11" width="4" height="2.5" rx="1" fill="rgba(255,255,255,0.25)"/>
        <rect x="3" y="4" width="5" height="3.5" rx="1" fill="rgba(255,255,255,0.12)"/>
      </g>
    </svg>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  const ruleResults = RULES.map(r => ({ ...r, met: r.test(password) }))
  const strength = ruleResults.filter(r => r.met).length
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword
  const allRulesMet = strength === 5

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!allRulesMet || !passwordsMatch) return
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setConfirmed(true)
    setLoading(false)
  }

  async function handleResend() {
    setResending(true)
    await supabase.auth.resend({ type: 'signup', email })
    setResending(false)
    setResent(true)
    setTimeout(() => setResent(false), 4000)
  }

  // ── Confirmation screen ──────────────────────────────────────────────────
  if (confirmed) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ backgroundColor: '#080910' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(34,197,94,0.07) 0%, transparent 70%)' }}
        />
        <div className="relative w-full max-w-sm">
          <div className="flex justify-center mb-10">
            <Logo size="lg" />
          </div>
          <div
            className="rounded-2xl p-8 text-center"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Envelope icon */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="5" width="20" height="14" rx="2.5" stroke="#22c55e" strokeWidth="1.5" fill="none"/>
                <path d="M2 8l10 7 10-7" stroke="#22c55e" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </div>

            <h1
              className="text-2xl mb-2"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, letterSpacing: '0.05em' }}
            >
              CHECK YOUR EMAIL
            </h1>
            <p className="text-sm mb-1" style={{ color: '#9ca3af', fontWeight: 300, lineHeight: 1.6 }}>
              We sent a confirmation link to
            </p>
            <p className="text-sm mb-6 font-medium" style={{ color: '#22c55e', wordBreak: 'break-all' }}>
              {email}
            </p>
            <p className="text-xs mb-8" style={{ color: '#6b7280', fontWeight: 300, lineHeight: 1.6 }}>
              Click the link in the email to activate your account. Check your spam folder if you don&apos;t see it.
            </p>

            <button
              onClick={handleResend}
              disabled={resending || resent}
              className="w-full py-2.5 rounded-lg text-sm transition-all duration-150"
              style={{
                background: resent ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${resent ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'}`,
                color: resent ? '#22c55e' : '#9ca3af',
                fontFamily: "'Barlow', sans-serif",
                fontWeight: resent ? 500 : 300,
              }}
            >
              {resent ? 'Email resent ✓' : resending ? 'Resending...' : 'Resend confirmation email'}
            </button>

            <p className="text-center text-xs mt-5" style={{ color: '#6b7280', fontWeight: 300 }}>
              Wrong email?{' '}
              <button
                onClick={() => setConfirmed(false)}
                style={{ color: '#22c55e', fontWeight: 400, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Go back
              </button>
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ── Sign up form ─────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ backgroundColor: '#080910' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(34,197,94,0.07) 0%, transparent 70%)' }}
      />

      <div className="relative w-full max-w-sm">
        <div className="flex justify-center mb-10">
          <Logo size="lg" />
        </div>

        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <h1
            className="text-2xl mb-1"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, letterSpacing: '0.05em' }}
          >
            CREATE ACCOUNT
          </h1>
          <p className="text-sm mb-7" style={{ color: '#6b7280', fontWeight: 300 }}>
            Start your fuel intelligence journey
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name */}
            <div>
              <label className="block text-xs mb-1.5" style={{ color: '#9ca3af', letterSpacing: '0.08em' }}>
                FULL NAME
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Alex Rodriguez"
                className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#ffffff',
                  fontFamily: "'Barlow', sans-serif",
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(34,197,94,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs mb-1.5" style={{ color: '#9ca3af', letterSpacing: '0.08em' }}>
                EMAIL
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#ffffff',
                  fontFamily: "'Barlow', sans-serif",
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(34,197,94,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs mb-1.5" style={{ color: '#9ca3af', letterSpacing: '0.08em' }}>
                PASSWORD
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${password.length === 0 ? 'rgba(255,255,255,0.08)' : allRulesMet ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  color: '#ffffff',
                  fontFamily: "'Barlow', sans-serif",
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(34,197,94,0.5)')}
                onBlur={e => (e.target.style.borderColor = password.length === 0 ? 'rgba(255,255,255,0.08)' : allRulesMet ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.08)')}
              />

              {/* Fuel gauge */}
              {password.length > 0 && (
                <div className="mt-4">
                  <p
                    className="text-xs mb-2 text-center"
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 900,
                      letterSpacing: '0.1em',
                      color: strength === 0 ? '#4b5563'
                        : strength < 3 ? '#f87171'
                        : strength < 5 ? '#fbbf24'
                        : '#22c55e',
                    }}
                  >
                    PASSWORD STRENGTH
                  </p>
                  <div className="flex justify-center">
                    <FuelGauge strength={strength} />
                  </div>

                  {/* Rules checklist */}
                  <div className="flex flex-col gap-2 mt-3">
                    {ruleResults.map(rule => (
                      <div key={rule.id} className="flex items-center gap-3">
                        <span
                          className="flex-shrink-0 rounded-full inline-flex items-center justify-center"
                          style={{
                            width: '16px',
                            height: '16px',
                            minWidth: '16px',
                            background: rule.met ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${rule.met ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.1)'}`,
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {rule.met && (
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                              <path d="M1.5 4L3 5.5L6.5 2" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </span>
                        <span
                          className="text-xs"
                          style={{
                            color: rule.met ? '#22c55e' : '#6b7280',
                            fontWeight: rule.met ? 400 : 300,
                            transition: 'color 0.2s ease',
                            lineHeight: '1.4',
                          }}
                        >
                          {rule.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-xs mb-1.5" style={{ color: '#9ca3af', letterSpacing: '0.08em' }}>
                CONFIRM PASSWORD
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${
                      confirmPassword.length === 0 ? 'rgba(255,255,255,0.08)'
                      : passwordsMatch ? 'rgba(34,197,94,0.4)'
                      : 'rgba(239,68,68,0.4)'
                    }`,
                    color: '#ffffff',
                    fontFamily: "'Barlow', sans-serif",
                    paddingRight: confirmPassword.length > 0 ? '40px' : '16px',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(34,197,94,0.5)')}
                  onBlur={e => {
                    e.target.style.borderColor = confirmPassword.length === 0
                      ? 'rgba(255,255,255,0.08)'
                      : passwordsMatch ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'
                  }}
                />
                {/* Match indicator icon */}
                {confirmPassword.length > 0 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    {passwordsMatch ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="7" fill="rgba(34,197,94,0.15)" stroke="rgba(34,197,94,0.4)" strokeWidth="1"/>
                        <path d="M4.5 8L6.5 10L11 5.5" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="7" fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.3)" strokeWidth="1"/>
                        <path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    )}
                  </span>
                )}
              </div>
              {passwordsMismatch && (
                <p className="text-xs mt-1.5" style={{ color: '#f87171', fontWeight: 300 }}>
                  Passwords do not match
                </p>
              )}
              {passwordsMatch && (
                <p className="text-xs mt-1.5" style={{ color: '#22c55e', fontWeight: 300 }}>
                  Passwords match
                </p>
              )}
            </div>

            {error && (
              <div
                className="rounded-lg px-4 py-3 text-xs"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !allRulesMet || !passwordsMatch}
              className="w-full py-3 rounded-lg text-sm font-medium transition-all duration-200 mt-2"
              style={{
                background: loading ? 'rgba(34,197,94,0.3)'
                  : !allRulesMet || !passwordsMatch ? 'rgba(34,197,94,0.15)'
                  : '#22c55e',
                color: loading || !allRulesMet || !passwordsMatch
                  ? 'rgba(255,255,255,0.3)'
                  : '#000000',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 900,
                letterSpacing: '0.1em',
                fontSize: '15px',
                cursor: !allRulesMet || !passwordsMatch ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: '#6b7280', fontWeight: 300 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#22c55e', fontWeight: 400 }}>
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#374151' }}>
          © {new Date().getFullYear()} Diesel AI. All rights reserved.
        </p>
      </div>
    </div>
  )
}
