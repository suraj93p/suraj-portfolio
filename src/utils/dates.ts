/** Month-only career dates are interpreted in UTC, not the visitor's local timezone. */
export function parseYearMonth(value: string): Date {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) throw new Error(`Invalid month: ${value}`);
  const [year, month] = value.split('-').map(Number);
  if (year < 1900 || year > 2200) throw new Error(`Year out of range: ${value}`);
  return new Date(Date.UTC(year, month - 1, 1));
}

export function parseDateOnly(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error(`Invalid date: ${value}`);
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error(`Invalid date: ${value}`);
  }
  return date;
}

export function formatMonth(value: string, locale = 'en-SG'): string {
  return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(parseYearMonth(value));
}

export function formatPeriod(start: string, end: string | null, present: string, separator = 'to', locale = 'en-SG'): string {
  return `${formatMonth(start, locale)} ${separator} ${end ? formatMonth(end, locale) : present}`;
}

/** Use the editorial date so stale content never implies a new verification. */
export function completeCareerYears(start: string, asOf: string): number {
  const first = parseYearMonth(start);
  const last = parseDateOnly(asOf);
  if (first > last) throw new Error('Career start cannot be after contentAsOf');
  const months = (last.getUTCFullYear() - first.getUTCFullYear()) * 12 + last.getUTCMonth() - first.getUTCMonth();
  return Math.floor(months / 12);
}
