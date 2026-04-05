import { memo, useCallback } from 'react'
import '../App.css'

interface ParamSlidersProps {
  beta: number
  eta: number
  onBetaChange: (value: number) => void
  onEtaChange: (value: number) => void
}

export const ParamSliders = memo((props: ParamSlidersProps) => {
  const { beta, eta, onBetaChange, onEtaChange } = props

  const handleBetaChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onBetaChange(parseFloat(e.target.value))
    },
    [onBetaChange]
  )

  const handleEtaChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onEtaChange(parseFloat(e.target.value))
    },
    [onEtaChange]
  )

  return (
    <div className="slider-container">
      <div className="slider-group">
        <label>
          <span className="param-label">β (Shape Parameter)</span>
          <span className="param-value">{beta.toFixed(3)}</span>
        </label>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.05"
          value={beta}
          onChange={handleBetaChange}
          className="slider"
        />
        <p className="help-text">
          {beta < 1
            ? '↓ Mortalidad infantil: Tasa falla decrece'
            : Math.abs(beta - 1) < 0.1
              ? '◆ Falla aleatoria: Distribución exponencial'
              : '↑ Desgaste: Tasa falla aumenta con tiempo'}
        </p>
      </div>

      <div className="slider-group">
        <label>
          <span className="param-label">η (Scale) [horas]</span>
          <span className="param-value">{eta.toFixed(0)}</span>
        </label>
        <input
          type="range"
          min="500"
          max="2000"
          step="50"
          value={eta}
          onChange={handleEtaChange}
          className="slider"
        />
        <p className="help-text">Vida característica (63.2% de fallos acumulativos)</p>
      </div>
    </div>
  )
})

ParamSliders.displayName = 'ParamSliders'
