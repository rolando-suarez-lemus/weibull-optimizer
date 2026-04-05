import { Equipment } from '../shared/contracts.js'

export const EQUIPMENT_PRESETS: Equipment[] = [
  {
    id: 'bearing-skf-6205',
    name: 'SKF 6205 Ball Bearing',
    category: 'bearing',
    weibullParams: {
      beta: 1.7918,
      eta: 715.97,
    },
    mtbf: 636.9,
    costPM: 45,
    costCorrectiva: 850,
    criticality: 'high',
  },
  {
    id: 'pump-centrifugal',
    name: 'Centrifugal Pump (0.5-2 HP)',
    category: 'pump',
    weibullParams: {
      beta: 2.1,
      eta: 1200,
    },
    mtbf: 1050.3,
    costPM: 120,
    costCorrectiva: 1800,
    criticality: 'critical',
  },
  {
    id: 'motor-3phase',
    name: 'Three-Phase Squirrel Cage Motor',
    category: 'motor',
    weibullParams: {
      beta: 1.5,
      eta: 2000,
    },
    mtbf: 1763.3,
    costPM: 150,
    costCorrectiva: 2200,
    criticality: 'critical',
  },
  {
    id: 'valve-solenoid',
    name: 'Solenoid Valve 24VDC',
    category: 'valve',
    weibullParams: {
      beta: 0.9,
      eta: 500,
    },
    mtbf: 542.2,
    costPM: 35,
    costCorrectiva: 650,
    criticality: 'medium',
  },
  {
    id: 'sensor-inductive',
    name: 'Inductive Proximity Sensor M18',
    category: 'sensor',
    weibullParams: {
      beta: 1.3,
      eta: 800,
    },
    mtbf: 762.5,
    costPM: 25,
    costCorrectiva: 400,
    criticality: 'medium',
  },
  {
    id: 'filter-hydraulic',
    name: 'Hydraulic Return Filter 10µm',
    category: 'filter',
    weibullParams: {
      beta: 2.5,
      eta: 600,
    },
    mtbf: 525.8,
    costPM: 50,
    costCorrectiva: 300,
    criticality: 'high',
  },
]

/**
 * Get preset by ID
 */
export function getPresetById(id: string): Equipment | undefined {
  return EQUIPMENT_PRESETS.find((e) => e.id === id)
}

/**
 * Get presets by category
 */
export function getPresetsByCategory(
  category: Equipment['category']
): Equipment[] {
  return EQUIPMENT_PRESETS.filter((e) => e.category === category)
}

/**
 * Extract all unique categories
 */
export function getCategories(): Equipment['category'][] {
  const categories = new Set(EQUIPMENT_PRESETS.map((e) => e.category))
  return Array.from(categories)
}
