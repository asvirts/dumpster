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

export const SIZE_GUIDE: Record<number, string> = {
  10: 'Small cleanouts, garage junk, bathroom remodel',
  15: 'Kitchen remodel, flooring, moderate cleanouts',
  20: 'Roof tear-off, whole-home cleanout, small addition',
  30: 'Major renovations, multi-room projects',
  40: 'New construction, large commercial jobs',
};
