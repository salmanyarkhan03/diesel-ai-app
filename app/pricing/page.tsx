import NavBar from '@/components/NavBar'
import Sidebar from '@/components/Sidebar'
import Link from 'next/link'

export default function PricingPage() {
  return (
    <div style={{ backgroundColor: '#080910', minHeight: '100vh' }}>
      <NavBar />
      <Sidebar />
      <main className="pt-14 pl-14 sm:pl-52">
        <div className="px-6 py-8 max-w-3xl">
          <div className="mb-8">
            <h1
              className="text-3xl sm:text-4xl mb-1"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, letterSpacing: '0.05em' }}
            >
              PRICE MANAGEMENT
            </h1>
            <p style={{ color: '#6b7280', fontWeight: 300, fontSize: '14px' }}>
              Set and adjust fuel prices across your locations
            </p>
          </div>

          <div
            className="rounded-2xl p-12 text-center"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2v16M6 6h6a2 2 0 010 4H8a2 2 0 000 4h7" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h3
              className="text-lg mb-2"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900 }}
            >
              COMING SOON
            </h3>
            <p style={{ color: '#6b7280', fontWeight: 300, fontSize: '14px', maxWidth: 320, margin: '0 auto' }}>
              Price management will be available in the next release. You&apos;ll be able to set prices, view competitor data, and push changes across all pumps.
            </p>
            <Link
              href="/dashboard"
              className="inline-block mt-6 text-xs px-5 py-2.5 rounded-lg"
              style={{
                background: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.25)',
                color: '#22c55e',
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 500,
              }}
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
