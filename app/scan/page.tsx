import { QRScanner } from '@/components/QRScanner';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function ScanPage() {
  return (
    <div className="px-4 py-6 max-w-lg mx-auto md:px-8 md:py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
            Skanna QR-kod
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            Rikta kameran mot en eFTI QR-kod
          </p>
        </div>
        <ThemeToggle />
      </div>

      <div
        className="card p-6"
        style={{ background: 'var(--surface)' }}
      >
        <QRScanner />
      </div>

      <div
        className="mt-4 rounded-xl p-4 text-xs"
        style={{ background: 'var(--surface-elevated)', color: 'var(--muted)' }}
      >
        <p className="font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Förväntat format</p>
        <p>QR-koden ska innehålla UIL-data i JSON-format:</p>
        <code
          className="block mt-1 p-2 rounded text-xs font-mono break-all"
          style={{ background: 'var(--surface)', color: 'var(--foreground)' }}
        >
          {'{"datasetId":"DS-2024-SE-448291","gateId":"SE","platformId":"SE-TRAFA-01"}'}
        </code>
      </div>
    </div>
  );
}
