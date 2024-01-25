import { Accent, Button, Level, Message } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import { useMemo } from 'react'
import styled from 'styled-components'

import { missionSourceEnum, type NewMission } from '../../../../domain/entities/missions'
import { cancelCreateAndRedirectToFilteredList } from '../../../../domain/use_cases/missions/cancelCreateAndRedirectToFilteredList'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { missionFormsActions } from '../slice'

export function ControlUnitWarningMessage() {
  const { values } = useFormikContext<Partial<NewMission>>()

  const dispatch = useAppDispatch()
  const activeMissionId = useAppSelector(state => state.missionForms.activeMissionId)
  const engagedControlUnit = useAppSelector(state =>
    activeMissionId ? state.missionForms.missions[activeMissionId]?.engagedControlUnit : undefined
  )

  const message = useMemo(() => {
    if (!engagedControlUnit) {
      return ''
    }

    if (engagedControlUnit.missionSources.length === 1) {
      const source = engagedControlUnit.missionSources[0]
      if (!source) {
        return ''
      }

      return `Une autre mission, ouverte par le ${missionSourceEnum[source].label}, est en cours avec cette unité.`
    }

    if (engagedControlUnit.missionSources.length > 1) {
      return `D'autres missions en cours, ouvertes par le ${engagedControlUnit.missionSources
        .map(source => missionSourceEnum[source].label)
        .join(' et le ')}, sont en cours avec cette unité.`
    }

    return ''
  }, [engagedControlUnit])

  const validate = async () => {
    dispatch(missionFormsActions.setEngagedControlUnit(undefined))
  }

  const cancel = async () => {
    const controlUnitId = engagedControlUnit?.controlUnit?.id
    if (!controlUnitId) {
      return
    }

    dispatch(cancelCreateAndRedirectToFilteredList({ controlUnitId, missionId: values.id }))
  }

  if (!engagedControlUnit) {
    return null
  }

  return (
    <StyledMessage level={Level.WARNING}>
      <Warning>Attention</Warning>
      <div>
        <span>{message}</span>
        <br />
        <span>Voulez-vous quand même conserver cette mission ?</span>
      </div>

      <ButtonsContainer>
        <Button accent={Accent.WARNING} onClick={validate}>
          Oui, la conserver
        </Button>
        <Button accent={Accent.WARNING} onClick={cancel}>
          Non, l&apos;abandonner
        </Button>
      </ButtonsContainer>
    </StyledMessage>
  )
}

const StyledMessage = styled(Message)`
  margin-top: 8px;
`
const Warning = styled.p`
  color: ${({ theme }) => theme.color.goldenPoppy};
  font-weight: bold;
`
const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
`
