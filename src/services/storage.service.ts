export function readPreference(key: string): string | null {
  try { return window.sessionStorage.getItem(`suraj-portfolio:${key}`); } catch { return null; }
}
export function writePreference(key: string, value: string): void {
  try { window.sessionStorage.setItem(`suraj-portfolio:${key}`, value); } catch { /* Preferences are optional. */ }
}
