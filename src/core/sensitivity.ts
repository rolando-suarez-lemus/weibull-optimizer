import { TornadoAnalysisResult } from '../shared/contracts.js'
import { mtbf } from './weibull.js'

/**
 * Tornado Analysis: Sensitivity to ±variation in β and η
 * Shows which parameter has more impact on MTBF
 */
export function tornadoAnalysis(
  baseBeta: number,
  baseEta: number,
  variationPercent: number = 10
): TornadoAnalysisResult[] {
  // Calculate baseline MTBF
  const baseMTBF = mtbf(baseBeta, baseEta)

  const results: TornadoAnalysisResult[] = []

  // Analyze β variation
  const betaVariation = (baseBeta * variationPercent) / 100
  const betaNegative = mtbf(baseBeta - betaVariation, baseEta)
  const betaPositive = mtbf(baseBeta + betaVariation, baseEta)

  const betaNegativeChange = ((betaNegative - baseMTBF) / baseMTBF) * 100
  const betaPositiveChange = ((betaPositive - baseMTBF) / baseMTBF) * 100

  results.push({
    parameter: 'β (Shape Parameter)',
    negativeChangePercent: betaNegativeChange,
    positiveChangePercent: betaPositiveChange,
    impactFactor: Math.max(Math.abs(betaNegativeChange), Math.abs(betaPositiveChange)),
  })

  // Analyze η variation
  const etaVariation = (baseEta * variationPercent) / 100
  const etaNegative = mtbf(baseBeta, baseEta - etaVariation)
  const etaPositive = mtbf(baseBeta, baseEta + etaVariation)

  const etaNegativeChange = ((etaNegative - baseMTBF) / baseMTBF) * 100
  const etaPositiveChange = ((etaPositive - baseMTBF) / baseMTBF) * 100

  results.push({
    parameter: 'η (Scale Parameter)',
    negativeChangePercent: etaNegativeChange,
    positiveChangePercent: etaPositiveChange,
    impactFactor: Math.max(Math.abs(etaNegativeChange), Math.abs(etaPositiveChange)),
  })

  // Sort by impact factor (descending)
  return results.sort((a, b) => b.impactFactor - a.impactFactor)
}

/**
 * One-way sensitivity: vary parameter and return MTBF curve
 */
export function onWayVariation(
  baseBeta: number,
  baseEta: number,
  parameterName: 'beta' | 'eta',
  variationRange: number = 50, // ±50%
  numPoints: number = 50
): Array<{ value: number; mtbfValue: number; changePercent: number }> {
  const baseMTBF = mtbf(baseBeta, baseEta)
  const results: Array<{ value: number; mtbfValue: number; changePercent: number }> = []

  for (let i = 0; i < numPoints; i++) {
    const t = (i / (numPoints - 1)) * 2 - 1 // -1 to 1
    const percentage = t * variationRange // -50% to +50%

    let newBeta = baseBeta
    let newEta = baseEta

    if (parameterName === 'beta') {
      newBeta = baseBeta * (1 + percentage / 100)
    } else {
      newEta = baseEta * (1 + percentage / 100)
    }

    const newMTBF = mtbf(newBeta, newEta)
    const changePercent = ((newMTBF - baseMTBF) / baseMTBF) * 100

    results.push({
      value: parameterName === 'beta' ? newBeta : newEta,
      mtbfValue: newMTBF,
      changePercent,
    })
  }

  return results
}

/**
 * Elasticity: % change in MTBF per 1% change in parameter
 */
export function elasticity(
  parameterName: 'beta' | 'eta',
  beta: number,
  eta: number
): number {
  const baseMTBF = mtbf(beta, eta)
  const delta = 0.001 // 0.1% change

  let newBeta = beta
  let newEta = eta

  if (parameterName === 'beta') {
    newBeta = beta * (1 + delta)
  } else {
    newEta = eta * (1 + delta)
  }

  const newMTBF = mtbf(newBeta, newEta)
  const mtbfChange = ((newMTBF - baseMTBF) / baseMTBF) * 100
  const paramChange = delta * 100 // 0.1%

  return mtbfChange / paramChange
}

/**
 * Elasticities for both parameters
 */
export function elasticities(beta: number, eta: number): {
  betaElasticity: number
  etaElasticity: number
} {
  return {
    betaElasticity: elasticity('beta', beta, eta),
    etaElasticity: elasticity('eta', beta, eta),
  }
}
