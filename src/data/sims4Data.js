/**
 * Sims 4 Official Data
 * Contains all official traits, aspirations, careers, skills, and ages
 * Used for both manual entry and OCR fuzzy matching
 */

// Traits with English (game) and Swedish names
export const TRAITS = [
  // Emotional traits
  { en: 'Active', sv: 'Aktiv' },
  { en: 'Cheerful', sv: 'Glad' },
  { en: 'Creative', sv: 'Kreativ' },
  { en: 'Genius', sv: 'Geni' },
  { en: 'Gloomy', sv: 'Dystert' },
  { en: 'Goofball', sv: 'Tok' },
  { en: 'Hot-Headed', sv: 'Hetsig' },
  { en: 'Romantic', sv: 'Romantisk' },
  { en: 'Self-Assured', sv: 'Självsäker' },
  
  // Hobby traits
  { en: 'Art Lover', sv: 'Konstälskare' },
  { en: 'Bookworm', sv: 'Bokmal' },
  { en: 'Foodie', sv: 'Matnörd' },
  { en: 'Geek', sv: 'Nörd' },
  { en: 'Loves Outdoors', sv: 'Älskar utomhus' },
  { en: 'Music Lover', sv: 'Musikälskare' },
  { en: 'Perfectionist', sv: 'Perfektionist' },
  
  // Lifestyle traits
  { en: 'Ambitious', sv: 'Ambitiös' },
  { en: 'Childish', sv: 'Barnslig' },
  { en: 'Clumsy', sv: 'Klumpig' },
  { en: 'Commitment Issues', sv: 'Rädd för åtaganden' },
  { en: 'Dance Machine', sv: 'Dansmaskin' },
  { en: 'Family-Oriented', sv: 'Familjeorienterad' },
  { en: 'Glutton', sv: 'Frossare' },
  { en: 'Lazy', sv: 'Lat' },
  { en: 'Loner', sv: 'Ensamvarg' },
  { en: 'Loves the Cold', sv: 'Älskar kyla' },
  { en: 'Loves the Heat', sv: 'Älskar värme' },
  { en: 'Materialistic', sv: 'Materialistisk' },
  { en: 'Neat', sv: 'Städnisse' },
  { en: 'Noncommittal', sv: 'Oengagerad' },
  { en: 'Slob', sv: 'Slarver' },
  { en: 'Snob', sv: 'Snobb' },
  { en: 'Squeamish', sv: 'Kräsen' },
  { en: 'Vegetarian', sv: 'Vegetarian' },
  
  // Social traits
  { en: 'Bro', sv: 'Brorsa' },
  { en: 'Evil', sv: 'Ond' },
  { en: 'Good', sv: 'God' },
  { en: 'Hates Children', sv: 'Hatar barn' },
  { en: 'Insider', sv: 'Insider' },
  { en: 'Jealous', sv: 'Svartsjuk' },
  { en: 'Mean', sv: 'Elak' },
  { en: 'Outgoing', sv: 'Utåtriktad' },
  { en: 'Self-Absorbed', sv: 'Självupptagen' },
  { en: 'Unflirty', sv: 'Oflirtig' },
  
  // Mental traits
  { en: 'Erratic', sv: 'Oberäknelig' },
  { en: 'Kleptomaniac', sv: 'Kleptoman' },
  { en: 'Paranoid', sv: 'Paranoid' },
  
  // Toddler traits
  { en: 'Angelic', sv: 'Änglalik' },
  { en: 'Charmer', sv: 'Charmör' },
  { en: 'Clingy', sv: 'Kletigt' },
  { en: 'Fussy', sv: 'Kinkig' },
  { en: 'Independent', sv: 'Självständig' },
  { en: 'Inquisitive', sv: 'Nyfiken' },
  { en: 'Silly', sv: 'Fnissig' },
  { en: 'Wild', sv: 'Vild' },
  
  // Child traits
  { en: 'Whiz Kid', sv: 'Snillrik' },
  { en: 'Rambunctious Scamp', sv: 'Busfransen' },
  { en: 'Social Butterfly', sv: 'Social fjäril' },
  
  // Expansion/Game Pack traits
  { en: 'Cat Lover', sv: 'Kattälskare' },
  { en: 'Dog Lover', sv: 'Hundälskare' },
  { en: 'High Maintenance', sv: 'Kräver mycket' },
  { en: 'Jealous', sv: 'Svartsjuk' },
  { en: 'Maker', sv: 'Skapare' },
  { en: 'Recycle Disciple', sv: 'Återvinningsfanatiker' },
  { en: 'Freegan', sv: 'Gratisätare' },
  { en: 'Green Fiend', sv: 'Miljökämpe' },
  { en: 'Proper', sv: 'Korrekt' },
  { en: 'Adventurous', sv: 'Äventyrlig' },
  { en: 'Overachiever', sv: 'Överpresterare' },
  { en: 'Party Animal', sv: 'Festpransen' },
  { en: 'Socially Awkward', sv: 'Socialt klumpig' },
  { en: 'Loyal', sv: 'Lojal' },
  { en: 'Lactose Intolerant', sv: 'Laktosintolerant' }
]

// Aspirations grouped by category
export const ASPIRATIONS = {
  'Kreativitet': [
    { en: 'Master Chef', sv: 'Mästerkock' },
    { en: 'Master Mixologist', sv: 'Mästerbartender' },
    { en: 'Musical Genius', sv: 'Musikaliskt geni' },
    { en: 'Painter Extraordinaire', sv: 'Extraordinär målare' },
    { en: 'Bestselling Author', sv: 'Bästsäljarförfattare' }
  ],
  'Förmögenhet': [
    { en: 'Fabulously Wealthy', sv: 'Sagolikt rik' },
    { en: 'Mansion Baron', sv: 'Herrgårdsbaron' },
    { en: 'Freelance Botanist', sv: 'Frilansande botaniker' }
  ],
  'Familj': [
    { en: 'Big Happy Family', sv: 'Stor lycklig familj' },
    { en: 'Successful Lineage', sv: 'Framgångsrik släkt' },
    { en: 'Super Parent', sv: 'Superförälder' }
  ],
  'Kärlek': [
    { en: 'Serial Romantic', sv: 'Seriell romantiker' },
    { en: 'Soulmate', sv: 'Själsfrände' }
  ],
  'Kunskap': [
    { en: 'Computer Whiz', sv: 'Datorunderbarn' },
    { en: 'Nerd Brain', sv: 'Nördhjärna' },
    { en: 'Renaissance Sim', sv: 'Renässanssim' },
    { en: 'Academic', sv: 'Akademiker' },
    { en: 'Archaeology Scholar', sv: 'Arkeologiforskare' }
  ],
  'Popularitet': [
    { en: 'Friend of the World', sv: 'Världens vän' },
    { en: 'Party Animal', sv: 'Festdjur' },
    { en: 'Joke Star', sv: 'Skämtstjärna' },
    { en: 'World-Famous Celebrity', sv: 'Världsberömd kändis' },
    { en: 'Leader of the Pack', sv: 'Ledare för flocken' }
  ],
  'Atletisk': [
    { en: 'Bodybuilder', sv: 'Kroppsbyggare' },
    { en: 'Extreme Sports Enthusiast', sv: 'Extremsportentusiast' }
  ],
  'Natur': [
    { en: 'Angler Extraordinaire', sv: 'Extraordinär fiskare' },
    { en: 'Curator', sv: 'Kurator' },
    { en: 'Jungle Explorer', sv: 'Djungelutforskare' },
    { en: 'Beach Life', sv: 'Strandliv' }
  ],
  'Mat & Dryck': [
    { en: 'Grilled Cheese', sv: 'Grillad ost' }
  ],
  'Deviancy': [
    { en: 'Chief of Mischief', sv: 'Busens mästare' },
    { en: 'Public Enemy', sv: 'Allmänhetens fiende' }
  ]
}

// Careers
export const CAREERS = [
  { en: 'Unemployed', sv: 'Arbetslös' },
  { en: 'Astronaut', sv: 'Astronaut' },
  { en: 'Athlete', sv: 'Idrottare' },
  { en: 'Business', sv: 'Affärsman' },
  { en: 'Criminal', sv: 'Kriminell' },
  { en: 'Critic', sv: 'Kritiker' },
  { en: 'Culinary', sv: 'Kulinarisk' },
  { en: 'Detective', sv: 'Detektiv' },
  { en: 'Doctor', sv: 'Läkare' },
  { en: 'Entertainer', sv: 'Underhållare' },
  { en: 'Gardener', sv: 'Trädgårdsmästare' },
  { en: 'Journalist', sv: 'Journalist' },
  { en: 'Military', sv: 'Militär' },
  { en: 'Painter', sv: 'Målare' },
  { en: 'Politician', sv: 'Politiker' },
  { en: 'Scientist', sv: 'Vetenskapsman' },
  { en: 'Secret Agent', sv: 'Hemlig agent' },
  { en: 'Social Media', sv: 'Sociala medier' },
  { en: 'Style Influencer', sv: 'Stilinfluencer' },
  { en: 'Tech Guru', sv: 'Teknikguru' },
  { en: 'Writer', sv: 'Författare' },
  { en: 'Actor', sv: 'Skådespelare' },
  { en: 'Conservationist', sv: 'Naturvårdare' },
  { en: 'Civil Designer', sv: 'Stadsplanerare' },
  { en: 'Education', sv: 'Lärare' },
  { en: 'Engineer', sv: 'Ingenjör' },
  { en: 'Law', sv: 'Jurist' },
  { en: 'Freelancer', sv: 'Frilansare' },
  { en: 'Salaryperson', sv: 'Kontorsarbetare' }
]

// Skills
export const SKILLS = [
  { en: 'Acting', sv: 'Skådespeleri', maxLevel: 10 },
  { en: 'Archaeology', sv: 'Arkeologi', maxLevel: 10 },
  { en: 'Baking', sv: 'Bakning', maxLevel: 10 },
  { en: 'Charisma', sv: 'Karisma', maxLevel: 10 },
  { en: 'Comedy', sv: 'Komedi', maxLevel: 10 },
  { en: 'Cooking', sv: 'Matlagning', maxLevel: 10 },
  { en: 'Dancing', sv: 'Dans', maxLevel: 10 },
  { en: 'DJ Mixing', sv: 'DJ-mixning', maxLevel: 10 },
  { en: 'Fabrication', sv: 'Tillverkning', maxLevel: 10 },
  { en: 'Fishing', sv: 'Fiske', maxLevel: 10 },
  { en: 'Fitness', sv: 'Fitness', maxLevel: 10 },
  { en: 'Flower Arranging', sv: 'Blomsterarrangemang', maxLevel: 10 },
  { en: 'Gardening', sv: 'Trädgårdsarbete', maxLevel: 10 },
  { en: 'Gourmet Cooking', sv: 'Gourmetmatlagning', maxLevel: 10 },
  { en: 'Guitar', sv: 'Gitarr', maxLevel: 10 },
  { en: 'Handiness', sv: 'Händighet', maxLevel: 10 },
  { en: 'Herbalism', sv: 'Örtlära', maxLevel: 10 },
  { en: 'Juice Fizzing', sv: 'Juiceblandning', maxLevel: 10 },
  { en: 'Knitting', sv: 'Stickning', maxLevel: 10 },
  { en: 'Logic', sv: 'Logik', maxLevel: 10 },
  { en: 'Media Production', sv: 'Medieproduktion', maxLevel: 10 },
  { en: 'Mischief', sv: 'Rackartyg', maxLevel: 10 },
  { en: 'Mixology', sv: 'Mixologi', maxLevel: 10 },
  { en: 'Painting', sv: 'Målning', maxLevel: 10 },
  { en: 'Parenting', sv: 'Föräldraskap', maxLevel: 10 },
  { en: 'Photography', sv: 'Fotografering', maxLevel: 10 },
  { en: 'Piano', sv: 'Piano', maxLevel: 10 },
  { en: 'Pipe Organ', sv: 'Piporgel', maxLevel: 10 },
  { en: 'Programming', sv: 'Programmering', maxLevel: 10 },
  { en: 'Research and Debate', sv: 'Forskning och debatt', maxLevel: 10 },
  { en: 'Robotics', sv: 'Robotik', maxLevel: 10 },
  { en: 'Rock Climbing', sv: 'Klättring', maxLevel: 10 },
  { en: 'Rocket Science', sv: 'Raketvetenskap', maxLevel: 10 },
  { en: 'Selvadoradian Culture', sv: 'Selvadoradisk kultur', maxLevel: 5 },
  { en: 'Singing', sv: 'Sång', maxLevel: 10 },
  { en: 'Skiing', sv: 'Skidåkning', maxLevel: 10 },
  { en: 'Snowboarding', sv: 'Snowboard', maxLevel: 10 },
  { en: 'Vampire Lore', sv: 'Vampyrlära', maxLevel: 15 },
  { en: 'Veterinarian', sv: 'Veterinär', maxLevel: 10 },
  { en: 'Video Gaming', sv: 'Videospel', maxLevel: 10 },
  { en: 'Violin', sv: 'Violin', maxLevel: 10 },
  { en: 'Wellness', sv: 'Välmående', maxLevel: 10 },
  { en: 'Writing', sv: 'Skrivande', maxLevel: 10 }
]

// Age categories
export const AGES = [
  { en: 'Baby', sv: 'Baby' },
  { en: 'Infant', sv: 'Spädbarn' },
  { en: 'Toddler', sv: 'Toddler' },
  { en: 'Child', sv: 'Barn' },
  { en: 'Teen', sv: 'Tonåring' },
  { en: 'Young Adult', sv: 'Ung vuxen' },
  { en: 'Adult', sv: 'Vuxen' },
  { en: 'Elder', sv: 'Äldre' }
]

// Helper functions for easy access
export function getAllTraitNames() {
  return TRAITS.map(t => t.en).concat(TRAITS.map(t => t.sv))
}

export function getAllAspirationNames() {
  const names = []
  for (const category of Object.values(ASPIRATIONS)) {
    for (const asp of category) {
      names.push(asp.en, asp.sv)
    }
  }
  return names
}

export function getAllCareerNames() {
  return CAREERS.map(c => c.en).concat(CAREERS.map(c => c.sv))
}

export function getAllSkillNames() {
  return SKILLS.map(s => s.en).concat(SKILLS.map(s => s.sv))
}

export function getAllAgeNames() {
  return AGES.map(a => a.en).concat(AGES.map(a => a.sv))
}

// Convert English to Swedish
export function traitToSwedish(englishTrait) {
  const trait = TRAITS.find(t => t.en.toLowerCase() === englishTrait.toLowerCase())
  return trait ? trait.sv : englishTrait
}

export function aspirationToSwedish(englishAspiration) {
  for (const category of Object.values(ASPIRATIONS)) {
    const asp = category.find(a => a.en.toLowerCase() === englishAspiration.toLowerCase())
    if (asp) return asp.sv
  }
  return englishAspiration
}

export function careerToSwedish(englishCareer) {
  const career = CAREERS.find(c => c.en.toLowerCase() === englishCareer.toLowerCase())
  return career ? career.sv : englishCareer
}

export function skillToSwedish(englishSkill) {
  const skill = SKILLS.find(s => s.en.toLowerCase() === englishSkill.toLowerCase())
  return skill ? skill.sv : englishSkill
}

export function ageToSwedish(englishAge) {
  const age = AGES.find(a => a.en.toLowerCase() === englishAge.toLowerCase())
  return age ? age.sv : englishAge
}

// Get all traits as simple array (for form select options)
export function getTraitOptions() {
  return TRAITS.map(t => t.sv).sort()
}

// Get aspirations grouped by category (for form select options)
export function getAspirationOptions() {
  const options = {}
  for (const [category, aspirations] of Object.entries(ASPIRATIONS)) {
    options[category] = aspirations.map(a => a.sv)
  }
  return options
}

// Get careers as simple array
export function getCareerOptions() {
  return CAREERS.map(c => c.sv).sort()
}

// Get skills as simple array
export function getSkillOptions() {
  return SKILLS.map(s => s.sv).sort()
}

// Get ages as simple array
export function getAgeOptions() {
  return AGES.map(a => a.sv)
}
