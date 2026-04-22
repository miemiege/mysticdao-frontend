export interface DirectionInfo {
  chinese: string;
  trigram: string;
  trigramChar: string;
  element: string;
  meaning: string;
  colors: string[];
  numbers: number[];
  shapes: string[];
  advice: string;
  color: string;
}

export const directionData: Record<string, DirectionInfo> = {
  north: {
    chinese: '北',
    trigram: 'Kan',
    trigramChar: '坎',
    element: 'Water',
    meaning: 'Career & Life Path',
    colors: ['Black', 'Deep Blue'],
    numbers: [1, 6],
    shapes: ['Wavy', 'Flowing'],
    advice: 'Place a small water feature or aquarium in the north to boost career energy. Dark blue and black colors enhance this area.',
    color: '#4a7ab8',
  },
  northeast: {
    chinese: '东北',
    trigram: 'Gen',
    trigramChar: '艮',
    element: 'Earth',
    meaning: 'Knowledge & Wisdom',
    colors: ['Yellow', 'Brown'],
    numbers: [2, 8],
    shapes: ['Square', 'Flat'],
    advice: 'A bookshelf or study area in the northeast supports learning. Use earthy tones and ceramics.',
    color: '#c8a45c',
  },
  east: {
    chinese: '东',
    trigram: 'Zhen',
    trigramChar: '震',
    element: 'Wood',
    meaning: 'Family & Health',
    colors: ['Green', 'Teal'],
    numbers: [3, 4],
    shapes: ['Tall', 'Column'],
    advice: 'Place healthy plants in the east to strengthen family bonds and vitality. Wooden furniture enhances this area.',
    color: '#4a9b7f',
  },
  southeast: {
    chinese: '东南',
    trigram: 'Xun',
    trigramChar: '巽',
    element: 'Wood',
    meaning: 'Wealth & Abundance',
    colors: ['Green', 'Purple'],
    numbers: [3, 4],
    shapes: ['Tall', 'Column'],
    advice: 'A healthy plant or small water feature with flowing water activates wealth energy. Keep this area clean and clutter-free.',
    color: '#4a9b7f',
  },
  south: {
    chinese: '南',
    trigram: 'Li',
    trigramChar: '离',
    element: 'Fire',
    meaning: 'Reputation & Fame',
    colors: ['Red', 'Orange'],
    numbers: [9],
    shapes: ['Triangular', 'Pointed'],
    advice: 'Decorate with red accents or place awards/certificates in the south. Good lighting, especially natural light, strengthens this area.',
    color: '#c84a3d',
  },
  southwest: {
    chinese: '西南',
    trigram: 'Kun',
    trigramChar: '坤',
    element: 'Earth',
    meaning: 'Love & Relationships',
    colors: ['Pink', 'Yellow'],
    numbers: [2, 8],
    shapes: ['Square', 'Flat'],
    advice: 'Pairs of objects, romantic artwork, or crystals in the southwest nurture love energy. Avoid single or solitary items.',
    color: '#c8a45c',
  },
  west: {
    chinese: '西',
    trigram: 'Dui',
    trigramChar: '兑',
    element: 'Metal',
    meaning: 'Children & Creativity',
    colors: ['White', 'Gold'],
    numbers: [6, 7],
    shapes: ['Round', 'Curved'],
    advice: 'Metal wind chimes, white decor, or creative supplies in the west support children and artistic expression.',
    color: '#d1ccc4',
  },
  northwest: {
    chinese: '西北',
    trigram: 'Qian',
    trigramChar: '乾',
    element: 'Metal',
    meaning: 'Helpful People & Travel',
    colors: ['Silver', 'White'],
    numbers: [6, 7],
    shapes: ['Round', 'Curved'],
    advice: 'Metal objects, photos of mentors, or travel memorabilia in the northwest attract beneficial connections and opportunities.',
    color: '#d1ccc4',
  },
};

export const directions = [
  { key: 'north', label: 'N', angle: 0 },
  { key: 'northeast', label: 'NE', angle: 45 },
  { key: 'east', label: 'E', angle: 90 },
  { key: 'southeast', label: 'SE', angle: 135 },
  { key: 'south', label: 'S', angle: 180 },
  { key: 'southwest', label: 'SW', angle: 225 },
  { key: 'west', label: 'W', angle: 270 },
  { key: 'northwest', label: 'NW', angle: 315 },
];

export const roomTypes = [
  'Living Room',
  'Bedroom',
  'Office',
  'Kitchen',
  'Entrance',
];

export interface RoomAdvice {
  tips: string[];
  elementFocus: string;
}

export const roomAdvice: Record<string, Record<string, RoomAdvice>> = {
  'Living Room': {
    north: { tips: ['Place a mirror on the north wall', 'Use deep blue curtains', 'Add a small tabletop fountain'], elementFocus: 'Water' },
    northeast: { tips: ['Create a reading nook', 'Display books and knowledge items', 'Use warm yellow lighting'], elementFocus: 'Earth' },
    east: { tips: ['Add tall plants near windows', 'Use wooden furniture', 'Hang family photos'], elementFocus: 'Wood' },
    southeast: { tips: ['Place a money plant', 'Keep windows clean for energy flow', 'Use purple accent pillows'], elementFocus: 'Wood' },
    south: { tips: ['Install warm lighting', 'Display artwork or achievements', 'Use red decorative accents'], elementFocus: 'Fire' },
    southwest: { tips: ['Arrange seating in pairs', 'Hang romantic artwork', 'Use pink or earth-tone textiles'], elementFocus: 'Earth' },
    west: { tips: ['Add metal picture frames', 'Create a play area for children', 'Use white or silver decor'], elementFocus: 'Metal' },
    northwest: { tips: ['Place a metal bowl', 'Display photos of helpful people', 'Use grey or silver accents'], elementFocus: 'Metal' },
  },
  Bedroom: {
    north: { tips: ['Place the headboard against north wall', 'Use dark blue bedding', 'Avoid water features'], elementFocus: 'Water' },
    northeast: { tips: ['Place a study desk', 'Use warm lamps', 'Keep the area organized'], elementFocus: 'Earth' },
    east: { tips: ['Use wooden bed frame', 'Add plants outside the bedroom', 'Choose green textiles'], elementFocus: 'Wood' },
    southeast: { tips: ['Place wealth symbols discreetly', 'Use green plants', 'Keep the space uncluttered'], elementFocus: 'Wood' },
    south: { tips: ['Use soft red accents', 'Install dimmable lights', 'Place a small lamp'], elementFocus: 'Fire' },
    southwest: { tips: ['Position bed for partnership energy', 'Use pairs of nightstands', 'Add romantic touches'], elementFocus: 'Earth' },
    west: { tips: ['Use metal bed frame', 'Hang creative artwork', 'Add white bedding'], elementFocus: 'Metal' },
    northwest: { tips: ['Display mentor photos', 'Use silver accents', 'Keep area tidy'], elementFocus: 'Metal' },
  },
  Office: {
    north: { tips: ['Position desk to face north', 'Use black desk accessories', 'Place water feature nearby'], elementFocus: 'Water' },
    northeast: { tips: ['Create a knowledge corner', 'Display certificates', 'Use warm lighting'], elementFocus: 'Earth' },
    east: { tips: ['Add tall plants', 'Use wooden desk', 'Grow a small bamboo'], elementFocus: 'Wood' },
    southeast: { tips: ['Place a jade plant', 'Keep the area clean', 'Use purple accents'], elementFocus: 'Wood' },
    south: { tips: ['Use red desk accessories', 'Install good lighting', 'Display achievements'], elementFocus: 'Fire' },
    southwest: { tips: ['Add crystals', 'Use warm earth tones', 'Balance with partnership items'], elementFocus: 'Earth' },
    west: { tips: ['Use metal desk organizer', 'Display creative work', 'Add white decor'], elementFocus: 'Metal' },
    northwest: { tips: ['Place a metal paperweight', 'Display mentor or travel photos', 'Use grey tones'], elementFocus: 'Metal' },
  },
  Kitchen: {
    north: { tips: ['Keep sink area clean', 'Fix any leaks promptly', 'Use blue dish towels'], elementFocus: 'Water' },
    northeast: { tips: ['Store cookbooks here', 'Use ceramic containers', 'Add warm lighting'], elementFocus: 'Earth' },
    east: { tips: ['Place herbs on windowsill', 'Use wooden cutting boards', 'Grow fresh plants'], elementFocus: 'Wood' },
    southeast: { tips: ['This is the wealth corner', 'Keep it spotless', 'Add a bowl of fresh fruit'], elementFocus: 'Wood' },
    south: { tips: ['Stove represents fire', 'Keep stove clean', 'Use red accents carefully'], elementFocus: 'Fire' },
    southwest: { tips: ['Round dining table is best', 'Use warm colors', 'Share meals here'], elementFocus: 'Earth' },
    west: { tips: ['Use metal cookware', 'Add white tile backsplash', 'Display round plates'], elementFocus: 'Metal' },
    northwest: { tips: ['Store wine or beverages', 'Use metal storage', 'Keep organized'], elementFocus: 'Metal' },
  },
  Entrance: {
    north: { tips: ['Welcome water feature', 'Use dark blue doormat', 'Keep pathway clear'], elementFocus: 'Water' },
    northeast: { tips: ['Add a bookshelf or console', 'Use warm welcoming light', 'Place a knowledge symbol'], elementFocus: 'Earth' },
    east: { tips: ['Add tall plants flanking door', 'Use wooden door mat', 'Hang a wind chime'], elementFocus: 'Wood' },
    southeast: { tips: ['Place a plant by entrance', 'Use green accents', 'Keep area prosperous-looking'], elementFocus: 'Wood' },
    south: { tips: ['Good lighting essential', 'Use red accents sparingly', 'Make entrance inviting'], elementFocus: 'Fire' },
    southwest: { tips: ['Pairs of plants or lanterns', 'Warm welcoming colors', 'Romantic touches'], elementFocus: 'Earth' },
    west: { tips: ['Metal door knocker', 'White or silver accents', 'Round decorations'], elementFocus: 'Metal' },
    northwest: { tips: ['Metal mailbox', 'Helpful people symbols', 'Keep area pristine'], elementFocus: 'Metal' },
  },
};

export const elementIcons: Record<string, string> = {
  Water: '💧',
  Earth: '⛰️',
  Wood: '🌿',
  Fire: '🔥',
  Metal: '⚪',
};

/**
 * Convert a compass angle (0-360) to a direction key.
 * 0° = North, 90° = East, 180° = South, 270° = West.
 */
export function getDirectionFromAngle(angle: number): string {
  const normalized = ((angle % 360) + 360) % 360;
  const dirs = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
  const idx = Math.round(normalized / 45) % 8;
  return dirs[idx];
}
