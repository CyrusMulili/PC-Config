export function getCategoryWeights(useCase: string) {
  switch (useCase) {
    case 'Gaming':
      return { CPU: 0.18, GPU: 0.30, Motherboard: 0.10, RAM: 0.08, Storage: 0.08, PSU: 0.08, Case: 0.05, Monitor: 0.13 };
    case 'Office':
      return { CPU: 0.25, GPU: 0.00, Motherboard: 0.14, RAM: 0.12, Storage: 0.14, PSU: 0.08, Case: 0.07, Monitor: 0.20 };
    case 'ContentCreation':
      return { CPU: 0.22, GPU: 0.20, Motherboard: 0.11, RAM: 0.12, Storage: 0.12, PSU: 0.07, Case: 0.06, Monitor: 0.10 };
    case 'General':
    default:
      return { CPU: 0.20, GPU: 0.05, Motherboard: 0.12, RAM: 0.10, Storage: 0.13, PSU: 0.08, Case: 0.07, Monitor: 0.25 };
  }
}

export function calculateTargetBudgets(totalBudget: number, useCase: string, excluded: string[]) {
  const baseWeights = getCategoryWeights(useCase);
  const weights = { ...baseWeights };
  
  // Exclude specified categories by setting their weight to 0
  for (const cat of excluded) {
    if (cat in weights) {
      weights[cat as keyof typeof weights] = 0;
    }
  }
  
  // Calculate total active weight
  const totalActiveWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  
  // Redistribute weights so they sum to 1.0 (if there are active weights)
  const finalBudgets: Record<string, number> = {};
  if (totalActiveWeight > 0) {
    for (const [cat, w] of Object.entries(weights)) {
      if (w > 0) {
        finalBudgets[cat] = Math.round((w / totalActiveWeight) * totalBudget);
      } else {
        finalBudgets[cat] = 0;
      }
    }
  }
  
  return finalBudgets;
}

export function formatKSh(value: number): string {
  return "KSh " + value.toLocaleString();
}
