import { Accent, Button, Icon, Size } from '@mtes-mct/monitor-ui'

import { controlUnitFactory } from '../Missions.helpers'
import { ControlUnitSelector } from './ControlUnitSelector'

export function ControlUnitsForm({ form, push, readOnly, remove }) {
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
              controlUnitPath={`controlUnits[${index}]`}
              removeControlUnit={handleRemoveControlUnit(index)}
            />
          ))}
        </>
      )}
      {!readOnly && (
        <Button accent={Accent.SECONDARY} Icon={Icon.Plus} onClick={handleAddControlUnit} size={Size.SMALL}>
          Ajouter une autre unité
        </Button>
      )}
    </div>
  )
}
