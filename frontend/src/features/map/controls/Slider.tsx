import { useState } from 'react'

export function Slider({ initialValue = 50, max = 100, min = 0, onChange, step = 1, title }) {
  const [value, setValue] = useState(initialValue)

  return (
    <div style={{ background: '#fff', marginTop: '2em', padding: '2rem 1.5rem' }}>
      {title}
      <div>
        {/* Valeur affichée */}
        <div style={{ fontSize: 48, fontWeight: 500, lineHeight: 1, marginBottom: '0.5rem' }}>{value}</div>
        <div style={{ color: '#888', fontSize: 16, marginBottom: '2rem' }}>valeur</div>

        {/* Slider */}
        <div style={{ alignItems: 'center', display: 'flex', gap: 16 }}>
          <span style={{ color: '#888', fontSize: 13, minWidth: 28 }}>{min}</span>
          <input
            max={max}
            min={min}
            onChange={e => {
              setValue(Number(e.target.value))
              onChange(Number(e.target.value))
            }}
            step={step}
            style={{ flex: 1 }}
            type="range"
            value={value}
          />
          <span style={{ color: '#888', fontSize: 13, minWidth: 28, textAlign: 'right' }}>{max}</span>
        </div>
      </div>
    </div>
  )
}
