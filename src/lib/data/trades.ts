import { Trade } from "@/lib/types";

export const TRADES: Trade[] = [
  {
    id: "plumber",
    name: "Plumber",
    localName: "Plumber",
    icon: "🔧",
    description: "Pipes, drains, taps, toilets, water tanks, bathroom and kitchen plumbing",
    problems: [
      "Leaking pipe",
      "Blocked drain",
      "No hot water",
      "Toilet not flushing",
      "Low water pressure",
      "Pipe burst",
      "Bathroom renovation",
      "Kitchen sink problem",
      "Water tank issue",
      "Tap dripping",
    ],
    sortOrder: 1,
  },
  {
    id: "electrician",
    name: "Electrician",
    localName: "Electrician",
    icon: "⚡",
    description: "Wiring, lights, outlets, breakers, fans, generators, electrical repairs",
    problems: [
      "Power outage in house",
      "Lights flickering",
      "Need new wiring",
      "Breaker keeps tripping",
      "Install ceiling fan",
      "Outdoor lights",
      "Generator hookup",
      "Socket not working",
      "Electrical burning smell",
      "Need extra outlets",
    ],
    sortOrder: 2,
  },
  {
    id: "ac-technician",
    name: "AC Technician",
    localName: "AC Man",
    icon: "❄️",
    description: "Air conditioning install, repair, servicing, and maintenance",
    problems: [
      "AC not cooling",
      "AC leaking water",
      "AC making noise",
      "Need AC installed",
      "AC servicing",
      "AC not turning on",
      "AC smell bad",
      "Split unit installation",
      "AC remote not working",
    ],
    sortOrder: 3,
  },
  {
    id: "carpenter",
    name: "Carpenter",
    localName: "Carpenter",
    icon: "🪚",
    description: "Furniture, cabinets, doors, windows, wooden structures, repairs",
    problems: [
      "Build wardrobe",
      "Fix door",
      "Kitchen cabinets",
      "Window frame repair",
      "Wooden fence",
      "Roof repair",
      "Build shed",
      "Furniture repair",
      "Wooden stairs",
      "Built-in shelves",
    ],
    sortOrder: 4,
  },
  {
    id: "mason",
    name: "Mason / Builder",
    localName: "Mason",
    icon: "🧱",
    description: "Blocks, concrete, foundation, plastering, tiling, house construction",
    problems: [
      "Build wall",
      "Foundation work",
      "Plastering",
      "Tiling",
      "Concrete work",
      "House extension",
      "Fix cracked wall",
      "Build steps",
      "Retaining wall",
      "Column work",
    ],
    sortOrder: 5,
  },
  {
    id: "painter",
    name: "Painter",
    localName: "Painter",
    icon: "🎨",
    description: "Interior and exterior painting, waterproofing, touch-ups",
    problems: [
      "Paint house exterior",
      "Paint interior rooms",
      "Touch up work",
      "Waterproofing",
      "Paint fence or gate",
      "Wall preparation",
      "Remove old paint",
      "Decorative painting",
    ],
    sortOrder: 6,
  },
  {
    id: "welder",
    name: "Welder",
    localName: "Welder Man",
    icon: "🔩",
    description: "Gates, grills, fences, railings, burglar bars, metal fabrication",
    problems: [
      "Build gate",
      "Fix gate",
      "Window grills",
      "Metal fence",
      "Burglar bars",
      "Railing",
      "Metal roof structure",
      "Welding repair",
      "Container modification",
      "Staircase railing",
    ],
    sortOrder: 7,
  },
  {
    id: "mechanic",
    name: "Mechanic",
    localName: "Mechanic",
    icon: "🚗",
    description: "Car repair, engine, brakes, AC, service, diagnostics",
    problems: [
      "Car not starting",
      "Engine trouble",
      "Brake repair",
      "Car AC not working",
      "Oil change",
      "Transmission problem",
      "Tire change",
      "General service",
      "Check engine light",
      "Suspension issue",
    ],
    sortOrder: 8,
  },
];

// Build a flat list of all problems for autocomplete search
export const ALL_PROBLEMS = TRADES.flatMap((trade) =>
  trade.problems.map((problem) => ({
    problem,
    tradeId: trade.id,
    tradeName: trade.localName,
  }))
);

// Helper: find trade by ID
export function getTradeById(id: string): Trade | undefined {
  return TRADES.find((t) => t.id === id);
}

// Helper: find trades matching a problem string
export function findTradesByProblem(query: string): Trade[] {
  const q = query.toLowerCase();
  return TRADES.filter((trade) =>
    trade.problems.some((p) => p.toLowerCase().includes(q))
  );
}
