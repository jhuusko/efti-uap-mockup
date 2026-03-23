import Link from 'next/link';
import { TransportDocument } from '@/components/results/TransportDocument';
import { ThemeToggle } from '@/components/ThemeToggle';

interface Props {
  params: Promise<{ requestId: string; index: string }>;
}

export default async function TransportDocumentPage({ params }: Props) {
  const { requestId, index } = await params;
  const consignmentIndex = parseInt(index, 10);

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto md:px-8 md:py-8">
      <div className="no-print flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link
            href={`/requests/${requestId}`}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--muted)' }}
            title="Tillbaka till förfrågan"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
              Transportdokument
            </h1>
            <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--muted)' }}>
              {requestId}
            </p>
          </div>
        </div>
        <ThemeToggle />
      </div>

      <TransportDocument requestId={requestId} index={consignmentIndex} />
    </div>
  );
}
