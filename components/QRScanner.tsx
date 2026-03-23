'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitUILQuery } from '@/lib/mockApi';
import { UILQuery } from '@/lib/types';

type ScannerState = 'idle' | 'scanning' | 'error' | 'processing';

export function QRScanner() {
  const router = useRouter();
  const scannerRef = useRef<unknown>(null);
  const containerId = 'qr-reader-container';
  const [state, setState] = useState<ScannerState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [showManual, setShowManual] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function startScanner() {
      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        const scanner = new Html5Qrcode(containerId);
        scannerRef.current = scanner;

        setState('scanning');
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            if (!mounted) return;
            handleScanResult(decodedText, scanner);
          },
          undefined,
        );
      } catch {
        if (mounted) {
          setState('error');
          setErrorMsg('Kamerabehörighet nekades eller kameran är inte tillgänglig.');
          setShowManual(true);
        }
      }
    }

    startScanner();

    return () => {
      mounted = false;
      const scanner = scannerRef.current as { stop?: () => Promise<void>; clear?: () => void } | null;
      if (scanner?.stop) {
        scanner.stop().then(() => scanner.clear?.()).catch(() => {});
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleScanResult(text: string, scanner?: unknown) {
    setState('processing');
    try {
      const s = scanner as { stop?: () => Promise<void>; clear?: () => void } | undefined;
      await s?.stop?.();
      s?.clear?.();
    } catch { /* ignore */ }

    try {
      const query = parseUIL(text);
      const requestId = await submitUILQuery(query);
      router.push(`/requests/${requestId}`);
    } catch {
      setState('error');
      setErrorMsg(`Ogiltigt QR-innehåll: ${text.slice(0, 80)}`);
    }
  }

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!manualInput.trim()) return;
    setState('processing');
    try {
      const query = parseUIL(manualInput.trim());
      const requestId = await submitUILQuery(query);
      router.push(`/requests/${requestId}`);
    } catch {
      setState('error');
      setErrorMsg('Ogiltig UIL-data. Ange giltig JSON eller UIL-sträng.');
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Camera viewport */}
      {!showManual && (
        <div className="relative w-full max-w-sm">
          <div
            id={containerId}
            className="w-full rounded-xl overflow-hidden"
            style={{ minHeight: '300px', background: '#000' }}
          />
          {state === 'scanning' && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div
                className="w-64 h-64 rounded-2xl"
                style={{ border: '2px solid var(--primary)', boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)' }}
              />
            </div>
          )}
          {state === 'processing' && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl" style={{ background: 'rgba(0,0,0,0.6)' }}>
              <div className="text-center text-white">
                <div className="spinner mx-auto mb-2" style={{ borderTopColor: '#fff', borderColor: 'rgba(255,255,255,0.3)' }} />
                <p className="text-sm">Behandlar…</p>
              </div>
            </div>
          )}
        </div>
      )}

      {state === 'scanning' && !showManual && (
        <p className="text-sm text-center" style={{ color: 'var(--muted)' }}>
          Rikta kameran mot QR-koden
        </p>
      )}

      {/* Error message */}
      {state === 'error' && errorMsg && (
        <div
          className="w-full max-w-sm rounded-xl p-4 text-sm"
          style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}
        >
          {errorMsg}
        </div>
      )}

      {/* Manual input toggle */}
      {!showManual ? (
        <button
          className="btn-secondary text-sm"
          onClick={() => setShowManual(true)}
        >
          Ange UIL manuellt
        </button>
      ) : (
        <form onSubmit={handleManualSubmit} className="w-full max-w-sm space-y-3">
          <div>
            <label className="form-label">
              UIL-data (JSON eller sträng)
            </label>
            <textarea
              className="form-input resize-none"
              rows={4}
              placeholder={`{"datasetId":"DS-2024-SE-448291","gateId":"SE","platformId":"SE-TRAFA-01"}`}
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
            />
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
              Klistra in QR-kodens innehåll eller ange UIL som JSON
            </p>
          </div>
          <button
            type="submit"
            className="btn-primary w-full justify-center"
            disabled={state === 'processing' || !manualInput.trim()}
          >
            {state === 'processing' ? <><span className="spinner" />Söker…</> : 'Sök'}
          </button>
          {!showManual || state !== 'error' ? null : (
            <button
              type="button"
              className="btn-secondary w-full justify-center"
              onClick={() => { setState('idle'); setErrorMsg(''); setShowManual(false); }}
            >
              Försök skanna igen
            </button>
          )}
        </form>
      )}
    </div>
  );
}

function parseUIL(text: string): UILQuery {
  // Try JSON parse first
  try {
    const obj = JSON.parse(text);
    if (obj.datasetId && obj.gateId && obj.platformId) {
      return {
        datasetId: String(obj.datasetId),
        gateId: String(obj.gateId),
        platformId: String(obj.platformId),
        subsetId: obj.subsetId ? String(obj.subsetId) : undefined,
      };
    }
  } catch { /* fall through */ }

  // Try URI scheme: efti://DS-xxx/SE/SE-TRAFA-01
  const uriMatch = text.match(/^efti:\/\/([^/]+)\/([^/]+)\/([^/?]+)/);
  if (uriMatch) {
    return {
      datasetId: uriMatch[1],
      gateId: uriMatch[2],
      platformId: uriMatch[3],
    };
  }

  throw new Error('Cannot parse UIL from: ' + text);
}
