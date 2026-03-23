import { RequestStatus as Status } from '@/lib/types';

interface Props {
  status: Status;
}

const config: Record<Status, { label: string; className: string; icon: React.ReactNode }> = {
  [Status.PENDING]: {
    label: 'Pågår',
    className: 'badge badge-pending',
    icon: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  [Status.COMPLETE]: {
    label: 'Slutförd',
    className: 'badge badge-complete',
    icon: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
  },
  [Status.ERROR]: {
    label: 'Fel',
    className: 'badge badge-error',
    icon: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  },
  [Status.TIMEOUT]: {
    label: 'Tidsgräns',
    className: 'badge badge-timeout',
    icon: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  },
};

export function RequestStatusBadge({ status }: Props) {
  const { label, className, icon } = config[status];
  return (
    <span className={className}>
      {icon}
      {label}
    </span>
  );
}
