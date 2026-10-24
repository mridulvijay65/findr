import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.broadcast.deleteMany();
  await prisma.claim.deleteMany();
  await prisma.item.deleteMany();
  await prisma.lockerStation.deleteMany();
  await prisma.recoveryStory.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const aarav = await prisma.user.create({
    data: {
      id: 'user-aarav',
      name: 'Aarav Verma',
      email: 'aarav.v@campus.edu',
      department: 'Computer Science · 2nd Yr',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdz9ajjOFDIL3XIM5dw-yYh-Bha-8ls7ZBAxiwPqH1CefwquNohcflZZDJ0u4XHwYS8rHY_bMIDcnWP9DXqGD7ksICQSqGD6SAEXrKn_2DIivPE0Lr5Iw1QxJJroaH_-ZQD1atih_2DKLT_ccNShf0S2XGoDurzHDqr6GLFYaqq9OWwQl_olqQlSRhASqzku31T35flkPPyLGSQqgAkdAZa0OO1AXG2F6I8nqGkodBhZswiva7NbUYRg',
      karmaPoints: 420,
      itemsReunited: 8,
      badge: 'Quad Ambassador',
      rank: 4,
    },
  });

  const rahul = await prisma.user.create({
    data: {
      id: 'user-rahul',
      name: 'Rahul Sharma',
      email: 'rahul.s@campus.edu',
      department: 'Electrical Engineering · 3rd Yr',
      avatar: 'https://picsum.photos/seed/avatar-rahul/120/120',
      karmaPoints: 1450,
      itemsReunited: 28,
      badge: 'Campus Legend',
      rank: 1,
    },
  });

  const maya = await prisma.user.create({
    data: {
      id: 'user-maya',
      name: 'Maya Kulkarni',
      email: 'maya.k@campus.edu',
      department: 'Computer Science · 4th Yr',
      avatar: 'https://picsum.photos/seed/avatar-maya/120/120',
      karmaPoints: 1120,
      itemsReunited: 22,
      badge: 'Master Re-uniter',
      rank: 2,
    },
  });

  const profRao = await prisma.user.create({
    data: {
      id: 'user-rao',
      name: 'Prof. S. Rao',
      email: 'rao@campus.edu',
      department: 'Faculty · Applied Physics',
      avatar: 'https://picsum.photos/seed/avatar-rao/120/120',
      karmaPoints: 980,
      itemsReunited: 19,
      badge: 'Faculty Guardian',
      rank: 3,
    },
  });

  const tanya = await prisma.user.create({
    data: {
      id: 'user-tanya',
      name: 'Tanya Sengupta',
      email: 'tanya.s@campus.edu',
      department: 'Design & Media · 2nd Yr',
      avatar: 'https://picsum.photos/seed/avatar-tanya/120/120',
      karmaPoints: 375,
      itemsReunited: 7,
      badge: 'Swift Scout',
      rank: 5,
    },
  });

  const martinez = await prisma.user.create({
    data: {
      id: 'user-martinez',
      name: 'Officer Martinez',
      email: 'martinez@campus.edu',
      department: 'Campus Security Unit Alpha',
      avatar: 'https://picsum.photos/seed/avatar-martinez/120/120',
      karmaPoints: 1720,
      itemsReunited: 34,
      badge: 'Campus Guardian',
      rank: 6,
    },
  });

  // Generic reporters
  const libraryAttendant = await prisma.user.create({
    data: {
      id: 'user-lib-desk',
      name: 'Library Desk Attendant',
      email: 'lib.desk@campus.edu',
      department: 'Central Library Staff',
      karmaPoints: 200,
      itemsReunited: 15,
      badge: 'Staff Helper',
      rank: 10,
    },
  });

  const ananya = await prisma.user.create({
    data: {
      id: 'user-ananya',
      name: 'Ananya S.',
      email: 'ananya.s@campus.edu',
      department: 'Biotech · 3rd Yr',
      karmaPoints: 50,
      itemsReunited: 2,
      badge: 'Newcomer',
      rank: 20,
    },
  });

  const devPatel = await prisma.user.create({
    data: {
      id: 'user-dev',
      name: 'Dev Patel',
      email: 'dev.p@campus.edu',
      department: 'ECE Dept · 3rd Yr',
      karmaPoints: 100,
      itemsReunited: 4,
      badge: 'Helper',
      rank: 15,
    },
  });

  const taMaya = await prisma.user.create({
    data: {
      id: 'user-ta-maya',
      name: 'TA Maya',
      email: 'ta.maya@campus.edu',
      department: 'Mathematics TA',
      karmaPoints: 150,
      itemsReunited: 6,
      badge: 'Mentor',
      rank: 12,
    },
  });

  const nescafeCashier = await prisma.user.create({
    data: {
      id: 'user-nescafe',
      name: 'Nescafe Cashier',
      email: 'nescafe@campus.edu',
      department: 'Food & Beverage Staff',
      karmaPoints: 80,
      itemsReunited: 3,
      badge: 'Helper',
      rank: 18,
    },
  });

  const samBarista = await prisma.user.create({
    data: {
      id: 'user-sam',
      name: 'Sam Barista',
      email: 'sam.b@campus.edu',
      department: 'Food & Beverage Staff',
      karmaPoints: 60,
      itemsReunited: 2,
      badge: 'Newcomer',
      rank: 19,
    },
  });

  const coachKevin = await prisma.user.create({
    data: {
      id: 'user-coach',
      name: 'Coach Kevin',
      email: 'kevin@campus.edu',
      department: 'Athletics Department',
      karmaPoints: 300,
      itemsReunited: 10,
      badge: 'Sports Guardian',
      rank: 7,
    },
  });

  const priya = await prisma.user.create({
    data: {
      id: 'user-priya',
      name: 'Priya N.',
      email: 'priya.n@campus.edu',
      department: 'Architecture · 2nd Yr',
      karmaPoints: 30,
      itemsReunited: 1,
      badge: 'Newcomer',
      rank: 25,
    },
  });

  console.log('✅ Users created');

  // Create items
  const items = await Promise.all([
    prisma.item.create({
      data: {
        id: 'item-1',
        title: 'Sony WH-1000XM4',
        category: 'Electronics',
        status: 'Lost',
        location: 'Desk 44B, 3rd Floor Silent Wing',
        sector: 'Central Library & Cafes',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqKTepxaTMEzuPBgr7pZgPqRmyuzWQDPxRR0eUmNaxkm2k3YATWBXaCAa9SFbwywVBU-oLvc6tq3I16nCfk5TCQ9BBEWK7OAOJkX6ZIRVLwhhfsAs29fRTNKCg7cukQ9QUJZxDlIxoaN2rExePqIJocCOjdlctV_7fyOrgABL8jOzwz6PLA8M09KFNVjkWXx3hXUD_WotBBo4eFjcRHuyUHbhOPGny7eTDSQgHWvi9S6zTJWNY-4x5Pg',
        description: 'Black over-ear headphones in protective hard case with USB-C cable inside. Left during study session for CS301.',
        karmaReward: 60,
        reporterId: aarav.id,
        verificationQuestion: 'What color is the zipper pull tag on the case?',
      },
    }),
    prisma.item.create({
      data: {
        id: 'item-2',
        title: 'Campus ID & Lanyard',
        category: 'IDs & Cards',
        status: 'In Locker',
        location: 'Circulation Desk / Ground Floor',
        sector: 'Central Library & Cafes',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0gobxgF_plpWzMhPlT3t-w8vZ8obKxP80iCeHHK-KlFXkuwVKfjr6BtKiF_ZncaU0H7NvhISuwgpfc7veG7gGT_QrXG5okPvaKT7Tkt05aDN7FUYnCI7zL3897vdWpDd1vGYj0PelfubmKQOPaCtpZg2VWjSpyv2hOoz20VWN6snWYZkzep4ICp0Zvvrr1LhzWVuSUb_yQnKXNGaFOSbA0SEW4gbBmORKl6KabyKBqOuF0mN3LjEHwg',
        description: 'Blue university lanyard with RFID contactless smart card belonging to Mechanical Engineering student.',
        lockerNumber: 'Safe Locker #02',
        lockerOtp: '492810',
        karmaReward: 40,
        reporterId: libraryAttendant.id,
        verificationQuestion: 'What is the student ID ending 3 digits?',
      },
    }),
    prisma.item.create({
      data: {
        id: 'item-3',
        title: 'Nalgene 1L Bottle',
        category: 'Bottles & Tumblers',
        status: 'Lost',
        location: 'Reference Stacks Section C',
        sector: 'Central Library & Cafes',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEniIu2qMufZ8WJGVMwE08MsdBcr_6LsZGu1Cdke4NZFdavvm92NPs4bYp8FVv0WB2GdTxhVIfROZ1uqdbMAt9nQWcUE_ehI0WhNRfOtHRfUKF0xoMRkHsIqB33hx0ob_bPJX6cQT9eIjn8hwhZg9jr6TKYTsRyIeKh4-1VFiiS_tUCQUIwPMOehDnno4yFlLq8dzufLltqeEUSt1SjVcKbv86rsV9I4NwMpclCaddt435caWDfnRJhQ',
        description: 'Clear wide-mouth bottle decorated with colorful Linux and Open Source club stickers.',
        karmaReward: 25,
        reporterId: ananya.id,
        verificationQuestion: 'Name two stickers on the front facing side.',
      },
    }),
    prisma.item.create({
      data: {
        id: 'item-4',
        title: '65W Type-C Laptop Charger',
        category: 'Electronics',
        status: 'Awaiting Owner',
        location: 'Lab 204 (Bench 12)',
        sector: 'Engineering Cluster',
        image: 'https://picsum.photos/seed/charger-65w/400/300',
        description: 'Matte white GaN charging brick with braided 2-meter USB-C to USB-C cable. Left plugged under the power strip.',
        karmaReward: 30,
        reporterId: devPatel.id,
        verificationQuestion: 'Brand logo on the power adapter face.',
      },
    }),
    prisma.item.create({
      data: {
        id: 'item-5',
        title: 'Casio FX-991EX Classwiz',
        category: 'Stationery & Books',
        status: 'In Locker',
        location: 'Hall 3B · Handed to TA Maya',
        sector: 'Engineering Cluster',
        image: 'https://picsum.photos/seed/casio-calc/400/300',
        description: 'Scientific calculator with slide-on plastic protective lid. Has small yellow masking tape with initials "R.M."',
        lockerNumber: 'Safe Locker #04',
        lockerOtp: '318754',
        karmaReward: 35,
        reporterId: taMaya.id,
        verificationQuestion: 'What are the initials written on the tape?',
      },
    }),
    prisma.item.create({
      data: {
        id: 'item-6',
        title: 'Bike Lock Keys on Red Cord',
        category: 'Keys & Tags',
        status: 'Awaiting Owner',
        location: 'Corner High Table #4',
        sector: 'Central Library & Cafes',
        image: 'https://picsum.photos/seed/keys-red/400/300',
        description: 'Pair of brass Kryptonite U-lock keys attached to a red climbing accessory cord with aluminum mini carabiner.',
        karmaReward: 30,
        reporterId: nescafeCashier.id,
        verificationQuestion: 'What color is the mini carabiner?',
      },
    }),
    prisma.item.create({
      data: {
        id: 'item-7',
        title: 'Hydro Flask 24oz Sage Green',
        category: 'Bottles & Tumblers',
        status: 'Awaiting Owner',
        location: 'Under booth couch · Handed to Barista',
        sector: 'Central Library & Cafes',
        image: 'https://picsum.photos/seed/hydroflask-sage/400/300',
        description: 'Light sage green bottle with silicone boot at the base and straw lid. Very minimal scratch near the rim.',
        karmaReward: 25,
        reporterId: samBarista.id,
        verificationQuestion: 'Color of the silicone protective boot at base.',
      },
    }),
    prisma.item.create({
      data: {
        id: 'item-8',
        title: 'Fitbit Charge 5 (Black band)',
        category: 'Wearables & Apparel',
        status: 'In Locker',
        location: 'Locker Room Bench · Safe Locker #08',
        sector: 'Sports Complex',
        image: 'https://picsum.photos/seed/fitbit-charge/400/300',
        description: 'Black fitness tracker with silicone sports strap. Found by athletic trainer near Bench 7.',
        lockerNumber: 'Safe Locker #08',
        lockerOtp: '849201',
        karmaReward: 50,
        reporterId: coachKevin.id,
        verificationQuestion: 'Describe the watch face background theme.',
      },
    }),
    prisma.item.create({
      data: {
        id: 'item-9',
        title: 'North Face Borealis Backpack',
        category: 'Wearables & Apparel',
        status: 'Lost',
        location: 'Outdoor Amphitheater Quad',
        sector: 'North Academic Quad',
        image: 'https://picsum.photos/seed/backpack-borealis/400/300',
        description: 'Grey and black daypack containing spiral notebooks, pencil case, and rain jacket.',
        karmaReward: 45,
        reporterId: priya.id,
        verificationQuestion: 'What color is the spiral notebook cover inside?',
      },
    }),
  ]);

  console.log(`✅ ${items.length} items created`);

  // Create locker stations
  const lockers = await Promise.all([
    prisma.lockerStation.create({
      data: {
        id: 'loc-quad',
        name: 'Safe Handover Hub #01 (Central Quad Vault)',
        location: 'Central Library Quad Arcade (Opposite Gate B)',
        totalLockers: 8,
        availableLockers: 4,
        status: 'Online',
        supportedAccess: '24/7 RFID Tap & 6-Digit OTP',
        activeItem: 'Campus ID & Lanyard',
        sampleOtp: '492810',
      },
    }),
    prisma.lockerStation.create({
      data: {
        id: 'loc-eng',
        name: 'Safe Handover Hub #02 (Engineering Cluster)',
        location: 'Block A Foyer, Next to Student Council Board',
        totalLockers: 6,
        availableLockers: 2,
        status: 'Online',
        supportedAccess: 'Student RFID & Dynamic OTP',
        activeItem: 'Casio FX-991EX Classwiz',
        sampleOtp: '318754',
      },
    }),
    prisma.lockerStation.create({
      data: {
        id: 'loc-arena',
        name: 'Safe Handover Hub #03 (Campus Arena & Gym)',
        location: 'Main Pavilion Entry Lobby, Desk Area',
        totalLockers: 6,
        availableLockers: 3,
        status: 'Online',
        supportedAccess: 'Smart Pin & Security Desk Dual-Key',
        activeItem: 'Fitbit Charge 5',
        sampleOtp: '849201',
      },
    }),
    prisma.lockerStation.create({
      data: {
        id: 'loc-hostel',
        name: 'Safe Handover Hub #04 (Hostel Village Commons)',
        location: 'Block C Reception Lounge',
        totalLockers: 8,
        availableLockers: 3,
        status: 'Online',
        supportedAccess: 'Hostel Card & Peer OTP Handover',
        activeItem: 'Dorm Keys & Bike Lock',
        sampleOtp: '761290',
      },
    }),
  ]);

  console.log(`✅ ${lockers.length} locker stations created`);

  // Create recovery stories
  const stories = await Promise.all([
    prisma.recoveryStory.create({
      data: {
        itemTitle: 'Dorm Keys (3 Blue Tags)',
        quote: 'Got my dorm keys back in 15 mins! Rahul dropped them at Locker #04. Huge lifesaver before finals!',
        handoverBy: 'Rahul S.',
        karma: 50,
      },
    }),
    prisma.recoveryStory.create({
      data: {
        itemTitle: 'Hydro Flask 32oz Mustard',
        quote: 'Left it at Nescafe outdoor table. Security desk verified my stickers in under 3 minutes.',
        handoverBy: 'Maya K.',
        karma: 35,
      },
    }),
    prisma.recoveryStory.create({
      data: {
        itemTitle: 'Casio Graphing Calculator',
        quote: 'Found inside Lecture Hall 3B. Returned right into my hands before the 2 PM exam!',
        handoverBy: 'Prof. Rao',
        karma: 100,
      },
    }),
    prisma.recoveryStory.create({
      data: {
        itemTitle: 'MacBook Air M2 Space Grey',
        quote: 'Locker #01 notification alerted me right as I walked past the Quad. Incredible campus mesh system!',
        handoverBy: 'Officer Martinez',
        karma: 120,
      },
    }),
  ]);

  console.log(`✅ ${stories.length} recovery stories created`);

  // Create notifications for Aarav
  await Promise.all([
    prisma.notification.create({
      data: {
        title: 'Match Alert: Sony Headphones',
        description: 'An item matching your search was tagged near 3rd Floor Silent Wing.',
        badge: 'High Match',
        userId: aarav.id,
      },
    }),
    prisma.notification.create({
      data: {
        title: 'Locker OTP Generated',
        description: 'Safe Locker #02 is holding verified Campus ID. Code expires in 6 hours.',
        badge: 'Vault',
        userId: aarav.id,
      },
    }),
    prisma.notification.create({
      data: {
        title: '+50 Good Karma Awarded',
        description: 'Your report helped reunite Priya with her lost graphing calculator!',
        badge: 'Karma',
        userId: aarav.id,
      },
    }),
  ]);

  console.log('✅ Notifications created');
  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
