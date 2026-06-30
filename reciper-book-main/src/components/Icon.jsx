/**
 * Minimal inline-SVG icon set matching the lucide style used in the Pencil design.
 * Keeps us free of icon-library dependencies for a small student project.
 */
const paths = {
  'arrow-right': <path d="M5 12h14M13 5l7 7-7 7" />,
  'arrow-left': <path d="M19 12H5M12 19l-7-7 7-7" />,
  eye: (
    <>
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  'eye-off': (
    <>
      <path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-11-7-11-7a20 20 0 013.22-4.27M9.88 4.24A10.9 10.9 0 0112 4c7 0 11 7 11 7a20.4 20.4 0 01-2.16 3.19" />
      <path d="M1 1l22 22" />
      <path d="M14.12 14.12A3 3 0 119.88 9.88" />
    </>
  ),
  check: <path d="M20 6L9 17l-5-5" />,
  x: <path d="M18 6L6 18M6 6l12 12" />,
  google: (
    <>
      <path d="M21.35 11.1H12v3.83h5.35a5.3 5.3 0 01-2.3 3.48v2.88h3.72c2.18-2 3.43-4.94 3.43-8.47 0-.6-.05-1.17-.15-1.72z" fill="#4285F4" stroke="none"/>
      <path d="M12 22c3.09 0 5.67-1.02 7.56-2.77l-3.72-2.88a6.6 6.6 0 01-3.84 1.09c-2.95 0-5.45-1.99-6.34-4.66H1.83v2.93A10 10 0 0012 22z" fill="#34A853" stroke="none"/>
      <path d="M5.66 12.78a6.03 6.03 0 010-3.57V6.28H1.83a10 10 0 000 9.43l3.83-2.93z" fill="#FBBC04" stroke="none"/>
      <path d="M12 5.38c1.68 0 3.19.58 4.37 1.72l3.28-3.28A10 10 0 001.83 6.28l3.83 2.93c.89-2.67 3.39-4.66 6.34-4.66z" fill="#EA4335" stroke="none"/>
    </>
  ),
  sparkles: (
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zM5 17l.75 2.25L8 20l-2.25.75L5 23l-.75-2.25L2 20l2.25-.75L5 17z" />
  ),
};

export default function Icon({ name, size = 18, color = 'currentColor', strokeWidth = 2, className, ...rest }) {
  const body = paths[name];
  if (!body) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {body}
    </svg>
  );
}
