import { Accent, Button, Icon, Size } from '@mtes-mct/monitor-ui'

import { ControlUnitSelector } from './ControlUnitSelector'
import { controlUnitFactory } from '../Missions.helpers'

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
              controlUnitPath={`controlUnits[${index}]`}
              removeControlUnit={handleRemoveControlUnit(index)}
            />
          ))}
        </>
      )}

      <Button accent={Accent.SECONDARY} Icon={Icon.Plus} onClick={handleAddControlUnit} size={Size.SMALL}>
        Ajouter une autre unité
      </Button>
    </div>
  )
}
