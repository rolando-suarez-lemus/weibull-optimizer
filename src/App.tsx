import { useState, useCallback } from 'react'
import { WeibullParams } from './shared/contracts.js'
import { ParamSliders } from './components/ParamSliders.js'
import { EquipmentPresets } from './components/EquipmentPresets.js'
import { WeibullCurves } from './components/WeibullCurves.js'
import { FormulaDisplay } from './components/FormulaDisplay.js'
import { BPercentileTable } from './components/BPercentileTable.js'
import { SensitivityAnalysis } from './components/SensitivityAnalysis.js'
import './App.css'

export default function App() {
  const [beta, setBeta] = useState(1.5)
  const [eta, setEta] = useState(1000)
  const [showFormulas, setShowFormulas] = useState(false)
  const [showSensitivity, setShowSensitivity] = useState(false)

  const handleBetaChange = useCallback((value: number) => {
    setBeta(Math.max(0.5, Math.min(3, value)))
  }, [])

  const handleEtaChange = useCallback((value: number) => {
    setEta(Math.max(500, Math.min(2000, value)))
  }, [])

  const handlePresetSelect = useCallback((params: WeibullParams) => {
    setBeta(params.beta)
    setEta(params.eta)
  }, [])

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Weibull Optimizer</h1>
        <p className="subtitle">
          Interactive Reliability Engineering & Preventive Maintenance Dashboard
        </p>
      </header>

      <main className="app-main">
        {/* Left: Controls */}
        <aside className="sidebar-left">
          <div className="panel">
            <h2>Parameters</h2>
            <ParamSliders
              beta={beta}
              eta={eta}
              onBetaChange={handleBetaChange}
              onEtaChange={handleEtaChange}
            />
          </div>

          <div className="panel">
            <EquipmentPresets onSelect={handlePresetSelect} />
          </div>

          <div className="panel">
            <h3>Analysis Tools</h3>
            <button
              className="toggle-btn"
              onClick={() => setShowFormulas(!showFormulas)}
            >
              {showFormulas ? '▼' : '▶'} Formulas & Theory
            </button>
            <button
              className="toggle-btn"
              onClick={() => setShowSensitivity(!showSensitivity)}
            >
              {showSensitivity ? '▼' : '▶'} Sensitivity Analysis
            </button>
          </div>
        </aside>

        {/* Center: Visualizations */}
        <section className="main-content">
          <div className="panel">
            <WeibullCurves beta={beta} eta={eta} />
          </div>

          <div className="panel">
            <BPercentileTable beta={beta} eta={eta} />
          </div>
        </section>

        {/* Right: Additional Analysis */}
        <aside className="sidebar-right">
          {showFormulas && (
            <div className="panel collapsible">
              <FormulaDisplay beta={beta} eta={eta} />
            </div>
          )}

          {showSensitivity && (
            <div className="panel collapsible">
              <SensitivityAnalysis beta={beta} eta={eta} />
            </div>
          )}
        </aside>
      </main>
    </div>
  )
}
