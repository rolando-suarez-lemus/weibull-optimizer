import { memo, useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import { generateWeibullCurve } from '../core/weibull.js'

interface WeibullCurvesProps {
  beta: number
  eta: number
}

export const WeibullCurves = memo((props: WeibullCurvesProps) => {
  const { beta, eta } = props

  const curveData = useMemo(() => {
    const mtbfApprox = eta * 0.9
    const tMax = mtbfApprox * 1.5
    return generateWeibullCurve(beta, eta, tMax, 150)
  }, [beta, eta])

  const getCurveColor = () => {
    if (beta < 1) return '#ff9900'
    if (Math.abs(beta - 1) < 0.1) return '#00d4ff'
    return '#ff3333'
  }

  const curveColor = getCurveColor()

  return (
    <div className="charts-grid">
      {/* PDF Chart */}
      <div className="chart-card">
        <h3>Probability Density Function ƒ(t)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={curveData}>
            <defs>
              <linearGradient id="colorPdf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={curveColor} stopOpacity={0.7} />
                <stop offset="95%" stopColor={curveColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="t"
              stroke="#a0a0a0"
              tickFormatter={(v: any) => (typeof v === 'number' ? v.toFixed(0) : '')}
            />
            <YAxis
              stroke="#a0a0a0"
              tickFormatter={(v: any) => (typeof v === 'number' ? v.toFixed(4) : '')}
              width={60}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(20, 50, 90, 0.8)',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: '8px',
              }}
              formatter={(value: any) => [
                typeof value === 'number' ? value.toFixed(4) : '—',
              ]}
            />
            <Area
              type="monotone"
              dataKey="pdf"
              stroke={curveColor}
              fill="url(#colorPdf)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* CDF Chart */}
      <div className="chart-card">
        <h3>Cumulative Distribution Function F(t)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={curveData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="t"
              stroke="#a0a0a0"
              tickFormatter={(v: any) => (typeof v === 'number' ? v.toFixed(0) : '')}
            />
            <YAxis
              stroke="#a0a0a0"
              domain={[0, 1]}
              tickFormatter={(v: any) => (typeof v === 'number' ? (v * 100).toFixed(0) + '%' : '')}
              width={60}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(20, 50, 90, 0.8)',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: '8px',
              }}
              formatter={(value: any) => [
                typeof value === 'number' ? (value * 100).toFixed(2) + '%' : '—',
                'F(t)',
              ]}
            />
            <Line
              type="monotone"
              dataKey="cdf"
              stroke="#ffc658"
              dot={false}
              isAnimationActive={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Reliability Chart */}
      <div className="chart-card">
        <h3>Reliability Function R(t)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={curveData}>
            <defs>
              <linearGradient id="colorReliability" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ff00" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#00ff00" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="t"
              stroke="#a0a0a0"
              tickFormatter={(v: any) => (typeof v === 'number' ? v.toFixed(0) : '')}
            />
            <YAxis
              stroke="#a0a0a0"
              domain={[0, 1]}
              tickFormatter={(v: any) => (typeof v === 'number' ? (v * 100).toFixed(0) + '%' : '')}
              width={60}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(20, 50, 90, 0.8)',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: '8px',
              }}
              formatter={(value: any) => [
                typeof value === 'number' ? (value * 100).toFixed(2) + '%' : '—',
                'R(t)',
              ]}
            />
            <Area
              type="monotone"
              dataKey="reliability"
              stroke="#00ff00"
              fill="url(#colorReliability)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Hazard Rate Chart */}
      <div className="chart-card">
        <h3>Hazard Rate h(t) - Failure Rate</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={curveData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="t"
              stroke="#a0a0a0"
              tickFormatter={(v: any) => (typeof v === 'number' ? v.toFixed(0) : '')}
            />
            <YAxis
              stroke="#a0a0a0"
              tickFormatter={(v: any) => (typeof v === 'number' ? v.toFixed(4) : '')}
              width={60}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(20, 50, 90, 0.8)',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: '8px',
              }}
              formatter={(value: any) => [
                typeof value === 'number' ? value.toFixed(4) : '—',
              ]}
            />
            <Line
              type="monotone"
              dataKey="hazard"
              stroke="#ff6b6b"
              dot={false}
              isAnimationActive={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
})

WeibullCurves.displayName = 'WeibullCurves'
