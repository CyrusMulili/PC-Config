import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { calculateTargetBudgets } from './src/utils';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize GoogleGenAI SDK
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("WARNING: GEMINI_API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for parsing JSON safely from LLM code block outputs
function cleanAndParseJSON(text: string) {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return JSON.parse(cleaned.trim());
}

// 1. Endpoint: Generate full build
app.post('/api/build/generate', async (req, res) => {
  try {
    const { budgetKSh, useCase, excludedCategories } = req.body;
    
    if (!budgetKSh || isNaN(budgetKSh)) {
      return res.status(400).json({ error: "Invalid budget value." });
    }

    const useCaseLabels: Record<string, string> = {
      Gaming: "smooth gaming performance, favoring GPU and CPU strength",
      Office: "office spreadsheet work, typing, speed, multitasking, favoring RAM, SSD storage and a quality flat monitor (integrated graphics)",
      ContentCreation: "professional video editing, rendering, photo editing, requiring strong multicore CPU, generous RAM, GPU acceleration, and accurate color specs on monitored displays",
      General: "home browsing, media streaming, everyday multitasking, balanced, budget-friendly"
    };

    const targetBudgets = calculateTargetBudgets(Number(budgetKSh), useCase, excludedCategories || []);

    const prompt = `You are an expert PC build advisor for Kenyan buyers.
Generate a complete, compatible, real computer build consisting of 8 components (or fewer if some categories are excluded) based on the following context:
Total Budget: KSh ${budgetKSh}
Use Case: ${useCase} (${useCaseLabels[useCase] || 'balanced build'})
Excluded Component Categories (the user already owns these, do not recommend them): ${excludedCategories && excludedCategories.length ? excludedCategories.join(', ') : 'None'}

Here is a recommended heuristic spending split budget in Kenyan Shillings (KSh) for each active category (aim close to these, but find actual compatible parts):
${JSON.stringify(targetBudgets, null, 2)}

Strict Expert Compatibility Constraints:
- CPU socket must match the Motherboard socket (e.g. LGA1700, AM5, AM4).
- RAM slot type (DDR4 vs DDR5) must be supported by the Motherboard (e.g., if Motherboard uses DDR5, RAM must be DDR5).
- Motherboard form factor (ATX/Micro-ATX/Mini-ITX) must fit inside the chosen Case.
- GPU length must not exceed the Case's maximum GPU clearance (mm).
- PSU wattage must cover the total estimated power draw of all components plus approximately 20% headroom, and must include the correct power connector for the GPU (e.g., PCIe 8-pin or 12VHPWR).

Using your Google Search Grounding:
- Search specifically for real, actual components available from Kenyan stores (such as Jumia Kenya, Avechi, Phone Place Kenya, Skyworld Kenya, Sky.co.ke, or other reliable local sellers).
- Focus on real prices in Kenyan Shillings (KSh).
- If a component has no local listing, find its real international price (e.g. Amazon, PCPartPicker), convert to KSh (roughly 1 USD = 130 KSh), label the sourceName as "International Estimate", and provide a standard global reseller page in sourceUrl.
- Avoid inventing fake component models or fictitious specifications.

Respond ONLY with a JSON object. No other text. The JSON format must be EXACTLY:
{
  "components": [
    {
      "category": "CPU" | "GPU" | "Motherboard" | "RAM" | "Storage" | "PSU" | "Case" | "Monitor",
      "name": "Full product brand, model, and name (e.g., AMD Ryzen 5 5600)",
      "brand": "Brand (e.g., AMD, MSI, Kingston, Corsair)",
      "model": "Model number/code (e.g., Ryzen 5 5600, MAG B650)",
      "priceKSh": number,
      "specs": {
        "socket": "AM4" or "LGA1700" etc. (For CPU and Motherboard)",
        "ramType": "DDR4" or "DDR5" (For Motherboard and RAM)",
        "ramSpeed": "3200 MHz" or "5200 MHz" or "6000 MHz" etc.",
        "formFactor": "ATX" or "Micro-ATX" or "Mini-ITX" (For Motherboard)",
        "sizeSupport": ["ATX", "Micro-ATX", "Mini-ITX"] etc. (For Case - what motherboard sizes it accommodates)",
        "maxGpuLength": number (For Case - max supported clearance in mm, e.g. 350)",
        "gpuLength": number (For GPU - its actual physical length in mm, e.g. 242)",
        "powerDraw": number (Recommended/peak draw in Watts, e.g. 65 for CPU, 120 for GPU, 10 for RAM)",
        "wattage": number (For PSU - output capacity in Watts, e.g. 650)",
        "gpuPowerConnectors": "None", "8-pin", "12+4-pin (12VHPWR)" etc. (For GPU)",
        "psuConnectors": ["24-pin", "PCIe 8-pin", "12VHPWR"] etc. (For PSU)",
        "details": "Summary of other specs (e.g., 6 Cores 12 Threads, Up to 4.4GHz; 1TB NVMe PCIe 4.0; or 1080p 144Hz IPS)"
      },
      "whyThisPick": "Single sentence explanation of why this specific part fits the Kenyan budget, performance, or compatibility needs",
      "sourceName": "Store name, e.g. Jumia Kenya, Avechi, Phone Place, or International Estimate",
      "sourceUrl": "Direct URL from search grounding to verify the pricing/specs",
      "alternativeOptions": [
        {
          "storeName": "Competitor local shop name (e.g., Skyworld, Jumia Kenya, Avechi, Phone Place)",
          "priceKSh": number,
          "url": "Direct verification link to confirm this retailer option's price page"
        }
      ]
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // Instruct for JSON output
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response content from Gemini.");
    }

    const data = cleanAndParseJSON(text);
    return res.json(data);

  } catch (error: any) {
    console.error("Generate error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate PC build." });
  }
});

// 2. Endpoint: Chat assistant adjustment
app.post('/api/build/chat', async (req, res) => {
  try {
    const { currentBuild, message, history } = req.body;

    if (!currentBuild || !message) {
      return res.status(400).json({ error: "Missing currentBuild structure or message text." });
    }

    const conversationHistoryText = history && history.length
      ? history.map((h: any) => `${h.sender === 'user' ? 'Buyer' : 'Advisor'}: ${h.text}`).join('\n')
      : '';

    const prompt = `You are BuildWise, an expert PC build advisor for shoppers in Kenya.
The user is viewing their current computer build, and has inputted a plain language request:
"${message}"

Current Builder Context:
- Target Budget: KSh ${currentBuild.budgetKSh}
- Current Total Price: KSh ${currentBuild.totalCostKSh}
- Intended Use Case: ${currentBuild.useCase}
- Excluded categories: ${currentBuild.excludedCategories && currentBuild.excludedCategories.length ? currentBuild.excludedCategories.join(', ') : 'None'}

Current Build parts List:
${JSON.stringify(currentBuild.components, null, 2)}

Prior conversation log:
${conversationHistoryText}

Your guidelines:
1. Carefully understand the user request (e.g. "swap the GPU for something cheaper," "why this motherboard," "make this better for video editing instead of gaming").
2. Perform Google Search grounding if they are asking to replace, swap, or add components. Ensure you find REAL and fully COMPATIBLE products from Kenyan retailers (or global converted fallback estimation pages) with valid links.
3. Ensure the revised complete set of components stays COMPATIBLE (double check: Cpu socket matching motherboard, RAM speed/type alignment, case dimensions & Motherboard sizing, GPU space in case, PSU power headroom, and power connectors).
4. If they just asked a question, answer it thoroughly in the "reply" section of the JSON and keep the "components" array identical to the current one.
5. If they request a parts substitution, implement it in the "components" list, updating ONLY the parts that need to be changed to satisfy their request (and any corresponding cascading parts required for alignment and compatibility!), keeping the rest unchanged. Maintain correct pricing within KSh ${currentBuild.budgetKSh}. Make sure each updated component contains "alternativeOptions" with 1-2 competitor price references to enable the user to validate prices.

Respond ONLY with a JSON object. No other markdown code ticks or external text. The JSON format must be EXACTLY:
{
  "reply": "Plentiful, helpful explanation answering their question or detailing the exact changes made (e.g. why we swapped, cost impact, and compatibility verification). Write in conversational, clean Markdown.",
  "components": [
    ... Full active array of up to 8 components (CPU, GPU, Motherboard, RAM, Storage, PSU, Case, Monitor), incorporating any updates, with each element having the full BuildComponent structure including any "alternativeOptions" competitor comparisons ...
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini API.");
    }

    const data = cleanAndParseJSON(text);
    return res.json(data);

  } catch (error: any) {
    console.error("Chat error:", error);
    return res.status(500).json({ error: error.message || "Failed to process chat request." });
  }
});

// 3. Endpoint: Swapping candidate search
app.post('/api/build/swap-search', async (req, res) => {
  try {
    const { category, query, currentBuild } = req.body;

    if (!category) {
      return res.status(400).json({ error: "No category provided for swap search." });
    }

    const searchPrompt = `You are a computer hardware expert. Search for matching real specifications for ${category}.
Keyword/Constraints: "${query || 'popular choices'}"
Target builder context: The candidate should fit in a custom KSh budget PC build.

Currently active parts (for compatibility matching):
${JSON.stringify(currentBuild?.components || [], null, 2)}

Find exactly ONE real, current, available component from Kenyan shops (or international estimate with converted KSh price) matching the request.
Ensure it satisfies compatibility (e.g. if the builder already has an AM5 motherboard, a CPU must be AM5 socket; if the motherboard uses DDR5, this RAM must be DDR5; the case must fit motherboard, etc.).

Respond ONLY with a JSON object. Ensure it has the structure:
{
  "component": {
    "category": "${category}",
    "name": "Full product brand, name, and model",
    "brand": "Manufacturer",
    "model": "Model code/ref",
    "priceKSh": number,
    "specs": {
      "socket": "AM4" or "LGA1700" etc. (if CPU/Mobo)",
      "ramType": "DDR4" or "DDR5" (if RAM/Mobo)",
      "ramSpeed": "3200 MHz" etc.",
      "formFactor": "ATX" etc. (if Mobo)",
      "sizeSupport": ["ATX", "Micro-ATX"] etc. (if Case)",
      "maxGpuLength": number (if Case in mm)",
      "gpuLength": number (if GPU in mm)",
      "powerDraw": number (TDP in Watts)",
      "wattage": number (if PSU)",
      "gpuPowerConnectors": "8-pin" etc. (if GPU)",
      "psuConnectors": ["24-pin", "PCIE 8-pin"] (if PSU)",
      "details": "Key hardware specs details description"
    },
    "whyThisPick": "Why this specific alternative satisfies the search query and fits",
    "sourceName": "Store name, e.g. Jumia Kenya, Avechi, Phone Place, or International Estimate",
    "sourceUrl": "Actual retailer link from Google Search grounding",
    "alternativeOptions": [
      {
        "storeName": "Name of competitor retailer (e.g. Skyworld, Avechi, Phone Place, Jumia Kenya)",
        "priceKSh": number,
        "url": "Verifiable direct listing URL for comparison"
      }
    ]
  }
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: searchPrompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from AI for search.");
    }

    const data = cleanAndParseJSON(text);
    return res.json(data);

  } catch (error: any) {
    console.error("Swap search error:", error);
    return res.status(500).json({ error: error.message || "Failed to find alternative component." });
  }
});

// Setup Vite Dev Server / serve static bundle in production
async function main() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log("Mounted Vite Dev Server middleware.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Serving static files from /dist.");
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BuildWise server is running on http://0.0.0.0:${PORT}`);
  });
}

main().catch(err => {
  console.error("Server boot failed:", err);
});
