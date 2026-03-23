'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getRecentSearches, initializeMockSearchHistory } from '@/lib/mockApi';

type RecentSearch = {
  requestId: string;
  queryType: string;
  summary: string;
  submittedAt: string;
};

export function RecentSearchesList() {
  const [searches, setSearches] = useState<RecentSearch[]>([]);

  useEffect(() => {
    initializeMockSearchHistory();
    setSearches(getRecentSearches());
  }, []);

  if (searches.length === 0) {
    return (
      <div
        className="card text-center py-8"
        style={{ color: 'var(--muted)' }}
      >
        <svg className="mx-auto mb-2" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <p className="text-sm">Inga senaste sökningar</p>
      </div>
    );
  }

  return (
    <div className="card p-0 overflow-hidden">
      {searches.map((s, i) => (
        <Link
          key={s.requestId}
          href={`/requests/${s.requestId}`}
          className="flex items-center gap-3 px-4 py-3 no-underline transition-colors"
          style={{
            borderBottom: i < searches.length - 1 ? '1px solid var(--border-subtle)' : undefined,
            textDecoration: 'none',
          }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
            style={{ background: 'var(--surface-elevated)', color: 'var(--muted)' }}
          >
            {s.queryType === 'uil' ? 'UIL' : 'ID'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>
              {s.summary}
            </div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              {new Date(s.submittedAt).toLocaleString('sv-SE', {
                dateStyle: 'short',
                timeStyle: 'short',
              })}
            </div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--muted)', flexShrink: 0 }}>
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </Link>
      ))}
    </div>
  );
}
