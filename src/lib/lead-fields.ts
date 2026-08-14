import { z } from 'astro:schema';
import {
  BUDGET_RANGES,
  DUMPSTER_SIZES,
  HOW_FOUND_OPTIONS,
  MATERIALS,
  PREFERRED_CONTACTS,
} from './constants';

/**
 * Niche adapter for quote forms.
 * Copy this module to another directory site and swap `NICHE_ID` + `NICHE_FIELDS`.
 * Universal seeker fields stay in `quoteInputSchema` so they stay identical across niches.
 */
export const NICHE_ID = 'dumpster' as const;

export type NicheField = {
  name: string;
  label: string;
  type: 'select' | 'text';
  required: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  maxLength?: number;
};

export const NICHE_FIELDS: NicheField[] = [
  {
    name: 'projectSize',
    label: 'Dumpster size',
    type: 'select',
    required: false,
    options: [
      { value: '', label: 'Not sure' },
      ...DUMPSTER_SIZES.map((s) => ({ value: String(s), label: `${s} yard` })),
    ],
  },
  {
    name: 'material',
    label: 'Material',
    type: 'select',
    required: false,
    options: [
      { value: '', label: 'Select…' },
      ...MATERIALS.map((m) => ({ value: m.id, label: m.label })),
    ],
  },
];

export function emptyToNull(value: unknown): string | undefined {
  if (value == null) return undefined;
  const s = String(value).trim();
  return s === '' ? undefined : s;
}

export function digitsInPhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

export const quoteInputSchema = z.object({
  mode: z.enum(['direct', 'match']).optional(),
  operatorId: z.string().max(64).optional(),
  seekerName: z.string().min(1).max(120),
  seekerEmail: z.string().email(),
  seekerPhone: z
    .string()
    .min(7)
    .max(40)
    .refine((v) => digitsInPhone(v).length >= 7, 'Enter a valid phone number'),
  projectSize: z.string().max(20).optional(),
  material: z.string().max(40).optional(),
  addressOrZip: z.string().min(3).max(200),
  timeline: z.string().max(120).optional(),
  notes: z.string().max(2000).optional(),
  preferredContact: z.enum(['phone', 'email', 'either']).optional(),
  budgetRange: z.string().max(40).optional(),
  howFound: z.string().max(40).optional(),
  sourcePath: z.string().max(400).optional(),
  sourceCityId: z.string().max(64).optional(),
  utmSource: z.string().max(120).optional(),
  utmMedium: z.string().max(120).optional(),
  utmCampaign: z.string().max(120).optional(),
  utmContent: z.string().max(120).optional(),
  utmTerm: z.string().max(120).optional(),
  referrer: z.string().max(500).optional(),
  /** Honeypot — must stay empty. */
  companyWebsite: z.string().max(200).optional(),
  'cf-turnstile-response': z.string().max(4096).optional(),
});

export type QuoteInput = z.infer<typeof quoteInputSchema>;

export function qualificationFromInput(input: {
  projectSize?: string | null;
  material?: string | null;
}): string {
  return JSON.stringify({
    niche: NICHE_ID,
    projectSize: emptyToNull(input.projectSize) ?? null,
    material: emptyToNull(input.material) ?? null,
  });
}

export function labelForBudget(id: string | null | undefined): string {
  if (!id) return '—';
  return BUDGET_RANGES.find((b) => b.id === id)?.label ?? id;
}

export function labelForHowFound(id: string | null | undefined): string {
  if (!id) return '—';
  return HOW_FOUND_OPTIONS.find((h) => h.id === id)?.label ?? id;
}

export function labelForContact(id: string | null | undefined): string {
  if (!id) return '—';
  return PREFERRED_CONTACTS.find((c) => c.id === id)?.label ?? id;
}

export function labelForMaterial(id: string | null | undefined): string {
  if (!id) return '—';
  return MATERIALS.find((m) => m.id === id)?.label ?? id;
}
