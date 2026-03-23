'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitIdentifierQuery } from '@/lib/mockApi';
import { IdentifierQuery, TransportMode, TransportModeLabel } from '@/lib/types';

const EU_GATES = [
  'AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI',
  'FR', 'GR', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT',
  'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK',
];

const EU_COUNTRIES = [
  { code: 'AT', name: 'Österrike' }, { code: 'BE', name: 'Belgien' },
  { code: 'BG', name: 'Bulgarien' }, { code: 'CY', name: 'Cypern' },
  { code: 'CZ', name: 'Tjeckien' }, { code: 'DE', name: 'Tyskland' },
  { code: 'DK', name: 'Danmark' }, { code: 'EE', name: 'Estland' },
  { code: 'ES', name: 'Spanien' }, { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'Frankrike' }, { code: 'GR', name: 'Grekland' },
  { code: 'HR', name: 'Kroatien' }, { code: 'HU', name: 'Ungern' },
  { code: 'IE', name: 'Irland' }, { code: 'IT', name: 'Italien' },
  { code: 'LT', name: 'Litauen' }, { code: 'LU', name: 'Luxemburg' },
  { code: 'LV', name: 'Lettland' }, { code: 'MT', name: 'Malta' },
  { code: 'NL', name: 'Nederländerna' }, { code: 'PL', name: 'Polen' },
  { code: 'PT', name: 'Portugal' }, { code: 'RO', name: 'Rumänien' },
  { code: 'SE', name: 'Sverige' }, { code: 'SI', name: 'Slovenien' },
  { code: 'SK', name: 'Slovakien' },
];

export function IdentifierForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [modeCode, setModeCode] = useState<TransportMode | ''>('');
  const [registrationCountry, setRegistrationCountry] = useState('');
  const [dangerousGoods, setDangerousGoods] = useState(false);
  const [selectedGates, setSelectedGates] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [identifierError, setIdentifierError] = useState('');

  function toggleGate(code: string) {
    setSelectedGates((prev) =>
      prev.includes(code) ? prev.filter((g) => g !== code) : [...prev, code],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!identifier.trim()) {
      setIdentifierError('Identifieraren är obligatorisk');
      return;
    }
    if (identifier.trim().length > 17) {
      setIdentifierError('Max 17 tecken');
      return;
    }
    setIdentifierError('');
    setLoading(true);

    const query: IdentifierQuery = {
      identifier: identifier.trim().toUpperCase(),
      identifierType: ['EQUIPMENT'],
    };
    if (modeCode) query.modeCode = modeCode;
    if (registrationCountry) query.registrationCountryCode = registrationCountry;
    if (dangerousGoods) query.dangerousGoodsIndicator = true;
    if (selectedGates.length > 0) query.eftiGateIndicator = selectedGates;

    try {
      const requestId = await submitIdentifierQuery(query);
      router.push(`/requests/${requestId}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Identifier */}
      <div>
        <label className="form-label">
          Transportidentifierare <span style={{ color: 'var(--danger)' }}>*</span>
        </label>
        <input
          className="form-input font-mono"
          placeholder="t.ex. ABCU1234567"
          value={identifier}
          onChange={(e) => { setIdentifier(e.target.value); setIdentifierError(''); }}
          maxLength={17}
        />
        {identifierError && (
          <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{identifierError}</p>
        )}
        <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
          Transportutrustningens ID, max 17 tecken (ISO 6346)
        </p>
      </div>

      {/* Transport mode */}
      <div>
        <label className="form-label">Transportslag</label>
        <select
          className="form-select"
          value={modeCode}
          onChange={(e) => setModeCode(e.target.value as TransportMode | '')}
        >
          <option value="">Alla transportslag</option>
          {Object.entries(TransportModeLabel).map(([code, label]) => (
            <option key={code} value={code}>{label}</option>
          ))}
        </select>
      </div>

      {/* Registration country */}
      <div>
        <label className="form-label">Registreringsland</label>
        <select
          className="form-select"
          value={registrationCountry}
          onChange={(e) => setRegistrationCountry(e.target.value)}
        >
          <option value="">Alla länder</option>
          {EU_COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
          ))}
        </select>
      </div>

      {/* Dangerous goods */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={dangerousGoods}
          onClick={() => setDangerousGoods((v) => !v)}
          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0"
          style={{ background: dangerousGoods ? 'var(--primary)' : 'var(--border)' }}
        >
          <span
            className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
            style={{ transform: dangerousGoods ? 'translateX(1.375rem)' : 'translateX(0.25rem)' }}
          />
        </button>
        <div>
          <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
            Farligt gods
          </span>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            Filtrera på konsignationer med farligt gods
          </p>
        </div>
      </div>

      {/* Advanced: Gate filter */}
      <div>
        <button
          type="button"
          className="flex items-center gap-1.5 text-sm font-medium"
          style={{ color: 'var(--primary)' }}
          onClick={() => setShowAdvanced((v) => !v)}
        >
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ transition: 'transform 0.15s', transform: showAdvanced ? 'rotate(90deg)' : 'rotate(0deg)' }}
          >
            <polyline points="9 18 15 12 9 6"/>
          </svg>
          Avancerade filter
          {selectedGates.length > 0 && (
            <span
              className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold"
              style={{ background: 'var(--primary)', color: 'var(--primary-fg)' }}
            >
              {selectedGates.length}
            </span>
          )}
        </button>

        {showAdvanced && (
          <div className="mt-3 space-y-2">
            <label className="form-label">eFTI-gater att söka i</label>
            <p className="text-xs mb-2" style={{ color: 'var(--muted)' }}>
              Välj specifika EU/EES-gater (lämna tomt för alla)
            </p>
            <div className="flex flex-wrap gap-2">
              {EU_GATES.map((code) => {
                const selected = selectedGates.includes(code);
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => toggleGate(code)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors"
                    style={{
                      background: selected ? 'var(--primary)' : 'var(--surface-elevated)',
                      color: selected ? 'var(--primary-fg)' : 'var(--muted)',
                      border: '1px solid',
                      borderColor: selected ? 'var(--primary)' : 'var(--border)',
                    }}
                  >
                    {code}
                  </button>
                );
              })}
            </div>
          </div>
        )}
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
            Sök konsignationer
          </>
        )}
      </button>
    </form>
  );
}
