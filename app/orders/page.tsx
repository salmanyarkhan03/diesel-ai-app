import NavBar from '@/components/NavBar'
import Sidebar from '@/components/Sidebar'
import Link from 'next/link'

export default function OrdersPage() {
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
              ORDERS & DELIVERY
            </h1>
            <p style={{ color: '#6b7280', fontWeight: 300, fontSize: '14px' }}>
              Schedule fuel deliveries and track orders
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
                <rect x="1" y="6" width="14" height="10" rx="2" stroke="#22c55e" strokeWidth="1.4" fill="none"/>
                <path d="M15 9h2l2 4v3h-4V9z" stroke="#22c55e" strokeWidth="1.4" strokeLinejoin="round" fill="none"/>
                <circle cx="5" cy="17" r="1.5" stroke="#22c55e" strokeWidth="1.2" fill="none"/>
                <circle cx="14" cy="17" r="1.5" stroke="#22c55e" strokeWidth="1.2" fill="none"/>
                <path d="M5 6V3a1 1 0 011-1h4" stroke="#22c55e" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </div>
            <h3
              className="text-lg mb-2"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900 }}
            >
              COMING SOON
            </h3>
            <p style={{ color: '#6b7280', fontWeight: 300, fontSize: '14px', maxWidth: 320, margin: '0 auto' }}>
              Delivery scheduling and order tracking will be available in the next release. You&apos;ll be able to request deliveries, track ETAs, and view order history.
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
