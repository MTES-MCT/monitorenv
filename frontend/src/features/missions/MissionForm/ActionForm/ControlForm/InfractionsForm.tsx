import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Button } from '@mtes-mct/monitor-ui'
import { useState } from 'react'
import styled from 'styled-components'

import { InfractionCard } from './InfractionCard'
import { InfractionForm } from './InfractionForm/InfractionForm'
import { infractionFactory } from '../../../Missions.helpers'
import { getActiveMission, missionFormsActions } from '../../slice'

import type { Infraction } from '../../../../../domain/entities/missions'

export function InfractionsForm({ canAddInfraction, envActionIndex, form, push, remove }) {
  const dispatch = useAppDispatch()

  const infractions: Array<Infraction> = form?.values.envActions[envActionIndex]?.infractions ?? []

  const selectedMission = useAppSelector(state => getActiveMission(state.missionForms))

  const activeInfractionId = selectedMission?.activeAction?.activeInfractionId

  const infractionIndex = infractions.findIndex(infraction => infraction.id === activeInfractionId)

  const [currentInfractionIndex, setCurrentInfractionIndex] = useState<number | undefined>(infractionIndex)

  const handleAddInfraction = () => {
    const numberOfInfractions = infractions?.length || 0
    const newInfraction = infractionFactory()
    push(newInfraction)
    setCurrentInfractionIndex(numberOfInfractions)
    dispatch(missionFormsActions.setActiveInfractionId(newInfraction.id))
  }

  const handleValidate = () => {
    setCurrentInfractionIndex(undefined)
    dispatch(missionFormsActions.setActiveInfractionId(undefined))
  }

  const handleEditInfraction = (index, id: string) => () => {
    setCurrentInfractionIndex(index)
    dispatch(missionFormsActions.setActiveInfractionId(id))
  }

  const handleRemoveInfraction = index => () => {
    setCurrentInfractionIndex(undefined)
    dispatch(missionFormsActions.setActiveInfractionId(undefined))
    remove(index)
  }

  const handleDuplicateInfraction = (index, id: string) => () => {
    const numberOfInfractions = infractions.length || 0
    const selectedInfraction = infractions[index]

    push(infractionFactory(selectedInfraction))
    setCurrentInfractionIndex(numberOfInfractions)
    dispatch(missionFormsActions.setActiveInfractionId(id))
  }

  return (
    <div>
      <Header>
        <Title>Détails de la cible en infraction</Title>
        <Button accent={Accent.SECONDARY} disabled={!canAddInfraction} onClick={handleAddInfraction}>
          + Ajouter un contrôle avec infraction
        </Button>
      </Header>

      {form?.values.envActions?.length > 0 && infractions.length > 0 ? (
        <InfractionsWrapper>
          {infractions.map(({ id }, index) =>
            currentInfractionIndex !== undefined && index === currentInfractionIndex ? (
              <InfractionForm
                key={id}
                currentInfractionIndex={currentInfractionIndex}
                envActionIndex={envActionIndex}
                removeInfraction={handleRemoveInfraction(index)}
                validateInfraction={handleValidate}
              />
            ) : (
              <InfractionCard
                key={id}
                canAddInfraction={canAddInfraction}
                currentInfractionIndex={index}
                duplicateInfraction={handleDuplicateInfraction(index, id)}
                envActionIndex={envActionIndex}
                removeInfraction={handleRemoveInfraction(index)}
                setCurrentInfractionIndex={handleEditInfraction(index, id)}
              />
            )
          )}
        </InfractionsWrapper>
      ) : (
        <NoActionWrapper>
          <NoAction>Aucun contrôle avec infraction enregistré pour le moment</NoAction>
        </NoActionWrapper>
      )}
    </div>
  )
}

const Header = styled.div`
  align-items: end;
  display: flex;
  margin-bottom: 8px;
  justify-content: space-between;
`
const Title = styled.span`
  font-size: 13px;
  line-height: 22px;
  display: inline-block;
  color: ${p => p.theme.color.slateGray};
`
const InfractionsWrapper = styled.div`
  flex: 1;
`
const NoActionWrapper = styled.div`
  background: ${p => p.theme.color.white};
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
`

const NoAction = styled.div`
  color: ${p => p.theme.color.slateGray};
  font-size: 13px;
  font-style: italic;
  text-align: center;
`
