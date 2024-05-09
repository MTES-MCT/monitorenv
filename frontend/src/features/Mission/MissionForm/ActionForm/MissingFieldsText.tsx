import { getIsMissionEnded } from '@features/Mission/utils'
import { Icon, pluralize, THEME } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export function MissingFieldsText({
  missionEndDate,
  totalMissingFields
}: {
  missionEndDate: string | undefined
  totalMissingFields: number
}) {
  if (totalMissingFields === 0) {
    return (
      <MissingFieldsContainer>
        <Icon.Confirm color={THEME.color.mediumSeaGreen} />{' '}
        <Text $color={THEME.color.mediumSeaGreen} data-cy="action-all-fields-are-filled-text">
          Complété – les champs nécessaires aux statistiques sont remplis
        </Text>
      </MissingFieldsContainer>
    )
  }

  const isMissionEnded = getIsMissionEnded(missionEndDate)

  return (
    <MissingFieldsContainer>
      <Icon.AttentionFilled color={isMissionEnded ? THEME.color.maximumRed : THEME.color.charcoal} />
      <Text
        $color={isMissionEnded ? THEME.color.maximumRed : THEME.color.charcoal}
        data-cy="action-missing-fields-text"
      >
        {totalMissingFields} {pluralize('champ', totalMissingFields)} {pluralize('nécessaire', totalMissingFields)} aux
        statistiques à compléter
      </Text>
    </MissingFieldsContainer>
  )
}

const MissingFieldsContainer = styled.div`
  color: ${p => p.theme.color.gunMetal};
  display: flex;
  flex-direction: row;
  font-weight: 700;
  gap: 8px;
`

const Text = styled.p<{ $color: string }>`
  color: ${p => p.$color};
`
