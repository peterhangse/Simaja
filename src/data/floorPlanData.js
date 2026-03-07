// ─── Sims 4 Floor Plan Data ─────────────────────────────────────────────────

export const LOT_SIZES = [
  { label: '15×10', w: 15, h: 10, tier: 'Tiny' },
  { label: '20×15', w: 20, h: 15, tier: 'Small' },
  { label: '20×20', w: 20, h: 20, tier: 'Small' },
  { label: '30×20', w: 30, h: 20, tier: 'Medium' },
  { label: '30×30', w: 30, h: 30, tier: 'Medium' },
  { label: '40×30', w: 40, h: 30, tier: 'Large' },
  { label: '40×40', w: 40, h: 40, tier: 'Large' },
  { label: '50×40', w: 50, h: 40, tier: 'Huge' },
  { label: '50×50', w: 50, h: 50, tier: 'Huge' },
  { label: '64×64', w: 64, h: 64, tier: 'Mansion' }
]

export const STYLES = [
  { id: 'modern', label: 'Modern', icon: '🏢' },
  { id: 'farmhouse', label: 'Farmhouse', icon: '🌾' },
  { id: 'victorian', label: 'Victorian', icon: '🏰' },
  { id: 'mediterranean', label: 'Mediterranean', icon: '🌊' },
  { id: 'craftsman', label: 'Craftsman', icon: '🔨' },
  { id: 'scandinavian', label: 'Scandinavian', icon: '❄️' },
  { id: 'cottage', label: 'Cottage', icon: '🌸' },
  { id: 'midcentury', label: 'Mid-Century', icon: '📺' },
  { id: 'tudor', label: 'Tudor', icon: '🏯' },
  { id: 'spanish', label: 'Spanish Colonial', icon: '☀️' },
  { id: 'beach', label: 'Beach House', icon: '🏖️' },
  { id: 'rustic', label: 'Rustic Cabin', icon: '🪵' },
  { id: 'minimalist', label: 'Minimalist', icon: '⬜' },
  { id: 'artdeco', label: 'Art Deco', icon: '✨' },
  { id: 'industrial', label: 'Industrial', icon: '⚙️' },
  { id: 'contemporary', label: 'Contemporary', icon: '🏠' }
]

export const BUDGETS = [
  { id: 'starter', label: 'Starter (§20k–§50k)', icon: '🪙', min: 20000, max: 50000 },
  { id: 'mid', label: 'Mid-Range (§50k–§150k)', icon: '💰', min: 50000, max: 150000 },
  { id: 'high', label: 'High-End (§150k–§300k)', icon: '💎', min: 150000, max: 300000 },
  { id: 'luxury', label: 'Luxury (§300k+)', icon: '👑', min: 300000, max: 600000 }
]

export const HOUSEHOLD = [
  { id: 'single', label: 'Single Sim', icon: '🧑' },
  { id: 'couple', label: 'Couple', icon: '👫' },
  { id: 'family', label: 'Small Family', icon: '👨‍👩‍👧' },
  { id: 'large', label: 'Large Family', icon: '👨‍👩‍👧‍👦' }
]

export const EXTRAS = [
  { id: 'pool', label: 'Swimming Pool', icon: '🏊' },
  { id: 'garage', label: 'Garage', icon: '🚗' },
  { id: 'garden', label: 'Garden/Yard', icon: '🌿' },
  { id: 'office', label: 'Home Office', icon: '💻' },
  { id: 'gym', label: 'Gym/Workout', icon: '🏋️' },
  { id: 'library', label: 'Library', icon: '📚' },
  { id: 'studio', label: 'Art Studio', icon: '🎨' },
  { id: 'basement', label: 'Basement', icon: '⬇️' }
]

export const FEATURES = [
  { id: 'openplan', label: 'Open Plan Kitchen/Living', icon: '🔓' },
  { id: 'ensuite', label: 'Ensuite Master Bath', icon: '🛁' },
  { id: 'balcony', label: 'Balcony/Deck', icon: '🌅' },
  { id: 'mudroom', label: 'Mudroom/Entry Hall', icon: '🚪' },
  { id: 'laundry', label: 'Laundry Room', icon: '🧺' },
  { id: 'dining', label: 'Separate Dining Room', icon: '🍽️' }
]

export const ROOM_STYLES = {
  'Living Room':         { fill: '#C8E6C9', stroke: '#388E3C', pattern: 'diagonal',   icon: '🛋️' },
  'Kitchen':             { fill: '#FFF9C4', stroke: '#F9A825', pattern: 'dots',        icon: '🍳' },
  'Bedroom':             { fill: '#BBDEFB', stroke: '#1976D2', pattern: 'horizontal',  icon: '🛏️' },
  'Master Bedroom':      { fill: '#90CAF9', stroke: '#1565C0', pattern: 'horizontal',  icon: '🛏️' },
  'Bathroom':            { fill: '#E1BEE7', stroke: '#7B1FA2', pattern: 'grid',        icon: '🚿' },
  'Master Bathroom':     { fill: '#CE93D8', stroke: '#6A1B9A', pattern: 'grid',        icon: '🛁' },
  'Dining Room':         { fill: '#FFE0B2', stroke: '#E65100', pattern: 'dots',        icon: '🍽️' },
  'Office':              { fill: '#DCEDC8', stroke: '#558B2F', pattern: 'diagonal',    icon: '💻' },
  'Garage':              { fill: '#CFD8DC', stroke: '#546E7A', pattern: 'none',        icon: '🚗' },
  'Laundry':             { fill: '#FCE4EC', stroke: '#C62828', pattern: 'dots',        icon: '🧺' },
  'Hallway':             { fill: '#F5F5F5', stroke: '#9E9E9E', pattern: 'none',        icon: '🚶' },
  'Entry':               { fill: '#EFEBE9', stroke: '#795548', pattern: 'none',        icon: '🚪' },
  'Garden':              { fill: '#A5D6A7', stroke: '#2E7D32', pattern: 'organic',     icon: '🌿' },
  'Pool':                { fill: '#B3E5FC', stroke: '#0277BD', pattern: 'wave',        icon: '🏊' },
  'Gym':                 { fill: '#D7CCC8', stroke: '#4E342E', pattern: 'diagonal',    icon: '🏋️' },
  'Library':             { fill: '#FFCCBC', stroke: '#BF360C', pattern: 'diagonal',    icon: '📚' },
  'Art Studio':          { fill: '#F8BBD9', stroke: '#880E4F', pattern: 'dots',        icon: '🎨' },
  'Basement':            { fill: '#BDBDBD', stroke: '#424242', pattern: 'grid',        icon: '⬇️' },
  'Balcony':             { fill: '#B2EBF2', stroke: '#00838F', pattern: 'none',        icon: '🌅' },
  'Mudroom':             { fill: '#D7CCC8', stroke: '#6D4C41', pattern: 'none',        icon: '🚪' },
  'Closet':              { fill: '#E0E0E0', stroke: '#757575', pattern: 'none',        icon: '👔' },
  'Open Kitchen/Living': { fill: '#FFFDE7', stroke: '#F57F17', pattern: 'diagonal',    icon: '🍳' },
  'Staircase':           { fill: '#F3E5F5', stroke: '#6A1B9A', pattern: 'diagonal',    icon: '🪜' }
}

export const DEFAULT_ROOM_STYLE = { fill: '#E8EAF6', stroke: '#3F51B5', pattern: 'none', icon: '📦' }

// ─── Room Size Constraints (Sims 4 tile dimensions) ─────────────────────────

export const ROOM_SIZE_CONSTRAINTS = {
  'Entry':               { minW: 2, minH: 2, maxW: 3, maxH: 3 },
  'Mudroom':             { minW: 2, minH: 2, maxW: 3, maxH: 3 },
  'Hallway':             { minW: 2, minH: 3, maxW: 3, maxH: 14 },
  'Staircase':           { minW: 2, minH: 3, maxW: 3, maxH: 4 },
  'Closet':              { minW: 2, minH: 3, maxW: 3, maxH: 4 },
  'Laundry':             { minW: 2, minH: 3, maxW: 3, maxH: 4 },
  'Bathroom':            { minW: 3, minH: 3, maxW: 4, maxH: 5 },
  'Master Bathroom':     { minW: 4, minH: 4, maxW: 5, maxH: 6 },
  'Bedroom':             { minW: 4, minH: 4, maxW: 5, maxH: 6 },
  'Master Bedroom':      { minW: 5, minH: 5, maxW: 7, maxH: 7 },
  'Kitchen':             { minW: 4, minH: 4, maxW: 7, maxH: 6 },
  'Dining Room':         { minW: 4, minH: 4, maxW: 6, maxH: 5 },
  'Living Room':         { minW: 6, minH: 5, maxW: 10, maxH: 8 },
  'Open Kitchen/Living': { minW: 8, minH: 6, maxW: 13, maxH: 9 },
  'Office':              { minW: 3, minH: 3, maxW: 6, maxH: 6 },
  'Gym':                 { minW: 3, minH: 3, maxW: 6, maxH: 6 },
  'Library':             { minW: 3, minH: 3, maxW: 6, maxH: 6 },
  'Art Studio':          { minW: 3, minH: 3, maxW: 6, maxH: 6 },
  'Garage':              { minW: 6, minH: 7, maxW: 8, maxH: 10 },
  'Pool':                { minW: 5, minH: 4, maxW: 10, maxH: 7 },
  'Garden':              { minW: 3, minH: 3, maxW: 8, maxH: 8 },
  'Balcony':             { minW: 3, minH: 2, maxW: 8, maxH: 3 },
  'Basement':            { minW: 4, minH: 4, maxW: 10, maxH: 8 }
}

// ─── Forbidden adjacencies ──────────────────────────────────────────────────

export const FORBIDDEN_ADJACENCIES = [
  ['Bathroom', 'Kitchen'],
  ['Garage', 'Kitchen'],
  ['Garage', 'Living Room'],
  ['Pool', 'Kitchen'],
  ['Pool', 'Living Room']
]

// ─── Floor Zoning ───────────────────────────────────────────────────────────

export const FLOOR_ZONES = {
  ground: [
    'Entry', 'Hallway', 'Staircase', 'Living Room', 'Kitchen',
    'Open Kitchen/Living', 'Dining Room', 'Garage', 'Laundry',
    'Mudroom', 'Pool', 'Garden', 'Bathroom', 'Basement'
  ],
  upper: [
    'Staircase', 'Hallway', 'Master Bedroom', 'Bedroom',
    'Master Bathroom', 'Bathroom', 'Closet', 'Office',
    'Library', 'Gym', 'Art Studio', 'Balcony'
  ]
}

// ─── Annotation Templates ───────────────────────────────────────────────────

export const ANNOTATION_TEMPLATES = {
  'Entry': [
    { category: 'Logic', note: 'The Entry acts as the routing hub — every Sim arriving or leaving passes through here. Keeping it small (2–3 tiles) prevents Sims from congregating and blocking the front door.' },
    { category: 'Gameplay', note: 'Place a mirror and a coat rack near the Entry. Sims will autonomously check appearance here, boosting the Confident moodlet before heading out.' },
    { category: 'Build Tip', note: 'Use the foundation tool to create a small porch extension outside the Entry. It adds curb appeal without eating lot space.' }
  ],
  'Living Room': [
    { category: 'Gameplay', note: 'The Living Room is the largest interior room — Sims spend the most waking hours here fulfilling Fun and Social motives. Place a TV, bookshelf, and seating cluster.' },
    { category: 'Logic', note: 'Positioned adjacent to the Kitchen and Entry so Sims can quickly route between eating, socialising, and leaving the lot.' },
    { category: 'Aesthetics', note: 'The open sightline from Entry through Living Room creates a grand first impression. Use half-walls or arches to maintain visual flow.' },
    { category: 'Game Mechanics', note: 'Sims autonomously gather in the Living Room. A fireplace here grants the Cozy moodlet (+1 Happy) to everyone in the room.' }
  ],
  'Kitchen': [
    { category: 'Gameplay', note: 'Place the fridge, stove, counter, and sink in an L or U shape for optimal Sim routing when cooking. Sims path between these objects constantly.' },
    { category: 'Logic', note: 'Kitchen shares a wall with Dining Room for efficient meal-to-table routing. Sims carry plates directly through the door without long walks.' },
    { category: 'Build Tip', note: 'Use bb.moveobjects to place a kitchen island. It acts as extra counter space and Sims will eat quick meals here standing up.' }
  ],
  'Open Kitchen/Living': [
    { category: 'Gameplay', note: 'The combined space lets cooking Sims socialise with those watching TV. Fulfils Social, Fun, and Hunger motives simultaneously — highly efficient.' },
    { category: 'Logic', note: 'Open plan eliminates door routing. Sims never get stuck pathing through doorways between kitchen and living zones.' },
    { category: 'Aesthetics', note: 'Use half-walls or the counter itself to visually separate zones while keeping the open feel. Island counters work perfectly as a room divider.' }
  ],
  'Dining Room': [
    { category: 'Gameplay', note: 'A separate Dining Room lets 6–8 Sims eat together. The Family Meal interaction boosts Social need for everyone at the table.' },
    { category: 'Logic', note: 'Directly adjacent to Kitchen — Sims carry plates through one door and sit immediately. No routing delays.' },
    { category: 'Aesthetics', note: 'A chandelier or candles on the dining table trigger the Nicely Decorated moodlet, turning every meal into a +2 Happy boost.' }
  ],
  'Master Bedroom': [
    { category: 'Gameplay', note: 'The Master Bedroom is the largest bedroom (5–7 tiles each way) to fit a double bed, dresser, and nightstands. Sims fulfil Energy and Romance motives here.' },
    { category: 'Logic', note: 'Placed on the upper floor away from the noisy Living Room and Kitchen, preventing Sim sleep disruption from the Disturbed Sleep moodlet.' },
    { category: 'Build Tip', note: 'Place the bed with headboard against a wall and leave 1 tile clearance on both sides. Both Sims can get in/out without routing failure.' }
  ],
  'Bedroom': [
    { category: 'Gameplay', note: 'Each Bedroom needs at minimum a bed, dresser, and nightstand. The Energised moodlet (+1) comes from sleeping in a well-decorated room.' },
    { category: 'Logic', note: 'Bedrooms connect to the Hallway, not directly to each other or to the Living Room. This prevents noise-based sleep disruption.' },
    { category: 'Game Mechanics', note: 'Children and teens need homework desks in their Bedrooms. Leave space for a desk and chair — the Focused moodlet helps homework completion.' }
  ],
  'Bathroom': [
    { category: 'Gameplay', note: 'Sims visit the Bathroom 2–3 times per Sim-day. Keep it accessible from the Hallway so all household members can reach it without crossing private rooms.' },
    { category: 'Logic', note: 'Smaller than any Bedroom — only needs toilet, sink, and shower. Oversized Bathrooms waste tiles that could be Bedroom space.' },
    { category: 'Build Tip', note: 'Use the Alt key when placing the toilet to fine-tune positioning. Sims need 1 tile in front of the toilet to use it.' }
  ],
  'Master Bathroom': [
    { category: 'Gameplay', note: 'The ensuite Master Bathroom connects directly to the Master Bedroom. The Refreshed moodlet from a bath stacks with the Energised moodlet from a good sleep.' },
    { category: 'Logic', note: 'Accessible from both the Master Bedroom and the Hallway — the parent Sims have private access while guests can still reach it if needed.' },
    { category: 'Build Tip', note: 'A bathtub grants a stronger Refreshed moodlet than a shower. If space allows (4×5+), always include both.' }
  ],
  'Hallway': [
    { category: 'Logic', note: 'The Hallway is the circulation spine connecting all rooms on this floor. Every room must be reachable through the Hallway without crossing private spaces.' },
    { category: 'Gameplay', note: 'Keep Hallways 2–3 tiles wide. Narrower Hallways cause Sim routing bottlenecks — two Sims cannot pass each other in a 1-tile corridor.' },
    { category: 'Build Tip', note: 'Place wall decorations in the Hallway for the Nicely Decorated moodlet. Sims path through Hallways constantly, so every decoration gets noticed.' }
  ],
  'Staircase': [
    { category: 'Logic', note: 'The Staircase occupies the exact same x,y position on every floor, allowing proper vertical circulation. It connects to the Hallway on each level.' },
    { category: 'Gameplay', note: 'Sims take ~1 Sim-hour to use stairs. Centralise the Staircase to minimise total walking time between frequently-used rooms across floors.' },
    { category: 'Build Tip', note: 'Use the spiral staircase for tight lots (2×2 footprint) or the L-shaped stairs for a grander look on larger lots.' }
  ],
  'Office': [
    { category: 'Gameplay', note: 'Place a computer, bookshelf, and good lighting. The Focused moodlet from a well-decorated Office boosts Work From Home task completion speed.' },
    { category: 'Logic', note: 'Placed away from the noisy Living Room and Kitchen. The Focused moodlet is cancelled by the Tense moodlet from nearby noise sources.' }
  ],
  'Garage': [
    { category: 'Logic', note: 'The Garage connects to the Entry or Mudroom, never directly to the Kitchen or Living Room. This provides a service buffer zone.' },
    { category: 'Build Tip', note: 'Use the garage as extra storage space. The bb.moveobjects cheat lets you place shelving units and workbenches along the walls.' }
  ],
  'Pool': [
    { category: 'Gameplay', note: 'Swimming fulfils both Fun and Fitness motives simultaneously. Sims with the Active trait will autonomously swim laps.' },
    { category: 'Game Mechanics', note: 'Pools must be outdoors. The Refreshed moodlet from swimming lasts 4 hours and stacks with Happy moodlets from Nice Decoration.' },
    { category: 'Build Tip', note: 'Use pool lights and the fountain tool to create a resort-style atmosphere. The Playful moodlet triggers near decorated pools.' }
  ],
  'Garden': [
    { category: 'Gameplay', note: 'Gardening fulfils Fun motive and generates harvestables that boost cooking quality. The Gardening skill is one of the most profitable in the game.' },
    { category: 'Aesthetics', note: 'Placed at the rear of the lot, the Garden provides a green backdrop visible from Kitchen and Dining Room windows.' }
  ],
  'Library': [
    { category: 'Gameplay', note: 'A Library with 3+ bookshelves gives the Focused +2 moodlet. Sims autonomously read here, building Logic and other skills passively.' },
    { category: 'Logic', note: 'Adjacent to the Office for a study wing. Both rooms benefit from the quiet, away from the social zones downstairs.' }
  ],
  'Gym': [
    { category: 'Gameplay', note: 'Exercise equipment fulfils the Fitness motive. Sims with the Active trait get the Energised moodlet (+2) just from being in a gym-decorated room.' },
    { category: 'Logic', note: 'Place near a Bathroom — Sims want to shower immediately after working out. Close proximity reduces the Hygiene motive drop penalty.' }
  ],
  'Art Studio': [
    { category: 'Gameplay', note: 'Easels and craft tables fulfil Fun and build Painting/Creative skills. Completed paintings can be sold for Simoleons or hung for decoration bonuses.' },
    { category: 'Aesthetics', note: 'Large windows boost the Inspired moodlet. Place the Art Studio on an exterior wall facing the Garden for maximum Inspiration.' }
  ],
  'Laundry': [
    { category: 'Gameplay', note: 'With the Laundry Day pack, washers and dryers add realism. Sims autonomously do laundry — the Clean Clothes moodlet gives +1 Happy for 8 hours.' },
    { category: 'Logic', note: 'Placed adjacent to the Kitchen or a Bathroom for plumbing adjacency. Small utility room that shares infrastructure.' }
  ],
  'Mudroom': [
    { category: 'Logic', note: 'Acts as a buffer between the Garage/exterior and the main living spaces. Prevents tracking dirt directly into the house.' },
    { category: 'Build Tip', note: 'Place hooks, a shoe rack, and a small bench. The Mudroom is also a great spot for the laundry hamper if space is tight.' }
  ],
  'Balcony': [
    { category: 'Aesthetics', note: 'The Balcony is always shallow (max 3 tiles deep) to remain a viewing platform, not a full room. It provides scenic backdrop for upper-floor rooms.' },
    { category: 'Gameplay', note: 'Place seating on the Balcony. Sims gain the Beautiful Vista moodlet (+2 Happy) when relaxing outdoors with a scenic view.' }
  ],
  'Closet': [
    { category: 'Gameplay', note: 'Dressers in the Closet give Sims the "Plan Outfit" interaction. The Well-Dressed moodlet boosts Confidence for 4 hours.' },
    { category: 'Logic', note: 'Always adjacent to the Master Bedroom or Bedroom. Smallest room in the house — just enough for a dresser and mirror.' }
  ],
  'Basement': [
    { category: 'Gameplay', note: 'Basements are great for noisy activities — instruments, DJing, gaming. Sound does not travel vertically between floors in Sims 4.' },
    { category: 'Build Tip', note: 'Use the basement tool to dig one level down. Add windows using the bb.moveobjects cheat for light wells that prevent the Cramped moodlet.' }
  ]
}

// ─── Annotation Category Colors ─────────────────────────────────────────────

export const ANNOTATION_CATEGORY_COLORS = {
  'Gameplay':       { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' },
  'Logic':          { bg: 'bg-blue-100',    text: 'text-blue-700',    border: 'border-blue-300' },
  'Aesthetics':     { bg: 'bg-purple-100',  text: 'text-purple-700',  border: 'border-purple-300' },
  'Build Tip':      { bg: 'bg-amber-100',   text: 'text-amber-700',   border: 'border-amber-300' },
  'Game Mechanics': { bg: 'bg-rose-100',    text: 'text-rose-700',    border: 'border-rose-300' },
  'Style Narrative':{ bg: 'bg-teal-100',    text: 'text-teal-700',    border: 'border-teal-300' }
}

// ─── Procedural Generation Data ─────────────────────────────────────────────

export const HOUSE_NAMES = {
  modern:        ['The Glass Cube', 'Simline Loft', 'Prism Villa', 'The Modernist', 'Aqua House', 'Skyview Residence', 'The Edge'],
  farmhouse:     ['Willow Creek Farmstead', 'Harvest Moon Ranch', 'The Old Barn', 'Sunny Meadows', 'Country Cottage', 'The Henford'],
  victorian:     ['Goth Manor', 'Rosewood Hall', 'The Painted Lady', 'Windenburg Estate', 'Thornhill House', 'Crimson Peak'],
  mediterranean: ['Villa del Sol', 'Casa Serena', 'Oasis Springs Retreat', 'Sunstone Villa', 'The Riviera'],
  craftsman:     ['Artisan Lodge', 'The Bungalow', 'Maplewood Craft', 'Cedar Heights', 'Ironwood Den'],
  scandinavian:  ['Hygge Haven', 'Frost Pine', 'Nordic Loft', 'Birch House', 'Snowdrift', 'The Minimalist'],
  cottage:       ['Bramblewood Cottage', 'Rose Garden', 'The Thatched Nook', 'Foxglove Lane', 'Lavender Cottage'],
  midcentury:    ['Retro Ranch', 'Atomic Lodge', 'The Eames', 'Palm Springs Pad', 'Boomerang Villa'],
  tudor:         ['Blackwood Manor', 'Chester Hall', 'Tudor Rose', 'The Half-Timber', 'Old Windenburg'],
  spanish:       ['Casa del Arco', 'Hacienda Sol', 'The Mission', 'Terracotta Dreams', 'El Patio'],
  beach:         ['Sulani Shores', 'Driftwood Villa', 'Tidal House', 'The Beach Shack', 'Coral Reef'],
  rustic:        ['Pine Ridge Cabin', 'The Log House', 'Granite Falls Lodge', 'Stone & Timber', 'Wolf Den'],
  minimalist:    ['White Space', 'The Void', 'Less Is More', 'Clean Lines', 'Open Air'],
  artdeco:       ['The Gatsby', 'Golden Age', 'Deco Palace', 'The Chrysler', 'Emerald Room'],
  industrial:    ['The Warehouse', 'Iron & Brick', 'The Foundry', 'Loft 42', 'Steel & Glass'],
  contemporary:  ['The Now House', 'Current Living', 'Fresh Start', 'Sim City Pad', 'Level Up']
}

export const BUILD_TIPS = {
  modern:        'Use lots of glass walls and half-walls for that open, airy modern feel. The bb.moveobjects cheat helps place furniture precisely.',
  farmhouse:     'Add a wraparound porch using fences and the foundation tool. Use wood textures and warm lighting throughout.',
  victorian:     'Layer room heights using the wall height tool. Add trim, dormers, and a turret for authenticity.',
  mediterranean: 'Use arched windows and terracotta roofing. Add an interior courtyard if the lot allows.',
  craftsman:     'Exposed beams with the debug menu. Use stone and wood siding combinations on exterior walls.',
  scandinavian:  'Keep it minimal — lots of white walls, light wood floors, and large windows for natural light.',
  cottage:       'Use the terrain tools for an uneven garden. Half-walls and lattice fences add charm.',
  midcentury:    'Low-pitch roofs, floor-to-ceiling windows, and open plan are essential. Use retro furniture from packs.',
  tudor:         'Use the half-timbered wall style and steep roof pitches. Dark wood beams contrast light plaster.',
  spanish:       'Terracotta tile roofing, stucco walls, and interior courtyards. Arched doorways are a must.',
  beach:         'Raise the foundation for a stilts effect. Use the ocean-facing wall as all windows.',
  rustic:        'Stone fireplaces, log walls, and cozy textiles. Use terrain paint for a natural surrounding.',
  minimalist:    'Less is literally more. Use platform tool for subtle level changes. Monochrome palette.',
  artdeco:       'Geometric patterns, gold accents, and dramatic lighting. The Get Famous pack has great deco items.',
  industrial:    'Exposed brick walls, metal shelving, and pendant lights. Use half-walls to zone open spaces.',
  contemporary:  'Mix materials freely — glass, wood, concrete. Use the new curved walls if your pack supports them.'
}

// Room types that map from extras/features to room names
export const EXTRA_TO_ROOM = {
  pool: 'Pool',
  garage: 'Garage',
  garden: 'Garden',
  office: 'Office',
  gym: 'Gym',
  library: 'Library',
  studio: 'Art Studio',
  basement: 'Basement'
}

export const FEATURE_TO_ROOM = {
  openplan: 'Open Kitchen/Living',
  ensuite: 'Master Bathroom',
  balcony: 'Balcony',
  mudroom: 'Mudroom',
  laundry: 'Laundry',
  dining: 'Dining Room'
}

// How much each room "wants" to be near another (higher = stronger preference)
// Format: ADJACENCY[roomA][roomB] = score
export const ADJACENCY = {
  'Entry':               { 'Living Room': 5, 'Hallway': 4, 'Mudroom': 5 },
  'Living Room':         { 'Kitchen': 4, 'Dining Room': 4, 'Entry': 3, 'Hallway': 3 },
  'Kitchen':             { 'Dining Room': 5, 'Living Room': 4, 'Laundry': 3 },
  'Open Kitchen/Living': { 'Dining Room': 4, 'Entry': 3, 'Hallway': 3 },
  'Dining Room':         { 'Kitchen': 5, 'Living Room': 4 },
  'Master Bedroom':      { 'Master Bathroom': 5, 'Closet': 4, 'Hallway': 3 },
  'Bedroom':             { 'Bathroom': 4, 'Hallway': 3 },
  'Bathroom':            { 'Bedroom': 4, 'Hallway': 3 },
  'Master Bathroom':     { 'Master Bedroom': 5, 'Hallway': 2 },
  'Hallway':             { 'Entry': 4, 'Living Room': 3, 'Bedroom': 3, 'Staircase': 5 },
  'Staircase':           { 'Hallway': 5 },
  'Office':              { 'Library': 3, 'Hallway': 2, 'Living Room': 2 },
  'Library':             { 'Office': 3, 'Living Room': 2 },
  'Garage':              { 'Entry': 3, 'Mudroom': 3 },
  'Laundry':             { 'Kitchen': 3, 'Bathroom': 2 },
  'Mudroom':             { 'Entry': 5, 'Garage': 3 },
  'Gym':                 { 'Bathroom': 3, 'Hallway': 2 },
  'Art Studio':          { 'Hallway': 2 },
  'Closet':              { 'Master Bedroom': 5, 'Bedroom': 3 }
}
