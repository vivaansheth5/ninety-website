export function PitchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="1" />
      <line x1="12" y1="4.5" x2="12" y2="19.5" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M2.5 8.5h3.5v7H2.5z" />
      <path d="M21.5 8.5h-3.5v7h3.5z" />
    </svg>
  );
}

export function JerseyIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M8 3.5 4 6l1.6 3.2L8 8v12.5h8V8l2.4 1.2L20 6l-4-2.5-2 1.5h-4L8 3.5Z" strokeLinejoin="round" />
    </svg>
  );
}

export function TimelineIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" strokeLinecap="round" />
    </svg>
  );
}

export function BallIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8.2 15.2 10.4 14 14.1H10L8.8 10.4Z" strokeLinejoin="round" />
      <path d="M12 8.2V4.5M15.2 10.4l3.4-1.4M14 14.1l1.5 3.3M10 14.1l-1.5 3.3M8.8 10.4l-3.4-1.4" strokeLinecap="round" />
    </svg>
  );
}

export function MenuIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M5 5l14 14M19 5 5 19" strokeLinecap="round" />
    </svg>
  );
}
