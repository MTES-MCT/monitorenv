import { Accent, Button, Icon, Size } from '@mtes-mct/monitor-ui'

import { ControlUnitSelector } from './ControlUnitSelector'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { controlUnitFactory } from '../../Missions.helpers'
import { getActiveMission } from '../slice'

export function ControlUnitsForm({ form, push, remove }) {
  const activeMission = useAppSelector(state => getActiveMission(state.missionForms))
  const engagedControlUnit = activeMission?.engagedControlUnit

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
              removeControlUnit={handleRemoveControlUnit(index)}
            />
          ))}
        </>
      )}

      <Button
        accent={Accent.SECONDARY}
        data-cy="add-other-control-unit"
        disabled={!!engagedControlUnit}
        Icon={Icon.Plus}
        onClick={handleAddControlUnit}
        size={Size.SMALL}
      >
        Ajouter une autre unité
      </Button>
    </div>
  )
}
