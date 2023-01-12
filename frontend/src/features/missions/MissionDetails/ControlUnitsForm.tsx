import { IconButton } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'
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
      {form?.values.controlUnits?.length > 0 ? (
        <ControlUnitsWrapper>
          {form?.values.controlUnits?.map((_, index) => (
            <ControlUnitSelector
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              removeControlUnit={handleRemoveControlUnit(index)}
              controlUnitIndex={index}
              controlUnitPath={`controlUnits[${index}]`}
            />
          ))}
        </ControlUnitsWrapper>
      ) : (
        <NoUnitWrapper>
          <NoAction>Aucune unité renseignée</NoAction>
        </NoUnitWrapper>
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
const NoUnitWrapper = styled.div`
  background: ${COLORS.white};
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`

const NoAction = styled.div`
  text-align: center;
`
