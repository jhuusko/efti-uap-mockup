'use client';

import { useEffect, useState } from 'react';
import { AUTHORITIES, Authority, useAuthority } from './AuthorityProvider';

function AuthorityAvatar({ authority, size = 'md' }: { authority: Authority; size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 'w-8 h-8 text-sm' : 'w-9 h-9 text-base';
  return (
    <div
      className={`${dim} rounded-lg flex items-center justify-center font-semibold text-white flex-shrink-0`}
      style={{ background: 'var(--primary)' }}
      aria-hidden="true"
    >
      {authority.name.charAt(0)}
    </div>
  );
}

export function AuthoritySwitcher() {
  const { authority, setAuthorityId } = useAuthority();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors cursor-pointer"
        style={{ background: 'var(--surface-elevated)' }}
        aria-haspopup="dialog"
        aria-expanded={open}
        title="Växla myndighet"
      >
        <AuthorityAvatar authority={authority} />
        <div className="flex-1 min-w-0">
          <div
            className="text-[10px] font-semibold uppercase tracking-wider truncate"
            style={{ color: 'var(--muted)' }}
          >
            Inloggad som
          </div>
          <div
            className="text-sm font-semibold truncate leading-tight"
            style={{ color: 'var(--foreground)' }}
          >
            {authority.name}
          </div>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: 'var(--muted)', flexShrink: 0 }}
          aria-hidden="true"
        >
          <polyline points="6 9 12 4 18 9" />
          <polyline points="6 15 12 20 18 15" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="authority-switcher-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl shadow-xl p-5"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                id="authority-switcher-title"
                className="text-base font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                Växla myndighet
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 rounded transition-colors cursor-pointer"
                style={{ color: 'var(--muted)' }}
                aria-label="Stäng"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <ul className="space-y-2">
              {AUTHORITIES.map((a) => {
                const active = a.id === authority.id;
                return (
                  <li key={a.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthorityId(a.id);
                        setOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                      style={{
                        background: active
                          ? 'color-mix(in srgb, var(--primary) 10%, transparent)'
                          : 'var(--surface-elevated)',
                        border: `1px solid ${active ? 'var(--primary)' : 'var(--border-subtle)'}`,
                        color: active ? 'var(--primary)' : 'var(--foreground)',
                      }}
                    >
                      <AuthorityAvatar authority={a} />
                      <span className="flex-1 text-left">{a.name}</span>
                      {active && (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
