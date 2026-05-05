/**
 * Ploomes — FieldKeys de campos custom (Contact).
 *
 * Source: bestbarbers-ai/src/knowledge/ploomes-bb-fields.json
 * Gerado por: bestbarbers-ai/scripts/ploomes-setup-fields.ts
 *
 * Frontend só popula Contact. A automação do Ploomes (configurada via UI)
 * espelha estes campos no Deal criado a partir do Contact.
 *
 * Para regenerar: `cd bestbarbers-ai && npx tsx scripts/ploomes-setup-fields.ts`,
 * depois copiar a seção "Contact" deste arquivo para cá.
 */

export const PLOOMES_CONTACT_FIELDS = {
  // Wave 1 — abr/2026 (Meta ad params via url_tags)
  bb_campaign_id:    'contact_A48D77F6-CD14-4A9D-BB80-C46EDAD491E8',
  bb_campaign_name:  'contact_F5A3EEB7-8A11-41A1-959B-1C20F0A822DF',
  bb_adset_id:       'contact_29CF9F80-9777-476D-85F1-2030A09F5F26',
  bb_ad_id:          'contact_D73D2261-53D5-4025-9DF1-9BC1A8331FD6',
  bb_lp_version:     'contact_F1E05DF5-3638-44FA-9730-EF071A6F3B0F',
  bb_wave:           'contact_DF967EC9-3A62-4CA6-B74D-7A5FF9E162D3',
  bb_audience_type:  'contact_24A72DD1-E221-4E8B-9EA1-E355D67D5477',

  // Wave 2 — mai/2026 (UTMs clássicos + click IDs)
  bb_utm_source:     'contact_31BD2BAF-4F03-4AB1-9BEB-B9D90BAE409F',
  bb_utm_medium:     'contact_6E0C2008-E788-4940-8CF0-0B3570303C2B',
  bb_utm_campaign:   'contact_3A46CC12-B71A-4A88-91CD-BBDB60878389',
  bb_utm_content:    'contact_C0551DAE-3946-4811-816C-9EE65AFF43F0',
  bb_utm_term:       'contact_A09FA53B-B74B-4345-82C6-BB3E3B2A3A8F',
  bb_fbclid:         'contact_7AFF1DE0-4FF9-429D-80A7-08E0478A31CE',
  bb_gclid:          'contact_6341952B-8446-47E2-93A6-F10921A9E218',
  bb_lead_event_id:  'contact_15FDF793-85B5-4024-A866-348C44A2D67B',
} as const;

// Campos legados (ownerName, descrição string, cadeiras, faturamento) — não-bb_*.
export const PLOOMES_LEGACY_FIELDS = {
  ownerName:        'contact_DA6F2406-FE50-4EFC-BBB5-A3463435B427',
  campaignDescStr:  'contact_2D7EF0B1-E99E-414A-A7DA-4106F05DD4BB',
  employeeCount:    'contact_51143832-6126-4F8F-9453-D6EEFFE2A352',
  monthlyRevenue:   'contact_0748BA26-23E6-41CA-8C7A-A3568B28AC75',
} as const;

export type PloomesContactFieldKey =
  (typeof PLOOMES_CONTACT_FIELDS)[keyof typeof PLOOMES_CONTACT_FIELDS];
