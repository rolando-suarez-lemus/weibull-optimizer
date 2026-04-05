import { useState } from 'react'
import './App.css'

export default function App() {
  const [beta, setBeta] = useState(1.5)
  const [eta, setEta] = useState(1000)

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Weibull Optimizer</h1>
        <p className="subtitle">Interactive Reliability Engineering Dashboard</p>
      </header>

      <main className="app-main">
        <section className="control-panel">
          <h2>Parameters</h2>
          <div className="slider-group">
            <label>
              β (Shape): {beta.toFixed(2)}
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.05"
                value={beta}
                onChange={(e) => setBeta(parseFloat(e.target.value))}
              />
            </label>
            <p className="help-text">
              β &lt; 1: Mortalidad infantil | β ≈ 1: Falla aleatoria | β &gt; 1: Desgaste
            </p>
          </div>

          <div className="slider-group">
            <label>
              η (Scale) [horas]: {eta.toFixed(0)}
              <input
                type="range"
                min="500"
                max="2000"
                step="50"
                value={eta}
                onChange={(e) => setEta(parseFloat(e.target.value))}
              />
            </label>
            <p className="help-text">Vida característica (63.2% de fallos)</p>
          </div>
        </section>

        <section className="visualization-panel">
          <h2>Visualizations</h2>
          <p className="placeholder">Charts coming soon...</p>
        </section>

        <section className="formula-panel">
          <h2>Mathematical Framework</h2>
          <p className="placeholder">Formulas coming soon...</p>
        </section>
      </main>
    </div>
  )
}
