import Link from 'next/link';
import { RecentSearchesList } from '@/components/RecentSearchesList';
import { QuickSearchBar } from '@/components/QuickSearchBar';

export default function DashboardPage() {
  return (
    <div className="px-4 py-6 max-w-2xl mx-auto md:px-8 md:py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
            style={{ background: 'var(--primary)' }}
          >
            eFTI
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
              eFTI Portal
            </h1>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              Elektronisk fraktinformation
            </p>
          </div>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
          Välkommen till eFTI-portalen för behöriga myndigheter. Sök efter
          fraktinformation via QR-kod, UIL-referens eller transportidentifierare.
        </p>
      </div>

      <QuickSearchBar />

      {/* Quick actions */}
      <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--muted)' }}>
        Snabbåtgärder
      </h2>
      <div className="grid gap-3 mb-8">
        <Link
          href="/scan"
          className="card flex items-center gap-4 no-underline hover:border-[color:var(--primary)] transition-colors"
          style={{ textDecoration: 'none' }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'color-mix(in srgb, var(--primary) 12%, transparent)', color: 'var(--primary)' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <path d="M14 14h1v1h-1zM19 14h1v1h-1zM14 19h1v1h-1zM19 19h1v1h-1zM16.5 14v5M14 16.5h5"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
              Skanna QR-kod
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              Skanna QR-kod med UIL-data för direktsökning
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--muted)', flexShrink: 0 }}>
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </Link>

        <Link
          href="/search/uil"
          className="card flex items-center gap-4 no-underline hover:border-[color:var(--primary)] transition-colors"
          style={{ textDecoration: 'none' }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'color-mix(in srgb, var(--primary) 12%, transparent)', color: 'var(--primary)' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="9" y1="13" x2="15" y2="13"/>
              <line x1="9" y1="17" x2="12" y2="17"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
              Sök med UIL
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              Sök med dataset-ID, gate-ID och plattforms-ID
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--muted)', flexShrink: 0 }}>
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </Link>

        <Link
          href="/search/identifiers"
          className="card flex items-center gap-4 no-underline hover:border-[color:var(--primary)] transition-colors"
          style={{ textDecoration: 'none' }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'color-mix(in srgb, var(--primary) 12%, transparent)', color: 'var(--primary)' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
              Sök med identifierare
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              Sök med transportutrustnings-ID, land, transportslag
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--muted)', flexShrink: 0 }}>
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </Link>
      </div>

      {/* Recent searches */}
      <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--muted)' }}>
        Senaste sökningar
      </h2>
      <RecentSearchesList />
    </div>
  );
}
