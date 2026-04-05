import { memo, useMemo } from 'react'
import { calculateBPercentiles } from '../core/weibull.js'

interface BPercentileTableProps {
  beta: number
  eta: number
}

export const BPercentileTable = memo((props: BPercentileTableProps) => {
  const { beta, eta } = props

  const bPercentiles = useMemo(() => {
    return calculateBPercentiles(beta, eta)
  }, [beta, eta])

  const getRecommendation = (percentage: number, hours: number) => {
    if (percentage === 10) {
      return hours < 500 ? '⚠️ Critical - Cambiar urgente' : '✓ Reemplazo planificado'
    }
    if (percentage === 50) {
      return '◆ Mediana - 50% probabilidad falla'
    }
    if (percentage === 90) {
      return '✓ Cierre de vida'
    }
    return ''
  }

  return (
    <div className="b-percentile-table-container">
      <h3>vida característica (B-Percentiles)</h3>
      <table className="b-percentile-table">
        <thead>
          <tr>
            <th>Label</th>
            <th>Definición</th>
            <th>Horas</th>
            <th>Log₁₀(h)</th>
            <th>Recomendación</th>
          </tr>
        </thead>
        <tbody>
          {bPercentiles.map((bp) => (
            <tr key={bp.label} className={`b-percentile-row b-${bp.percentage}`}>
              <td className="label-cell">{bp.label}</td>
              <td className="definition-cell">{bp.percentage}% fallos</td>
              <td className="value-cell">{bp.hours.toFixed(1)}</td>
              <td className="log-cell">
                {bp.hours > 0
                  ? Math.log10(bp.hours).toFixed(2)
                  : '—'}
              </td>
              <td className="recommendation-cell">
                {getRecommendation(bp.percentage, bp.hours)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})

BPercentileTable.displayName = 'BPercentileTable'
