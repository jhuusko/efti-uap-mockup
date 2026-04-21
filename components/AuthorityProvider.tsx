'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type AuthorityId = 'polisen' | 'kustbevakningen' | 'tullverket';

export interface Authority {
  id: AuthorityId;
  name: string;
  role: string;
}

export const AUTHORITIES: Authority[] = [
  { id: 'polisen', name: 'Polisen', role: 'Kontrollant' },
  { id: 'kustbevakningen', name: 'Kustbevakningen', role: 'Kontrollant' },
  { id: 'tullverket', name: 'Tullverket', role: 'Kontrollant' },
];

const DEFAULT_AUTHORITY = AUTHORITIES[2];

interface AuthorityContextValue {
  authority: Authority;
  setAuthorityId: (id: AuthorityId) => void;
}

const AuthorityContext = createContext<AuthorityContextValue>({
  authority: DEFAULT_AUTHORITY,
  setAuthorityId: () => {},
});

export function useAuthority() {
  return useContext(AuthorityContext);
}

export function AuthorityProvider({ children }: { children: React.ReactNode }) {
  const [authorityId, setAuthorityIdState] = useState<AuthorityId>(DEFAULT_AUTHORITY.id);

  useEffect(() => {
    const stored = localStorage.getItem('efti_authority') as AuthorityId | null;
    if (stored && AUTHORITIES.some((a) => a.id === stored)) {
      setAuthorityIdState(stored);
    }
  }, []);

  function setAuthorityId(id: AuthorityId) {
    setAuthorityIdState(id);
    localStorage.setItem('efti_authority', id);
  }

  const authority = AUTHORITIES.find((a) => a.id === authorityId) ?? DEFAULT_AUTHORITY;

  return (
    <AuthorityContext.Provider value={{ authority, setAuthorityId }}>
      {children}
    </AuthorityContext.Provider>
  );
}
