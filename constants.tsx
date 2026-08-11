import { Course, Testimonial, FaqItem } from './types';

/* 
  -----------------------------------------------------------------------
  HOW TO UPDATE IMAGES:
  1. Upload your image to Google Drive.
  2. Right click -> Share -> Copy Link (Ensure access is "Anyone with the link").
  3. Paste the link into the 'imageUrl' field below.
  
  The code will automatically convert Google Drive links to work on the website.
  -----------------------------------------------------------------------
*/

const RAW_COURSES: Course[] = [
  {
    id: '5',
    title: 'V-Ray Photorealism',
    software: 'V-Ray',
    description: 'Turn your SketchUp models into magazine-quality photorealistic images that close deals.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1aHEt_z78tYD_0Cn66DiduAnhwn-o8El8',
    color: 'from-blue-600 to-indigo-500',
    students: '48k',
    price: 49,
    originalPrice: 99,
    learningPoints: [
      'Master realistic sunlight, night lighting & shadows',
      'Create materials that look like real wood, glass & stone',
      'Produce beauty shots that sell €5,000 projects'
    ],
    workflowImpact: 'Sell your design before it exists.'
  },
  {
    id: '1',
    title: 'AutoCAD Mastery',
    software: 'AutoCAD',
    description: 'Draw accurate 2D floor plans for houses and buildings.',
    imageUrl: 'https://drive.google.com/file/d/1fV5bz4JDugh8HxLMJ0fXu5K5sDj3qlSR/view?usp=drive_link',
    color: 'from-red-500 to-red-400',
    students: '42.5k',
    price: 49,
    originalPrice: 99,
    learningPoints: [
      'Draw floor plans and furniture layouts easily',
      'Print your drawings to scale for construction',
      'Use shortcuts to draw 10x faster than others'
    ],
    workflowImpact: 'Create professional blueprints that contractors can actually build from.'
  },
  {
    id: '2',
    title: 'BIM with Revit',
    software: 'Revit',
    description: 'Build smart 3D buildings on your computer.',
    imageUrl: 'https://drive.google.com/file/d/1N_BbG9kAEwIk541Id53_RV0CWjO1jzAt/view?usp=drive_link',
    color: 'from-red-600 to-red-500',
    students: '38k',
    price: 49,
    originalPrice: 99,
    learningPoints: [
      'Create 3D buildings with automatic floor plans',
      'Calculate how many bricks and windows you need',
      'Work on big projects with other team members'
    ],
    workflowImpact: 'Save days of work. The software does it for you.'
  },
  {
    id: '3',
    title: 'SketchUp Pro',
    software: 'SketchUp',
    description: 'Build complete 3D interiors from scratch — the foundation of every great render.',
    imageUrl: 'https://drive.google.com/file/d/1wl6by5AO5MiPeoYsZ8F6Zi5AJahoeTQo/view?usp=drive_link',
    color: 'from-blue-500 to-cyan-400',
    students: '55k',
    price: 49,
    originalPrice: 99,
    learningPoints: [
      'Build 3D rooms, kitchens & full homes from a blank canvas',
      'Apply realistic textures, furniture & materials',
      'Export scenes ready for D5 Render'
    ],
    workflowImpact: 'Model their dream kitchen or bedroom in just minutes.'
  },
  {
    id: '4',
    title: '3ds Max Advanced',
    software: '3ds Max',
    description: 'Design fancy furniture and luxury interiors.',
    imageUrl: 'https://drive.google.com/file/d/1DgmIvkeC2dxGpRpzbIthHQsSdlCty2Xg/view?usp=drive_link',
    color: 'from-cyan-600 to-blue-500',
    students: '22k',
    price: 49,
    originalPrice: 99,
    learningPoints: [
      'Model complex shapes like twisted towers',
      'Create soft fabrics, pillows, and blankets',
      'Design high-end luxury interior spaces'
    ],
    workflowImpact: 'Charge more for premium, high-detail luxury designs.'
  },
  {
    id: '6',
    title: 'Lumion Cinematic',
    software: 'Lumion',
    description: 'Make movies of your architecture.',
    imageUrl: 'https://drive.google.com/file/d/1XW2DDHVa1Qc15NcZ3wUKMFRT7LkyZMCt/view?usp=drive_link',
    color: 'from-teal-500 to-emerald-400',
    students: '31k',
    price: 49,
    originalPrice: 99,
    learningPoints: [
      'Add grass, trees, and water instantly',
      'Make people walk and cars drive in your scene',
      'Create a video tour of the house'
    ],
    workflowImpact: 'A 1-minute video sells a house better than 100 drawings.'
  },
  {
    id: '7',
    title: 'D5 Render AI',
    software: 'D5 Render',
    description: 'AI-powered real-time rendering. See changes instantly. Generate 4K images in seconds.',
    imageUrl: 'https://drive.google.com/file/d/1vbV4j6K9sgzbbZ7qlRdgqPTXWiHBPLsr/view?usp=drive_link',
    color: 'from-purple-500 to-pink-500',
    students: '19k',
    price: 49,
    originalPrice: 99,
    learningPoints: [
      'Real-time AI rendering — see changes as you make them',
      'AI-assisted lighting, materials & scene composition',
      'Generate cinematic 4K images & video walkthroughs in seconds'
    ],
    workflowImpact: 'Make live design changes while the client watches.'
  },
  {
    id: '8',
    title: 'Enscape VR',
    software: 'Enscape',
    description: 'Walk inside your design using VR.',
    imageUrl: 'https://drive.google.com/file/d/1SmezP6LwT3yo9aE3oivpGkqS-xycSOyx/view?usp=drive_link',
    color: 'from-blue-500 to-indigo-600',
    students: '25k',
    price: 49,
    originalPrice: 99,
    learningPoints: [
      'One-click to start walking inside your model',
      'Send a web link so clients can walk around too',
      'Use Virtual Reality (VR) to impress'
    ],
    workflowImpact: 'Spot mistakes before construction starts.'
  },
  {
    id: '9',
    title: 'AI Architecture',
    software: 'Midjourney',
    description: 'Get 100 design ideas in 1 minute with AI.',
    imageUrl: 'https://drive.google.com/file/d/1s-HzZVKpc9F92mLW2gMOPk0kVrKAqUIS/view?usp=drive_link',
    color: 'from-fuchsia-600 to-purple-600',
    students: '60k',
    price: 49,
    originalPrice: 99,
    learningPoints: [
      'How to write text to get amazing house images',
      'Create mood boards for clients instantly',
      'Combine different styles (e.g., Classic + Modern)'
    ],
    workflowImpact: 'Never run out of ideas.'
  },
  {
    id: '10',
    title: 'Generative Design',
    software: 'Stable Diffusion',
    description: 'Turn a rough sketch into a realistic building using AI.',
    imageUrl: 'https://drive.google.com/file/d/1xSzSjuL4imlbXwEYMwKw_vhuueDcFtHm/view?usp=drive_link',
    color: 'from-indigo-500 to-purple-500',
    students: '15k',
    price: 49,
    originalPrice: 99,
    learningPoints: [
      'Turn hand sketches into realistic renders',
      'Change specific parts of an image with AI',
      'Install AI tools on your own computer'
    ],
    workflowImpact: 'Show a client a realistic picture during the first meeting.'
  },
  {
    id: '11',
    title: 'Unreal Engine 5',
    software: 'Unreal Engine',
    description: 'Make your design look like a high-end video game.',
    imageUrl: 'https://drive.google.com/file/d/14EfKoC7BfxXmYxd6t6qIE470yQaX0toW/view?usp=drive_link',
    color: 'from-gray-600 to-gray-400',
    students: '18k',
    price: 49,
    originalPrice: 99,
    learningPoints: [
      'Create interactive lights and doors',
      'Make realistic fire, water, and wind',
      'Package your design as a playable game'
    ],
    workflowImpact: 'Give clients a controller and let them play inside their future home.'
  },
  {
    id: '12',
    title: 'Post Production',
    software: 'Photoshop',
    description: 'Add real sky, birds, and people to your renders.',
    imageUrl: 'https://drive.google.com/file/d/1FkzIhdu7K5JeRFq7BM1wGV5MND_fLMKe/view?usp=drive_link',
    color: 'from-blue-800 to-blue-600',
    students: '72k',
    price: 49,
    originalPrice: 99,
    learningPoints: [
      'Fix lighting and colors easily',
      'Add realistic people and trees',
      'Make your portfolio look professional'
    ],
    workflowImpact: 'Make average renders look like award-winning photography.'
  }
];

// --- AUTO-FIX LOGIC ---
export const COURSES = RAW_COURSES.map(course => {
  let url = course.imageUrl;
  if (url.includes('drive.google.com') && url.includes('/file/d/')) {
    const idMatch = url.match(/\/d\/([^/]+)/);
    if (idMatch && idMatch[1]) {
      url = `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
    }
  }
  return { ...course, imageUrl: url };
});

// ─── FRONT-END OFFER: AutoCAD + SketchUp + Lumion + D5 Render ───
export const FRONT_END_IDS = ['1', '3', '6', '7'];
export const FRONT_END_COURSES = COURSES.filter(c => FRONT_END_IDS.includes(c.id));

// ─── UPSELL: Everything else ───
export const UPSELL_COURSES = COURSES.filter(c => !FRONT_END_IDS.includes(c.id));

export const FRONT_END_PRICE = 49;
export const FRONT_END_ORIGINAL_PRICE = 99;
export const UPSELL_PRICE = 27;
export const UPSELL_ORIGINAL_PRICE = 199;
export const UPSELL2_PRICE = 36;
export const UPSELL2_ORIGINAL_PRICE = 99;
export const DOWNSELL_BOOKS_PRICE = 12;

export const BUNDLE_PRICE = FRONT_END_PRICE;
export const BUNDLE_ORIGINAL_PRICE = FRONT_END_ORIGINAL_PRICE;

export const RAW_BOOKS: Course[] = [
  {
    id: 'b1',
    title: 'Living Room Design Book',
    software: '145 Pages',
    description: 'The heart of the home is usually the most cluttered. I teach you how to create conversation circles, master rug sizing, and lighting layers that actually work.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1YYJxA6NPSH23Oe3Nal_3QlW_DG0-mqKJ',
    color: 'from-orange-400 to-amber-300',
    students: '12.5k',
    price: 0,
    originalPrice: 0,
    learningPoints: ['The "Rug Rule" 90% of people break', 'Lighting layering for mood vs. function', 'Selecting the perfect sofa scale'],
    workflowImpact: 'Stop making living rooms that look like furniture showrooms. Make them liveable.'
  },
  {
    id: 'b2',
    title: 'Kitchen Design Book',
    software: '180 Pages',
    description: 'Function meets envy. We go deep on the "Working Triangle," cabinet finishes that don\'t date, and island dimensions that allow flow.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1AlxdHun9I2AO639g4Q0YJv_BOzb9sbZe',
    color: 'from-slate-600 to-slate-400',
    students: '10.2k',
    price: 0,
    originalPrice: 0,
    learningPoints: ['The Golden Triangle rule explained', 'Materials that survive red wine spills', 'Hidden storage hacks for small spaces'],
    workflowImpact: 'Design kitchens that people actually want to cook in, not just look at.'
  },
  {
    id: 'b3',
    title: 'Bedroom Design Book',
    software: '120 Pages',
    description: 'Your sanctuary. I show you how to use texture and color psychology to lower heart rates. It\'s not just a bed in a room; it\'s a retreat.',
    imageUrl: 'https://lh3.googleusercontent.com/d/12APuUeW_CUcJxCYDG-R0PhmtwpKmWqs8',
    color: 'from-stone-500 to-stone-400',
    students: '15k',
    price: 0,
    originalPrice: 0,
    learningPoints: ['Color psychology for deep sleep', 'Bedding textures that feel expensive', 'Blackout solutions that look chic'],
    workflowImpact: 'Create spaces where your clients (or you) can actually disconnect from the world.'
  },
  {
    id: 'b4',
    title: 'Washroom Design Book',
    software: '95 Pages',
    description: 'Yes, bathrooms matter. Stop treating them like utility closets. We cover tile transitions, vanity lighting, and how to make 40sqft feel like a spa.',
    imageUrl: 'https://lh3.googleusercontent.com/d/17CCyJ7HJhtPg3XPS8y9wf7SOG_kVMgf8',
    color: 'from-teal-500 to-emerald-400',
    students: '9.8k',
    price: 0,
    originalPrice: 0,
    learningPoints: ['Tile layouts that expand space', 'The science of flattering vanity lighting', 'Fixture mixing: Brass vs. Chrome'],
    workflowImpact: 'Turn the most expensive room per sqft into the most impressive one.'
  },
  {
    id: 'b5',
    title: 'Study Design Book',
    software: '110 Pages',
    description: 'Work from home is here to stay. Learn to design ergonomic, distraction-free zones that look good on a Zoom call.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1dzA2UnKUd_S37XMjh53ZiuhviZAivH1B',
    color: 'from-blue-900 to-blue-700',
    students: '11k',
    price: 0,
    originalPrice: 0,
    learningPoints: ['Video-call background styling', 'Ergonomics without the ugly chair', 'Cable management mastery'],
    workflowImpact: 'Productivity is designed. Build spaces that encourage deep work.'
  },
  {
    id: 'b6',
    title: 'Elevations Design Book',
    software: '160 Pages',
    description: 'Curb appeal is the first impression. We talk paint palettes, landscaping integration, and front door theory.',
    imageUrl: 'https://lh3.googleusercontent.com/d/1_TGYyThr32ciEl7C7obqHnwq1_WOR8N2',
    color: 'from-green-600 to-lime-500',
    students: '8.5k',
    price: 0,
    originalPrice: 0,
    learningPoints: ['Choosing exterior paint that lasts', 'Lighting the path: Safety vs. Style', 'Entryway styling that welcomes'],
    workflowImpact: 'Increase property value before anyone even steps inside the house.'
  }
];

export const COURSE_CATEGORIES = [
  {
    title: "Planning",
    ids: ['1', '2']
  },
  {
    title: "Designing",
    ids: ['3', '4', '12']
  },
  {
    title: "Rendering",
    ids: ['5', '6', '7', '8']
  },
  {
    title: "AI & MORE",
    ids: ['9', '10', '11']
  }
];

export const PRICING_PLANS = [
  {
    id: 'lifetime-basic',
    duration: 'Lifetime Access',
    period: 'One-time payment',
    price: '€49',
    originalPrice: '€99',
    label: 'Best Value'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'James Carter',
    role: 'Senior Architect',
    location: 'New York, USA',
    content: 'Having SketchUp, Lumion and D5 Render in one bundle changed how our entire studio works. We model, render, and present — all from this €49 course.'
  },
  {
    name: 'Sophie Laurent',
    role: '3D Visualizer',
    location: 'London, UK',
    content: 'The SketchUp-to-Lumion pipeline is so well taught. D5 Render AI lets me do real-time walkthroughs in client meetings. My close rate doubled.'
  },
  {
    name: 'Emma Rodriguez',
    role: 'Freelance Designer',
    location: 'Los Angeles, USA',
    content: 'I went from flat 2D drawings to photorealistic Lumion renders in 2 weeks. Built my entire freelance portfolio from these 4 courses. Now I charge 3x more.'
  },
  {
    name: 'Daniel Chen',
    role: 'Architecture Student',
    location: 'Toronto, Canada',
    content: 'SketchUp + Lumion + D5 Render AI — this pipeline is what firms actually use. I was the only student who knew all four. Landed my dream internship immediately.'
  },
  {
    name: 'Olivia Brooks',
    role: 'Interior Designer',
    location: 'Sydney, Australia',
    content: 'I can model a room in SketchUp, render video in Lumion, and show variations in D5 — all in the time it used to take for one basic drawing. Best €49 ever.'
  },
  {
    name: 'Marco Rossi',
    role: 'Landscape Architect',
    location: 'Milan, Italy',
    content: 'D5 Render AI for real-time changes, Lumion for cinematic videos, SketchUp for the foundation. This bundle covers everything.'
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What exactly do I get for €49?",
    answer: "You get 4 complete courses: AutoCAD Mastery (2D floor plans), SketchUp Pro (3D modeling), Lumion Cinematic (video walkthroughs), and D5 Render AI (real-time AI rendering). Plus 10,000+ textures, 2,000+ 3D models, all software links, a certified diploma, and 24/7 team support. Lifetime access."
  },
  {
    question: "How do I access the courses after buying?",
    answer: "You'll receive instant access via email with download links and login credentials within 5 minutes of payment."
  },
  {
    question: "Are project files included?",
    answer: "Yes, all 3D models, textures, and source files used in tutorials are included for download."
  },
  {
    question: "Do I need to buy expensive software?",
    answer: "Not at all. We provide links to official free or student versions of SketchUp, V-Ray, and D5 Render. No extra cost."
  },
  {
    question: "Do I get a certificate?",
    answer: "Yes, industry-recognized certificates are provided upon completion of each course."
  },
  {
    question: "Is there a refund policy?",
    answer: "Yes, 100% money-back guarantee within 7 days if you're not satisfied. No questions asked."
  }
];