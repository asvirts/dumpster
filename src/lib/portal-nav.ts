// Client-safe portal navigation and page titles (used by the portal layout and head).

export const PORTAL_NAV = [
  { href: '/portal', label: 'Overview' },
  { href: '/portal/leads', label: 'Leads' },
  { href: '/portal/listing', label: 'Listing' },
] as const;

export const PORTAL_TITLES: Record<string, string> = {
  '/portal': 'Overview',
  '/portal/leads': 'Leads',
  '/portal/listing': 'Listing',
  '/portal/select-org': 'Select company',
};

export function portalTitle(path: string): string {
  return PORTAL_TITLES[path] ?? 'Portal';
}
