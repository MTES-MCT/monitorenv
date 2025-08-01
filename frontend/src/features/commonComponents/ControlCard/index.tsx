import { ControlInfractionsTags } from '@features/Mission/components/ControlInfractionsTags'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Button, getLocalizedDayjs, Icon, IconButton, pluralize, Size, THEME } from '@mtes-mct/monitor-ui'
import { TargetTypeEnum, TargetTypeLabels } from 'domain/entities/targetType'
import styled from 'styled-components'

import type { Infraction } from 'domain/entities/missions'

export function ControlCard({
  actionNumberOfControls,
  actionStartDateTimeUtc,
  actionTargetType,
  controlThemes,
  infractions,
  isSelected = false,
  onClose,
  onConsultMission
}: {
  actionNumberOfControls: number
  actionStartDateTimeUtc: string
  actionTargetType: TargetTypeEnum
  controlThemes: string
  infractions: Infraction[]
  isSelected?: boolean
  onClose?: () => void
  onConsultMission?: () => void
}) {
  const isSuperUser = useAppSelector(state => state.account.isSuperUser)

  const parsedActionStartDateTimeUtc = new Date(actionStartDateTimeUtc)
  const actionDate = getLocalizedDayjs(parsedActionStartDateTimeUtc).format('DD MMM à HH:mm')

  return (
    <StyledControlCardHeader>
      <StyledControlThemes>
        <ThemesAndCloseButton>
          {controlThemes && controlThemes?.length > 0 ? (
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
              onClick={onClose}
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
      {isSelected && isSuperUser && (
        <ConsultButton Icon={Icon.Display} isFullWidth={false} onClick={onConsultMission} size={Size.SMALL}>
          Consulter
        </ConsultButton>
      )}
    </StyledControlCardHeader>
  )
}

const CloseButton = styled(IconButton)<{ $isVisible: boolean }>`
  padding: 0;
  margin-left: 8px;
  ${p => !p.$isVisible && 'visibility: hidden;'};
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
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
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
  font-weight: 700;
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
const ConsultButton = styled(Button)`
  align-self: start;
`
