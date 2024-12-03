import { Accent, Button, Level, Message } from '@mtes-mct/monitor-ui'
import { useField, useFormikContext } from 'formik'
import { useMemo } from 'react'
import styled from 'styled-components'

import { missionSourceEnum, type NewMission } from '../../../../domain/entities/missions'
import { cancelCreateAndRedirectToFilteredList } from '../../../../domain/use_cases/missions/cancelCreateAndRedirectToFilteredList'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { getActiveMission, missionFormsActions } from '../slice'

export function ControlUnitWarningMessage({ controlUnitIndex }: { controlUnitIndex: number }) {
  const dispatch = useAppDispatch()

  const { values } = useFormikContext<Partial<NewMission>>()
  const [unitField] = useField<number | undefined>(`controlUnits.${controlUnitIndex}.id`)

  const activeMission = useAppSelector(state => getActiveMission(state.missionForms))
  const engagedControlUnit = activeMission?.engagedControlUnit

  const message = useMemo(() => {
    if (!engagedControlUnit) {
      return ''
    }

    if (engagedControlUnit.missionSources.length === 1) {
      const source = engagedControlUnit.missionSources[0]
      if (!source) {
        return ''
      }

      return `Une autre mission, ouverte par le ${missionSourceEnum[source].label}, est en cours avec cette unité. `
    }

    if (engagedControlUnit.missionSources.length > 1) {
      return `D'autres missions en cours, ouvertes par le ${engagedControlUnit.missionSources
        .map(source => missionSourceEnum[source].label)
        .join(' et le ')}, sont en cours avec cette unité. `
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

  if (!engagedControlUnit || engagedControlUnit?.controlUnit.id !== unitField.value) {
    return null
  }

  return (
    <StyledMessage level={Level.WARNING}>
      <Warning>Attention</Warning>
      <div>
        <span>{message}</span>
        <span>Voulez-vous quand même conserver cette mission ?</span>
      </div>

      <ButtonsContainer>
        <Button accent={Accent.WARNING} isFullWidth onClick={validate}>
          Oui, la conserver
        </Button>
        <Button accent={Accent.WARNING} isFullWidth onClick={cancel}>
          Non, l&apos;abandonner
        </Button>
      </ButtonsContainer>
    </StyledMessage>
  )
}

const StyledMessage = styled(Message)`
  margin-top: 8px;
  position: relative;
  z-index: 10;
`
const Warning = styled.p`
  color: ${({ theme }) => theme.color.goldenPoppy};
  font-weight: bold;
`
const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  gap: 8px;
`
