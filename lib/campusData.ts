export interface CampusItem {
  id: string;
  title: string;
  category: 'Electronics' | 'IDs & Cards' | 'Keys & Tags' | 'Bottles & Tumblers' | 'Stationery & Books' | 'Wearables & Apparel';
  itemType?: 'LOST' | 'FOUND';
  status: 'Lost' | 'In Locker' | 'Awaiting Owner' | 'Claimed' | 'Recovered';
  location: string;
  sector: 'North Academic Quad' | 'Engineering Cluster' | 'Sports Complex' | 'Hostel Village' | 'Central Library & Cafes';
  timeAgo: string;
  image: string;
  description: string;
  brand?: string | null;
  color?: string | null;
  lockerNumber?: string;
  lockerOtp?: string;
  karmaReward: number;
  reporter: string;
  reporterId?: string;
  verificationQuestion?: string;
}

export interface RecoveryStory {
  id: string;
  itemTitle: string;
  quote: string;
  timeAgo: string;
  handoverBy: string;
  karma: number;
}

export interface LockerStation {
  id: string;
  name: string;
  location: string;
  totalLockers: number;
  availableLockers: number;
  status: 'Online' | 'Maintenance';
  supportedAccess: string;
  activeItem?: string;
  sampleOtp?: string;
}

export interface KarmaUser {
  rank: number;
  name: string;
  department: string;
  itemsReunited: number;
  karmaPoints: number;
  avatar: string;
  badge: string;
}

export const INITIAL_ITEMS: CampusItem[] = [
  {
    id: 'item-1',
    title: 'Sony WH-1000XM4',
    category: 'Electronics',
    status: 'Lost',
    location: 'Desk 44B, 3rd Floor Silent Wing',
    sector: 'Central Library & Cafes',
    timeAgo: '24m ago',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqKTepxaTMEzuPBgr7pZgPqRmyuzWQDPxRR0eUmNaxkm2k3YATWBXaCAa9SFbwywVBU-oLvc6tq3I16nCfk5TCQ9BBEWK7OAOJkX6ZIRVLwhhfsAs29fRTNKCg7cukQ9QUJZxDlIxoaN2rExePqIJocCOjdlctV_7fyOrgABL8jOzwz6PLA8M09KFNVjkWXx3hXUD_WotBBo4eFjcRHuyUHbhOPGny7eTDSQgHWvi9S6zTJWNY-4x5Pg',
    description: 'Black over-ear headphones in protective hard case with USB-C cable inside. Left during study session for CS301.',
    karmaReward: 60,
    reporter: 'Aarav (CS Dept)',
    verificationQuestion: 'What color is the zipper pull tag on the case?'
  },
  {
    id: 'item-2',
    title: 'Campus ID & Lanyard',
    category: 'IDs & Cards',
    status: 'In Locker',
    location: 'Circulation Desk / Ground Floor',
    sector: 'Central Library & Cafes',
    timeAgo: '1h ago',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0gobxgF_plpWzMhPlT3t-w8vZ8obKxP80iCeHHK-KlFXkuwVKfjr6BtKiF_ZncaU0H7NvhISuwgpfc7veG7gGT_QrXG5okPvaKT7Tkt05aDN7FUYnCI7zL3897vdWpDd1vGYj0PelfubmKQOPaCtpZg2VWjSpyv2hOoz20VWN6snWYZkzep4ICp0Zvvrr1LhzWVuSUb_yQnKXNGaFOSbA0SEW4gbBmORKl6KabyKBqOuF0mN3LjEHwg',
    description: 'Blue university lanyard with RFID contactless smart card belonging to Mechanical Engineering student.',
    lockerNumber: 'Safe Locker #02',
    lockerOtp: '492810',
    karmaReward: 40,
    reporter: 'Library Desk Attendant',
    verificationQuestion: 'What is the student ID ending 3 digits?'
  },
  {
    id: 'item-3',
    title: 'Nalgene 1L Bottle',
    category: 'Bottles & Tumblers',
    status: 'Lost',
    location: 'Reference Stacks Section C',
    sector: 'Central Library & Cafes',
    timeAgo: '3h ago',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEniIu2qMufZ8WJGVMwE08MsdBcr_6LsZGu1Cdke4NZFdavvm92NPs4bYp8FVv0WB2GdTxhVIfROZ1uqdbMAt9nQWcUE_ehI0WhNRfOtHRfUKF0xoMRkHsIqB33hx0ob_bPJX6cQT9eIjn8hwhZg9jr6TKYTsRyIeKh4-1VFiiS_tUCQUIwPMOehDnno4yFlLq8dzufLltqeEUSt1SjVcKbv86rsV9I4NwMpclCaddt435caWDfnRJhQ',
    description: 'Clear wide-mouth bottle decorated with colorful Linux and Open Source club stickers.',
    karmaReward: 25,
    reporter: 'Ananya S. (Biotech)',
    verificationQuestion: 'Name two stickers on the front facing side.'
  },
  {
    id: 'item-4',
    title: '65W Type-C Laptop Charger',
    category: 'Electronics',
    status: 'Awaiting Owner',
    location: 'Lab 204 (Bench 12)',
    sector: 'Engineering Cluster',
    timeAgo: '45m ago',
    image: 'https://picsum.photos/seed/charger-65w/400/300',
    description: 'Matte white GaN charging brick with braided 2-meter USB-C to USB-C cable. Left plugged under the power strip.',
    karmaReward: 30,
    reporter: 'Dev Patel (ECE Dept)',
    verificationQuestion: 'Brand logo on the power adapter face.'
  },
  {
    id: 'item-5',
    title: 'Casio FX-991EX Classwiz',
    category: 'Stationery & Books',
    status: 'In Locker',
    location: 'Hall 3B · Handed to TA Maya',
    sector: 'Engineering Cluster',
    timeAgo: '2h ago',
    image: 'https://picsum.photos/seed/casio-calc/400/300',
    description: 'Scientific calculator with slide-on plastic protective lid. Has small yellow masking tape with initials "R.M."',
    lockerNumber: 'Safe Locker #04',
    lockerOtp: '318754',
    karmaReward: 35,
    reporter: 'TA Maya (Mathematics)',
    verificationQuestion: 'What are the initials written on the tape?'
  },
  {
    id: 'item-6',
    title: 'Bike Lock Keys on Red Cord',
    category: 'Keys & Tags',
    status: 'Awaiting Owner',
    location: 'Corner High Table #4',
    sector: 'Central Library & Cafes',
    timeAgo: '30m ago',
    image: 'https://picsum.photos/seed/keys-red/400/300',
    description: 'Pair of brass Kryptonite U-lock keys attached to a red climbing accessory cord with aluminum mini carabiner.',
    karmaReward: 30,
    reporter: 'Nescafe Cashier',
    verificationQuestion: 'What color is the mini carabiner?'
  },
  {
    id: 'item-7',
    title: 'Hydro Flask 24oz Sage Green',
    category: 'Bottles & Tumblers',
    status: 'Awaiting Owner',
    location: 'Under booth couch · Handed to Barista',
    sector: 'Central Library & Cafes',
    timeAgo: '1h 15m ago',
    image: 'https://picsum.photos/seed/hydroflask-sage/400/300',
    description: 'Light sage green bottle with silicone boot at the base and straw lid. Very minimal scratch near the rim.',
    karmaReward: 25,
    reporter: 'Sam Barista',
    verificationQuestion: 'Color of the silicone protective boot at base.'
  },
  {
    id: 'item-8',
    title: 'Fitbit Charge 5 (Black band)',
    category: 'Wearables & Apparel',
    status: 'In Locker',
    location: 'Locker Room Bench · Safe Locker #08',
    sector: 'Sports Complex',
    timeAgo: '3h ago',
    image: 'https://picsum.photos/seed/fitbit-charge/400/300',
    description: 'Black fitness tracker with silicone sports strap. Found by athletic trainer near Bench 7.',
    lockerNumber: 'Safe Locker #08',
    lockerOtp: '849201',
    karmaReward: 50,
    reporter: 'Coach Kevin (Athletics)',
    verificationQuestion: 'Describe the watch face background theme.'
  },
  {
    id: 'item-9',
    title: 'North Face Borealis Backpack',
    category: 'Wearables & Apparel',
    status: 'Lost',
    location: 'Outdoor Amphitheater Quad',
    sector: 'North Academic Quad',
    timeAgo: '4h ago',
    image: 'https://picsum.photos/seed/backpack-borealis/400/300',
    description: 'Grey and black daypack containing spiral notebooks, pencil case, and rain jacket.',
    karmaReward: 45,
    reporter: 'Priya N. (Architecture)',
    verificationQuestion: 'What color is the spiral notebook cover inside?'
  }
];

export const RECOVERY_STORIES: RecoveryStory[] = [
  {
    id: 'rec-1',
    itemTitle: 'Dorm Keys (3 Blue Tags)',
    quote: 'Got my dorm keys back in 15 mins! Rahul dropped them at Locker #04. Huge lifesaver before finals!',
    timeAgo: '18m ago',
    handoverBy: 'Rahul S.',
    karma: 50
  },
  {
    id: 'rec-2',
    itemTitle: 'Hydro Flask 32oz Mustard',
    quote: 'Left it at Nescafe outdoor table. Security desk verified my stickers in under 3 minutes.',
    timeAgo: '1h ago',
    handoverBy: 'Maya K.',
    karma: 35
  },
  {
    id: 'rec-3',
    itemTitle: 'Casio Graphing Calculator',
    quote: 'Found inside Lecture Hall 3B. Returned right into my hands before the 2 PM exam!',
    timeAgo: '3h ago',
    handoverBy: 'Prof. Rao',
    karma: 100
  },
  {
    id: 'rec-4',
    itemTitle: 'MacBook Air M2 Space Grey',
    quote: 'Locker #01 notification alerted me right as I walked past the Quad. Incredible campus mesh system!',
    timeAgo: '5h ago',
    handoverBy: 'Officer Martinez',
    karma: 120
  }
];

export const LOCKER_STATIONS: LockerStation[] = [
  {
    id: 'loc-quad',
    name: 'Safe Handover Hub #01 (Central Quad Vault)',
    location: 'Central Library Quad Arcade (Opposite Gate B)',
    totalLockers: 8,
    availableLockers: 4,
    status: 'Online',
    supportedAccess: '24/7 RFID Tap & 6-Digit OTP',
    activeItem: 'Campus ID & Lanyard',
    sampleOtp: '492810'
  },
  {
    id: 'loc-eng',
    name: 'Safe Handover Hub #02 (Engineering Cluster)',
    location: 'Block A Foyer, Next to Student Council Board',
    totalLockers: 6,
    availableLockers: 2,
    status: 'Online',
    supportedAccess: 'Student RFID & Dynamic OTP',
    activeItem: 'Casio FX-991EX Classwiz',
    sampleOtp: '318754'
  },
  {
    id: 'loc-arena',
    name: 'Safe Handover Hub #03 (Campus Arena & Gym)',
    location: 'Main Pavilion Entry Lobby, Desk Area',
    totalLockers: 6,
    availableLockers: 3,
    status: 'Online',
    supportedAccess: 'Smart Pin & Security Desk Dual-Key',
    activeItem: 'Fitbit Charge 5',
    sampleOtp: '849201'
  },
  {
    id: 'loc-hostel',
    name: 'Safe Handover Hub #04 (Hostel Village Commons)',
    location: 'Block C Reception Lounge',
    totalLockers: 8,
    availableLockers: 3,
    status: 'Online',
    supportedAccess: 'Hostel Card & Peer OTP Handover',
    activeItem: 'Dorm Keys & Bike Lock',
    sampleOtp: '761290'
  }
];

export const KARMA_LEADERBOARD: KarmaUser[] = [
  {
    rank: 1,
    name: 'Rahul Sharma',
    department: 'Electrical Engineering · 3rd Yr',
    itemsReunited: 28,
    karmaPoints: 1450,
    avatar: 'https://picsum.photos/seed/avatar-rahul/120/120',
    badge: 'Campus Legend'
  },
  {
    rank: 2,
    name: 'Maya Kulkarni',
    department: 'Computer Science · 4th Yr',
    itemsReunited: 22,
    karmaPoints: 1120,
    avatar: 'https://picsum.photos/seed/avatar-maya/120/120',
    badge: 'Master Re-uniter'
  },
  {
    rank: 3,
    name: 'Prof. S. Rao',
    department: 'Faculty · Applied Physics',
    itemsReunited: 19,
    karmaPoints: 980,
    avatar: 'https://picsum.photos/seed/avatar-rao/120/120',
    badge: 'Faculty Guardian'
  },
  {
    rank: 4,
    name: 'Aarav (You)',
    department: 'Computer Science · 2nd Yr',
    itemsReunited: 8,
    karmaPoints: 420,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=faces',
    badge: 'Quad Ambassador'
  },
  {
    rank: 5,
    name: 'Tanya Sengupta',
    department: 'Design & Media · 2nd Yr',
    itemsReunited: 7,
    karmaPoints: 375,
    avatar: 'https://picsum.photos/seed/avatar-tanya/120/120',
    badge: 'Swift Scout'
  },
  {
    rank: 6,
    name: 'Officer Martinez',
    department: 'Campus Security Unit Alpha',
    itemsReunited: 34,
    karmaPoints: 1720,
    avatar: 'https://picsum.photos/seed/avatar-martinez/120/120',
    badge: 'Campus Guardian'
  }
];
