// Material categories reference data (mirrors DB seed)

export interface MaterialCategory {
  id: string;
  name: string;
  icon: string;
}

export const MATERIAL_CATEGORIES: MaterialCategory[] = [
  { id: "pipes-fittings", name: "Pipes & Fittings", icon: "🔧" },
  { id: "electrical", name: "Electrical", icon: "⚡" },
  { id: "lumber", name: "Lumber & Wood", icon: "🪵" },
  { id: "cement-concrete", name: "Cement & Concrete", icon: "🧱" },
  { id: "paint", name: "Paint & Finishes", icon: "🎨" },
  { id: "roofing", name: "Roofing & Gutters", icon: "🏠" },
  { id: "fasteners", name: "Fasteners & Hardware", icon: "🔩" },
  { id: "plumbing", name: "Plumbing Fixtures", icon: "🚿" },
  { id: "ac-cooling", name: "AC & Cooling", icon: "❄️" },
  { id: "welding", name: "Welding Supplies", icon: "🔥" },
  { id: "tools", name: "Tools & Equipment", icon: "🛠️" },
  { id: "safety", name: "Safety Gear", icon: "🦺" },
];

export function getCategoryById(id: string): MaterialCategory | undefined {
  return MATERIAL_CATEGORIES.find((c) => c.id === id);
}
