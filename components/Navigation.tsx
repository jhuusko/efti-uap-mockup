'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { AuthoritySwitcher } from './AuthoritySwitcher';

interface NavItem {
  href: string;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Hem',
    shortLabel: 'Hem',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    href: '/scan',
    label: 'Skanna QR',
    shortLabel: 'Skanna',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <path d="M14 14h1v1h-1zM19 14h1v1h-1zM14 19h1v1h-1zM19 19h1v1h-1zM16.5 14v5M14 16.5h5"/>
      </svg>
    ),
  },
  {
    href: '/search/uil',
    label: 'Sök UIL',
    shortLabel: 'UIL',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="9" y1="13" x2="15" y2="13"/>
        <line x1="9" y1="17" x2="12" y2="17"/>
      </svg>
    ),
  },
  {
    href: '/search/identifiers',
    label: 'Sök identifierare',
    shortLabel: 'Sök ID',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
  },
];

export function Navigation() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 border-r z-40"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
              style={{ background: 'var(--primary)' }}
            >
              eFTI
            </div>
            <div>
              <div className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>eFTI Portal</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>Behörig myndighet</div>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{
                  color: active ? 'var(--primary)' : 'var(--muted)',
                  background: active ? 'color-mix(in srgb, var(--primary) 10%, transparent)' : 'transparent',
                }}
              >
                <span style={{ color: active ? 'var(--primary)' : 'var(--muted)' }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="px-3 py-4 border-t space-y-2" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between px-3 py-1">
            <span className="text-xs" style={{ color: 'var(--muted)' }}>Tema</span>
            <ThemeToggle />
          </div>
          <AuthoritySwitcher />
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1 flex flex-col items-center justify-center py-2 gap-1 text-xs font-medium transition-colors min-h-[3.5rem]"
                style={{ color: active ? 'var(--primary)' : 'var(--muted)' }}
              >
                <span>{item.icon}</span>
                <span>{item.shortLabel}</span>
                {active && (
                  <span
                    className="absolute bottom-0 w-8 h-0.5 rounded-full"
                    style={{ background: 'var(--primary)' }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
