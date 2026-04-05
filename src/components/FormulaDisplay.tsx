import { memo, useMemo } from 'react'
import LatexRenderer from './LatexRenderer.js'
import { formatWeibullFormulas, calculateMTBF } from '../core/weibull.js'

interface FormulaDisplayProps {
  beta: number
  eta: number
}

export const FormulaDisplay = memo((props: FormulaDisplayProps) => {
  const { beta, eta } = props

  const formulas = useMemo(() => {
    return formatWeibullFormulas(beta, eta)
  }, [beta, eta])

  const mtbfValue = useMemo(() => {
    return calculateMTBF(beta, eta)
  }, [beta, eta])

  return (
    <div className="formulas-container">
      <h2 className="formulas-title">Mathematical Framework</h2>

      <div className="formula-card">
        <h4>Probability Density Function (PDF)</h4>
        <LatexRenderer
          formula={formulas.pdf}
          displayMode={true}
          className="equation"
        />
        <p className="formula-description">
          Probabilidad instantánea de falla en tiempo t
        </p>
      </div>

      <div className="formula-card">
        <h4>Cumulative Distribution Function (CDF)</h4>
        <LatexRenderer
          formula={formulas.cdf}
          displayMode={true}
          className="equation"
        />
        <p className="formula-description">Probabilidad acumulada de falla hasta t</p>
      </div>

      <div className="formula-card">
        <h4>Reliability Function</h4>
        <LatexRenderer
          formula={formulas.reliability}
          displayMode={true}
          className="equation"
        />
        <p className="formula-description">Probabilidad de sobrevivencia sin falla</p>
      </div>

      <div className="formula-card">
        <h4>Hazard Rate (Failure Rate)</h4>
        <LatexRenderer
          formula={formulas.hazard}
          displayMode={true}
          className="equation"
        />
        <p className="formula-description">Tasa instantánea de falla (fallas/hora)</p>
      </div>

      <div className="formula-card">
        <h4>Mean Time Between Failures (MTBF)</h4>
        <LatexRenderer
          formula={formulas.mtbf}
          displayMode={true}
          className="equation"
        />
        <p className="formula-description">
          Tiempo promedio hasta falla: {mtbfValue.toFixed(1)} horas
        </p>
      </div>

      <div className="formula-card">
        <h4>B-Percentile (Life)</h4>
        <LatexRenderer
          formula={formulas.bPercentile}
          displayMode={true}
          className="equation"
        />
        <p className="formula-description">Tiempo cuando n% de equipos han fallado</p>
      </div>
    </div>
  )
})

FormulaDisplay.displayName = 'FormulaDisplay'
