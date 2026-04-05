import { memo, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { tornadoAnalysis } from '../core/sensitivity.js'

interface SensitivityAnalysisProps {
  beta: number
  eta: number
}

export const SensitivityAnalysis = memo((props: SensitivityAnalysisProps) => {
  const { beta, eta } = props

  const tornadoData = useMemo(() => {
    return tornadoAnalysis(beta, eta, 10)
  }, [beta, eta])

  // Transform for charting
  const chartData = useMemo(() => {
    return tornadoData.map((item) => ({
      name: item.parameter,
      negative: item.negativeChangePercent,
      positive: item.positiveChangePercent,
      impact: item.impactFactor,
    }))
  }, [tornadoData])

  return (
    <div className="sensitivity-container">
      <h3>Tornado Analysis (±10% Variation)</h3>
      <p className="sensitivity-description">
        Impact on MTBF when parameters vary by ±10%
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            type="number"
            stroke="#a0a0a0"
            tickFormatter={(v) => v.toFixed(1) + '%'}
          />
          <YAxis
            dataKey="name"
            type="category"
            stroke="#a0a0a0"
            width={140}
            interval={0}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(20, 50, 90, 0.8)',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              borderRadius: '8px',
            }}
            formatter={(value: any) => [
              typeof value === 'number' ? value.toFixed(2) + '%' : '—',
            ]}
          />
          <Legend />
          <Bar
            dataKey="negative"
            fill="#ff6b6b"
            name="−10%"
            radius={[0, 4, 4, 0]}
          />
          <Bar
            dataKey="positive"
            fill="#51cf66"
            name="+10%"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="tornado-summary">
        <h4>Ranking by Impact</h4>
        <ul className="impact-list">
          {tornadoData.map((item, idx) => (
            <li key={idx} className="impact-item">
              <span className="rank">{idx + 1}.</span>
              <span className="param-name">{item.parameter}</span>
              <span className="impact-value">
                {item.impactFactor.toFixed(2)}% impact
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
})

SensitivityAnalysis.displayName = 'SensitivityAnalysis'
