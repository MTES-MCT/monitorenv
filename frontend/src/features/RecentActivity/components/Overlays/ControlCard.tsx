import { ControlInfractionsTags } from '@features/Mission/components/ControlInfractionsTags'
import { recentActivityActions } from '@features/RecentActivity/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useGetControlPlans } from '@hooks/useGetControlPlans'
import { Accent, getLocalizedDayjs, Icon, IconButton, pluralize, THEME } from '@mtes-mct/monitor-ui'
import { TargetTypeLabels } from 'domain/entities/targetType'
import { removeOverlayStroke } from 'domain/shared_slices/Global'
import styled from 'styled-components'

import type { Feature } from 'ol'

export function ControlCard({ control, isSelected = false }: { control: Feature; isSelected?: boolean }) {
  const dispatch = useAppDispatch()

  const { actionNumberOfControls, actionStartDateTimeUtc, actionTargetType, infractions, themeIds } =
    control.getProperties()

  const { themes } = useGetControlPlans()
  const controlThemes = themeIds?.map(themeId => themes[themeId]?.theme).join(',')

  const parsedActionStartDateTimeUtc = new Date(actionStartDateTimeUtc)
  const actionDate = getLocalizedDayjs(parsedActionStartDateTimeUtc).format('DD MMM à HH:mm')

  const closeControl = () => {
    if (isSelected) {
      dispatch(removeOverlayStroke())
      // we need this timeout to delete the overlay stroke before delete the selected control
      setTimeout(() => {
        dispatch(recentActivityActions.setSelectedControl())
      }, 100)
    }
  }

  return (
    <StyledControlCardHeader>
      <StyledControlThemes>
        <ThemesAndCloseButton>
          {themeIds?.length > 0 ? (
            <StyledThemes>{controlThemes}</StyledThemes>
          ) : (
            <StyledGrayText>Thématique à renseigner</StyledGrayText>
          )}
          {isSelected && (
            <CloseButton
              $isVisible={isSelected}
              accent={Accent.TERTIARY}
              data-cy="mission-overlay-close"
              Icon={Icon.Close}
              iconSize={14}
              onClick={closeControl}
            />
          )}
        </ThemesAndCloseButton>
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

const CloseButton = styled(IconButton)<{ $isVisible: boolean }>`
  padding: 0px;
  margin-left: 5px;
  ${p => !p.$isVisible && 'visibility: hidden;'};
`

const StyledThemes = styled.div`
  white-space: nowrap;
  font: normal normal bold 13px/18px Marianne;
`
const ThemesAndCloseButton = styled.div`
  display: flex;
  justify-content: space-between;
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
