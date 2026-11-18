export type IconName = 'arrow' | 'arrowUpRight' | 'arrowUp' | 'menu' | 'close' | 'copy' | 'check' | 'download' | 'book' | 'running' | 'mentorship' | 'code' | 'layers' | 'database' | 'quality' | 'delivery' | 'collaboration' | 'location' | 'mail' | 'education' | 'refresh' | 'offline' | 'print' | 'grid';
const paths: Record<IconName, string> = {
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  arrowUpRight: 'M6 18 18 6M6 6h12v12',
  arrowUp: 'M12 20V4m-6 6 6-6 6 6',
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'm6 6 12 12M6 18 18 6',
  copy: 'M9 9h11v11H9zM5 15H3V3h12v2',
  check: 'm5 12 4 4L19 6',
  download: 'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
  book: 'M12 6C9 3 5 3 2 4v15c4-1 7-1 10 2 3-3 6-3 10-2V4c-3-1-7-1-10 2Zm0 0v15',
  running: 'M14 4a1.5 1.5 0 1 0 0-.1M7 10l4-3 4 4 4 1M11 7l-2 7 4 3 1 5M9 14l-4 6H2',
  mentorship: 'M9 9a3 3 0 1 0 0-.1M3 21v-2a6 6 0 0 1 12 0v2M17 4a3 3 0 0 1 0 6m1 5a5 5 0 0 1 4 5v1',
  code: 'm8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18',
  layers: 'm12 3 10 5-10 5L2 8Zm-10 9 10 5 10-5M2 16l10 5 10-5',
  database: 'M3 6c0-4 18-4 18 0s-18 4-18 0Zm0 0v12c0 4 18 4 18 0V6M3 12c0 4 18 4 18 0',
  quality: 'm12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Zm-4 9 3 3 5-6',
  delivery: 'M5 4h14v5H5zM5 15h14v5H5zM8 6.5h.1M8 17.5h.1M12 9v6',
  collaboration: 'M4 4h16v12H9l-5 4Zm4 4h8M8 12h5',
  location: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Zm-5 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  mail: 'M3 5h18v14H3zm0 0 9 8 9-8',
  education: 'm2 8 10-5 10 5-10 5Zm4 3v6c4 3 8 3 12 0v-6m4-3v9',
  refresh: 'M20 7a9 9 0 0 0-15-2L2 8m0-5v5h5m-3 9a9 9 0 0 0 15 2l3-3m0 5v-5h-5',
  offline: 'm3 3 18 18M2 9a16 16 0 0 1 6-3m5-1a16 16 0 0 1 9 4M5 13a11 11 0 0 1 7-3m6 3 1 1M8 17a6 6 0 0 1 8 0m-4 4h.1',
  print: 'M6 8V2h12v6M6 17H2V8h20v9h-4M6 14h12v8H6zM18 11h.1',
  grid: 'M3 3h18v18H3zm0 6h18M3 15h18M9 3v18M15 3v18'
};
export function Icon({ name, size = 20, className = '' }: { name: IconName; size?: number; className?: string }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={paths[name]} /></svg>;
}
