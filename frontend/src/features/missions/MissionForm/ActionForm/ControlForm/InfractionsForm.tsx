import { useState } from 'react'
import { Button } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../../../constants/constants'
import { infractionFactory } from '../../../Missions.helpers'
import { InfractionCard } from './InfractionCard'
import { InfractionForm } from './InfractionForm/InfractionForm'

import type { Infraction } from '../../../../../domain/entities/missions'

export function InfractionsForm({ canAddInfraction, currentActionIndex, form, push, remove }) {
  const [currentInfractionIndex, setCurrentInfractionIndex] = useState(undefined)

  const handleAddInfraction = () => {
    const numberOfInfractions = form?.values.envActions[currentActionIndex]?.infractions?.length || 0
    push(infractionFactory())
    setCurrentInfractionIndex(numberOfInfractions)
  }

  const handleValidate = () => {
    setCurrentInfractionIndex(undefined)
  }

  const handleEditInfraction = index => () => {
    setCurrentInfractionIndex(index)
  }

  const handleRemoveInfraction = index => () => {
    setCurrentInfractionIndex(undefined)
    remove(index)
  }

  const handleDuplicateInfraction = index => () => {
    const numberOfInfractions = form?.values.envActions[currentActionIndex]?.infractions.length || 0
    const selectedInfraction = form?.values.envActions[currentActionIndex]?.infractions[index] as Infraction

    push(infractionFactory(selectedInfraction))
    setCurrentInfractionIndex(numberOfInfractions)
  }

  return (
    <>
      <Header>
        <Title>Détails de la cible en infraction</Title>
        <Button appearance="ghost" disabled={!canAddInfraction} onClick={handleAddInfraction} size="sm">
          + Ajouter un contrôle avec infraction
        </Button>
      </Header>

      {form?.values.envActions?.length > 0 && form?.values.envActions[currentActionIndex]?.infractions?.length > 0 ? (
        <InfractionsWrapper>
          {form?.values.envActions[currentActionIndex]?.infractions.map((infraction, index) =>
            currentInfractionIndex && index === currentInfractionIndex ? (
              <InfractionForm
                key={infraction.id}
                currentActionIndex={currentActionIndex}
                currentInfractionIndex={currentInfractionIndex}
                removeInfraction={handleRemoveInfraction(index)}
                validateInfraction={handleValidate}
              />
            ) : (
              <InfractionCard
                key={infraction.id}
                canAddInfraction={canAddInfraction}
                currentActionIndex={currentActionIndex}
                currentInfractionIndex={index}
                duplicateInfraction={handleDuplicateInfraction(index)}
                removeInfraction={handleRemoveInfraction(index)}
                setCurrentInfractionIndex={handleEditInfraction(index)}
              />
            )
          )}
        </InfractionsWrapper>
      ) : (
        <NoActionWrapper>
          <NoAction>aucun contrôle avec infraction enregistré pour le moment</NoAction>
        </NoActionWrapper>
      )}
    </>
  )
}

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`
const Title = styled.h3`
  font-size: 13px;
  line-height: 22px;
  display: inline-block;
  color: ${COLORS.slateGray};
`
const InfractionsWrapper = styled.div`
  flex: 1;
`
const NoActionWrapper = styled.div`
  background: ${COLORS.white};
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
`

const NoAction = styled.div`
  text-align: center;
`
