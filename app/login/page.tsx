'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'password' | 'magic'>('password')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (mode === 'password') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      } else {
        router.push('/dashboard')
      }
    } else {
      const { error } = await supabase.auth.signInWithOtp({ email })
      if (error) {
        setError(error.message)
      } else {
        setSent(true)
      }
    }

    setLoading(false)
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: '#080910' }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(34,197,94,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="w-full flex justify-center items-center mb-10">
          <Logo size="lg" />
        </div>

        {/* Card */}
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
            SIGN IN
          </h1>
          <p className="text-sm mb-8" style={{ color: '#6b7280', fontWeight: 300 }}>
            Access your fuel intelligence dashboard
          </p>

          {/* Mode toggle */}
          <div
            className="flex rounded-lg p-1 mb-6"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            {(['password', 'magic'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setSent(false); setError(null) }}
                className="flex-1 py-2 rounded-md text-sm transition-all duration-200"
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: mode === m ? 500 : 300,
                  background: mode === m ? 'rgba(34,197,94,0.15)' : 'transparent',
                  color: mode === m ? '#22c55e' : '#6b7280',
                  border: mode === m ? '1px solid rgba(34,197,94,0.3)' : '1px solid transparent',
                }}
              >
                {m === 'password' ? 'Password' : 'Magic Link'}
              </button>
            ))}
          </div>

          {sent ? (
            <div
              className="rounded-xl p-5 text-center"
              style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}
            >
              <div className="text-2xl mb-2">✉️</div>
              <p className="text-sm" style={{ color: '#22c55e', fontWeight: 400 }}>
                Magic link sent to <strong>{email}</strong>
              </p>
              <p className="text-xs mt-1" style={{ color: '#6b7280' }}>
                Check your inbox and click the link to sign in.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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

              {mode === 'password' && (
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: '#9ca3af', letterSpacing: '0.08em' }}>
                    PASSWORD
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
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
                  <div className="flex justify-end mt-1.5">
                    <button type="button" className="text-xs" style={{ color: '#22c55e', fontWeight: 300 }}>
                      Forgot password?
                    </button>
                  </div>
                </div>
              )}

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
                disabled={loading}
                className="w-full py-3 rounded-lg text-sm font-medium transition-all duration-200 mt-2"
                style={{
                  background: loading ? 'rgba(34,197,94,0.3)' : '#22c55e',
                  color: loading ? 'rgba(255,255,255,0.5)' : '#000000',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 900,
                  letterSpacing: '0.1em',
                  fontSize: '15px',
                }}
              >
                {loading ? 'SIGNING IN...' : mode === 'magic' ? 'SEND MAGIC LINK' : 'SIGN IN'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs mt-4" style={{ color: '#6b7280', fontWeight: 300 }}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" style={{ color: '#22c55e', fontWeight: 400 }}>
            Sign up
          </Link>
        </p>

        <p className="text-center text-xs mt-4" style={{ color: '#374151' }}>
          © {new Date().getFullYear()} Diesel AI. All rights reserved.
        </p>
      </div>
    </div>
  )
}
