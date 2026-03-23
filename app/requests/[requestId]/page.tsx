import { RequestView } from '@/components/results/RequestView';
import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';

interface Props {
  params: Promise<{ requestId: string }>;
}

export default async function RequestPage({ params }: Props) {
  const { requestId } = await params;

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto md:px-8 md:py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--muted)' }}
            title="Tillbaka till hem"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
              Förfrågningsresultat
            </h1>
            <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--muted)' }}>
              {requestId}
            </p>
          </div>
        </div>
        <ThemeToggle />
      </div>

      <RequestView requestId={requestId} />
    </div>
  );
}
