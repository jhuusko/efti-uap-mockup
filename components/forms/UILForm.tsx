'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitUILQuery } from '@/lib/mockApi';
import { UILQuery } from '@/lib/types';

export function UILForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<UILQuery>({
    datasetId: '',
    gateId: '',
    platformId: '',
    subsetId: '',
  });
  const [errors, setErrors] = useState<Partial<UILQuery>>({});

  function validate(): boolean {
    const e: Partial<UILQuery> = {};
    if (!form.datasetId.trim()) e.datasetId = 'Obligatoriskt';
    if (!form.gateId.trim()) e.gateId = 'Obligatoriskt';
    if (!form.platformId.trim()) e.platformId = 'Obligatoriskt';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const requestId = await submitUILQuery({
        datasetId: form.datasetId.trim(),
        gateId: form.gateId.trim(),
        platformId: form.platformId.trim(),
        subsetId: form.subsetId?.trim() || undefined,
      });
      router.push(`/requests/${requestId}`);
    } finally {
      setLoading(false);
    }
  }

  function set(field: keyof UILQuery, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="form-label">
          Dataset-ID <span style={{ color: 'var(--danger)' }}>*</span>
        </label>
        <input
          className="form-input"
          placeholder="t.ex. DS-2024-SE-448291"
          value={form.datasetId}
          onChange={(e) => set('datasetId', e.target.value)}
        />
        {errors.datasetId && (
          <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors.datasetId}</p>
        )}
        <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
          Unik identifierare för datasetet på plattformen
        </p>
      </div>

      <div>
        <label className="form-label">
          Gate-ID <span style={{ color: 'var(--danger)' }}>*</span>
        </label>
        <input
          className="form-input"
          placeholder="t.ex. SE"
          value={form.gateId}
          onChange={(e) => set('gateId', e.target.value.toUpperCase())}
          maxLength={10}
        />
        {errors.gateId && (
          <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors.gateId}</p>
        )}
        <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
          EU/EES-landkod för den gate som hanterar konsignationen
        </p>
      </div>

      <div>
        <label className="form-label">
          Plattforms-ID <span style={{ color: 'var(--danger)' }}>*</span>
        </label>
        <input
          className="form-input"
          placeholder="t.ex. SE-TRAFA-01"
          value={form.platformId}
          onChange={(e) => set('platformId', e.target.value)}
        />
        {errors.platformId && (
          <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors.platformId}</p>
        )}
        <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
          Identifierare för den plattform som lagrar datasetet
        </p>
      </div>

      <div>
        <label className="form-label">
          Delmängds-ID{' '}
          <span className="text-xs font-normal" style={{ color: 'var(--muted)' }}>(valfritt)</span>
        </label>
        <input
          className="form-input"
          placeholder="t.ex. SUBSET-001"
          value={form.subsetId ?? ''}
          onChange={(e) => set('subsetId', e.target.value)}
        />
        <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
          Begränsar svaret till en specifik delmängd av data
        </p>
      </div>

      <button
        type="submit"
        className="btn-primary w-full justify-center"
        disabled={loading}
      >
        {loading ? (
          <><span className="spinner" style={{ width: '1rem', height: '1rem' }} />Söker…</>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            Skicka förfrågan
          </>
        )}
      </button>
    </form>
  );
}
