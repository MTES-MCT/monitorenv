import { Button, Level, Message } from '@mtes-mct/monitor-ui'
import { useMemo } from 'react'
import styled from 'styled-components'

import { missionSourceEnum } from '../../../domain/entities/missions'

export function ControlUnitWarningMessage(engagedControlUnit: any) {
  const message = useMemo(() => {
    const { missionSources } = engagedControlUnit
    if (missionSources.length === 1) {
      const source = missionSources[0]
      if (!source) {
        return ''
      }

      return `Cette unité est actuellement sélectionnée dans une autre mission en cours ouverte par le ${missionSourceEnum[source].label}.`
    }

    if (missionSources.length > 1) {
      return `Cette unité est actuellement sélectionnée dans plusieurs autres missions en cours, ouvertes par le ${missionSources
        .map(source => missionSourceEnum[source].label)
        .join(' et le ')}.`
    }

    return ''
  }, [engagedControlUnit])

  const validate = () => {}

  const cancel = () => {}

  return (
    <StyledMessage level={Level.WARNING}>
      <Bold>Attention</Bold>
      <div>
        <span>{message}</span>
        <span>Voulez-vous quand même conserver cette mission ?</span>
      </div>

      <div>
        <Button onClick={validate}>Oui, la conserver</Button>
        <Button onClick={cancel}>Non, l&apos;abandonner</Button>
      </div>
    </StyledMessage>
  )
}

const StyledMessage = styled(Message)`
  margin-top: 8px;
`
const Bold = styled.p`
  font-weight: bold;
`
