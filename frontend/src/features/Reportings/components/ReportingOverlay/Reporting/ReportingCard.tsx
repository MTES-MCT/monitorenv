import { editReportingInLocalStore } from '@features/Reportings/useCases/editReportingInLocalStore'
import {
  getFormattedReportingId,
  getTargetDetailsSubText,
  getTargetName,
  getTimeLeft
} from '@features/Reportings/utils'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useTracking } from '@hooks/useTracking'
import { Accent, Button, Icon, IconButton, Size, THEME, Tag, getLocalizedDayjs } from '@mtes-mct/monitor-ui'
import { displaySubThemes } from '@utils/getThemesAsOptions'
import { ControlStatusEnum, ReportingTypeEnum, ReportingTypeLabels } from 'domain/entities/reporting'
import { ReportingTargetTypeLabels } from 'domain/entities/targetType'
import { vehicleTypeLabels } from 'domain/entities/vehicleType'
import { ReportingContext } from 'domain/shared_slices/Global'
import { closeAllOverlays } from 'domain/use_cases/map/closeAllOverlays'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'

import { LinkToMissionTag } from '../../LinkToMissionTag'
import { StatusActionTag } from '../../StatusActionTag'

type ReportingCardProps = {
  feature: any
  isCardVisible?: boolean
  isOnlyHoverable?: boolean
  isSuperUser?: boolean
  onClose: () => void
  selected?: boolean
  updateMargins: (margin: number) => void
}
function StatusTag({
  controlStatus,
  isArchived,
  isAttachToMission
}: {
  controlStatus: ControlStatusEnum
  isArchived: boolean
  isAttachToMission: boolean
}) {
  if (isArchived) {
    return (
      <Tag borderColor={THEME.color.slateGray} color={THEME.color.slateGray}>
        Archivé
      </Tag>
    )
  }
  if (isAttachToMission) {
    return (
      <AttachedMissionContainer>
        <LinkToMissionTag />
        <StatusActionTag controlStatus={controlStatus} />
      </AttachedMissionContainer>
    )
  }

  return null
}

export function ReportingCard({
  feature,
  isCardVisible = true,
  isOnlyHoverable = false,
  isSuperUser = true,
  onClose,
  selected = false,
  updateMargins
}: ReportingCardProps) {
  const dispatch = useAppDispatch()
  const { trackEvent } = useTracking()

  const ref = useRef<HTMLDivElement>(null)

  const {
    controlStatus,
    createdAt,
    description,
    detachedFromMissionAtUtc,
    id,
    isArchived,
    missionId,
    reportingId,
    reportType,
    targetDetails,
    targetType,
    theme,
    validityTime,
    vehicleType
  } = feature.getProperties()

  const creationDate = getLocalizedDayjs(createdAt).format('DD MMM YYYY à HH:mm')
  const endOfValidity = getLocalizedDayjs(createdAt).add(validityTime || 0, 'hour')
  const timeLeft = getTimeLeft(endOfValidity)

  const targetName = useMemo(() => {
    if (targetDetails.length > 1) {
      if (vehicleType) {
        return `${targetDetails.length} ${vehicleTypeLabels[vehicleType].label.toLowerCase()}s`
      }

      return `${targetDetails.length} ${ReportingTargetTypeLabels[targetType]}s`
    }

    return getTargetName({ target: targetDetails[0], targetType, vehicleType })
  }, [targetDetails, vehicleType, targetType])

  const targetDetailsText = useMemo(() => {
    if (targetDetails.length > 1) {
      return undefined
    }

    return getTargetDetailsSubText({ target: targetDetails[0], targetType, vehicleType })
  }, [targetDetails, vehicleType, targetType])

  const timeLeftText = useMemo(() => {
    if (timeLeft < 0 || isArchived) {
      return 'Archivé'
    }

    if (timeLeft > 0 && timeLeft < 1) {
      return 'Fin dans < 1h'
    }

    return `Fin dans ${Math.round(timeLeft)} h`
  }, [timeLeft, isArchived])

  const editReporting = () => {
    dispatch(editReportingInLocalStore(id, ReportingContext.MAP))
    dispatch(closeAllOverlays())

    if (!isSuperUser) {
      trackEvent({
        action: 'Consultation Signalement',
        category: 'MONITOR_EXT',
        name: 'Consultation Signalement'
      })
    }
  }

  const closeReportingCard = useCallback(() => {
    onClose()
  }, [onClose])

  useEffect(() => {
    if (feature && ref.current) {
      const cardHeight = ref.current.offsetHeight
      updateMargins(cardHeight === 0 ? 200 : cardHeight)
    }
  }, [feature, updateMargins])

  if (!isCardVisible) {
    return null
  }

  return (
    <Wrapper ref={ref} data-cy="reporting-overlay">
      <StyledHeader>
        <StyledHeaderFirstLine>
          <StyledBoldText>{`${getFormattedReportingId(reportingId)} - ${targetName}`}</StyledBoldText>
          {targetDetailsText && <StyledBoldText>{targetDetailsText}</StyledBoldText>}
          <StyledGrayText>
            <StyledBullet
              $color={
                reportType === ReportingTypeEnum.INFRACTION_SUSPICION ? THEME.color.maximumRed : THEME.color.blueGray
              }
            />
            {ReportingTypeLabels[reportType]}
          </StyledGrayText>
          <StyledGrayText>{creationDate} (UTC)</StyledGrayText>
        </StyledHeaderFirstLine>

        <StyledHeaderSecondLine>
          {timeLeft > 0 && !isArchived && (
            <>
              <Icon.Clock />
              <span>{timeLeftText}</span>
            </>
          )}

          <CloseButton
            $isVisible={selected}
            accent={Accent.TERTIARY}
            data-cy="reporting-overlay-close"
            Icon={Icon.Close}
            iconSize={14}
            onClick={closeReportingCard}
          />
        </StyledHeaderSecondLine>
      </StyledHeader>
      <div>
        <StyledThemeContainer>
          {theme && <StyledBoldText>{theme.name}</StyledBoldText>}
          {theme?.subThemes && <StyledMediumText>&nbsp;/&nbsp;{displaySubThemes([theme])}</StyledMediumText>}
        </StyledThemeContainer>
        {description && isSuperUser && <StyledDescription title={description}>{description}</StyledDescription>}
      </div>
      <StatusTag
        controlStatus={controlStatus}
        isArchived={timeLeft < 0 || isArchived}
        isAttachToMission={missionId && !detachedFromMissionAtUtc}
      />
      {!isOnlyHoverable && (
        <StyledButton data-cy="map-edit-reporting" Icon={Icon.Edit} onClick={editReporting} size={Size.SMALL}>
          {isSuperUser ? 'Éditer le signalement' : 'Consulter le signalement'}
        </StyledButton>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  padding: 10px;
  box-shadow: 0px 3px 6px #70778540;
  border-radius: 1px;
  background-color: ${p => p.theme.color.white};
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 0 0 345px;
`
const StyledHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: space-between;
`

const StyledHeaderFirstLine = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  > span {
    max-width: 190px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const StyledHeaderSecondLine = styled.div`
  display: flex;
  flex-direction: row;
  > span {
    margin-left: 4px;
    color: ${p => p.theme.color.charcoal};
  }
`
const CloseButton = styled(IconButton)<{ $isVisible: boolean }>`
  padding: 0px;
  margin-left: 8px;
  ${p => !p.$isVisible && 'visibility: hidden;'};
`

const StyledBoldText = styled.span`
  font-weight: 700;
  color: ${p => p.theme.color.gunMetal};
`
const StyledMediumText = styled.span`
  font-weight: 500;
  color: ${p => p.theme.color.gunMetal};
`
const StyledGrayText = styled.span`
  color: ${p => p.theme.color.slateGray};
  display: flex;
  align-items: baseline;
`
const StyledBullet = styled.div<{ $color: string }>`
  border-radius: 50%;
  background-color: ${p => p.$color};
  width: 10px;
  height: 10px;
  margin-right: 6px;
`
const StyledDescription = styled.p`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  color: ${p => p.theme.color.gunMetal};
  padding-right: 32px;
`

const StyledThemeContainer = styled.div`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  padding-right: 32px;
`

// TODO delete when Monitor-ui component have good padding
const StyledButton = styled(Button)`
  padding: 4px 12px;
  align-self: start;
  width: inherit;
`

const AttachedMissionContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`
