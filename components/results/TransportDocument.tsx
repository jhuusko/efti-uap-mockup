'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRequestResult } from '@/lib/mockApi';
import { ConsignmentApiDto, TransportModeLabel, TransportMode } from '@/lib/types';

interface Props {
  requestId: string;
  index: number;
}

function DocSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border" style={{ borderColor: '#888', marginBottom: '-1px' }}>
      <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wide" style={{ background: '#e8edf2', borderBottom: '1px solid #888', color: '#444' }}>
        {title}
      </div>
      <div className="px-3 py-2 text-sm" style={{ color: '#111' }}>
        {children}
      </div>
    </div>
  );
}

function DocField({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex gap-2 leading-snug">
      <span className="text-xs flex-shrink-0" style={{ color: '#666', minWidth: '140px' }}>{label}:</span>
      <span className="text-xs font-medium" style={{ color: '#111' }}>{value}</span>
    </div>
  );
}

export function TransportDocument({ requestId, index }: Props) {
  const router = useRouter();
  const [consignment, setConsignment] = useState<ConsignmentApiDto | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getRequestResult(requestId).then((result) => {
      if (!result || !result.data || !result.data[index]) {
        setNotFound(true);
        return;
      }
      setConsignment(result.data[index]);
    });
  }, [requestId, index]);

  if (notFound) {
    return (
      <div className="card text-center py-10">
        <p className="text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>Konsignation hittades inte</p>
        <button className="btn-secondary mt-4" onClick={() => router.back()}>Gå tillbaka</button>
      </div>
    );
  }

  if (!consignment) {
    return (
      <div className="flex flex-col items-center py-16 gap-3">
        <div className="spinner" style={{ width: '2rem', height: '2rem' }} />
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Laddar dokument…</p>
      </div>
    );
  }

  const { platformId, datasetId, gateId, consignment: c } = consignment;
  const equipment = c.transportEquipment?.[0];
  const movement = c.transportMovements?.[0];
  const carrierParty = c.parties?.find((p) => p.roleCode === 'CA');
  const carrierName = movement?.carrierName ?? carrierParty?.name;
  const consignee = c.parties?.find((p) => p.roleCode === 'CN');
  const shipper = c.parties?.find((p) => p.roleCode === 'SH' || p.roleCode === 'CZ');
  const modeLabel = movement?.modeCode ? TransportModeLabel[movement.modeCode as TransportMode] : undefined;
  const hasDangerousGoods = equipment?.dangerousGoodsIndicator || movement?.dangerousGoodsIndicator;
  const customs = c.customsProcedure;
  const departure = movement?.departureLocation;
  const arrival = movement?.arrivalLocation;
  const docDate = c.carrierAcceptanceDateTime
    ? new Date(c.carrierAcceptanceDateTime).toLocaleDateString('sv-SE')
    : new Date().toLocaleDateString('sv-SE');

  return (
    <div>
      {/* Screen-only toolbar */}
      <div className="no-print flex items-center justify-between mb-6">
        <button
          className="btn-secondary text-sm flex items-center gap-1.5"
          onClick={() => router.back()}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Tillbaka
        </button>
        <button
          className="btn-primary text-sm flex items-center gap-1.5"
          onClick={() => window.print()}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"/>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8"/>
          </svg>
          Skriv ut / Spara som PDF
        </button>
      </div>

      {/* Document */}
      <div
        className="transport-doc bg-white"
        style={{
          border: '2px solid #333',
          fontFamily: 'serif',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        {/* Document header */}
        <div
          className="px-4 py-3 flex items-start justify-between"
          style={{ borderBottom: '2px solid #333', background: '#f0f4f8' }}
        >
          <div>
            <div className="text-xl font-bold uppercase tracking-wide" style={{ color: '#111' }}>
              Frakthandling
            </div>
            <div className="text-xs mt-0.5" style={{ color: '#555' }}>
              Elektroniskt transportdokument (eFTI)
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-mono font-semibold" style={{ color: '#111' }}>{datasetId}</div>
            <div className="text-xs mt-0.5" style={{ color: '#555' }}>Datum: {docDate}</div>
          </div>
        </div>

        {/* Shipper + Consignee side by side */}
        <div className="grid grid-cols-2" style={{ borderBottom: '1px solid #888' }}>
          <div style={{ borderRight: '1px solid #888' }}>
            <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wide" style={{ background: '#e8edf2', borderBottom: '1px solid #888', color: '#444' }}>
              1. Avsändare (Shipper)
            </div>
            <div className="px-3 py-2" style={{ minHeight: '64px' }}>
              {shipper ? (
                <div className="space-y-0.5">
                  {shipper.name && <div className="text-xs font-medium" style={{ color: '#111' }}>{shipper.name}</div>}
                  {shipper.countryCode && <div className="text-xs" style={{ color: '#555' }}>{shipper.countryCode}</div>}
                </div>
              ) : (
                <div className="text-xs italic" style={{ color: '#999' }}>Ej angiven</div>
              )}
            </div>
          </div>
          <div>
            <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wide" style={{ background: '#e8edf2', borderBottom: '1px solid #888', color: '#444' }}>
              2. Konsignatär (Consignee)
            </div>
            <div className="px-3 py-2" style={{ minHeight: '64px' }}>
              {consignee ? (
                <div className="space-y-0.5">
                  {consignee.name && <div className="text-xs font-medium" style={{ color: '#111' }}>{consignee.name}</div>}
                  {consignee.countryCode && <div className="text-xs" style={{ color: '#555' }}>{consignee.countryCode}</div>}
                </div>
              ) : (
                <div className="text-xs italic" style={{ color: '#999' }}>Ej angiven</div>
              )}
            </div>
          </div>
        </div>

        {/* Carrier */}
        <DocSection title="3. Transportör (Carrier)">
          {carrierName ? (
            <div className="space-y-0.5">
              <div className="text-xs font-medium" style={{ color: '#111' }}>{carrierName}</div>
              {carrierParty?.countryCode && <div className="text-xs" style={{ color: '#555' }}>{carrierParty.countryCode}</div>}
            </div>
          ) : (
            <span className="text-xs italic" style={{ color: '#999' }}>Ej angiven</span>
          )}
        </DocSection>

        {/* Route */}
        <div className="grid grid-cols-2" style={{ borderTop: '1px solid #888', borderBottom: '1px solid #888' }}>
          <div style={{ borderRight: '1px solid #888' }}>
            <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wide" style={{ background: '#e8edf2', borderBottom: '1px solid #888', color: '#444' }}>
              4. Avgångsplats
            </div>
            <div className="px-3 py-2">
              {departure ? (
                <div className="space-y-0.5">
                  {(departure.cityName || departure.name) && (
                    <div className="text-xs font-medium" style={{ color: '#111' }}>{departure.cityName ?? departure.name}</div>
                  )}
                  {departure.countryCode && <div className="text-xs" style={{ color: '#555' }}>{departure.countryCode}</div>}
                </div>
              ) : (
                <span className="text-xs italic" style={{ color: '#999' }}>Ej angiven</span>
              )}
            </div>
          </div>
          <div>
            <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wide" style={{ background: '#e8edf2', borderBottom: '1px solid #888', color: '#444' }}>
              5. Destinationsplats
            </div>
            <div className="px-3 py-2">
              {arrival ? (
                <div className="space-y-0.5">
                  {(arrival.cityName || arrival.name) && (
                    <div className="text-xs font-medium" style={{ color: '#111' }}>{arrival.cityName ?? arrival.name}</div>
                  )}
                  {arrival.countryCode && <div className="text-xs" style={{ color: '#555' }}>{arrival.countryCode}</div>}
                </div>
              ) : (
                <span className="text-xs italic" style={{ color: '#999' }}>Ej angiven</span>
              )}
            </div>
          </div>
        </div>

        {/* Transport equipment */}
        <DocSection title="6. Transportutrustning">
          <div className="space-y-0.5">
            {equipment ? (
              <>
                <DocField label="Utrustnings-ID" value={equipment.id} />
                <DocField label="Kategori" value={equipment.categoryCode} />
                <DocField label="Registreringsland" value={equipment.registrationCountryCode} />
                {equipment.grossWeightMeasure !== undefined && (
                  <DocField label="Bruttovikt" value={`${equipment.grossWeightMeasure.toLocaleString('sv-SE')} kg`} />
                )}
                {equipment.grossVolumeMeasure !== undefined && (
                  <DocField label="Bruttovolym" value={`${equipment.grossVolumeMeasure} m³`} />
                )}
                {equipment.sealIds && equipment.sealIds.length > 0 && (
                  <DocField label="Sigill" value={equipment.sealIds.join(', ')} />
                )}
                {hasDangerousGoods && (
                  <div className="mt-1 text-xs font-semibold" style={{ color: '#9a6700' }}>
                    ⚠ Farligt gods
                  </div>
                )}
              </>
            ) : (
              <span className="text-xs italic" style={{ color: '#999' }}>Ej angiven</span>
            )}
          </div>
        </DocSection>

        {/* Transport movement */}
        <DocSection title="7. Transportrörelse">
          <div className="space-y-0.5">
            <DocField label="Transportslag" value={modeLabel} />
            <DocField label="Registreringsland" value={movement?.registrationCountryCode} />
            {movement?.usedTransportEquipmentId && (
              <DocField label="Utnyttjad utrustning" value={movement.usedTransportEquipmentId} />
            )}
          </div>
        </DocSection>

        {/* Customs */}
        <DocSection title="8. Tullförfarande">
          {customs ? (
            <div className="space-y-0.5">
              <DocField label="Exporttullkontor" value={customs.exportCustomsOffice} />
              <DocField label="Importtullkontor" value={customs.importCustomsOffice} />
              <DocField label="Transiteringstullkontor" value={customs.transitCustomsOffice} />
              <DocField label="Förfarandekod" value={customs.procedureTypeCode} />
            </div>
          ) : (
            <span className="text-xs italic" style={{ color: '#999' }}>Ej angiven</span>
          )}
        </DocSection>

        {/* eFTI metadata */}
        <DocSection title="9. eFTI-metadata">
          <div className="space-y-0.5">
            <DocField label="Gate-ID" value={gateId} />
            <DocField label="Plattforms-ID" value={platformId} />
            <DocField label="Dataset-ID" value={datasetId} />
            {c.carrierAcceptanceDateTime && (
              <DocField
                label="Mottagen av transportör"
                value={new Date(c.carrierAcceptanceDateTime).toLocaleString('sv-SE', { dateStyle: 'long', timeStyle: 'short' })}
              />
            )}
          </div>
        </DocSection>

        {/* Signature row */}
        <div className="grid grid-cols-2" style={{ borderTop: '2px solid #333' }}>
          <div className="px-3 py-4" style={{ borderRight: '1px solid #888' }}>
            <div className="text-xs mb-6" style={{ color: '#444' }}>Avsändarens underskrift / Shipper signature</div>
            <div style={{ borderTop: '1px solid #888', paddingTop: '2px' }}>
              <span className="text-xs" style={{ color: '#888' }}>Underskrift och stämpel</span>
            </div>
          </div>
          <div className="px-3 py-4">
            <div className="text-xs mb-6" style={{ color: '#444' }}>Transportörens underskrift / Carrier signature</div>
            <div style={{ borderTop: '1px solid #888', paddingTop: '2px' }}>
              <span className="text-xs" style={{ color: '#888' }}>Underskrift och stämpel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
