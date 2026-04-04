const KEYWORD_ICON_MAP: Record<string, string> = {
  // People
  'general':      'badge',
  'guest':        'person',
  'vip':          'star',
  'visitor':      'person_outline',
  'employee':     'work',
  'contractor':   'engineering',
  'intern':       'school',
  'staff':        'group',
  'patient':      'healing',
  'nurse':        'vaccines',

  // Services
  'delivery':     'local_shipping',
  'courier':      'inventory_2',
  'maintenance':  'build',
  'repair':       'handyman',
  'cleaning':     'cleaning_services',
  'security':     'security',

  // Medical
  'doctor':       'medical_services',
  'medical':      'local_hospital',
  'ambulance':    'emergency',
  'hospital':     'local_hospital',

  // Official
  'interview':    'question_answer',
  'meeting':      'groups',
  'event':        'event',
  'conference':   'business_center',
  'audit':        'fact_check',
  'inspection':   'search',
  'official':     'account_balance',

  // Logistics
  'parking':      'local_parking',
  'vehicle':      'directions_car',
  'cab':          'local_taxi',
  'transport':    'commute',

  // Temporary / Time-based
  'temporary':    'schedule',
  'emergency':    'warning',
  'overnight':    'nightlight',
  'permanent':    'verified',
  'daily':        'today',
};

const DEFAULT_ICON = 'token';

export function resolveIcon(typeName: string): string {
  if (!typeName) return DEFAULT_ICON;

  const normalized = typeName.toLowerCase().replace(/[^a-z0-9\s]/g, '');
  const words = normalized.split(/\s+/);

  // Try full match first (e.g. "doctor visit" won't match, but individual words will)
  if (KEYWORD_ICON_MAP[normalized]) return KEYWORD_ICON_MAP[normalized];

  // Try each word
  for (const word of words) {
    if (KEYWORD_ICON_MAP[word]) return KEYWORD_ICON_MAP[word];
  }

  return DEFAULT_ICON;
}
