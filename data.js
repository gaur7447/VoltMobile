/* ==========================================================================
   VoltMobile Storefront — Smartphone Catalog Data (data.js)
   ========================================================================== */

const PHONES_DATA = [
  {
    id: "iphone-16-pro-max",
    brand: "Apple",
    name: "iPhone 16 Pro Max",
    category: "Flagship",
    badge: "Best Seller",
    rating: 4.9,
    display: '6.9" Super Retina XDR OLED, 120Hz ProMotion',
    processor: "Apple A18 Pro (3nm)",
    camera: "48MP Fusion + 48MP Ultra Wide + 12MP 5x Tetraprism",
    battery: "4685 mAh · MagSafe & USB-C",
    description:
      "Grade 5 titanium frame with Camera Control, 4K120 Dolby Vision video, and all-day battery life.",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
    colors: [
      {
        name: "Desert Titanium",
        hex: "#C2A382",
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Natural Titanium",
        hex: "#9E988E",
        image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Black Titanium",
        hex: "#262729",
        image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "White Titanium",
        hex: "#F1F2F4",
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80",
      },
    ],
    variants: [
      { ram: "8GB", storage: "256GB", price: 144900, mrp: 149900 },
      { ram: "8GB", storage: "512GB", price: 164900, mrp: 169900 },
      { ram: "8GB", storage: "1TB", price: 184900, mrp: 189900 },
    ],
  },
  {
    id: "galaxy-s25-ultra",
    brand: "Samsung",
    name: "Galaxy S25 Ultra",
    category: "Flagship",
    badge: "S-Pen Pro",
    rating: 4.8,
    display: '6.9" Dynamic AMOLED 2X, 1-120Hz LTPO',
    processor: "Snapdragon 8 Elite for Galaxy",
    camera: "200MP Main + 50MP Ultra Wide + 50MP 5x + 10MP 3x",
    battery: "5000 mAh · 45W Fast Charge",
    description:
      "Built-in S-Pen, titanium armor frame, Galaxy AI live assistants, and anti-reflective Gorilla Armor glass.",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80",
    colors: [
      {
        name: "Titanium Silverblue",
        hex: "#8FA4B8",
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Titanium Black",
        hex: "#1E2024",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Titanium Gray",
        hex: "#7A7E85",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Titanium Whitesilver",
        hex: "#E6E8EB",
        image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80",
      },
    ],
    variants: [
      { ram: "12GB", storage: "256GB", price: 129999, mrp: 134999 },
      { ram: "12GB", storage: "512GB", price: 141999, mrp: 146999 },
      { ram: "12GB", storage: "1TB", price: 165999, mrp: 169999 },
    ],
  },
  {
    id: "pixel-9-pro-xl",
    brand: "Google",
    name: "Pixel 9 Pro XL",
    category: "Camera",
    badge: "AI Camera King",
    rating: 4.8,
    display: '6.8" Super Actua LTPO OLED, 120Hz',
    processor: "Google Tensor G4 + Titan M2",
    camera: "50MP Octa PD + 48MP Macro Ultra Wide + 48MP 5x Telephoto",
    battery: "5060 mAh · 37W Fast & Wireless Charge",
    description:
      "Computational photography powerhouse with Magic Editor, Best Take, and 7 years of OS & security updates.",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
    colors: [
      {
        name: "Hazel",
        hex: "#768173",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Obsidian",
        hex: "#1C1D21",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Porcelain",
        hex: "#F3EFEA",
        image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Rose Quartz",
        hex: "#E5B4C0",
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80",
      },
    ],
    variants: [
      { ram: "16GB", storage: "256GB", price: 124999, mrp: 129999 },
      { ram: "16GB", storage: "512GB", price: 139999, mrp: 144999 },
    ],
  },
  {
    id: "oneplus-13",
    brand: "OnePlus",
    name: "OnePlus 13",
    category: "Performance",
    badge: "100W SuperVOOC",
    rating: 4.7,
    display: '6.82" ProXDR 2K+ 120Hz Micro-Quad Curved',
    processor: "Snapdragon 8 Elite",
    camera: "50MP Sony LYT-808 Hasselblad + 50MP 3x Periscope + 50MP UW",
    battery: "6000 mAh Silicon-Carbon · 100W Wired / 50W AirVOOC",
    description:
      "Ultra-dense 6000mAh battery paired with Hasselblad color tuning, IP68/IP69 durability, and alert slider.",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
    colors: [
      {
        name: "Midnight Ocean",
        hex: "#1B365D",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Arctic Dawn",
        hex: "#E8ECEF",
        image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Black Eclipse",
        hex: "#18181B",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
      },
    ],
    variants: [
      { ram: "12GB", storage: "256GB", price: 69999, mrp: 72999 },
      { ram: "16GB", storage: "512GB", price: 76999, mrp: 79999 },
      { ram: "24GB", storage: "1TB", price: 89999, mrp: 92999 },
    ],
  },
  {
    id: "xiaomi-15-ultra",
    brand: "Xiaomi",
    name: "Xiaomi 15 Ultra",
    category: "Camera",
    badge: "Leica Optics",
    rating: 4.8,
    display: '6.73" WQHD+ AMOLED, 120Hz, 3200 nits peak',
    processor: "Snapdragon 8 Elite",
    camera: '50MP 1" Leica Main + 200MP Periscope Telephoto + 50MP UW',
    battery: "5410 mAh · 90W HyperCharge",
    description:
      "Studio-grade Leica Summilux lens system engineered for low-light street photography and 8K cinema capture.",
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80",
    colors: [
      {
        name: "Silver Chrome",
        hex: "#C5C9CE",
        image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Obsidian Black",
        hex: "#171717",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Pine Green",
        hex: "#2D4F3E",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
      },
    ],
    variants: [
      { ram: "16GB", storage: "512GB", price: 109999, mrp: 114999 },
      { ram: "16GB", storage: "1TB", price: 119999, mrp: 124999 },
    ],
  },
  {
    id: "nothing-phone-3",
    brand: "Nothing",
    name: "Nothing Phone (3)",
    category: "Performance",
    badge: "Glyph Matrix",
    rating: 4.6,
    display: '6.7" Flexible OLED, 120Hz Adaptive',
    processor: "Snapdragon 8s Gen 3",
    camera: "50MP Dual Camera System + TrueLens Engine 3.0",
    battery: "5000 mAh · 45W Fast Charge",
    description:
      "Iconic transparent industrial design with programmable Glyph lighting cues and clean Nothing OS.",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80",
    colors: [
      {
        name: "Glyph White",
        hex: "#F4F4F5",
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Carbon Black",
        hex: "#18181B",
        image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80",
      },
    ],
    variants: [
      { ram: "8GB", storage: "128GB", price: 49999, mrp: 52999 },
      { ram: "12GB", storage: "256GB", price: 54999, mrp: 57999 },
      { ram: "16GB", storage: "512GB", price: 59999, mrp: 62999 },
    ],
  },
  {
    id: "galaxy-z-fold-6",
    brand: "Samsung",
    name: "Galaxy Z Fold 6",
    category: "Foldable",
    badge: "Dual-Screen Pro",
    rating: 4.7,
    display: '7.6" Main Foldable QXGA+ + 6.3" Cover AMOLED, 120Hz',
    processor: "Snapdragon 8 Gen 3 for Galaxy",
    camera: "50MP Wide + 12MP Ultra Wide + 10MP 3x Telephoto",
    battery: "4400 mAh · Super Fast Charging",
    description:
      "Slimmer, lighter foldable workstation with multi-window multitasking, Flex Mode, and AI Note Assist.",
    image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?auto=format&fit=crop&w=800&q=80",
    colors: [
      {
        name: "Silver Shadow",
        hex: "#B5BCC4",
        image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Crafted Black",
        hex: "#16171A",
        image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Pink",
        hex: "#F2C6CF",
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80",
      },
    ],
    variants: [
      { ram: "12GB", storage: "256GB", price: 164999, mrp: 174999 },
      { ram: "12GB", storage: "512GB", price: 176999, mrp: 186999 },
      { ram: "12GB", storage: "1TB", price: 199999, mrp: 209999 },
    ],
  },
  {
    id: "rog-phone-9-pro",
    brand: "ASUS",
    name: "ROG Phone 9 Pro",
    category: "Gaming",
    badge: "185Hz Gaming",
    rating: 4.8,
    display: '6.78" FHD+ Samsung E6 AMOLED, up to 185Hz',
    processor: "Snapdragon 8 Elite",
    camera: "50MP Gimbal OIS + 13MP Ultra Wide + 32MP 3x Telephoto",
    battery: "5800 mAh Dual-Cell · 65W HyperCharge",
    description:
      "Purpose-built gaming flagship with AniMe Vision mini-LED back, ultrasonic AirTriggers, and dual USB-C ports.",
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80",
    colors: [
      {
        name: "Phantom Black",
        hex: "#141518",
        image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Storm White",
        hex: "#E5E7EB",
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80",
      },
    ],
    variants: [
      { ram: "16GB", storage: "512GB", price: 94999, mrp: 99999 },
      { ram: "24GB", storage: "1TB", price: 119999, mrp: 124999 },
    ],
  },
  {
    id: "xperia-1-vi",
    brand: "Sony",
    name: "Xperia 1 VI",
    category: "Camera",
    badge: "Alpha Pro Mode",
    rating: 4.6,
    display: '6.5" FHD+ HDR OLED, 1-120Hz Powered by BRAVIA',
    processor: "Snapdragon 8 Gen 3",
    camera: "48MP Exmor T + 12MP Ultra Wide + 12MP 85-170mm Optical Zoom",
    battery: "5000 mAh · 2-Day Battery Claim",
    description:
      "True optical zoom lens inspired by Sony Alpha cameras, 3.5mm headphone jack, and microSD card expansion.",
    image: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=800&q=80",
    colors: [
      {
        name: "Khaki Green",
        hex: "#525C4B",
        image: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Platinum Silver",
        hex: "#CFD4DA",
        image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Black",
        hex: "#191A1D",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
      },
    ],
    variants: [
      { ram: "12GB", storage: "256GB", price: 119999, mrp: 129999 },
      { ram: "12GB", storage: "512GB", price: 129999, mrp: 139999 },
    ],
  },
  {
    id: "motorola-razr-50-ultra",
    brand: "Motorola",
    name: "Razr 50 Ultra",
    category: "Foldable",
    badge: '4.0" Cover Display',
    rating: 4.7,
    display: '6.9" FHD+ pOLED 165Hz + 4.0" External LTPO pOLED',
    processor: "Snapdragon 8s Gen 3",
    camera: "50MP Main OIS + 50MP 2x Portrait Telephoto",
    battery: "4000 mAh · 45W TurboPower & 15W Wireless",
    description:
      "Pocket-friendly clamshell flip with a full-featured external screen for widgets, replies, and camcorder grip.",
    image: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=800&q=80",
    colors: [
      {
        name: "Peach Fuzz",
        hex: "#FFBE98",
        image: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Midnight Blue",
        hex: "#1E293B",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Spring Green",
        hex: "#78A885",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
      },
    ],
    variants: [
      { ram: "12GB", storage: "256GB", price: 79999, mrp: 89999 },
      { ram: "12GB", storage: "512GB", price: 89999, mrp: 99999 },
    ],
  },
  {
    id: "vivo-x200-pro",
    brand: "Vivo",
    name: "Vivo X200 Pro",
    category: "Camera",
    badge: "ZEISS 200MP APO",
    rating: 4.8,
    display: '6.78" Zeiss Master Color AMOLED, 120Hz',
    processor: "MediaTek Dimensity 9400 (3nm)",
    camera: "50MP Sony LYT-818 + 200MP ZEISS APO Telephoto + 50MP UW",
    battery: "6000 mAh · 90W FlashCharge",
    description:
      "Concert and telephoto specialist featuring ZEISS T* coating, V3+ imaging chip, and a massive 6000mAh cell.",
    image: "https://images.unsplash.com/photo-1567581935884-334972355ca6?auto=format&fit=crop&w=800&q=80",
    colors: [
      {
        name: "Titanium Grey",
        hex: "#8E96A0",
        image: "https://images.unsplash.com/photo-1567581935884-334972355ca6?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Cosmos Black",
        hex: "#141619",
        image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80",
      },
    ],
    variants: [
      { ram: "16GB", storage: "256GB", price: 84999, mrp: 89999 },
      { ram: "16GB", storage: "512GB", price: 94999, mrp: 99999 },
    ],
  },
  {
    id: "realme-gt-7-pro",
    brand: "Realme",
    name: "Realme GT 7 Pro",
    category: "Gaming",
    badge: "Value Flagship",
    rating: 4.6,
    display: '6.78" Eco2 OLED Plus, 120Hz, 6000 nits peak',
    processor: "Snapdragon 8 Elite",
    camera: "50MP Sony IMX906 + 50MP 3x Periscope + 8MP Ultra Wide",
    battery: "5800 mAh · 120W SuperVOOC",
    description:
      "High-value flagship speedster combining Snapdragon 8 Elite power, 120W charging, and underwater camera mode.",
    image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80",
    colors: [
      {
        name: "Mars Orange",
        hex: "#D96B38",
        image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80",
      },
      {
        name: "Galaxy Grey",
        hex: "#525866",
        image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80",
      },
    ],
    variants: [
      { ram: "8GB", storage: "128GB", price: 44999, mrp: 49999 },
      { ram: "12GB", storage: "256GB", price: 54999, mrp: 59999 },
      { ram: "16GB", storage: "512GB", price: 59999, mrp: 64999 },
    ],
  },
];