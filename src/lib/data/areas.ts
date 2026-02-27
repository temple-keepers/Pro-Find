import { Area } from "@/lib/types";

export const AREAS: Area[] = [
  // Georgetown proper
  { id: "gt-kitty", name: "Kitty", shortName: "Kitty", region: "Georgetown", sortOrder: 1 },
  { id: "gt-campbellville", name: "Campbellville", shortName: "Campbellville", region: "Georgetown", sortOrder: 2 },
  { id: "gt-sophia", name: "Sophia", shortName: "Sophia", region: "Georgetown", sortOrder: 3 },
  { id: "gt-albouystown", name: "Albouystown", shortName: "Albouystown", region: "Georgetown", sortOrder: 4 },
  { id: "gt-lacytown", name: "Lacytown", shortName: "Lacytown", region: "Georgetown", sortOrder: 5 },
  { id: "gt-bourda", name: "Bourda", shortName: "Bourda", region: "Georgetown", sortOrder: 6 },
  { id: "gt-subryanville", name: "Subryanville", shortName: "Subryanville", region: "Georgetown", sortOrder: 7 },
  { id: "gt-bel-air", name: "Bel Air Park", shortName: "Bel Air", region: "Georgetown", sortOrder: 8 },
  { id: "gt-stabroek", name: "Stabroek", shortName: "Stabroek", region: "Georgetown", sortOrder: 9 },
  { id: "gt-south-ruimveldt", name: "South Ruimveldt", shortName: "S. Ruimveldt", region: "Georgetown", sortOrder: 10 },
  { id: "gt-north-ruimveldt", name: "North Ruimveldt", shortName: "N. Ruimveldt", region: "Georgetown", sortOrder: 11 },
  { id: "gt-turkeyen", name: "Turkeyen", shortName: "Turkeyen", region: "Georgetown", sortOrder: 12 },
  { id: "gt-queenstown", name: "Queenstown", shortName: "Queenstown", region: "Georgetown", sortOrder: 13 },
  { id: "gt-werk-en-rust", name: "Werk-en-Rust", shortName: "Werk-en-Rust", region: "Georgetown", sortOrder: 14 },
  { id: "gt-lodge", name: "Lodge", shortName: "Lodge", region: "Georgetown", sortOrder: 15 },
  { id: "gt-cummingsburg", name: "Cummingsburg", shortName: "Cummingsburg", region: "Georgetown", sortOrder: 16 },
  { id: "gt-newtown", name: "Newtown", shortName: "Newtown", region: "Georgetown", sortOrder: 17 },
  { id: "gt-alexander-village", name: "Alexander Village", shortName: "Alex Village", region: "Georgetown", sortOrder: 18 },
  { id: "gt-roxanne-burnham", name: "Roxanne Burnham Gardens", shortName: "RB Gardens", region: "Georgetown", sortOrder: 19 },

  // East Bank Demerara
  { id: "ebd-providence", name: "Providence", shortName: "Providence", region: "East Bank Demerara", sortOrder: 1 },
  { id: "ebd-eccles", name: "Eccles", shortName: "Eccles", region: "East Bank Demerara", sortOrder: 2 },
  { id: "ebd-houston", name: "Houston", shortName: "Houston", region: "East Bank Demerara", sortOrder: 3 },
  { id: "ebd-diamond", name: "Diamond", shortName: "Diamond", region: "East Bank Demerara", sortOrder: 4 },
  { id: "ebd-grove", name: "Grove", shortName: "Grove", region: "East Bank Demerara", sortOrder: 5 },
  { id: "ebd-land-of-canaan", name: "Land of Canaan", shortName: "Canaan", region: "East Bank Demerara", sortOrder: 6 },
  { id: "ebd-herstelling", name: "Herstelling", shortName: "Herstelling", region: "East Bank Demerara", sortOrder: 7 },
  { id: "ebd-soesdyke", name: "Soesdyke", shortName: "Soesdyke", region: "East Bank Demerara", sortOrder: 8 },
  { id: "ebd-timehri", name: "Timehri", shortName: "Timehri", region: "East Bank Demerara", sortOrder: 9 },

  // East Coast Demerara
  { id: "ecd-ogle", name: "Ogle", shortName: "Ogle", region: "East Coast Demerara", sortOrder: 1 },
  { id: "ecd-plaisance", name: "Plaisance", shortName: "Plaisance", region: "East Coast Demerara", sortOrder: 2 },
  { id: "ecd-bv", name: "BV (Beterverwagting)", shortName: "BV", region: "East Coast Demerara", sortOrder: 3 },
  { id: "ecd-buxton", name: "Buxton", shortName: "Buxton", region: "East Coast Demerara", sortOrder: 4 },
  { id: "ecd-enmore", name: "Enmore", shortName: "Enmore", region: "East Coast Demerara", sortOrder: 5 },
  { id: "ecd-lbi", name: "LBI (La Bonne Intention)", shortName: "LBI", region: "East Coast Demerara", sortOrder: 6 },
  { id: "ecd-lusignan", name: "Lusignan", shortName: "Lusignan", region: "East Coast Demerara", sortOrder: 7 },
  { id: "ecd-success", name: "Success", shortName: "Success", region: "East Coast Demerara", sortOrder: 8 },
  { id: "ecd-mon-repos", name: "Mon Repos", shortName: "Mon Repos", region: "East Coast Demerara", sortOrder: 9 },
  { id: "ecd-triumph", name: "Triumph", shortName: "Triumph", region: "East Coast Demerara", sortOrder: 10 },
  { id: "ecd-cove-john", name: "Cove & John", shortName: "Cove & John", region: "East Coast Demerara", sortOrder: 11 },

  // West Coast Demerara
  { id: "wcd-vreed-en-hoop", name: "Vreed-en-Hoop", shortName: "Vreed-en-Hoop", region: "West Coast Demerara", sortOrder: 1 },
  { id: "wcd-wales", name: "Wales", shortName: "Wales", region: "West Coast Demerara", sortOrder: 2 },
  { id: "wcd-leonora", name: "Leonora", shortName: "Leonora", region: "West Coast Demerara", sortOrder: 3 },
  { id: "wcd-uitvlugt", name: "Uitvlugt", shortName: "Uitvlugt", region: "West Coast Demerara", sortOrder: 4 },
  { id: "wcd-parika", name: "Parika", shortName: "Parika", region: "West Coast Demerara", sortOrder: 5 },

  // West Bank Demerara
  { id: "wbd-la-grange", name: "La Grange", shortName: "La Grange", region: "West Bank Demerara", sortOrder: 1 },
  { id: "wbd-la-parfaite", name: "La Parfaite Harmonie", shortName: "La Parfaite", region: "West Bank Demerara", sortOrder: 2 },

  // Berbice
  { id: "ber-new-amsterdam", name: "New Amsterdam", shortName: "New Amsterdam", region: "Berbice", sortOrder: 1 },
  { id: "ber-rose-hall", name: "Rose Hall", shortName: "Rose Hall", region: "Berbice", sortOrder: 2 },
  { id: "ber-corriverton", name: "Corriverton", shortName: "Corriverton", region: "Berbice", sortOrder: 3 },

  // Essequibo
  { id: "ess-anna-regina", name: "Anna Regina", shortName: "Anna Regina", region: "Essequibo", sortOrder: 1 },
  { id: "ess-bartica", name: "Bartica", shortName: "Bartica", region: "Essequibo", sortOrder: 2 },

  // Linden
  { id: "lin-linden", name: "Linden", shortName: "Linden", region: "Linden", sortOrder: 1 },
];

// Group areas by region for dropdown display
export function getAreasByRegion(): Record<string, Area[]> {
  const grouped: Record<string, Area[]> = {};
  for (const area of AREAS) {
    if (!grouped[area.region]) {
      grouped[area.region] = [];
    }
    grouped[area.region].push(area);
  }
  return grouped;
}

// Helper: find area by ID
export function getAreaById(id: string): Area | undefined {
  return AREAS.find((a) => a.id === id);
}

// Helper: get display name for area ID
export function getAreaDisplayName(id: string): string {
  const area = getAreaById(id);
  return area ? `${area.name}, ${area.region}` : id;
}

// Get unique regions
export function getRegions(): string[] {
  return Array.from(new Set(AREAS.map((a) => a.region)));
}
