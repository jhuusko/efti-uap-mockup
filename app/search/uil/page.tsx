import { UILForm } from '@/components/forms/UILForm';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function UILSearchPage() {
  return (
    <div className="px-4 py-6 max-w-lg mx-auto md:px-8 md:py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
            Sök med UIL
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            Unique Identifier for Logistics
          </p>
        </div>
        <ThemeToggle />
      </div>

      <div className="card">
        <UILForm />
      </div>
    </div>
  );
}
