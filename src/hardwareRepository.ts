export interface HardwareItem {
  category: string;
  name: string;
  brand: string;
  model: string;
  basePriceKSh: number;
  specs: any;
  whyThisPick: string;
  sourceName: string;
  sourceUrl: string;
  alternativeOptions: any[];
}

export const HARDWARE_REPOSITORY: HardwareItem[] = [
  // --- CPU ---
  {
    category: "CPU",
    name: "Intel Core i3-10100F (3.6 GHz)",
    brand: "Intel",
    model: "i3-10100F",
    basePriceKSh: 10000,
    specs: { socket: "LGA1200", ramType: "DDR4", powerDraw: 65, details: "4 Cores, 8 Threads, 6MB Cache, up to 4.3 GHz" },
    whyThisPick: "Ultra-budget choice for entry-level tasks, pairing perfectly with affordable LGA1200 motherboards.",
    sourceName: "Skyworld Kenya",
    sourceUrl: "https://skyworld.co.ke/",
    alternativeOptions: [
      { storeName: "Jumia Kenya", priceKSh: 10800, url: "https://www.jumia.co.ke/" }
    ]
  },
  {
    category: "CPU",
    name: "Intel Core i3-12100F (3.3 GHz)",
    brand: "Intel",
    model: "i3-12100F",
    basePriceKSh: 13500,
    specs: { socket: "LGA1700", ramType: "DDR4", powerDraw: 65, details: "4 Cores, 8 Threads, 12MB Cache, up to 4.3 GHz" },
    whyThisPick: "Amazing entry-level 12th gen CPU providing stellar single-core speed for gaming or office work on a budget.",
    sourceName: "Skyworld Kenya",
    sourceUrl: "https://skyworld.co.ke/",
    alternativeOptions: [
      { storeName: "Jumia Kenya", priceKSh: 14200, url: "https://www.jumia.co.ke/" },
      { storeName: "Avechi", priceKSh: 13900, url: "https://avechi.co.ke/" }
    ]
  },
  {
    category: "CPU",
    name: "AMD Ryzen 5 5600 (3.5 GHz)",
    brand: "AMD",
    model: "Ryzen 5 5600",
    basePriceKSh: 18500,
    specs: { socket: "AM4", ramType: "DDR4", powerDraw: 65, details: "6 Cores, 12 Threads, 32MB L3 Cache, PCIe 4.0" },
    whyThisPick: "Best value-for-money tier AM4 gaming CPU with incredible power efficiency and robust multi-thread capabilities.",
    sourceName: "Avechi",
    sourceUrl: "https://avechi.co.ke/",
    alternativeOptions: [
      { storeName: "Skyworld Kenya", priceKSh: 19200, url: "https://skyworld.co.ke/" },
      { storeName: "Phone Place", priceKSh: 18999, url: "https://www.thephoneplacekenya.com/" }
    ]
  },
  {
    category: "CPU",
    name: "Intel Core i5-12400F (2.5 GHz)",
    brand: "Intel",
    model: "i5-12400F",
    basePriceKSh: 21000,
    specs: { socket: "LGA1700", ramType: "DDR4", powerDraw: 65, details: "6 Cores, 12 Threads, 18MB Cache, up to 4.4 GHz" },
    whyThisPick: "Solid mid-range Alder Lake CPU featuring 6 performance cores, ideal for creative multitasking and high-frame gaming.",
    sourceName: "Skyworld Kenya",
    sourceUrl: "https://skyworld.co.ke/",
    alternativeOptions: [
      { storeName: "Jumia Kenya", priceKSh: 22000, url: "https://www.jumia.co.ke/" },
      { storeName: "Avechi", priceKSh: 21500, url: "https://avechi.co.ke/" }
    ]
  },
  {
    category: "CPU",
    name: "AMD Ryzen 5 7600 (3.8 GHz)",
    brand: "AMD",
    model: "Ryzen 5 7600",
    basePriceKSh: 31500,
    specs: { socket: "AM5", ramType: "DDR5", powerDraw: 65, details: "6 Cores, 12 Threads, Zen 4 Architecture, includes Wraith Stealth cooler" },
    whyThisPick: "Future-proof AM5 Zen 4 CPU utilizing blazing-fast DDR5 memory bandwidth for creator and top-tier workstation setups.",
    sourceName: "Avechi",
    sourceUrl: "https://avechi.co.ke/",
    alternativeOptions: [
      { storeName: "Phone Place", priceKSh: 32500, url: "https://www.thephoneplacekenya.com/" },
      { storeName: "Skyworld Kenya", priceKSh: 31900, url: "https://skyworld.co.ke/" }
    ]
  },
  {
    category: "CPU",
    name: "Intel Core i7-13700K (3.4 GHz)",
    brand: "Intel",
    model: "i7-13700K",
    basePriceKSh: 56000,
    specs: { socket: "LGA1700", ramType: "DDR5", powerDraw: 125, details: "16 Cores (8P + 8E), 24 Threads, 30MB Cache, up to 5.4 GHz" },
    whyThisPick: "Top of the line heavy workstation CPU representing maximum creator speed and unparalleled rendering bandwidth.",
    sourceName: "Skyworld Kenya",
    sourceUrl: "https://skyworld.co.ke/",
    alternativeOptions: [
      { storeName: "Avechi", priceKSh: 57500, url: "https://avechi.co.ke/" }
    ]
  },

  // --- Motherboard ---
  {
    category: "Motherboard",
    name: "MSI H610M-E DDR4 Micro-ATX",
    brand: "MSI",
    model: "H610M-E",
    basePriceKSh: 11000,
    specs: { socket: "LGA1700", ramType: "DDR4", formFactor: "Micro-ATX", details: "Intel LGA1700, 2x DDR4 Slots, PCIe 4.0, M.2 Slot" },
    whyThisPick: "Super dependable, reliable budget Intel motherboard offering all necessary lanes structure in a compact Micro-ATX shape.",
    sourceName: "Skyworld Kenya",
    sourceUrl: "https://skyworld.co.ke/",
    alternativeOptions: [
      { storeName: "Jumia Kenya", priceKSh: 11800, url: "https://www.jumia.co.ke/" }
    ]
  },
  {
    category: "Motherboard",
    name: "Gigabyte H410M H Micro-ATX",
    brand: "Gigabyte",
    model: "H410M H",
    basePriceKSh: 9500,
    specs: { socket: "LGA1200", ramType: "DDR4", formFactor: "Micro-ATX", details: "Support 10th Gen Core, Dual Channel DDR4, NVMe slot" },
    whyThisPick: "Ultra savings choice motherboard perfect for office setups keeping build rates tightly aligned.",
    sourceName: "Jumia Kenya",
    sourceUrl: "https://www.jumia.co.ke/",
    alternativeOptions: [
      { storeName: "Skyworld Kenya", priceKSh: 9900, url: "https://skyworld.co.ke/" }
    ]
  },
  {
    category: "Motherboard",
    name: "ASRock B450M-HDV R4.0 Micro-ATX",
    brand: "ASRock",
    model: "B450M-HDV",
    basePriceKSh: 10500,
    specs: { socket: "AM4", ramType: "DDR4", formFactor: "Micro-ATX", details: "AMD AM4 Socket, Ultra M.2, HDMI/DVI/D-Sub video outputs" },
    whyThisPick: "Very solid AM4 budget motherboard permitting standard memory profiles and straightforward BIOS layouts.",
    sourceName: "Avechi",
    sourceUrl: "https://avechi.co.ke/",
    alternativeOptions: [
      { storeName: "Skyworld Kenya", priceKSh: 11000, url: "https://skyworld.co.ke/" }
    ]
  },
  {
    category: "Motherboard",
    name: "Gigabyte B550M DS3H Micro-ATX",
    brand: "Gigabyte",
    model: "B550M DS3H",
    basePriceKSh: 15500,
    specs: { socket: "AM4", ramType: "DDR4", formFactor: "Micro-ATX", details: "PCIe 4.0 x16, Dual NVMe Slots, Robust 5+3 Phases Digital VRM" },
    whyThisPick: "Highly recommended AM4 motherboard supporting PCIe Gen 4.0 speeds directly for fast storage reads and modern GPUs.",
    sourceName: "Skyworld Kenya",
    sourceUrl: "https://skyworld.co.ke/",
    alternativeOptions: [
      { storeName: "Avechi", priceKSh: 16200, url: "https://avechi.co.ke/" }
    ]
  },
  {
    category: "Motherboard",
    name: "ASUS Prime B760M-K DDR4 Micro-ATX",
    brand: "ASUS",
    model: "B760M-K",
    basePriceKSh: 16800,
    specs: { socket: "LGA1700", ramType: "DDR4", formFactor: "Micro-ATX", details: "Intel LGA1700, 2.5Gb Ethernet, Rear USB 3.2 Gen 1" },
    whyThisPick: "An excellent mid-tier choice optimized for 12th and 13th gen intel processors with robust VRMs and power phases.",
    sourceName: "Skyworld Kenya",
    sourceUrl: "https://skyworld.co.ke/",
    alternativeOptions: [
      { storeName: "Avechi", priceKSh: 17500, url: "https://avechi.co.ke/" }
    ]
  },
  {
    category: "Motherboard",
    name: "MSI PRO B650M-A WIFI Micro-ATX",
    brand: "MSI",
    model: "PRO B650M-A WIFI",
    basePriceKSh: 26500,
    specs: { socket: "AM5", ramType: "DDR5", formFactor: "Micro-ATX", details: "Supports AMD Ryzen 7000/8000 series, 4x DDR5 Slots, PCIe 4.0, Wi-Fi 6E" },
    whyThisPick: "Premium AM5 motherboard equipped with high-speed wireless networking, multiple M.2 slots, and DDR5 performance matrix.",
    sourceName: "Avechi",
    sourceUrl: "https://avechi.co.ke/",
    alternativeOptions: [
      { storeName: "Skyworld Kenya", priceKSh: 27900, url: "https://skyworld.co.ke/" }
    ]
  },

  // --- GPU ---
  {
    category: "GPU",
    name: "Biostar Radeon RX 580 8GB",
    brand: "Biostar",
    model: "RX 580 8GB",
    basePriceKSh: 17500,
    specs: { gpuLength: 210, powerDraw: 150, gpuPowerConnectors: "8-pin", details: "8GB GDDR5 VRAM, Polaris architecture, HDMI/DisplayPort outputs" },
    whyThisPick: "Budget gaming champion providing massive 8GB workspace framebuffers for high texture modern esports titles.",
    sourceName: "Jumia Kenya",
    sourceUrl: "https://www.jumia.co.ke/",
    alternativeOptions: [
      { storeName: "Skyworld Kenya", priceKSh: 18505, url: "https://skyworld.co.ke/" }
    ]
  },
  {
    category: "GPU",
    name: "Asus Phoenix GeForce GTX 1650 4GB",
    brand: "Asus",
    model: "GTX 1650",
    basePriceKSh: 21500,
    specs: { gpuLength: 174, powerDraw: 75, gpuPowerConnectors: "None", details: "4GB GDDR5 VRAM, Single compact fan, no external power cables needed" },
    whyThisPick: "Extremely efficient entry card requiring zero connectors; perfect for upgrading small factor pre-built office cases.",
    sourceName: "Skyworld Kenya",
    sourceUrl: "https://skyworld.co.ke/",
    alternativeOptions: [
      { storeName: "Jumia Kenya", priceKSh: 22800, url: "https://www.jumia.co.ke/" }
    ]
  },
  {
    category: "GPU",
    name: "Gigabyte GeForce RTX 3050 Windforce OC 8GB",
    brand: "Gigabyte",
    model: "RTX 3050 Windforce",
    basePriceKSh: 35500,
    specs: { gpuLength: 242, powerDraw: 130, gpuPowerConnectors: "8-pin", details: "8GB GDDR6 VRAM, DLSS 2.0 and Ray Tracing support" },
    whyThisPick: "Affordable gateway RTX card providing Tensor cores for seamless upscaling, machine learning, and hardware streaming encoder.",
    sourceName: "Avechi",
    sourceUrl: "https://avechi.co.ke/",
    alternativeOptions: [
      { storeName: "Skyworld Kenya", priceKSh: 36900, url: "https://skyworld.co.ke/" }
    ]
  },
  {
    category: "GPU",
    name: "MSI GeForce RTX 4060 Ventus 2X Black 8GB OC",
    brand: "MSI",
    model: "RTX 4060 Ventus 2X",
    basePriceKSh: 52000,
    specs: { gpuLength: 199, powerDraw: 115, gpuPowerConnectors: "8-pin", details: "8GB GDDR6 VRAM, DLSS 3.0 Frame Generation, ultra energy efficient" },
    whyThisPick: "Latest-generation NVIDIA Ada Lovelace graphics card offering stellar DLSS 3 Frame Gen gains for high refresh 1080p gaming.",
    sourceName: "Skyworld Kenya",
    sourceUrl: "https://skyworld.co.ke/",
    alternativeOptions: [
      { storeName: "Avechi", priceKSh: 53500, url: "https://avechi.co.ke/" }
    ]
  },
  {
    category: "GPU",
    name: "Sapphire Pulse Radeon RX 6700 XT 12GB",
    brand: "Sapphire",
    model: "RX 6700 XT Pulse",
    basePriceKSh: 63000,
    specs: { gpuLength: 260, powerDraw: 230, gpuPowerConnectors: "8-pin + 6-pin", details: "12GB GDDR6 VRAM, ideal for ultra settings 1440p gaming resolution" },
    whyThisPick: "Superior choice featuring massive 12GB framebuffer, fully outclassing same price tier alternatives for modern textured AAA gaming.",
    sourceName: "Avechi",
    sourceUrl: "https://avechi.co.ke/",
    alternativeOptions: [
      { storeName: "Skyworld Kenya", priceKSh: 64900, url: "https://skyworld.co.ke/" }
    ]
  },
  {
    category: "GPU",
    name: "Zotac Gaming GeForce RTX 4070 Super Twin Edge 12GB",
    brand: "Zotac",
    model: "RTX 4070 Super Twin Edge",
    basePriceKSh: 98000,
    specs: { gpuLength: 234, powerDraw: 220, gpuPowerConnectors: "12VHPWR (or 2x PCIe 8-pin with adapter)", details: "12GB GDDR6X, high end rendering workstation, Ada Lovelace" },
    whyThisPick: "Outstanding premium GPU choice for content creators demanding heavy rendering speed, CUDA acceleration, and ultra settings gaming.",
    sourceName: "Skyworld Kenya",
    sourceUrl: "https://skyworld.co.ke/",
    alternativeOptions: [
      { storeName: "Avechi", priceKSh: 99999, url: "https://avechi.co.ke/" }
    ]
  },

  // --- RAM ---
  {
    category: "RAM",
    name: "Kingston Fury Beast 8GB DDR4 3200MHz",
    brand: "Kingston",
    model: "Fury Beast DDR4",
    basePriceKSh: 3800,
    specs: { ramType: "DDR4", ramSpeed: "3200 MHz", details: "Single module, low profile heatspreader, Intel XMP & AMD Ryzen ready" },
    whyThisPick: "The absolute standard for budget computer setups, reliable timing profiles and low structural heat signature.",
    sourceName: "Jumia Kenya",
    sourceUrl: "https://www.jumia.co.ke/",
    alternativeOptions: [
      { storeName: "Skyworld Kenya", priceKSh: 4200, url: "https://skyworld.co.ke/" }
    ]
  },
  {
    category: "RAM",
    name: "Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200MHz",
    brand: "Corsair",
    model: "Vengeance LPX",
    basePriceKSh: 7200,
    specs: { ramType: "DDR4", ramSpeed: "3200 MHz", details: "Dual-channel kit, black aluminum heatspreaders, CL16 latency" },
    whyThisPick: "Dual channel performance ensures optimal memory bus bandwidth, boosting system loading speed and task response frames.",
    sourceName: "Skyworld Kenya",
    sourceUrl: "https://skyworld.co.ke/",
    alternativeOptions: [
      { storeName: "Avechi", priceKSh: 7600, url: "https://avechi.co.ke/" },
      { storeName: "Jumia Kenya", priceKSh: 7450, url: "https://www.jumia.co.ke/" }
    ]
  },
  {
    category: "RAM",
    name: "Crucial Basic 16GB DDR5 4800MHz",
    brand: "Crucial",
    model: "Crucial DDR5",
    basePriceKSh: 9500,
    specs: { ramType: "DDR5", ramSpeed: "4800 MHz", details: "Single stick module, next-gen memory standard, high data transfer rates" },
    whyThisPick: "Entry level DDR5 choice providing faster processing capability suited for modern motherboards.",
    sourceName: "Skyworld Kenya",
    sourceUrl: "https://skyworld.co.ke/",
    alternativeOptions: [
      { storeName: "Avechi", priceKSh: 9990, url: "https://avechi.co.ke/" }
    ]
  },
  {
    category: "RAM",
    name: "Corsair Vengeance 32GB (2x16GB) DDR5 5600MHz",
    brand: "Corsair",
    model: "Vengeance DDR5 Kit",
    basePriceKSh: 17800,
    specs: { ramType: "DDR5", ramSpeed: "5600 MHz", details: "Dual Channel Kit, optimized for Intel/AMD, onboard voltage regulation, XMP 3.0" },
    whyThisPick: "Enormous 32GB workspace speed perfect for complex design apps, extreme heavy gaming bundles, or video rendering pipelines.",
    sourceName: "Avechi",
    sourceUrl: "https://avechi.co.ke/",
    alternativeOptions: [
      { storeName: "Skyworld Kenya", priceKSh: 18500, url: "https://skyworld.co.ke/" }
    ]
  },

  // --- Storage ---
  {
    category: "Storage",
    name: "Adata SU650 240GB 2.5'' SATA SSD",
    brand: "Adata",
    model: "SU650 240GB",
    basePriceKSh: 3500,
    specs: { details: "SATA III 6Gb/s, up to 520MB/s read, 3D NAND flash, 240GB capacity" },
    whyThisPick: "Awesome extreme budget SSD, replacing slow clunky HDDs to ensure blazing fast booting and responsiveness.",
    sourceName: "Jumia Kenya",
    sourceUrl: "https://www.jumia.co.ke/",
    alternativeOptions: [
      { storeName: "Skyworld Kenya", priceKSh: 3800, url: "https://skyworld.co.ke/" }
    ]
  },
  {
    category: "Storage",
    name: "HP S750 500GB 2.5'' SATA SSD",
    brand: "HP",
    model: "S750 500GB",
    basePriceKSh: 5200,
    specs: { details: "SATA III, 3D NAND, up to 560MB/s read, read/write acceleration" },
    whyThisPick: "Dependant 500GB SSD offering adequate room for OS, software suites, and several primary workspace projects.",
    sourceName: "Skyworld Kenya",
    sourceUrl: "https://skyworld.co.ke/",
    alternativeOptions: [
      { storeName: "Jumia Kenya", priceKSh: 5500, url: "https://www.jumia.co.ke/" }
    ]
  },
  {
    category: "Storage",
    name: "Kingston NV2 1TB PCIe 4.0 NVMe M.2 SSD",
    brand: "Kingston",
    model: "NV2 1TB",
    basePriceKSh: 8800,
    specs: { details: "M.2 2280 form factor, PCIe Gen 4x4, up to 3500MB/s read, 2100MB/s write speed" },
    whyThisPick: "Ultra quick NVMe storage option giving immense speed lanes directly into CPU without cumbersome power lines.",
    sourceName: "Skyworld Kenya",
    sourceUrl: "https://skyworld.co.ke/",
    alternativeOptions: [
      { storeName: "Jumia Kenya", priceKSh: 9400, url: "https://www.jumia.co.ke/" },
      { storeName: "Avechi", priceKSh: 9100, url: "https://avechi.co.ke/" }
    ]
  },
  {
    category: "Storage",
    name: "Samsung 980 Pro 1TB NVMe M.2 SSD",
    brand: "Samsung",
    model: "Samsung 980 Pro",
    basePriceKSh: 15500,
    specs: { details: "PCIe 4.0 NVMe, V-NAND technology, up to 7000MB/s reads, heatspreader integration" },
    whyThisPick: "The absolute benchmark for professional creator storage, with incredible continuous heavy rendering read rates.",
    sourceName: "Avechi",
    sourceUrl: "https://avechi.co.ke/",
    alternativeOptions: [
      { storeName: "Skyworld Kenya", priceKSh: 16500, url: "https://skyworld.co.ke/" }
    ]
  },

  // --- PSU ---
  {
    category: "PSU",
    name: "Antec Atom 450W PSU",
    brand: "Antec",
    model: "Atom 450W",
    basePriceKSh: 4200,
    specs: { wattage: 450, psuConnectors: ["24-pin", "8-pin (4+4) EPS", "1x PCIe 8-pin"], details: "450W constant power output, 120mm silent fan design, overvoltage protection" },
    whyThisPick: "Trustworthy cost-friendly power supply ensuring solid voltage regulation for general and office configurations.",
    sourceName: "Skyworld Kenya",
    sourceUrl: "https://skyworld.co.ke/",
    alternativeOptions: [
      { storeName: "Jumia Kenya", priceKSh: 4500, url: "https://www.jumia.co.ke/" }
    ]
  },
  {
    category: "PSU",
    name: "Deepcool DE600 v2 600W Power Supply",
    brand: "Deepcool",
    model: "DE600 v2",
    basePriceKSh: 5800,
    specs: { wattage: 600, psuConnectors: ["24-pin", "1x CPU 4+4-pin", "2x PCIe 8-pin (6+2)"], details: "Peak 605 Watts capacity, 120mm smart cooling fan, multi-protection guards" },
    whyThisPick: "Excellent pricing structure providing adequate headroom and standard PCIe ports to power budget GPUs.",
    sourceName: "Skyworld Kenya",
    sourceUrl: "https://skyworld.co.ke/",
    alternativeOptions: [
      { storeName: "Avechi", priceKSh: 6100, url: "https://avechi.co.ke/" }
    ]
  },
  {
    category: "PSU",
    name: "Corsair CV650 650W 80 Plus Bronze",
    brand: "Corsair",
    model: "CV650 Bronze",
    basePriceKSh: 8900,
    specs: { wattage: 650, psuConnectors: ["24-pin", "2x CPU EPS 8-pin", "2x PCIe 8-pin"], details: "80 Plus Bronze certified continuous power, silent fan curve profiles" },
    whyThisPick: "Bronze certified guaranteed reliability, providing quiet continuous execution safely shielding system components.",
    sourceName: "Avechi",
    sourceUrl: "https://avechi.co.ke/",
    alternativeOptions: [
      { storeName: "Skyworld Kenya", priceKSh: 9400, url: "https://skyworld.co.ke/" }
    ]
  },
  {
    category: "PSU",
    name: "Cooler Master MWE Gold 750W V2 Full Modular",
    brand: "Cooler Master",
    model: "MWE 750W Gold V2",
    basePriceKSh: 13900,
    specs: { wattage: 750, psuConnectors: ["24-pin", "2x PCIe 8-pin", "1x 12VHPWR"], details: "80 Plus Gold Certified, Fully Modular cable structure, active FDB fan" },
    whyThisPick: "Premium fully modular power supply giving incredible efficiency, clean cables management, and peak safety guards.",
    sourceName: "Skyworld Kenya",
    sourceUrl: "https://skyworld.co.ke/",
    alternativeOptions: [
      { storeName: "Avechi", priceKSh: 14500, url: "https://avechi.co.ke/" }
    ]
  },

  // --- Case ---
  {
    category: "Case",
    name: "Zeal Gaming Case with 3 RED Fans",
    brand: "Zeal",
    model: "Zeal Red Star",
    basePriceKSh: 4500,
    specs: { sizeSupport: ["ATX", "Micro-ATX"], maxGpuLength: 320, details: "Chassis with acrylic side panel, 3 pre-installed 120mm red LED ventilation fans" },
    whyThisPick: "Excellent value case coming loaded with three functional fans, which delivers superb airflow straight away.",
    sourceName: "Jumia Kenya",
    sourceUrl: "https://www.jumia.co.ke/",
    alternativeOptions: [
      { storeName: "Skyworld Kenya", priceKSh: 4800, url: "https://skyworld.co.ke/" }
    ]
  },
  {
    category: "Case",
    name: "Antec NX200M Micro-ATX Glass Elite",
    brand: "Antec",
    model: "NX200M",
    basePriceKSh: 5500,
    specs: { sizeSupport: ["Micro-ATX", "Mini-ITX"], maxGpuLength: 275, details: "Mesh front panel, tempered glass window, support for 240mm radiators" },
    whyThisPick: "Beautiful professional micro-ATX chassis sporting modern meshed front face and pristine glass window showcase.",
    sourceName: "Skyworld Kenya",
    sourceUrl: "https://skyworld.co.ke/",
    alternativeOptions: [
      { storeName: "Avechi", priceKSh: 5800, url: "https://avechi.co.ke/" }
    ]
  },
  {
    category: "Case",
    name: "Deepcool CC560 WH Mid-Tower Case",
    brand: "Deepcool",
    model: "CC560 WH",
    basePriceKSh: 7800,
    specs: { sizeSupport: ["ATX", "Micro-ATX", "Mini-ITX"], maxGpuLength: 370, details: "4 pre-installed LED fans, full glass side window, dust mesh top filters" },
    whyThisPick: "Spacious ATX case with exceptional GPU length clearance, guaranteeing support for large multi-fan cards.",
    sourceName: "Skyworld Kenya",
    sourceUrl: "https://skyworld.co.ke/",
    alternativeOptions: [
      { storeName: "Avechi", priceKSh: 8200, url: "https://avechi.co.ke/" }
    ]
  },

  // --- Monitor ---
  {
    category: "Monitor",
    name: "Vitron 19-inch Widescreen monitor",
    brand: "Vitron",
    model: "VT1900M",
    basePriceKSh: 6800,
    specs: { details: "LED Panel display, HD 1366 x 768 resolution, standard HDMI input port, slim sleek bezel" },
    whyThisPick: "The lowest entry screen option available locally, serving basic browsing tasks at rock bottom cost rates.",
    sourceName: "Jumia Kenya",
    sourceUrl: "https://www.jumia.co.ke/",
    alternativeOptions: [
      { storeName: "Skyworld", priceKSh: 7200, url: "https://skyworld.co.ke/" }
    ]
  },
  {
    category: "Monitor",
    name: "Hikvision DS-D5022FN-C 22-inch IPS FHD",
    brand: "Hikvision",
    model: "DS-D5022FN-C",
    basePriceKSh: 11500,
    specs: { details: "21.5'' diagonal active area, IPS 178 degree visual angle view, full HD 1080p, 60Hz rate" },
    whyThisPick: "Incredible full HD IPS display that offers beautiful colors and wide viewing angles, perfect for office or general work.",
    sourceName: "Skyworld Kenya",
    sourceUrl: "https://skyworld.co.ke/",
    alternativeOptions: [
      { storeName: "Jumia Kenya", priceKSh: 12500, url: "https://www.jumia.co.ke/" }
    ]
  },
  {
    category: "Monitor",
    name: "Asus VY249HE 24-inch Eye Care IPS 75Hz",
    brand: "Asus",
    model: "VY249HE",
    basePriceKSh: 16500,
    specs: { details: "23.8 inch Full HD (1920x1080), IPS, 75Hz refresh, FreeSync, Eye care anti-flicker blue light filters" },
    whyThisPick: "Premium panel featuring anti-bacterial coatings and eye protection filters, excellent for students or coding environments.",
    sourceName: "Skyworld Kenya",
    sourceUrl: "https://skyworld.co.ke/",
    alternativeOptions: [
      { storeName: "Avechi", priceKSh: 17200, url: "https://avechi.co.ke/" }
    ]
  },
  {
    category: "Monitor",
    name: "Samsung Odyssey G3 24'' 144Hz Gaming Monitor",
    brand: "Samsung",
    model: "Odyssey G3",
    basePriceKSh: 23500,
    specs: { details: "24-inch FHD, 144Hz high refresh rates, AMD FreeSync Premium, 1ms response speeds" },
    whyThisPick: "Absolute gaming essential with blazing 144Hz speed refresh rates for buttery smooth frame translations.",
    sourceName: "Avechi",
    sourceUrl: "https://avechi.co.ke/",
    alternativeOptions: [
      { storeName: "Skyworld Kenya", priceKSh: 24500, url: "https://skyworld.co.ke/" },
      { storeName: "Phone Place", priceKSh: 24300, url: "https://www.thephoneplacekenya.com/" }
    ]
  }
];
