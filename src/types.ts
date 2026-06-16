export type ComponentCategory = 'CPU' | 'GPU' | 'Motherboard' | 'RAM' | 'Storage' | 'PSU' | 'Case' | 'Monitor';

export interface StoreOption {
  storeName: string;
  priceKSh: number;
  url: string;
}

export interface BuildComponent {
  category: ComponentCategory;
  name: string;
  brand: string;
  model: string;
  priceKSh: number;
  specs: {
    socket?: string; // CPU, Motherboard (e.g., LGA1700, AM5, AM4)
    ramType?: 'DDR4' | 'DDR5'; // RAM, Motherboard
    ramSpeed?: string; // e.g. "3200 MHz", "5200 MHz", "6000 MHz"
    formFactor?: 'ATX' | 'Micro-ATX' | 'Mini-ITX'; // Motherboard form factor
    sizeSupport?: string[]; // Case supported form factors (e.g., ["ATX", "Micro-ATX"])
    maxGpuLength?: number; // Case max gpu length in mm
    gpuLength?: number; // GPU length in mm
    powerDraw?: number; // peak power draw in Watts
    wattage?: number; // PSU rated wattage (e.g., 650)
    gpuPowerConnectors?: string; // e.g., "8-pin", "12+4-pin (12VHPWR)", "None"
    psuConnectors?: string[]; // e.g., ["24-pin", "8-pin EPS", "PCIe 8-pin", "12VHPWR"]
    details?: string; // Text description of main specs
  };
  whyThisPick: string;
  sourceName: string; // e.g., "Jumia Kenya", "Skyworld Kenya", "Avechi", "Sky.co.ke", "Phone Place"
  sourceUrl: string;
  alternativeOptions?: StoreOption[];
}

export interface PCBuild {
  components: BuildComponent[];
  totalCostKSh: number;
  budgetKSh: number;
  useCase: 'Gaming' | 'Office' | 'ContentCreation' | 'General';
  excludedCategories: ComponentCategory[];
  sourcingMode?: 'live' | 'estimation' | 'local_catalog';
}

export interface CompatibilityReport {
  compatible: boolean;
  issues: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
