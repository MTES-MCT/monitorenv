import { IconButton } from 'rsuite'
import styled from 'styled-components'

import { ReactComponent as PlusSVG } from '../../../uiMonitor/icons/Plus.svg'
import { controlUnitFactory } from '../Missions.helpers'
import { ControlUnitSelector } from './ControlUnitSelector'

export function ControlUnitsForm({ form, push, remove }) {
  const handleAddControlUnit = () => {
    push(controlUnitFactory())
  }

  const handleRemoveControlUnit = index => () => {
    remove(index)
  }

  return (
    <>
      {form?.values.controlUnits?.length > 0 && (
        <ControlUnitsWrapper>
          {form.values.controlUnits.map((_, index) => (
            <ControlUnitSelector
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              controlUnitIndex={index}
              controlUnitPath={`controlUnits[${index}]`}
              removeControlUnit={handleRemoveControlUnit(index)}
            />
          ))}
        </ControlUnitsWrapper>
      )}
      <IconButton appearance="ghost" icon={<PlusSVG className="rs-icon" />} onClick={handleAddControlUnit} size="sm">
        Ajouter une autre unité
      </IconButton>
    </>
  )
}

const ControlUnitsWrapper = styled.div`
  flex: 1;
`
