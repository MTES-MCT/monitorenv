import { Accent, Button, Icon, Size } from '@mtes-mct/monitor-ui'
import { useMemo } from 'react'

import { ControlUnitSelector } from './ControlUnitSelector'
import { useGetEngagedControlUnitsQuery } from '../../../api/missionsAPI'
import { controlUnitFactory } from '../Missions.helpers'

export function ControlUnitsForm({ form, push, remove }) {
  const { data: engagedControlUnitsData } = useGetEngagedControlUnitsQuery()

  const engagedControlUnits = useMemo(() => {
    if (!engagedControlUnitsData) {
      return []
    }

    return engagedControlUnitsData
  }, [engagedControlUnitsData])

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
          {form.values.controlUnits.map(({ id }, index) => (
            <ControlUnitSelector
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              controlUnitIndex={index}
              controlUnitPath={`controlUnits[${index}]`}
              isEngaged={!!engagedControlUnits.find(engaged => engaged.id === id)}
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
