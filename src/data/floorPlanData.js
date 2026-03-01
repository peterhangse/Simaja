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
  'Open Kitchen/Living': { fill: '#FFFDE7', stroke: '#F57F17', pattern: 'diagonal',    icon: '🍳' }
}

export const DEFAULT_ROOM_STYLE = { fill: '#E8EAF6', stroke: '#3F51B5', pattern: 'none', icon: '📦' }

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
  'Master Bedroom':      { 'Master Bathroom': 5, 'Closet': 4 },
  'Bedroom':             { 'Bathroom': 4, 'Hallway': 3 },
  'Bathroom':            { 'Bedroom': 4, 'Hallway': 3 },
  'Master Bathroom':     { 'Master Bedroom': 5 },
  'Hallway':             { 'Entry': 4, 'Living Room': 3, 'Bedroom': 3 },
  'Office':              { 'Library': 3, 'Hallway': 2, 'Living Room': 2 },
  'Library':             { 'Office': 3, 'Living Room': 2 },
  'Garage':              { 'Entry': 3, 'Mudroom': 3 },
  'Laundry':             { 'Kitchen': 3, 'Bathroom': 2 },
  'Mudroom':             { 'Entry': 5, 'Garage': 3 },
  'Gym':                 { 'Bathroom': 3, 'Hallway': 2 },
  'Art Studio':          { 'Hallway': 2 },
  'Closet':              { 'Master Bedroom': 5, 'Bedroom': 3 }
}
