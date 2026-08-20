/* NirmaanHub — directory data, rates, and catalog */
window.NH = window.NH || {};

NH.BRAND = "NirmaanHub";
NH.SUPPORT_EMAIL = "developersoftware.support@gmail.com";
NH.SUPPORT_PHONE = "+91 755 356 2400";
NH.WHATSAPP = "917553562400";
NH.LISTING_FEE_FROM = 499;

NH.CITIES = [
  { id: "bhopal", name: "Bhopal", state: "Madhya Pradesh", multiplier: 0.95, lat: 23.2599, lng: 77.4126 },
  { id: "indore", name: "Indore", state: "Madhya Pradesh", multiplier: 0.98, lat: 22.7196, lng: 75.8577 },
  { id: "jabalpur", name: "Jabalpur", state: "Madhya Pradesh", multiplier: 0.88, lat: 23.1815, lng: 79.9864 },
  { id: "gwalior", name: "Gwalior", state: "Madhya Pradesh", multiplier: 0.87, lat: 26.2183, lng: 78.1828 },
  { id: "ujjain", name: "Ujjain", state: "Madhya Pradesh", multiplier: 0.86, lat: 23.1765, lng: 75.7885 },
  { id: "sagar", name: "Sagar", state: "Madhya Pradesh", multiplier: 0.84, lat: 23.8388, lng: 78.7378 },
  { id: "dewas", name: "Dewas", state: "Madhya Pradesh", multiplier: 0.85, lat: 22.9676, lng: 76.0534 },
  { id: "raipur", name: "Raipur", state: "Chhattisgarh", multiplier: 0.9, lat: 21.2514, lng: 81.6296 },
  { id: "nagpur", name: "Nagpur", state: "Maharashtra", multiplier: 0.96, lat: 21.1458, lng: 79.0882 },
  { id: "mumbai", name: "Mumbai", state: "Maharashtra", multiplier: 1.48, lat: 19.076, lng: 72.8777 },
  { id: "pune", name: "Pune", state: "Maharashtra", multiplier: 1.22, lat: 18.5204, lng: 73.8567 },
  { id: "delhi", name: "Delhi", state: "Delhi", multiplier: 1.35, lat: 28.6139, lng: 77.209 },
  { id: "bengaluru", name: "Bengaluru", state: "Karnataka", multiplier: 1.32, lat: 12.9716, lng: 77.5946 },
  { id: "hyderabad", name: "Hyderabad", state: "Telangana", multiplier: 1.18, lat: 17.385, lng: 78.4867 },
  { id: "chennai", name: "Chennai", state: "Tamil Nadu", multiplier: 1.2, lat: 13.0827, lng: 80.2707 },
  { id: "kolkata", name: "Kolkata", state: "West Bengal", multiplier: 1.1, lat: 22.5726, lng: 88.3639 },
  { id: "ahmedabad", name: "Ahmedabad", state: "Gujarat", multiplier: 1.08, lat: 23.0225, lng: 72.5714 },
  { id: "surat", name: "Surat", state: "Gujarat", multiplier: 1.06, lat: 21.1702, lng: 72.8311 },
  { id: "jaipur", name: "Jaipur", state: "Rajasthan", multiplier: 1.05, lat: 26.9124, lng: 75.7873 },
  { id: "lucknow", name: "Lucknow", state: "Uttar Pradesh", multiplier: 1.0, lat: 26.8467, lng: 80.9462 }
];

NH.CATEGORIES = [
  {
    id: "residential",
    name: "House Construction",
    short: "Homes & duplexes",
    image: "images/cat-residential.png",
    costMin: 1450,
    costMax: 2800,
    duration: "8–14 months",
    blurb: "RCC framed houses, duplexes and independent floors with civil, plumbing, electrical and finishing."
  },
  {
    id: "commercial",
    name: "Commercial Buildings",
    short: "Shops & offices",
    image: "images/cat-commercial.png",
    costMin: 1650,
    costMax: 3200,
    duration: "10–18 months",
    blurb: "Showrooms, clinics, offices and mixed-use buildings built to municipal and fire-safety norms."
  },
  {
    id: "villa",
    name: "Villa & Luxury Homes",
    short: "Premium villas",
    image: "images/cat-villa.png",
    costMin: 2400,
    costMax: 4500,
    duration: "12–20 months",
    blurb: "Architect-led villas with landscaping, pool-ready structure and high-spec interiors."
  },
  {
    id: "interior",
    name: "Interior Fit-outs",
    short: "Interiors",
    image: "images/cat-interior.png",
    costMin: 900,
    costMax: 2800,
    duration: "45–120 days",
    blurb: "Turnkey interiors — flooring, false ceiling, modular kitchen, wardrobes and lighting."
  },
  {
    id: "renovation",
    name: "Renovation & Remodeling",
    short: "Remodeling",
    image: "images/cat-renovation.png",
    costMin: 650,
    costMax: 1800,
    duration: "2–8 months",
    blurb: "Structural repairs, kitchen/bath remodels, elevation upgrades and complete home makeovers."
  },
  {
    id: "industrial",
    name: "Industrial Construction",
    short: "Sheds & plants",
    image: "images/cat-industrial.png",
    costMin: 1100,
    costMax: 2200,
    duration: "6–14 months",
    blurb: "PEB sheds, warehouses, workshops and factory civil works with heavy-duty flooring."
  },
  {
    id: "road",
    name: "Road & Infrastructure",
    short: "Roads & drains",
    image: "images/cat-road.png",
    costMin: 450,
    costMax: 1400,
    duration: "3–12 months",
    blurb: "Internal roads, compound development, drainage, retaining walls and site infrastructure."
  },
  {
    id: "turnkey",
    name: "Turnkey Projects",
    short: "Design + build",
    image: "images/cat-turnkey.png",
    costMin: 1750,
    costMax: 3600,
    duration: "10–18 months",
    blurb: "Single-contract design, approvals, construction and handover with a fixed scope."
  }
];

NH.PACKAGES = [
  {
    id: "basic",
    name: "Basic",
    tagline: "Strong structure, essential finish",
    rate: 1450,
    monthsPer1000: 8.5,
    includes: [
      "RCC frame as per drawing",
      "9\" / 4.5\" brick masonry",
      "Internal & external plaster",
      "Kajaria / Somany basic tiles",
      "Standard CP fittings",
      "Concealed electrical (ISI wire)",
      "2 coats putty + emulsion",
      "MS windows / flush doors",
      "Waterproofing in wet areas"
    ],
    excludes: ["Modular kitchen", "False ceiling", "Compound wall", "Furniture"]
  },
  {
    id: "standard",
    name: "Standard",
    tagline: "Most chosen by families",
    rate: 1850,
    monthsPer1000: 10,
    popular: true,
    includes: [
      "Everything in Basic",
      "Vitrified tiles (2×2 / 2×4)",
      "Branded sanitary (Jaquar / Cera)",
      "UPVC windows",
      "Granite kitchen platform",
      "Designer elevation texture",
      "LED lighting package",
      "Loft & basic storage",
      "Site engineer visits"
    ],
    excludes: ["Imported marble", "Home automation", "Landscape"]
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Designer finish, better brands",
    rate: 2450,
    monthsPer1000: 12,
    includes: [
      "Everything in Standard",
      "Large-format tiles / wooden-look",
      "Premium bath suites",
      "False ceiling in living & bedrooms",
      "Basic modular kitchen",
      "Main door teak / engineered",
      "Weather-coat exterior",
      "CCTV + video door phone ready",
      "Dedicated project manager"
    ],
    excludes: ["Imported fittings", "Smart home devices", "Pool"]
  },
  {
    id: "luxury",
    name: "Luxury",
    tagline: "Villa-grade specification",
    rate: 3350,
    monthsPer1000: 14,
    includes: [
      "Everything in Premium",
      "Italian marble / premium wood",
      "Imported sanitary & faucets",
      "Full interiors coordination",
      "Landscape-ready compound",
      "VRV / split AC piping",
      "Home automation conduits",
      "Solar-ready roof structure",
      "Snag-free white-glove handover"
    ],
    excludes: ["Furniture packages", "Appliances", "Pool equipment"]
  }
];

NH.ADDONS = [
  { id: "kitchen", name: "Full modular kitchen", type: "fixed", amount: 185000, hint: "8–10 ft, plywood + laminate" },
  { id: "ceiling", name: "False ceiling + cove lights", type: "perSqft", amount: 95, hint: "On built-up area" },
  { id: "compound", name: "Compound wall + main gate", type: "fixed", amount: 145000, hint: "Typical 40×60 plot" },
  { id: "solar", name: "3 kW rooftop solar", type: "fixed", amount: 165000, hint: "Net-metering ready" },
  { id: "wardrobe", name: "Bedroom wardrobes (3 rooms)", type: "fixed", amount: 120000, hint: "Factory-made" },
  { id: "waterproof", name: "Terrace waterproofing+", type: "perSqft", amount: 42, hint: "Chemical + brickbat" },
  { id: "parking", name: "Covered car porch", type: "fixed", amount: 95000, hint: "RCC canopy" },
  { id: "lift", name: "Home elevator provision", type: "fixed", amount: 420000, hint: "Shaft + 3-stop lift" }
];

NH.PLANS = [
  {
    id: "starter",
    name: "Starter Listing",
    price: 499,
    period: "year",
    badge: "Minimal fee",
    features: [
      "Company profile on NirmaanHub",
      "City + category listing",
      "Lead form routed to email",
      "Verified badge after review",
      "Edit details anytime"
    ]
  },
  {
    id: "featured",
    name: "Featured Builder",
    price: 1499,
    period: "year",
    popular: true,
    features: [
      "Everything in Starter",
      "Featured card on city page",
      "Priority in search",
      "WhatsApp enquiry button",
      "Monthly lead summary"
    ]
  },
  {
    id: "topsearch",
    name: "Top Search",
    price: 2999,
    period: "year",
    features: [
      "Everything in Featured",
      "Top Search badge",
      "Homepage spotlight slot",
      "Announcement-bar mention*",
      "Dedicated account email"
    ]
  }
];

NH.BUILDERS = [
  {
    id: "aw-constructions",
    name: "A.W. Constructions Pvt. Ltd",
    city: "bhopal",
    areas: ["Kolar Road", "Arera Colony", "Hoshangabad Road"],
    rating: 4.9,
    reviews: 432,
    years: 18,
    verified: true,
    topSearch: true,
    gst: true,
    categories: ["residential", "villa", "turnkey"],
    rate: 1920,
    phone: "07554001201",
    whatsapp: "919425001201",
    image: "images/work-duplex.png",
    gallery: ["images/work-duplex.png", "images/work-masonry.png", "images/cat-residential.png"],
    about: "Turnkey residential builder known for duplexes and independent houses across south Bhopal. In-house civil, plumbing and finishing teams with weekly photo reports.",
    services: ["Building", "Residential", "Turnkey"],
    response: "Flexible appointments available.",
    completed: 210,
    durationNote: "12–16 months for a 2,000 sq ft home"
  },
  {
    id: "bhawan-construction",
    name: "Bhawan Construction Services",
    city: "bhopal",
    areas: ["MP Nagar", "Bawadiya Kalan", "Danish Kunj"],
    rating: 4.4,
    reviews: 186,
    years: 9,
    verified: true,
    topSearch: false,
    gst: true,
    categories: ["residential", "commercial", "turnkey"],
    rate: 1200,
    phone: "07554002310",
    whatsapp: "919826102310",
    image: "images/cat-residential.png",
    gallery: ["images/cat-residential.png", "images/work-foundation.png"],
    about: "Civil contractor for independent houses and small commercial buildings. Transparent per-sq-ft billing with material-plus-labour or labour-only options.",
    services: ["Civil", "House construction"],
    response: "Quotes shared within 24 hours.",
    completed: 94,
    durationNote: "9–12 months for 1,200 sq ft"
  },
  {
    id: "rk-construction-bhopal",
    name: "RK Construction Company Bhopal",
    city: "bhopal",
    areas: ["Danish Kunj", "Salaiya", "Baghmugalia"],
    rating: 4.8,
    reviews: 318,
    years: 14,
    verified: true,
    topSearch: true,
    gst: true,
    categories: ["residential", "renovation"],
    rate: 1680,
    phone: "07554003420",
    whatsapp: "919893203420",
    image: "images/work-masonry.png",
    gallery: ["images/work-masonry.png", "images/cat-renovation.png"],
    about: "Residential contractors and masons for new homes and remodeling. Operates 9:00 AM – 9:00 PM, all week. Strong local crew for brickwork and RCC.",
    services: ["Construction contractors", "Residential", "Masons"],
    response: "Site visit same week.",
    completed: 156,
    durationNote: "10–14 months typical"
  },
  {
    id: "jaya-mahesh-kisan",
    name: "Jaya Mahesh Kisan Sewa Kendra",
    city: "bhopal",
    areas: ["Berasia Road", "Karond", "Ayodhya Bypass"],
    rating: 3.7,
    reviews: 64,
    years: 7,
    verified: true,
    topSearch: false,
    gst: true,
    categories: ["road", "industrial", "residential"],
    rate: 980,
    phone: "07554004530",
    whatsapp: "919827504530",
    image: "images/work-foundation.png",
    gallery: ["images/work-foundation.png", "images/cat-road.png"],
    about: "Civil construction for housing, site development and light infrastructure. GST, mobile and email verified contractor.",
    services: ["Civil construction", "Site development"],
    response: "Call now for a site estimate.",
    completed: 41,
    durationNote: "Depends on package scope"
  },
  {
    id: "malwa-nirman",
    name: "Malwa Nirman & Developers",
    city: "indore",
    areas: ["Vijay Nagar", "Scheme 140", "Bicholi Mardana"],
    rating: 4.6,
    reviews: 221,
    years: 12,
    verified: true,
    topSearch: true,
    gst: true,
    categories: ["residential", "villa", "commercial"],
    rate: 1780,
    phone: "07314001100",
    whatsapp: "919826201100",
    image: "images/cat-villa.png",
    gallery: ["images/cat-villa.png", "images/work-duplex.png"],
    about: "Indore-based design-and-build firm for bungalows and boutique commercial. Architect on board for municipal drawings.",
    services: ["Villa", "Residential", "Commercial"],
    response: "Free first consultation.",
    completed: 132,
    durationNote: "11–15 months"
  },
  {
    id: "sagar-buildwell",
    name: "Sagar Buildwell",
    city: "indore",
    areas: ["Rajendra Nagar", "Rau", "MR 10"],
    rating: 4.2,
    reviews: 98,
    years: 8,
    verified: true,
    topSearch: false,
    gst: true,
    categories: ["residential", "interior"],
    rate: 1550,
    phone: "07314002200",
    whatsapp: "919826302200",
    image: "images/cat-interior.png",
    gallery: ["images/cat-interior.png", "images/work-flooring.png"],
    about: "House construction with in-house interiors — flooring, kitchens and wardrobes under one BOQ.",
    services: ["House construction", "Interiors"],
    response: "Quick response on WhatsApp.",
    completed: 67,
    durationNote: "8–12 months + 60 days interiors"
  },
  {
    id: "narmada-structures",
    name: "Narmada Structures",
    city: "jabalpur",
    areas: ["Wright Town", "Napier Town", "Medical College Road"],
    rating: 4.5,
    reviews: 140,
    years: 16,
    verified: true,
    topSearch: false,
    gst: true,
    categories: ["residential", "commercial", "turnkey"],
    rate: 1380,
    phone: "07614003300",
    whatsapp: "919826403300",
    image: "images/cat-commercial.png",
    gallery: ["images/cat-commercial.png", "images/cat-turnkey.png"],
    about: "Long-standing Jabalpur contractor for homes, clinics and small offices. Emphasis on RCC quality and timely shuttering cycles.",
    services: ["Residential", "Commercial"],
    response: "Engineer available for soil test.",
    completed: 188,
    durationNote: "9–13 months"
  },
  {
    id: "gwalior-home-builders",
    name: "Gwalior Home Builders",
    city: "gwalior",
    areas: ["City Center", "Morar", "Thatipur"],
    rating: 4.3,
    reviews: 77,
    years: 10,
    verified: true,
    topSearch: false,
    gst: true,
    categories: ["residential", "renovation"],
    rate: 1320,
    phone: "07514004400",
    whatsapp: "919826504400",
    image: "images/cat-renovation.png",
    gallery: ["images/cat-renovation.png", "images/work-masonry.png"],
    about: "Independent house construction and old-home remodeling in Gwalior. Labour-plus-material contracts with weekly measurement.",
    services: ["Residential", "Renovation"],
    response: "Site visit in 48 hours.",
    completed: 72,
    durationNote: "8–12 months"
  },
  {
    id: "ujjain-shree-build",
    name: "Shree Build Associates",
    city: "ujjain",
    areas: ["Freeganj", "Nanakheda", "Dewas Road"],
    rating: 4.1,
    reviews: 53,
    years: 11,
    verified: true,
    topSearch: false,
    gst: true,
    categories: ["residential", "road"],
    rate: 1280,
    phone: "07344005500",
    whatsapp: "919826605500",
    image: "images/cat-road.png",
    gallery: ["images/cat-road.png", "images/work-foundation.png"],
    about: "House construction and internal road/compound development around Ujjain.",
    services: ["House construction", "Compound development"],
    response: "Government-drawing support.",
    completed: 58,
    durationNote: "8–11 months"
  },
  {
    id: "raipur-steel-civil",
    name: "Raipur Steel & Civil Works",
    city: "raipur",
    areas: ["Naya Raipur", "Shankar Nagar", "Pandri"],
    rating: 4.4,
    reviews: 119,
    years: 13,
    verified: true,
    topSearch: true,
    gst: true,
    categories: ["industrial", "commercial", "turnkey"],
    rate: 1480,
    phone: "07714006600",
    whatsapp: "919826706600",
    image: "images/cat-industrial.png",
    gallery: ["images/cat-industrial.png", "images/cat-commercial.png"],
    about: "PEB sheds, warehouses and commercial RCC. Combines fabrication yard with civil crew.",
    services: ["Industrial", "Commercial"],
    response: "BOQ in 3 working days.",
    completed: 81,
    durationNote: "6–12 months"
  },
  {
    id: "nagpur-orange-build",
    name: "Orange Build Nagpur",
    city: "nagpur",
    areas: ["Wardha Road", "Manish Nagar", "Dharampeth"],
    rating: 4.6,
    reviews: 205,
    years: 15,
    verified: true,
    topSearch: true,
    gst: true,
    categories: ["residential", "villa", "interior"],
    rate: 1720,
    phone: "07124007700",
    whatsapp: "919826807700",
    image: "images/cat-villa.png",
    gallery: ["images/cat-villa.png", "images/cat-interior.png"],
    about: "Bungalows and duplexes with interior packages. Strong finishing team for Nagpur climate.",
    services: ["Villa", "Interiors", "Residential"],
    response: "Saturday design studio open.",
    completed: 143,
    durationNote: "11–16 months"
  },
  {
    id: "mumbai-harbour-construct",
    name: "Harbour Construct LLP",
    city: "mumbai",
    areas: ["Andheri", "Thane", "Navi Mumbai"],
    rating: 4.7,
    reviews: 390,
    years: 20,
    verified: true,
    topSearch: true,
    gst: true,
    categories: ["residential", "commercial", "renovation"],
    rate: 2850,
    phone: "02240008800",
    whatsapp: "919820108800",
    image: "images/cat-commercial.png",
    gallery: ["images/cat-commercial.png", "images/cat-renovation.png"],
    about: "High-spec interiors, office fit-outs and independent house reconstruction in MMR. Handles BMC/TMC liaison.",
    services: ["Renovation", "Commercial", "Residential"],
    response: "PMC-style weekly reports.",
    completed: 260,
    durationNote: "14–22 months (approvals extra)"
  },
  {
    id: "pune-sahyadri-homes",
    name: "Sahyadri Homes Pune",
    city: "pune",
    areas: ["Baner", "Wagholi", "Hadapsar"],
    rating: 4.5,
    reviews: 174,
    years: 11,
    verified: true,
    topSearch: false,
    gst: true,
    categories: ["residential", "villa", "turnkey"],
    rate: 2100,
    phone: "02040009900",
    whatsapp: "919820209900",
    image: "images/work-duplex.png",
    gallery: ["images/work-duplex.png", "images/cat-turnkey.png"],
    about: "Turnkey bungalows on Pune’s west and east corridors. Soil investigation and structural consultant included.",
    services: ["Turnkey", "Villa"],
    response: "3D elevation with every quote.",
    completed: 89,
    durationNote: "12–18 months"
  },
  {
    id: "delhi-capital-civil",
    name: "Capital Civil Works",
    city: "delhi",
    areas: ["Dwarka", "Rohini", "Greater Noida"],
    rating: 4.4,
    reviews: 256,
    years: 17,
    verified: true,
    topSearch: true,
    gst: true,
    categories: ["residential", "commercial", "renovation"],
    rate: 2350,
    phone: "01140001010",
    whatsapp: "919810101010",
    image: "images/cat-residential.png",
    gallery: ["images/cat-residential.png", "images/cat-commercial.png"],
    about: "Builder floors, farmhouses and shop construction across NCR. Familiar with MCD / GNIDA processes.",
    services: ["Residential", "Commercial"],
    response: "Same-day call back.",
    completed: 301,
    durationNote: "10–16 months"
  },
  {
    id: "bengaluru-stoneleaf",
    name: "Stoneleaf Builders",
    city: "bengaluru",
    areas: ["Whitefield", "Sarjapur", "Yelahanka"],
    rating: 4.8,
    reviews: 287,
    years: 14,
    verified: true,
    topSearch: true,
    gst: true,
    categories: ["villa", "residential", "interior"],
    rate: 2480,
    phone: "08040001111",
    whatsapp: "919845011111",
    image: "images/cat-villa.png",
    gallery: ["images/cat-villa.png", "images/cat-interior.png"],
    about: "Architect-collaborative villas and premium interiors. Known for rainwater harvesting and laterite/stone details.",
    services: ["Villa", "Interiors"],
    response: "Design workshop on booking.",
    completed: 118,
    durationNote: "14–20 months"
  },
  {
    id: "hyderabad-deccan-build",
    name: "Deccan Build Co.",
    city: "hyderabad",
    areas: ["Gachibowli", "Kompally", "Uppal"],
    rating: 4.5,
    reviews: 163,
    years: 12,
    verified: true,
    topSearch: false,
    gst: true,
    categories: ["residential", "commercial", "turnkey"],
    rate: 1980,
    phone: "04040001212",
    whatsapp: "919848012121",
    image: "images/cat-turnkey.png",
    gallery: ["images/cat-turnkey.png", "images/work-duplex.png"],
    about: "Independent houses and G+2 commercial in GHMC limits. Vastu-compliant planning optional.",
    services: ["Turnkey", "Residential"],
    response: "GHMC drawing desk in-house.",
    completed: 97,
    durationNote: "11–15 months"
  },
  {
    id: "chennai-marina-construct",
    name: "Marina Construct",
    city: "chennai",
    areas: ["OMR", "Anna Nagar", "Tambaram"],
    rating: 4.3,
    reviews: 142,
    years: 19,
    verified: true,
    topSearch: false,
    gst: true,
    categories: ["residential", "commercial"],
    rate: 2050,
    phone: "04440001313",
    whatsapp: "919841013131",
    image: "images/work-flooring.png",
    gallery: ["images/work-flooring.png", "images/cat-residential.png"],
    about: "Coastal-climate construction with extra corrosion protection on steel and terrace waterproofing.",
    services: ["Residential", "Commercial"],
    response: "CMDA/DTCP support.",
    completed: 176,
    durationNote: "12–16 months"
  },
  {
    id: "kolkata-east-build",
    name: "East Build Associates",
    city: "kolkata",
    areas: ["New Town", "Rajarhat", "Behala"],
    rating: 4.2,
    reviews: 88,
    years: 13,
    verified: true,
    topSearch: false,
    gst: true,
    categories: ["residential", "renovation"],
    rate: 1680,
    phone: "03340001414",
    whatsapp: "919830014141",
    image: "images/cat-renovation.png",
    gallery: ["images/cat-renovation.png", "images/work-masonry.png"],
    about: "House construction and heritage-home remodeling in Kolkata. Moisture-control detailing for monsoon.",
    services: ["Residential", "Renovation"],
    response: "Sunday visits on request.",
    completed: 70,
    durationNote: "10–14 months"
  },
  {
    id: "ahmedabad-sabarmati",
    name: "Sabarmati Structurals",
    city: "ahmedabad",
    areas: ["SG Highway", "Bopal", "Naroda"],
    rating: 4.6,
    reviews: 201,
    years: 16,
    verified: true,
    topSearch: true,
    gst: true,
    categories: ["residential", "industrial", "commercial"],
    rate: 1750,
    phone: "07940001515",
    whatsapp: "919825015151",
    image: "images/cat-industrial.png",
    gallery: ["images/cat-industrial.png", "images/cat-commercial.png"],
    about: "Homes, shops and industrial sheds. Strong RCC and PEB execution across Ahmedabad.",
    services: ["Residential", "Industrial"],
    response: "AUDA/AMC drawing help.",
    completed: 154,
    durationNote: "9–14 months"
  },
  {
    id: "jaipur-pinkcity-homes",
    name: "Pinkcity Homes",
    city: "jaipur",
    areas: ["Mansarovar", "Vaishali Nagar", "Jagatpura"],
    rating: 4.7,
    reviews: 168,
    years: 12,
    verified: true,
    topSearch: false,
    gst: true,
    categories: ["residential", "villa", "interior"],
    rate: 1620,
    phone: "01414001616",
    whatsapp: "919829016161",
    image: "images/cat-interior.png",
    gallery: ["images/cat-interior.png", "images/cat-villa.png"],
    about: "Jaipur bungalows with sandstone and jaali details. Interiors studio for modular kitchens.",
    services: ["Villa", "Interiors"],
    response: "Vastu architect on panel.",
    completed: 102,
    durationNote: "10–15 months"
  },
  {
    id: "lucknow-awadh-build",
    name: "Awadh Build Studio",
    city: "lucknow",
    areas: ["Gomti Nagar", "Aliganj", "Sushant Golf City"],
    rating: 4.4,
    reviews: 131,
    years: 9,
    verified: true,
    topSearch: false,
    gst: true,
    categories: ["residential", "turnkey", "interior"],
    rate: 1580,
    phone: "05224001717",
    whatsapp: "919839017171",
    image: "images/cat-turnkey.png",
    gallery: ["images/cat-turnkey.png", "images/work-duplex.png"],
    about: "Turnkey homes and interiors for Lucknow families. Clear stage-wise payment schedule.",
    services: ["Turnkey", "Residential"],
    response: "LDA file assistance.",
    completed: 76,
    durationNote: "10–14 months"
  },
  {
    id: "sagar-central-civil",
    name: "Central Civil Sagar",
    city: "sagar",
    areas: ["Makronia", "Civil Lines", "Bina Road"],
    rating: 4.0,
    reviews: 39,
    years: 8,
    verified: true,
    topSearch: false,
    gst: true,
    categories: ["residential", "road"],
    rate: 1180,
    phone: "07582401818",
    whatsapp: "919826818181",
    image: "images/work-foundation.png",
    gallery: ["images/work-foundation.png", "images/cat-road.png"],
    about: "Affordable house construction and plot development in Sagar district.",
    services: ["House construction", "Plot development"],
    response: "Local mason crew ready.",
    completed: 34,
    durationNote: "7–11 months"
  }
];

NH.ANNOUNCEMENTS = [
  "List your construction company from ₹499 / year — limited introductory fee.",
  "Get an instant home-cost estimate with our square-foot calculator.",
  "Verified builders in your city. Every enquiry is shared with developersoftware.support@gmail.com."
];

NH.cityById = function (id) {
  return NH.CITIES.find(function (c) { return c.id === id; }) || NH.CITIES[0];
};

NH.categoryById = function (id) {
  return NH.CATEGORIES.find(function (c) { return c.id === id; });
};

NH.builderById = function (id) {
  return NH.BUILDERS.find(function (b) { return b.id === id; });
};

NH.buildersInCity = function (cityId, categoryId) {
  return NH.BUILDERS.filter(function (b) {
    var cityOk = !cityId || b.city === cityId;
    var catOk = !categoryId || b.categories.indexOf(categoryId) !== -1;
    return cityOk && catOk;
  });
};

NH.formatINR = function (n) {
  var num = Math.round(Number(n) || 0);
  return "₹" + num.toLocaleString("en-IN");
};

NH.nearbyCities = function (cityId) {
  var i = NH.CITIES.findIndex(function (c) { return c.id === cityId; });
  if (i < 0) return NH.CITIES.slice(0, 6);
  var out = [];
  for (var k = 1; k < NH.CITIES.length && out.length < 6; k++) {
    out.push(NH.CITIES[(i + k) % NH.CITIES.length]);
  }
  return out;
};
