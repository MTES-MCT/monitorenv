import { ControlUnitSelector } from './ControlUnitSelector'
import { controlUnitFactory } from '../../Missions.helpers'

export function ControlUnitsForm({ form, push, remove }) {
  const handleAddControlUnit = () => {
    push(controlUnitFactory())
  }

  const handleRemoveControlUnit = index => () => {
    remove(index)
  }

  return (
    <div>
      {form?.values.controlUnits?.length > 0 && (
        <>
          {form.values.controlUnits.map((_, index) => (
            <ControlUnitSelector
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              controlUnitIndex={index}
              onAddControlUnit={handleAddControlUnit}
              removeControlUnit={handleRemoveControlUnit(index)}
              totalControlUnits={form.values.controlUnits.length}
            />
          ))}
        </>
      )}
    </div>
  )
}
