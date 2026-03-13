'use client'

import { useState, useEffect } from 'react'
import NavBar from '@/components/NavBar'
import Sidebar from '@/components/Sidebar'
import { supabase } from '@/lib/supabase'

export default function SettingsPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [smsNotifs, setSmsNotifs] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setName(user.user_metadata?.full_name || '')
        setEmail(user.email || '')
        setPhone(user.user_metadata?.phone || '')
      }
    })
  }, [])

  async function handleSave() {
    setSaving(true)
    setSaveError(null)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      // Update auth metadata
      await supabase.auth.updateUser({ data: { full_name: name, phone } })
      // Update owners table
      const { error } = await supabase
        .from('owners')
        .update({ name, phone })
        .eq('id', user.id)
      if (error) {
        setSaveError(error.message)
      } else {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      }
    }
    setSaving(false)
  }

  return (
    <div style={{ backgroundColor: '#080910', minHeight: '100vh' }}>
      <NavBar />
      <Sidebar />

      <main className="pt-14 pl-14 sm:pl-52">
        <div className="px-6 py-8 max-w-2xl">
          <div className="mb-8">
            <h1
              className="text-3xl sm:text-4xl mb-1"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, letterSpacing: '0.05em' }}
            >
              SETTINGS
            </h1>
            <p style={{ color: '#6b7280', fontWeight: 300, fontSize: '14px' }}>
              Manage your account and preferences
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {/* Account Info */}
            <section
              className="rounded-xl p-6"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <h2
                className="text-base mb-5"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, letterSpacing: '0.06em', color: '#f9fafb' }}
              >
                ACCOUNT INFO
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: '#9ca3af', letterSpacing: '0.08em' }}>
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full rounded-lg px-4 py-3 text-sm outline-none"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#ffffff',
                      fontFamily: "'Barlow', sans-serif",
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: '#9ca3af', letterSpacing: '0.08em' }}>
                    EMAIL
                  </label>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="w-full rounded-lg px-4 py-3 text-sm outline-none"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      color: '#4b5563',
                      fontFamily: "'Barlow', sans-serif",
                      cursor: 'not-allowed',
                    }}
                  />
                  <p className="text-xs mt-1" style={{ color: '#374151', fontWeight: 300 }}>
                    Email cannot be changed after account creation.
                  </p>
                </div>
              </div>
            </section>

            {/* Notifications */}
            <section
              className="rounded-xl p-6"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <h2
                className="text-base mb-5"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, letterSpacing: '0.06em', color: '#f9fafb' }}
              >
                NOTIFICATIONS
              </h2>
              <div className="space-y-4">
                {/* Email toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: '#d1d5db', fontWeight: 400 }}>Email alerts</p>
                    <p className="text-xs mt-0.5" style={{ color: '#6b7280', fontWeight: 300 }}>
                      Receive daily reports and high-priority alerts
                    </p>
                  </div>
                  <button
                    onClick={() => setEmailNotifs(!emailNotifs)}
                    className="relative w-11 h-6 rounded-full transition-all duration-200 shrink-0"
                    style={{ background: emailNotifs ? '#22c55e' : 'rgba(255,255,255,0.1)' }}
                  >
                    <span
                      className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-200"
                      style={{
                        background: '#ffffff',
                        left: emailNotifs ? '22px' : '2px',
                      }}
                    />
                  </button>
                </div>

                {/* SMS toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: '#d1d5db', fontWeight: 400 }}>SMS alerts</p>
                    <p className="text-xs mt-0.5" style={{ color: '#6b7280', fontWeight: 300 }}>
                      Text messages for HIGH priority alerts only
                    </p>
                  </div>
                  <button
                    onClick={() => setSmsNotifs(!smsNotifs)}
                    className="relative w-11 h-6 rounded-full transition-all duration-200 shrink-0"
                    style={{ background: smsNotifs ? '#22c55e' : 'rgba(255,255,255,0.1)' }}
                  >
                    <span
                      className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-200"
                      style={{
                        background: '#ffffff',
                        left: smsNotifs ? '22px' : '2px',
                      }}
                    />
                  </button>
                </div>

                {smsNotifs && (
                  <div>
                    <label className="block text-xs mb-1.5" style={{ color: '#9ca3af', letterSpacing: '0.08em' }}>
                      PHONE NUMBER
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full rounded-lg px-4 py-3 text-sm outline-none"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: '#ffffff',
                        fontFamily: "'Barlow', sans-serif",
                      }}
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Plan */}
            <section
              className="rounded-xl p-6"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <h2
                className="text-base mb-5"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, letterSpacing: '0.06em', color: '#f9fafb' }}
              >
                PLAN
              </h2>
              <div
                className="rounded-lg p-4 flex items-center justify-between"
                style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}
              >
                <div>
                  <p
                    className="text-sm"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, color: '#22c55e', letterSpacing: '0.06em' }}
                  >
                    PRO PLAN
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#6b7280', fontWeight: 300 }}>
                    $99 / month · Up to 5 locations
                  </p>
                </div>
                <button
                  className="text-xs px-4 py-2 rounded-lg"
                  style={{
                    background: 'rgba(34,197,94,0.1)',
                    border: '1px solid rgba(34,197,94,0.3)',
                    color: '#22c55e',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                  }}
                >
                  UPGRADE
                </button>
              </div>
            </section>

            {/* Save button */}
            <div className="flex flex-col items-end gap-2">
              {saveError && (
                <p className="text-xs" style={{ color: '#f87171' }}>{saveError}</p>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 rounded-lg text-sm transition-all duration-150"
                style={{
                  background: saved ? 'rgba(34,197,94,0.2)' : saving ? 'rgba(34,197,94,0.4)' : '#22c55e',
                  color: saved ? '#22c55e' : saving ? 'rgba(0,0,0,0.5)' : '#000000',
                  border: saved ? '1px solid rgba(34,197,94,0.4)' : 'none',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 900,
                  letterSpacing: '0.1em',
                }}
              >
                {saved ? 'SAVED ✓' : saving ? 'SAVING...' : 'SAVE CHANGES'}
              </button>
            </div>

            {/* Danger zone */}
            <section
              className="rounded-xl p-6"
              style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)' }}
            >
              <h2
                className="text-base mb-2"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, letterSpacing: '0.06em', color: '#f87171' }}
              >
                DANGER ZONE
              </h2>
              <p className="text-sm mb-4" style={{ color: '#6b7280', fontWeight: 300 }}>
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <button
                className="text-xs px-4 py-2 rounded-lg transition-all duration-150"
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  color: '#f87171',
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: 500,
                }}
              >
                Delete Account
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
