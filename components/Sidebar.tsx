'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9"/>
        <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5"/>
        <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5"/>
        <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.3"/>
      </svg>
    ),
  },
  {
    href: '/upload',
    label: 'Upload Report',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 10V3M8 3L5 6M8 3L11 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 11 L2 13 Q2 14 3 14 L13 14 Q14 14 14 13 L14 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: '/locations',
    label: 'Locations',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.4" fill="none"/>
        <path d="M8 9 C5 9 2 11 2 13 L14 13 C14 11 11 9 8 9Z" fill="currentColor" opacity="0.4"/>
      </svg>
    ),
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3" fill="none"/>
        <path d="M8 1.5 L8 3M8 13 L8 14.5M1.5 8 L3 8M13 8 L14.5 8M3.1 3.1 L4.1 4.1M11.9 11.9 L12.9 12.9M3.1 12.9 L4.1 11.9M11.9 4.1 L12.9 3.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside
      className="fixed left-0 top-14 bottom-0 w-14 sm:w-52 flex flex-col py-4 z-40"
      style={{
        background: 'rgba(8,9,16,0.7)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <nav className="flex flex-col gap-1 px-2">
        {NAV_ITEMS.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150"
              style={{
                background: active ? 'rgba(34,197,94,0.1)' : 'transparent',
                border: active ? '1px solid rgba(34,197,94,0.2)' : '1px solid transparent',
                color: active ? '#22c55e' : '#9ca3af',
              }}
            >
              <span className="shrink-0">{item.icon}</span>
              <span
                className="hidden sm:block text-sm"
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: active ? 500 : 400,
                }}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Sign out at bottom */}
      <div className="mt-auto px-2">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150"
          style={{ color: '#6b7280' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
          onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            <path d="M10 5l3 3-3 3M13 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="hidden sm:block text-sm" style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 400 }}>
            Sign out
          </span>
        </button>
      </div>
    </aside>
  )
}
