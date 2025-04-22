import { dashboardActions } from '@features/Dashboard/slice'
import { Dashboard } from '@features/Dashboard/types'
import { StatusActionTag } from '@features/Reportings/components/StatusActionTag'
import { getFormattedReportingId, getTargetDetailsSubText, getTargetName } from '@features/Reportings/utils'
import { displaySubThemes } from '@features/Themes/utils/getThemesAsOptions'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, Icon, IconButton, THEME, useClickOutsideEffect, useNewWindow } from '@mtes-mct/monitor-ui'
import { getDateAsLocalizedStringCompact } from '@utils/getDateAsLocalizedString'
import { getFeature } from '@utils/getFeature'
import { getReportingStatus, ReportingStatusEnum, ReportingTypeEnum, type Reporting } from 'domain/entities/reporting'
import { setFitToExtent } from 'domain/shared_slices/Map'
import ArchivedFlag from 'features/Reportings/icons/archived_reporting.svg?react'
import ArchivedInfractionFlag from 'features/Reportings/icons/archived_reporting_infraction.svg?react'
import ArchivedObservationFlag from 'features/Reportings/icons/archived_reporting_observation.svg?react'
import ArchivedWithMissionFlag from 'features/Reportings/icons/archived_reporting_with_mission_attached.svg?react'
import { useMemo, useRef } from 'react'
import styled from 'styled-components'

type ReportingLayerProps = {
  isPinned?: boolean
  isSelected?: boolean
  reporting: Reporting
}

export function Layer({ isPinned = false, isSelected = false, reporting }: ReportingLayerProps) {
  const dispatch = useAppDispatch()

  const ref = useRef<HTMLDivElement>(null)
  const { newWindowContainerRef } = useNewWindow()

  useClickOutsideEffect(
    ref,
    () => {
      dispatch(dashboardActions.setSelectedReporting(undefined))
    },
    newWindowContainerRef.current
  )

  const handleSelect = e => {
    e.stopPropagation()

    if (isPinned) {
      dispatch(dashboardActions.removeItems({ itemIds: [+reporting.id], type: Dashboard.Block.REPORTINGS }))
      dispatch(dashboardActions.setSelectedReporting(undefined))
    } else {
      dispatch(dashboardActions.addItems({ itemIds: [+reporting.id], type: Dashboard.Block.REPORTINGS }))
    }
  }

  const focus = e => {
    e.stopPropagation()
    dispatch(dashboardActions.setSelectedReporting(reporting))

    const feature = getFeature(reporting.geom)

    const extent = feature?.getGeometry()?.getExtent()
    if (extent) {
      dispatch(setFitToExtent(extent))
    }
  }

  const remove = e => {
    e.stopPropagation()

    dispatch(dashboardActions.removeItems({ itemIds: [+reporting.id], type: Dashboard.Block.REPORTINGS }))
  }

  const reportingStatusFlag = useMemo(() => {
    const reportingStatus = getReportingStatus({ ...reporting })

    if (reporting.attachedMission && reportingStatus !== ReportingStatusEnum.ARCHIVED) {
      return <Icon.Report color={THEME.color.mediumSeaGreen} />
    }

    switch (reportingStatus) {
      case ReportingStatusEnum.ARCHIVED:
        return getReportingArchivedFlag()
      case ReportingStatusEnum.IN_PROGRESS:
        return <Icon.Report color={THEME.color.blueGray} />
      case ReportingStatusEnum.INFRACTION_SUSPICION:
        return <Icon.Report color={THEME.color.maximumRed} />
      case ReportingStatusEnum.OBSERVATION:
        return <Icon.Report color={THEME.color.blueGray} />

      default:
        return <Icon.Report color={THEME.color.slateGray} />
    }

    function getReportingArchivedFlag() {
      if (reporting.attachedMission) {
        return <StyledArchivedWithMissionFlag />
      }
      switch (reporting.reportType) {
        case ReportingTypeEnum.INFRACTION_SUSPICION:
          return <StyledArchivedInfractionFlag />
        case ReportingTypeEnum.OBSERVATION:
          return <StyledArchivedObservationFlag />
        default:
          return <StyledArchivedFlag />
      }
    }
  }, [reporting])

  const targetText = useMemo(() => {
    const targetName = getTargetName({
      target: reporting.targetDetails?.[0],
      targetType: reporting.targetType,
      vehicleType: reporting.vehicleType
    })

    const targetDetails = getTargetDetailsSubText({
      target: reporting.targetDetails?.[0],
      targetType: reporting.targetType,
      vehicleType: reporting.vehicleType
    })

    return `${targetName} ${targetDetails ? `(${targetDetails})` : ''}`
  }, [reporting.targetDetails, reporting.targetType, reporting.vehicleType])

  return (
    <StyledReporting ref={ref} $isSelected={isSelected} onClick={focus}>
      <Header>
        {reportingStatusFlag}
        <Summary>
          <Title>
            <Name data-cy={`dashboard-${isSelected ? 'selected-' : ''}reporting-${reporting.id}`}>
              Signalement {getFormattedReportingId(reporting.reportingId)} -{' '}
              {reporting.reportingSources?.map(source => source.displayedSource).join(', ')}
            </Name>
            <Target>{targetText}</Target>
            {reporting.createdAt && <Date>{getDateAsLocalizedStringCompact(reporting.createdAt, true)}</Date>}
          </Title>
          <div>
            <Theme>
              {reporting.theme.name} / {displaySubThemes([reporting.theme])} -{' '}
            </Theme>
            <Description>{reporting.description}</Description>
          </div>
          <StatusActionTag controlStatus={reporting.controlStatus} />
        </Summary>
        {isSelected ? (
          <IconButton
            accent={Accent.TERTIARY}
            color={THEME.color.charcoal}
            Icon={Icon.Close}
            onClick={remove}
            title="Supprimer le signalement"
          />
        ) : (
          <IconButton
            accent={Accent.TERTIARY}
            color={isPinned ? THEME.color.blueGray : THEME.color.charcoal}
            Icon={isPinned ? Icon.PinFilled : Icon.Pin}
            onClick={handleSelect}
            title="Sélectionner le signalement"
          />
        )}
      </Header>
    </StyledReporting>
  )
}

const StyledReporting = styled.div<{ $isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  background-color: ${p => p.theme.color.white};
  border-top: 1px solid ${p => p.theme.color.lightGray};
  padding: 16px 24px;
  &:hover {
    background: ${p => p.theme.color.blueYonder25};
    cursor: pointer;
  }

  ${p =>
    p.$isSelected &&
    `
        padding-left: 20px;
        padding-right: 20px;
        margin-left: 4px;
        margin-right: 4px;
    `}
`

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: baseline;
`

const Summary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0 auto 0 11px;
  width: 100%;
  overflow: hidden;
`

const Title = styled.div`
  display: flex;
  flex-direction: column;
`

const Name = styled.h2`
  color: ${p => p.theme.color.gunMetal};
  font-weight: bold;
  line-height: inherit;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Date = styled.span`
  color: ${p => p.theme.color.slateGray};
  font-weight: normal;
`

const Target = styled.span`
  color: ${p => p.theme.color.charcoal};
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Theme = styled.span`
  color: ${p => p.theme.color.charcoal};
  font-weight: bold;
`

const Description = styled.span`
  color: ${p => p.theme.color.charcoal};
`

const StyledArchivedFlag = styled(ArchivedFlag)`
  width: 20px;
  height: 20px;
`

const StyledArchivedObservationFlag = styled(ArchivedObservationFlag)`
  width: 20px;
  height: 20px;
`

const StyledArchivedInfractionFlag = styled(ArchivedInfractionFlag)`
  width: 20px;
  height: 20px;
`

const StyledArchivedWithMissionFlag = styled(ArchivedWithMissionFlag)`
  width: 20px;
  height: 20px;
`
