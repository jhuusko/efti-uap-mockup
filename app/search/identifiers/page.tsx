import { IdentifierForm } from '@/components/forms/IdentifierForm';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function IdentifierSearchPage() {
  return (
    <div className="px-4 py-6 max-w-lg mx-auto md:px-8 md:py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
            Sök med identifierare
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            Sök på transportutrustningens ID
          </p>
        </div>
        <ThemeToggle />
      </div>

      <div className="card">
        <IdentifierForm />
      </div>
    </div>
  );
}
