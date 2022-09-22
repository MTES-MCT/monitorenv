import React from 'react'
import { IconButton } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../constants/constants'
import { ReactComponent as PlusSVG } from '../../../uiMonitor/icons/plus.svg'
import { resourceUnitFactory } from '../Missions.helpers'
import { ResourceUnitSelector } from './ResourceUnitSelector'

export function ResourceUnitsForm({ form, push, remove }) {
  const handleAddResourceUnit = () => {
    push(resourceUnitFactory())
  }
  const handleRemoveResourceUnit = index => () => {
    remove(index)
  }

  return (
    <>
      {form?.values.resourceUnits?.length > 0 ? (
        <ResourceUnitsWrapper>
          {form?.values.resourceUnits?.map((resourceUnit, index) => (
            <ResourceUnitSelector
              key={index}
              removeResourceUnit={handleRemoveResourceUnit(index)}
              resourceUnitIndex={index}
              resourceUnitPath={`resourceUnits[${index}]`}
            />
          ))}
        </ResourceUnitsWrapper>
      ) : (
        <NoActionWrapper>
          <NoAction>Aucune unité renseignée</NoAction>
        </NoActionWrapper>
      )}

      <IconButton appearance="ghost" icon={<PlusSVG className="rs-icon" />} onClick={handleAddResourceUnit} size="sm">
        Ajouter une unité
      </IconButton>
    </>
  )
}

const ResourceUnitsWrapper = styled.div`
  flex: 1;
`
const NoActionWrapper = styled.div`
  background: ${COLORS.white};
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`

const NoAction = styled.div`
  text-align: center;
`
