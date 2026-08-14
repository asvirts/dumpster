export const BRAND = {
  name: 'Find A Dumpster',
  tagline: 'Verified local dumpster rentals — transparent pricing, real operators',
  description:
    'Find verified local dumpster rental operators with transparent pricing, permit notes, and driveway-safe options near you.',
} as const;

export const UTM = {
  source: 'findadumpster',
  medium: 'referral',
  campaign: 'operator_listing',
} as const;

export const DUMPSTER_SIZES = [10, 15, 20, 30, 40] as const;

export const MATERIALS = [
  { id: 'construction', label: 'Construction / Demo' },
  { id: 'yard', label: 'Yard / Green Waste' },
  { id: 'concrete', label: 'Concrete / Dirt' },
  { id: 'mixed', label: 'Mixed Debris' },
  { id: 'roofing', label: 'Roofing' },
  { id: 'household', label: 'Household Cleanout' },
] as const;

export type MaterialId = (typeof MATERIALS)[number]['id'];

export const VERIFICATION_STATUSES = ['pending', 'verified', 'rejected'] as const;
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

export const LEAD_STATUSES = [
  'new',
  'offered',
  'unlocked',
  'closed',
  'spam',
  'invalid',
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_MODES = ['direct', 'match'] as const;
export type LeadMode = (typeof LEAD_MODES)[number];

export const PREFERRED_CONTACTS = [
  { id: 'phone', label: 'Phone' },
  { id: 'email', label: 'Email' },
  { id: 'either', label: 'Either' },
] as const;
export type PreferredContact = (typeof PREFERRED_CONTACTS)[number]['id'];

export const BUDGET_RANGES = [
  { id: 'under-400', label: 'Under $400' },
  { id: '400-700', label: '$400–$700' },
  { id: '700-1200', label: '$700–$1,200' },
  { id: '1200-plus', label: '$1,200+' },
  { id: 'not-sure', label: 'Not sure' },
] as const;

export const HOW_FOUND_OPTIONS = [
  { id: 'google', label: 'Google' },
  { id: 'ai-search', label: 'AI / ChatGPT / Perplexity' },
  { id: 'social', label: 'Social media' },
  { id: 'referral', label: 'Friend or referral' },
  { id: 'other', label: 'Other' },
] as const;

/** Max operators a single match request can be offered to. */
export const MAX_MATCH_OFFERS = 3;

export const CLAIM_STATUSES = ['unclaimed', 'pending', 'approved', 'rejected'] as const;
export type ClaimStatus = (typeof CLAIM_STATUSES)[number];

export const DEFAULT_LEAD_PRICE_CENTS = 2500;

export const SIZE_GUIDE: Record<number, string> = {
  10: 'Small cleanouts, garage junk, bathroom remodel',
  15: 'Kitchen remodel, flooring, moderate cleanouts',
  20: 'Roof tear-off, whole-home cleanout, small addition',
  30: 'Major renovations, multi-room projects',
  40: 'New construction, large commercial jobs',
};
