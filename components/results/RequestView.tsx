'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRequestResult } from '@/lib/mockApi';
import { RequestResult, RequestStatus, UILQuery, IdentifierQuery, TransportModeLabel, TransportMode } from '@/lib/types';
import { RequestStatusBadge } from './RequestStatus';
import { ConsignmentCard } from './ConsignmentCard';

interface Props {
  requestId: string;
}

export function RequestView({ requestId }: Props) {
  const router = useRouter();
  const [result, setResult] = useState<RequestResult | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let stopped = false;

    async function poll() {
      const data = await getRequestResult(requestId);
      if (stopped) return;
      if (!data) { setNotFound(true); return; }
      setResult(data);
      if (data.status === RequestStatus.PENDING) {
        setTimeout(poll, 1000);
      }
    }

    poll();
    return () => { stopped = true; };
  }, [requestId]);

  if (notFound) {
    return (
      <div className="card text-center py-10">
        <p className="text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>Förfrågan hittades inte</p>
        <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>ID: {requestId}</p>
        <button className="btn-secondary" onClick={() => router.back()}>Gå tillbaka</button>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center py-16 gap-3">
        <div className="spinner" style={{ width: '2rem', height: '2rem' }} />
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Hämtar förfrågan…</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Request meta */}
      <div className="card">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>{requestId}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              Skickad {new Date(result.submittedAt).toLocaleString('sv-SE', { dateStyle: 'long', timeStyle: 'short' })}
            </p>
          </div>
          <RequestStatusBadge status={result.status} />
        </div>

        <QuerySummary result={result} />
      </div>

      {/* Pending state */}
      {result.status === RequestStatus.PENDING && (
        <div className="card flex items-center gap-4">
          <div className="spinner flex-shrink-0" />
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Väntar på svar från eFTI-nätverket
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              Förfrågan behandlas av berörda gater…
            </p>
          </div>
        </div>
      )}

      {/* Error / Timeout */}
      {(result.status === RequestStatus.ERROR || result.status === RequestStatus.TIMEOUT) && (
        <div className="card" style={{ borderColor: 'var(--danger)', background: 'var(--danger-bg)' }}>
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--danger)' }}>
            {result.status === RequestStatus.TIMEOUT ? 'Tidsgränsen uppnåddes' : 'Fel vid förfrågan'}
          </p>
          {result.errorDescription && (
            <p className="text-xs" style={{ color: 'var(--danger)' }}>{result.errorDescription}</p>
          )}
          <button
            className="btn-secondary mt-3 text-xs"
            onClick={() => router.back()}
          >
            Försök igen
          </button>
        </div>
      )}

      {/* Results */}
      {result.status === RequestStatus.COMPLETE && result.data && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
              Resultat
            </h2>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              {result.data.length} konsignation{result.data.length !== 1 ? 'er' : ''}
            </span>
          </div>
          {result.data.length === 0 ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              <p className="text-sm">Inga konsignationer hittades</p>
            </div>
          ) : (
            <div className="space-y-3">
              {result.data.map((c, i) => (
                <ConsignmentCard key={c.datasetId} consignment={c} index={i} requestId={requestId} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function QuerySummary({ result }: { result: RequestResult }) {
  if (result.queryType === 'uil') {
    const q = result.query as UILQuery;
    return (
      <div className="space-y-1">
        <p className="text-xs font-semibold mb-2" style={{ color: 'var(--muted)' }}>UIL-förfrågan</p>
        <SummaryRow label="Dataset-ID" value={q.datasetId} />
        <SummaryRow label="Gate-ID" value={q.gateId} />
        <SummaryRow label="Plattforms-ID" value={q.platformId} />
        {q.subsetId && <SummaryRow label="Delmängds-ID" value={q.subsetId} />}
      </div>
    );
  }

  const q = result.query as IdentifierQuery;
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold mb-2" style={{ color: 'var(--muted)' }}>Identifierarförfrågan</p>
      <SummaryRow label="Identifierare" value={q.identifier} mono />
      {q.modeCode && <SummaryRow label="Transportslag" value={TransportModeLabel[q.modeCode as TransportMode]} />}
      {q.registrationCountryCode && <SummaryRow label="Registreringsland" value={q.registrationCountryCode} />}
      {q.dangerousGoodsIndicator && <SummaryRow label="Farligt gods" value="Ja" />}
      {q.eftiGateIndicator && q.eftiGateIndicator.length > 0 && (
        <SummaryRow label="Gater" value={q.eftiGateIndicator.join(', ')} />
      )}
    </div>
  );
}

function SummaryRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-3 py-1 border-b last:border-0" style={{ borderColor: 'var(--border-subtle)' }}>
      <span className="text-xs" style={{ color: 'var(--muted)' }}>{label}</span>
      <span className={`text-xs font-medium ${mono ? 'font-mono' : ''}`} style={{ color: 'var(--foreground)' }}>{value}</span>
    </div>
  );
}
