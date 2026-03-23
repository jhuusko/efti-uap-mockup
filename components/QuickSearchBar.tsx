'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitIdentifierQuery } from '@/lib/mockApi';

export function QuickSearchBar() {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      const requestId = await submitIdentifierQuery({ identifier: trimmed });
      router.push(`/requests/${requestId}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Sök med behållar-ID, t.ex. MSCU7654321"
          className="form-input flex-1"
          disabled={loading}
          maxLength={17}
          autoComplete="off"
          autoCapitalize="characters"
        />
        <button
          type="submit"
          className="btn-primary flex items-center gap-2"
          disabled={loading || !value.trim()}
        >
          {loading ? (
            <span className="spinner" style={{ width: 16, height: 16 }} />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          )}
          Sök
        </button>
      </div>
    </form>
  );
}
