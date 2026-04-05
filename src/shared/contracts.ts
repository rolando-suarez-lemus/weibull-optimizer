export interface WeibullParams {
  beta: number          // shape parameter (0.1-10)
  eta: number          // scale parameter (100-5000 hours)
  gamma?: number       // location parameter (optional, default 0)
}

export interface Equipment {
  id: string
  name: string
  category: 'bearing' | 'pump' | 'motor' | 'valve' | 'sensor' | 'filter'
  weibullParams: WeibullParams
  mtbf: number
  costPM: number       // €/intervention
  costCorrectiva: number // €/failure
  criticality: 'critical' | 'high' | 'medium'
}

export interface B_Percentile {
  label: string        // "B₁₀", "B₅₀", "B₉₀"
  percentage: number
  hours: number
}

export interface WeibullCurvePoint {
  t: number           // time
  pdf: number         // f(t)
  cdf: number         // F(t)
  reliability: number // R(t)
  hazard: number      // h(t)
}

export interface PMOptimizationResult {
  optimalIntervalHours: number
  totalCostAnnual: number
  reliabilityAtOptimal: number
  unavailabilityRate: number
}

export interface TornadoAnalysisResult {
  parameter: string
  negativeChangePercent: number
  positiveChangePercent: number
  impactFactor: number
}
