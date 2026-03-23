import Link from 'next/link';
import { ConsignmentApiDto, TransportModeLabel, TransportMode } from '@/lib/types';

interface Props {
  consignment: ConsignmentApiDto;
  index: number;
  requestId: string;
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-3 py-1.5 border-b last:border-0" style={{ borderColor: 'var(--border-subtle)' }}>
      <span className="text-xs" style={{ color: 'var(--muted)' }}>{label}</span>
      <span className="text-xs font-medium text-right" style={{ color: 'var(--foreground)' }}>{value}</span>
    </div>
  );
}

export function ConsignmentCard({ consignment, index, requestId }: Props) {
  const { platformId, datasetId, gateId, consignment: c } = consignment;
  const equipment = c.transportEquipment?.[0];
  const movement = c.transportMovements?.[0];
  const carrier = movement?.carrierName ?? c.parties?.find((p) => p.roleCode === 'CA')?.name;
  const modeLabel = movement?.modeCode ? TransportModeLabel[movement.modeCode as TransportMode] : undefined;
  const hasDangerousGoods = equipment?.dangerousGoodsIndicator || movement?.dangerousGoodsIndicator;
  const departure = movement?.departureLocation;
  const arrival = movement?.arrivalLocation;
  const customs = c.customsProcedure;

  return (
    <div className="card p-0 overflow-hidden">
      {/* Card header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ background: 'var(--surface-elevated)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2">
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: 'var(--primary)' }}
          >
            {index + 1}
          </span>
          <span className="text-sm font-semibold font-mono" style={{ color: 'var(--foreground)' }}>
            {equipment?.id ?? c.id ?? 'Okänd'}
          </span>
          {hasDangerousGoods && (
            <span
              className="badge text-xs"
              style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}
            >
              ⚠ Farligt gods
            </span>
          )}
        </div>
        {modeLabel && (
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
            {modeLabel}
          </span>
        )}
      </div>

      {/* Route */}
      {(departure || arrival) && (
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <div className="text-xs" style={{ color: 'var(--muted)' }}>Från</div>
              <div className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>
                {departure?.cityName ?? departure?.name ?? '—'}
                {departure?.countryCode && <span style={{ color: 'var(--muted)' }}> ({departure.countryCode})</span>}
              </div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--muted)', flexShrink: 0 }}>
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
            <div className="flex-1 min-w-0 text-right">
              <div className="text-xs" style={{ color: 'var(--muted)' }}>Till</div>
              <div className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>
                {arrival?.cityName ?? arrival?.name ?? '—'}
                {arrival?.countryCode && <span style={{ color: 'var(--muted)' }}> ({arrival.countryCode})</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details */}
      <div className="px-4 py-3">
        <InfoRow label="Transportör" value={carrier} />
        <InfoRow label="Registreringsland" value={equipment?.registrationCountryCode} />
        {equipment?.grossWeightMeasure !== undefined && (
          <InfoRow label="Bruttovikt" value={`${equipment.grossWeightMeasure.toLocaleString('sv-SE')} kg`} />
        )}
        {equipment?.grossVolumeMeasure !== undefined && (
          <InfoRow label="Bruttovolym" value={`${equipment.grossVolumeMeasure} m³`} />
        )}
        <InfoRow label="Exporttullkontor" value={customs?.exportCustomsOffice} />
        <InfoRow label="Importtullkontor" value={customs?.importCustomsOffice} />
        {c.carrierAcceptanceDateTime && (
          <InfoRow
            label="Mottagen av transportör"
            value={new Date(c.carrierAcceptanceDateTime).toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' })}
          />
        )}
      </div>

      {/* Document link */}
      <div className="px-4 py-2 border-t" style={{ borderColor: 'var(--border)' }}>
        <Link
          href={`/requests/${requestId}/document/${index}`}
          className="text-xs font-medium flex items-center gap-1.5"
          style={{ color: 'var(--primary)', textDecoration: 'none' }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="9" y1="13" x2="15" y2="13"/>
            <line x1="9" y1="17" x2="12" y2="17"/>
          </svg>
          Visa transportdokument
        </Link>
      </div>

      {/* Footer */}
      <div
        className="px-4 py-2 flex flex-wrap gap-x-4 gap-y-1"
        style={{ background: 'var(--surface-elevated)', borderTop: '1px solid var(--border)' }}
      >
        <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
          Gate: <span style={{ color: 'var(--foreground)' }}>{gateId}</span>
        </span>
        <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
          Plattform: <span style={{ color: 'var(--foreground)' }}>{platformId}</span>
        </span>
        <span className="text-xs font-mono truncate" style={{ color: 'var(--muted)' }}>
          Dataset: <span style={{ color: 'var(--foreground)' }}>{datasetId}</span>
        </span>
      </div>
    </div>
  );
}
