import { useState } from 'react'
import { Button } from 'rsuite'
import styled from 'styled-components'

import { COLORS } from '../../../../../constants/constants'
import { infractionFactory } from '../../../Missions.helpers'
import { InfractionCard } from './InfractionCard'
import { InfractionForm } from './InfractionForm/InfractionForm'

export function InfractionsForm({ canAddInfraction, currentActionIndex, form, push, remove }) {
  const [currentInfractionIndex, setCurrentInfractionIndex] = useState(null)

  const handleAddInfraction = () => {
    const numberOfInfractions = form?.values.envActions[currentActionIndex]?.infractions?.length || 0
    push(infractionFactory())
    setCurrentInfractionIndex(numberOfInfractions)
  }

  const handleValidate = () => {
    setCurrentInfractionIndex(null)
  }

  const handleEditInfraction = index => () => {
    setCurrentInfractionIndex(index)
  }

  const handleRemoveInfraction = index => () => {
    setCurrentInfractionIndex(null)
    remove(index)
  }

  return (
    <>
      <Header>
        <Title>Détailler une infraction d&apos;une cible</Title>
        <Button appearance="ghost" disabled={!canAddInfraction} onClick={handleAddInfraction} size="sm">
          + Ajouter une nouvelle infraction
        </Button>
      </Header>

      {form?.values.envActions?.length > 0 && form?.values.envActions[currentActionIndex]?.infractions?.length > 0 ? (
        <InfractionsWrapper>
          {form?.values.envActions[currentActionIndex]?.infractions?.map((infraction, index) =>
            index === currentInfractionIndex ? (
              <InfractionForm
                key={infraction.id}
                currentActionIndex={currentActionIndex}
                infractionPath={`envActions[${currentActionIndex}].infractions[${index}]`}
                removeInfraction={handleRemoveInfraction(index)}
                validateInfraction={handleValidate}
              />
            ) : (
              <InfractionCard
                key={infraction.id}
                currentActionIndex={currentActionIndex}
                infractionPath={`envActions[${currentActionIndex}].infractions[${index}]`}
                removeInfraction={handleRemoveInfraction(index)}
                setCurrentInfractionIndex={handleEditInfraction(index)}
              />
            )
          )}
        </InfractionsWrapper>
      ) : (
        <NoActionWrapper>
          <NoAction>Aucune infraction engregistrée pour le moment</NoAction>
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
`

const NoAction = styled.div`
  text-align: center;
`
