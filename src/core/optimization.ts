import { PMOptimizationResult } from '../shared/contracts.js'
import { reliability, mtbf } from './weibull.js'

/**
 * Optimize preventive maintenance frequency
 * Minimizes total cost: (costPM / interval) + (costCorrectiva × unavailability)
 *
 * Steps:
 * 1. Grid search from 1 hour to MTBF with step size
 * 2. For each interval, calculate:
 *    - Reliability at that interval: R(interval)
 *    - Availability: R(interval)
 *    - Unavailability: 1 - R(interval)
 *    - Total cost: (costPM / interval) + (costCorrectiva × unavailability)
 * 3. Find interval with minimum total cost
 * 4. Verify meets availability_target
 */
export function optimizeMaintenanceFrequency(
  beta: number,
  eta: number,
  costPM: number,
  costCorrectiva: number,
  availabilityTarget: number = 0.99, // 99% default
  maxIterations: number = 100
): PMOptimizationResult {
  // Input validation
  if (beta <= 0 || eta <= 0 || costPM <= 0 || costCorrectiva <= 0) {
    return {
      optimalIntervalHours: 0,
      totalCostAnnual: Infinity,
      reliabilityAtOptimal: 0,
      unavailabilityRate: 1,
    }
  }

  const mtbfValue = mtbf(beta, eta)
  const minInterval = 1
  const maxInterval = mtbfValue
  const step = (maxInterval - minInterval) / maxIterations

  let bestInterval = minInterval
  let bestTotalCost = Infinity
  let bestReliability = 0

  // Annualized factor: 8760 hours/year
  const hoursPerYear = 8760

  for (let i = 0; i <= maxIterations; i++) {
    const interval = minInterval + i * step
    const rel = reliability(interval, beta, eta)
    const unavail = 1 - rel

    // Total cost per intervention cycle
    // Cost per hour = costPM/interval + costCorrectiva × unavail
    // Annual cost = (8760 / interval) × [costPM + costCorrectiva × unavail × interval]
    const cyclesPerYear = hoursPerYear / interval
    const costPerCycle = costPM + costCorrectiva * unavail * interval
    const totalCostAnnual = cyclesPerYear * costPerCycle

    // Check if this is better and meets availability target
    if (totalCostAnnual < bestTotalCost && rel >= availabilityTarget) {
      bestTotalCost = totalCostAnnual
      bestInterval = interval
      bestReliability = rel
    }
  }

  // If no solution meets target, return least-cost solution anyway
  if (bestInterval === minInterval && bestReliability < availabilityTarget) {
    let minCost = Infinity
    let minCostInterval = minInterval
    let minCostRel = 0

    for (let i = 0; i <= maxIterations; i++) {
      const interval = minInterval + i * step
      const rel = reliability(interval, beta, eta)
      const unavail = 1 - rel

      const cyclesPerYear = hoursPerYear / interval
      const costPerCycle = costPM + costCorrectiva * unavail * interval
      const totalCostAnnual = cyclesPerYear * costPerCycle

      if (totalCostAnnual < minCost) {
        minCost = totalCostAnnual
        minCostInterval = interval
        minCostRel = rel
      }
    }

    return {
      optimalIntervalHours: minCostInterval,
      totalCostAnnual: minCost,
      reliabilityAtOptimal: minCostRel,
      unavailabilityRate: 1 - minCostRel,
    }
  }

  return {
    optimalIntervalHours: bestInterval,
    totalCostAnnual: bestTotalCost,
    reliabilityAtOptimal: bestReliability,
    unavailabilityRate: 1 - bestReliability,
  }
}

/**
 * Calculate total cost for a given PM interval
 */
export function calculatePMCost(
  interval: number,
  costPM: number,
  costCorrectiva: number,
  beta: number,
  eta: number
): number {
  if (interval <= 0) return Infinity

  const rel = reliability(interval, beta, eta)
  const unavail = 1 - rel

  const hoursPerYear = 8760
  const cyclesPerYear = hoursPerYear / interval
  const costPerCycle = costPM + costCorrectiva * unavail * interval

  return cyclesPerYear * costPerCycle
}

/**
 * Generate cost curve for visualization
 */
export function generateCostCurve(
  beta: number,
  eta: number,
  costPM: number,
  costCorrectiva: number,
  numPoints: number = 100
): Array<{
  interval: number
  totalCost: number
  reliability: number
  unavailability: number
}> {
  const mtbfValue = mtbf(beta, eta)
  const minInterval = 1
  const maxInterval = mtbfValue
  const step = (maxInterval - minInterval) / (numPoints - 1)

  const curve = []

  for (let i = 0; i < numPoints; i++) {
    const interval = minInterval + i * step
    const rel = reliability(interval, beta, eta)
    const totalCost = calculatePMCost(interval, costPM, costCorrectiva, beta, eta)

    curve.push({
      interval,
      totalCost,
      reliability: rel,
      unavailability: 1 - rel,
    })
  }

  return curve
}
