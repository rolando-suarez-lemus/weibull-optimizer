import { WeibullCurvePoint, B_Percentile } from '../shared/contracts.js'

/**
 * Lanczos approximation for Gamma function
 * Precision: ~10^-12
 * Source: Numerical Recipes, Press et al.
 */
function gammaLanczos(z: number): number {
  const g = 7
  const coef = [
    0.99999999999980993,
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7,
  ]

  if (z < 0.5) {
    return Math.PI / (Math.sin(Math.PI * z) * gammaLanczos(1 - z))
  }

  z -= 1
  let x = coef[0]
  for (let i = 1; i < g + 2; i++) {
    x += coef[i] / (z + i)
  }

  const t = z + g + 0.5
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x
}

/**
 * Weibull Probability Density Function (PDF)
 * f(t) = (β/η) × (t/η)^(β-1) × exp(-(t/η)^β)
 */
export function pdf(t: number, beta: number, eta: number): number {
  if (t < 0 || eta <= 0 || beta <= 0) return 0
  const normalized = t / eta
  const term1 = (beta / eta) * Math.pow(normalized, beta - 1)
  const term2 = Math.exp(-Math.pow(normalized, beta))
  return term1 * term2
}

/**
 * Weibull Cumulative Distribution Function (CDF)
 * F(t) = 1 - exp(-(t/η)^β)
 */
export function cdf(t: number, beta: number, eta: number): number {
  if (t < 0) return 0
  if (eta <= 0 || beta <= 0) return 0
  const normalized = t / eta
  return 1 - Math.exp(-Math.pow(normalized, beta))
}

/**
 * Weibull Reliability Function
 * R(t) = exp(-(t/η)^β)
 */
export function reliability(t: number, beta: number, eta: number): number {
  if (t < 0) return 1
  if (eta <= 0 || beta <= 0) return 0
  const normalized = t / eta
  return Math.exp(-Math.pow(normalized, beta))
}

/**
 * Weibull Hazard Rate (Failure Rate Function)
 * h(t) = (β/η) × (t/η)^(β-1)
 */
export function hazardRate(t: number, beta: number, eta: number): number {
  if (t < 0 || eta <= 0 || beta <= 0) return 0
  const normalized = t / eta
  return (beta / eta) * Math.pow(normalized, beta - 1)
}

/**
 * Mean Time Between Failures (MTBF)
 * E[T] = η × Γ(1 + 1/β)
 */
export function mtbf(beta: number, eta: number): number {
  if (beta <= 0 || eta <= 0) return 0
  const gammaArg = 1 + 1 / beta
  return eta * gammaLanczos(gammaArg)
}

/**
 * B-Percentile: Time at which n% of population has failed
 * B_n = η × (-ln(1 - n/100))^(1/β)
 */
export function bPercentile(
  percentage: number,
  beta: number,
  eta: number
): number {
  if (percentage < 0 || percentage > 100 || beta <= 0 || eta <= 0) return 0
  if (percentage === 0) return 0
  if (percentage === 100) return Infinity

  const arg = Math.max(1e-10, 1 - percentage / 100)
  const lnTerm = Math.log(1 / arg)
  return eta * Math.pow(lnTerm, 1 / beta)
}

/**
 * Generate complete Weibull curve for visualization
 * Returns array of points for plotting PDF, CDF, R(t), hazard rate
 */
export function generateWeibullCurve(
  beta: number,
  eta: number,
  tMax: number,
  numPoints: number = 200
): WeibullCurvePoint[] {
  const points: WeibullCurvePoint[] = []
  const step = tMax / (numPoints - 1)

  for (let i = 0; i < numPoints; i++) {
    const t = i * step
    points.push({
      t,
      pdf: pdf(t, beta, eta),
      cdf: cdf(t, beta, eta),
      reliability: reliability(t, beta, eta),
      hazard: hazardRate(t, beta, eta),
    })
  }

  return points
}

/**
 * Determine Weibull region interpretation
 */
export function getWeibullInterpretation(beta: number): string {
  if (beta < 1) {
    return 'Mortalidad Infantil: Tasa falla decrece con tiempo'
  } else if (Math.abs(beta - 1) < 0.1) {
    return 'Falla Aleatoria: Distribución exponencial'
  } else {
    return 'Desgaste: Tasa falla aumenta con tiempo'
  }
}

/**
 * Calculate B-percentiles (typical values: 10, 50, 90)
 */
export function calculateBPercentiles(
  beta: number,
  eta: number
): B_Percentile[] {
  return [
    {
      label: 'B₁₀',
      percentage: 10,
      hours: bPercentile(10, beta, eta),
    },
    {
      label: 'B₅₀',
      percentage: 50,
      hours: bPercentile(50, beta, eta),
    },
    {
      label: 'B₉₀',
      percentage: 90,
      hours: bPercentile(90, beta, eta),
    },
  ]
}

/**
 * Calculate MTBF analytically
 */
export function calculateMTBF(beta: number, eta: number): number {
  return mtbf(beta, eta)
}

/**
 * Estimate time-to-failure percentile with confidence
 */
export function estimateLife(
  percentage: number,
  beta: number,
  eta: number
): number {
  return bPercentile(percentage, beta, eta)
}

/**
 * Utility: Format Weibull parameters for LaTeX rendering
 */
export function formatWeibullFormulas(beta: number, eta: number): {
  pdf: string
  cdf: string
  reliability: string
  hazard: string
  mtbf: string
  bPercentile: string
} {
  const mtbfValue = mtbf(beta, eta).toFixed(1)

  return {
    pdf: `f(t) = \\frac{${beta.toFixed(2)}}{${eta.toFixed(0)}} \\left(\\frac{t}{${eta.toFixed(0)}}\\right)^{${(beta - 1).toFixed(2)}} e^{-(t/${eta.toFixed(0)})^${beta.toFixed(2)}}`,
    cdf: `F(t) = 1 - e^{-(t/${eta.toFixed(0)})^${beta.toFixed(2)}}`,
    reliability: `R(t) = e^{-(t/${eta.toFixed(0)})^${beta.toFixed(2)}}`,
    hazard: `h(t) = \\frac{${beta.toFixed(2)}}{${eta.toFixed(0)}} \\left(\\frac{t}{${eta.toFixed(0)}}\\right)^{${(beta - 1).toFixed(2)}}`,
    mtbf: `\\text{MTBF} = ${mtbfValue} \\text{ hours}`,
    bPercentile: `B_n = ${eta.toFixed(0)} \\cdot \\left(-\\ln\\left(1 - \\frac{n}{100}\\right)\\right)^{1/${beta.toFixed(2)}}`,
  }
}
