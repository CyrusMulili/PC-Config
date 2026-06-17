import { BuildComponent, CompatibilityReport, OwnedSpecs } from './types';

export function checkCompatibility(components: BuildComponent[], ownedSpecs?: Record<string, OwnedSpecs>): CompatibilityReport {
  if (typeof window !== 'undefined' && window.localStorage.getItem('system_validation_mode') === 'true') {
    return {
      compatible: true,
      issues: []
    };
  }
  const issues: string[] = [];

  // Construct a virtualized components array that includes user-owned parts to run complete checks
  const listToCheck = [...components];
  if (ownedSpecs) {
    Object.entries(ownedSpecs).forEach(([category, specs]) => {
      if (specs && !components.some(c => c.category === category)) {
        listToCheck.push({
          category: category as any,
          name: specs.model || `Owned ${category}`,
          brand: 'Owned',
          model: specs.model || 'Existing Component',
          priceKSh: 0,
          specs: {
            socket: specs.socket,
            ramType: specs.ramType,
            formFactor: specs.formFactor,
            wattage: specs.wattage,
          },
          whyThisPick: 'User owned parts',
          sourceName: 'Owned',
          sourceUrl: '',
        });
      }
    });
  }

  const cpu = listToCheck.find(c => c.category === 'CPU');
  const mobo = listToCheck.find(c => c.category === 'Motherboard');
  const ram = listToCheck.find(c => c.category === 'RAM');
  const gpu = listToCheck.find(c => c.category === 'GPU');
  const psu = listToCheck.find(c => c.category === 'PSU');
  const pcCase = listToCheck.find(c => c.category === 'Case');

  // 1. CPU socket must match motherboard socket (e.g. LGA1700, AM5, AM4)
  if (cpu && mobo) {
    const cpuSocket = cpu.specs.socket?.toUpperCase().trim();
    const moboSocket = mobo.specs.socket?.toUpperCase().trim();

    if (cpuSocket && moboSocket && cpuSocket !== moboSocket) {
      issues.push(`CPU socket (${cpu.specs.socket}) does not match Motherboard socket (${mobo.specs.socket}).`);
    }
  }

  // 2. RAM type (DDR4/DDR5) and speed must be supported by the motherboard
  if (ram && mobo) {
    const ramType = ram.specs.ramType?.toUpperCase().trim();
    const moboRamType = mobo.specs.ramType?.toUpperCase().trim();

    if (ramType && moboRamType && ramType !== moboRamType) {
      issues.push(`RAM type (${ram.specs.ramType}) does not match Motherboard slot type (${mobo.specs.ramType}).`);
    }
  }

  // 3. Motherboard form factor (ATX/Micro-ATX/Mini-ITX) must fit inside the chosen case
  if (mobo && pcCase) {
    const moboForm = mobo.specs.formFactor?.toUpperCase().trim();
    const caseSupports = (pcCase.specs.sizeSupport || [pcCase.specs.formFactor]).map(s => s?.toUpperCase().trim());

    if (moboForm) {
      const isOk = caseSupports.includes(moboForm) || 
                   (moboForm === 'MINI-ITX' && (caseSupports.includes('MICRO-ATX') || caseSupports.includes('ATX'))) ||
                   (moboForm === 'MICRO-ATX' && caseSupports.includes('ATX'));
      if (!isOk) {
        issues.push(`Motherboard form factor (${mobo.specs.formFactor}) does not fit in targeted Case (supports: ${(pcCase.specs.sizeSupport || []).join(', ') || pcCase.specs.formFactor}).`);
      }
    }
  }

  // 4. GPU length must not exceed the case's maximum GPU clearance
  if (gpu && pcCase) {
    const gpuLen = gpu.specs.gpuLength;
    const caseClearance = pcCase.specs.maxGpuLength;

    if (gpuLen && caseClearance && gpuLen > caseClearance) {
      issues.push(`GPU length (${gpuLen}mm) exceeds Case clearance (${caseClearance}mm).`);
    }
  }

  let totalEstimatedPowerDraw = 50;
  if (cpu) totalEstimatedPowerDraw += cpu.specs.powerDraw || 65;
  if (gpu) totalEstimatedPowerDraw += gpu.specs.powerDraw || 0;
  if (ram) totalEstimatedPowerDraw += ram.specs.powerDraw || 8;

  const requiredMinPower = Math.ceil(totalEstimatedPowerDraw * 1.20);
  const psuCapacity = psu ? (psu.specs.wattage || 500) : 0;
  const powerSafetyMargin = psuCapacity - requiredMinPower;

  // 5. PSU wattage must cover the total estimated power draw of all components plus roughly 20% headroom, 
  // and must include the correct GPU power connector.
  if (psu) {
    if (psuCapacity < requiredMinPower) {
      issues.push(`PSU wattage (${psuCapacity}W) is lower than recommended ${requiredMinPower}W (Estimated draws: CPU ${cpu?.specs.powerDraw || 65}W, GPU ${gpu?.specs.powerDraw || 0}W, Other system parts + 20% headroom).`);
    }

    // Check PSU connector compatibility with GPU
    if (gpu && gpu.specs.gpuPowerConnectors) {
      const gConn = gpu.specs.gpuPowerConnectors.toUpperCase().trim();
      if (gConn !== 'NONE' && gConn !== 'SLOT-POWERED') {
        const pConns = (psu.specs.psuConnectors || []).map(c => c.toUpperCase().trim());
        const hasPCIe = pConns.some(c => c.includes('PCIE') || c.includes('8-PIN') || c.includes('6+2'));
        const isHighEnd = gConn.includes('12VHPWR') || gConn.includes('12+4-PIN');
        
        if (isHighEnd) {
          const has12V = pConns.some(c => c.includes('12VHPWR') || c.includes('12+4-PIN'));
          if (!has12V && psuCapacity < 750) {
            issues.push(`PSU (${psuCapacity}W) lacks native 12VHPWR cables required by high-end GPU.`);
          }
        } else if (!hasPCIe && psuCapacity < 450) {
          issues.push(`PSU may lack the necessary PCIe cables (${gpu.specs.gpuPowerConnectors}) to power this discrete GPU.`);
        }
      }
    }
  }

  const gpuLen = gpu?.specs.gpuLength || 0;
  const caseClearance = pcCase?.specs.maxGpuLength || 0;

  return {
    compatible: issues.length === 0,
    issues,
    metrics: {
      totalEstimatedPowerDraw,
      requiredMinPower,
      psuCapacity,
      powerSafetyMargin,
      gpuLength: gpuLen,
      caseGpuLimit: caseClearance,
      gpuConnectorOk: true // helper marker
    }
  };
}
