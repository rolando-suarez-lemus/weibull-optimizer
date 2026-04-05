import { memo, useCallback } from 'react'
import { EQUIPMENT_PRESETS } from '../data/presets.js'
import { WeibullParams } from '../shared/contracts.js'

interface EquipmentPresetsProps {
  onSelect: (params: WeibullParams) => void
}

export const EquipmentPresets = memo((props: EquipmentPresetsProps) => {
  const { onSelect } = props

  const handleSelect = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const id = e.target.value
      if (id) {
        const equipment = EQUIPMENT_PRESETS.find((e) => e.id === id)
        if (equipment) {
          onSelect(equipment.weibullParams)
        }
      }
    },
    [onSelect]
  )

  return (
    <div className="presets-container">
      <label htmlFor="equipment-select">
        <span className="preset-label">Equipment Presets</span>
      </label>
      <select
        id="equipment-select"
        onChange={handleSelect}
        className="preset-select"
        defaultValue=""
      >
        <option value="">— Select equipment type —</option>
        {EQUIPMENT_PRESETS.map((equipment) => (
          <option key={equipment.id} value={equipment.id}>
            {equipment.name} (β={equipment.weibullParams.beta.toFixed(2)}, η={equipment.weibullParams.eta.toFixed(0)}h)
          </option>
        ))}
      </select>
      <p className="preset-help">Load pre-configured Weibull parameters for common industrial equipment</p>
    </div>
  )
})

EquipmentPresets.displayName = 'EquipmentPresets'
