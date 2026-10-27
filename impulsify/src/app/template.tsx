/**
 * Re-mounts per navigation → a quick, compositor-only fade/rise between pages.
 * Uses fill-mode "backwards" so no transform remains afterwards (a lingering transform
 * would make fixed-position children like the sticky buy bar position relative to this div).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
