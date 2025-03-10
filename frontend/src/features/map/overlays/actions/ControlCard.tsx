import { ControlInfractionsTags } from '@features/Mission/components/ControlInfractionsTags'
import { THEME, getLocalizedDayjs, pluralize } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { TargetTypeLabels } from '../../../../domain/entities/targetType'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { useGetControlPlans } from '../../../../hooks/useGetControlPlans'
import { extractThemesAsText } from '../../../../utils/extractThemesAsText'

import type { Feature } from 'ol'

export function ControlCard({ children = undefined, feature }: { children?: React.ReactNode; feature: Feature }) {
  const listener = useAppSelector(state => state.draw.listener)
  const { actionNumberOfControls, actionStartDateTimeUtc, actionTargetType, controlPlans, infractions } =
    feature.getProperties()
  const parsedActionStartDateTimeUtc = new Date(actionStartDateTimeUtc)
  const actionDate = getLocalizedDayjs(parsedActionStartDateTimeUtc).format('DD MMM à HH:mm')

  const { isLoading, themes } = useGetControlPlans()

  if (listener ?? isLoading) {
    return null
  }

  return (
    <StyledControlCardHeader>
      <StyledControlThemes>
        {children ?? (
          <>
            {controlPlans?.length > 0 ? (
              <StyledThemes>{extractThemesAsText(controlPlans, themes)}</StyledThemes>
            ) : (
              <StyledGrayText>Thématique à renseigner</StyledGrayText>
            )}
          </>
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

const StyledControlCardHeader = styled.div`
  background: ${p => p.theme.color.white};
  padding: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.3);
  gap: 10px;
  flex: 0 0 200px;
`

const StyledControlThemes = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`
const StyledThemes = styled.div`
  white-space: nowrap;
  font: normal normal bold 13px/18px Marianne;
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
