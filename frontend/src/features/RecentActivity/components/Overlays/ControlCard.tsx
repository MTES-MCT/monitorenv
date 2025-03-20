import { ControlInfractionsTags } from '@features/Mission/components/ControlInfractionsTags'
import { useGetControlPlans } from '@hooks/useGetControlPlans'
import { getLocalizedDayjs, pluralize, THEME } from '@mtes-mct/monitor-ui'
import { TargetTypeLabels } from 'domain/entities/targetType'
import styled from 'styled-components'

export function ControlCard({ control }) {
  const { themes } = useGetControlPlans()
  const { actionNumberOfControls, actionStartDateTimeUtc, actionTargetType, infractions, themeIds } = control.properties
  const controlThemes = themeIds?.map(themeId => themes[themeId]?.theme).join(',')

  const parsedActionStartDateTimeUtc = new Date(actionStartDateTimeUtc)
  const actionDate = getLocalizedDayjs(parsedActionStartDateTimeUtc).format('DD MMM à HH:mm')

  return (
    <StyledControlCardHeader>
      <StyledControlThemes>
        {themeIds?.length > 0 ? (
          <StyledThemes>{controlThemes}</StyledThemes>
        ) : (
          <StyledGrayText>Thématique à renseigner</StyledGrayText>
        )}
        <Accented>
          {actionNumberOfControls} {pluralize('contrôle', actionNumberOfControls)}{' '}
          {TargetTypeLabels[actionTargetType] ? (
            <>({TargetTypeLabels[actionTargetType]})</>
          ) : (
            <StyledGrayText>(cible non renseignée)</StyledGrayText>
          )}
          <Bullet $color={infractions?.length > 0 ? THEME.color.maximumRed : THEME.color.mediumSeaGreen} />
        </Accented>
      </StyledControlThemes>
      {infractions && (
        <ControlInfractionsTags actionNumberOfControls={actionNumberOfControls} infractions={infractions} />
      )}
      <StyledGrayText>{actionStartDateTimeUtc ? actionDate : 'Date à renseigner'}</StyledGrayText>
    </StyledControlCardHeader>
  )
}
const StyledThemes = styled.div`
  white-space: nowrap;
  font: normal normal bold 13px/18px Marianne;
`

const StyledControlCardHeader = styled.div`
  background: ${p => p.theme.color.white};
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 0 0 200px;
`

const StyledControlThemes = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`

const Accented = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  white-space: nowrap;
  gap: 5px;
  font-weight: 500;
`

const Bullet = styled.div<{ $color: string }>`
  border-radius: 50%;
  width: 10px;
  height: 10px;
  background-color: ${p => p.$color};
`

const StyledGrayText = styled.p`
  color: ${p => p.theme.color.slateGray};
`
