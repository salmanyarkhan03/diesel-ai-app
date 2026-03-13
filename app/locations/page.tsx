'use client'

import { useState } from 'react'
import NavBar from '@/components/NavBar'
import Sidebar from '@/components/Sidebar'
import { useLocation } from '@/lib/location-context'
import { Location } from '@/types'

type MockLocation = Omit<Location, 'owner_id'> & { last_report: string }

const INITIAL_LOCATIONS: MockLocation[] = [
  {
    id: '1',
    name: 'Main Street #1',
    address: '1420 Main St, Houston, TX 77002',
    status: 'active',
    created_at: '2024-01-15T00:00:00Z',
    last_report: '2 hours ago',
  },
  {
    id: '2',
    name: 'Airport Rd Station',
    address: '8840 Airport Blvd, Houston, TX 77061',
    status: 'active',
    created_at: '2024-02-20T00:00:00Z',
    last_report: '5 hours ago',
  },
  {
    id: '3',
    name: 'Katy Freeway Stop',
    address: '15900 Katy Fwy, Houston, TX 77094',
    status: 'inactive',
    created_at: '2024-03-10T00:00:00Z',
    last_report: '3 days ago',
  },
]

interface AddLocationModalProps {
  onClose: () => void
  onAdd: (name: string, address: string) => void
}

function AddLocationModal({ onClose, onAdd }: AddLocationModalProps) {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !address.trim()) return
    onAdd(name.trim(), address.trim())
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6"
        style={{ background: '#0d0f14', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-xl"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, letterSpacing: '0.05em' }}
          >
            ADD LOCATION
          </h2>
          <button onClick={onClose} style={{ color: '#6b7280' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2L16 16M16 2L2 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs mb-1.5" style={{ color: '#9ca3af', letterSpacing: '0.08em' }}>
              LOCATION NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Downtown Station #2"
              required
              className="w-full rounded-lg px-4 py-3 text-sm outline-none"
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
          <div>
            <label className="block text-xs mb-1.5" style={{ color: '#9ca3af', letterSpacing: '0.08em' }}>
              ADDRESS
            </label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="123 Main St, City, TX 77000"
              required
              className="w-full rounded-lg px-4 py-3 text-sm outline-none"
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

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-lg text-sm"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#6b7280',
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 300,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-lg text-sm"
              style={{
                background: '#22c55e',
                color: '#000000',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 900,
                letterSpacing: '0.08em',
              }}
            >
              ADD LOCATION
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<MockLocation[]>(INITIAL_LOCATIONS)
  const [showModal, setShowModal] = useState(false)
  const { activeLocation, setActiveLocation } = useLocation()

  function handleAdd(name: string, address: string) {
    const newLoc: MockLocation = {
      id: Date.now().toString(),
      name,
      address,
      status: 'active',
      created_at: new Date().toISOString(),
      last_report: 'Just added',
    }
    setLocations(prev => [newLoc, ...prev])
    setShowModal(false)
    // TODO: persist to Supabase
  }

  return (
    <div style={{ backgroundColor: '#080910', minHeight: '100vh' }}>
      <NavBar />
      <Sidebar />
      {showModal && <AddLocationModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}

      <main className="pt-14 pl-14 sm:pl-52">
        <div className="px-6 py-8 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1
                className="text-3xl sm:text-4xl mb-1"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, letterSpacing: '0.05em' }}
              >
                LOCATIONS
              </h1>
              <p style={{ color: '#6b7280', fontWeight: 300, fontSize: '14px' }}>
                {locations.length} locations · {locations.filter(l => l.status === 'active').length} active
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all duration-150"
              style={{
                background: '#22c55e',
                color: '#000000',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 900,
                letterSpacing: '0.08em',
                fontSize: '13px',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              ADD LOCATION
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {locations.map(loc => {
              const isActive = loc.name === activeLocation
              return (
                <div
                  key={loc.id}
                  onClick={() => setActiveLocation(loc.name)}
                  className="rounded-xl p-5 flex items-center justify-between gap-4 transition-all duration-200"
                  style={{
                    background: isActive ? 'rgba(34,197,94,0.05)' : 'rgba(255,255,255,0.025)',
                    border: `1px solid ${isActive ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) e.currentTarget.style.borderColor = 'rgba(34,197,94,0.2)'
                  }}
                  onMouseLeave={e => {
                    if (!isActive) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        background: loc.status === 'active' ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)',
                        border: loc.status === 'active' ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="6" r="3" stroke={loc.status === 'active' ? '#22c55e' : '#6b7280'} strokeWidth="1.4" fill="none"/>
                        <path d="M8 9 C5 9 2 11 2 13 L14 13 C14 11 11 9 8 9Z" fill={loc.status === 'active' ? '#22c55e' : '#6b7280'} opacity="0.4"/>
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3
                          className="text-base"
                          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, letterSpacing: '0.03em', color: '#f9fafb' }}
                        >
                          {loc.name}
                        </h3>
                        {isActive && (
                          <span
                            className="text-xs px-1.5 py-0.5 rounded"
                            style={{
                              background: 'rgba(34,197,94,0.15)',
                              color: '#22c55e',
                              fontFamily: "'Barlow Condensed', sans-serif",
                              fontWeight: 900,
                              letterSpacing: '0.06em',
                              fontSize: '10px',
                            }}
                          >
                            ACTIVE VIEW
                          </span>
                        )}
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: '#6b7280', fontWeight: 300 }}>
                        {loc.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="hidden sm:block text-right">
                      <p className="text-xs" style={{ color: '#4b5563', fontWeight: 300 }}>Last report</p>
                      <p className="text-xs mt-0.5" style={{ color: '#9ca3af', fontWeight: 400 }}>{loc.last_report}</p>
                    </div>
                    <span
                      className="text-xs px-2.5 py-1 rounded-full"
                      style={{
                        background: loc.status === 'active' ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)',
                        color: loc.status === 'active' ? '#22c55e' : '#6b7280',
                        border: `1px solid ${loc.status === 'active' ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.08)'}`,
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 900,
                        letterSpacing: '0.06em',
                        fontSize: '11px',
                      }}
                    >
                      {loc.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
