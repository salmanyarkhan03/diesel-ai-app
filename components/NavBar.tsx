'use client'

import Logo from './Logo'
import { useLocation } from '@/lib/location-context'
import { useUser } from '@/lib/useUser'

export default function NavBar() {
  const { activeLocation } = useLocation()
  const { initial, displayName } = useUser()

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14"
      style={{
        background: 'rgba(8,9,16,0.85)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <Logo size="md" />

      <div className="flex items-center gap-3">
        {/* Location badge */}
        <div
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
          <span className="text-xs" style={{ color: '#9ca3af', fontFamily: "'Barlow', sans-serif", fontWeight: 300 }}>
            {activeLocation}
          </span>
        </div>

        {/* Avatar */}
        <div
          title={displayName}
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, rgba(34,197,94,0.3) 0%, rgba(34,197,94,0.1) 100%)',
            border: '1px solid rgba(34,197,94,0.4)',
            color: '#22c55e',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900,
          }}
        >
          {initial}
        </div>
      </div>
    </header>
  )
}
