import { Accent } from '@mtes-mct/monitor-ui'
import _ from 'lodash'

import { LinkToMissionTag } from './components/LinkToMissionTag'
import { StyledArchivedTag } from './style'
import {
  ReportingSourceEnum,
  type Reporting,
  ReportingStatusEnum,
  getReportingStatus,
  type TargetDetails
} from '../../domain/entities/reporting'
import { ReportingTargetTypeLabels, ReportingTargetTypeEnum } from '../../domain/entities/targetType'
import { vehicleTypeLabels, type VehicleTypeEnum } from '../../domain/entities/vehicleType'

import type { AtLeast } from '../../types'

export function getReportingInitialValues(reporting: AtLeast<Reporting, 'id'> | Reporting): AtLeast<Reporting, 'id'> {
  return {
    geom: undefined,
    sourceType: ReportingSourceEnum.SEMAPHORE,
    validityTime: 24,
    ...reporting
  }
}

export function isNewReporting(id: string | number | undefined) {
  if (!id) {
    return false
  }

  return id?.toString().includes('new') ?? false
}

export const getReportingTitle = reporting => {
  if (!reporting) {
    return undefined
  }
  const { id, reportingId } = reporting || {}
  const reportingStatus = getReportingStatus(reporting)
  if (isNewReporting(id)) {
    return `NOUVEAU SIGNALEMENT (${String(id).slice(4)})`
  }

  const statusTag = () => {
    if (reportingStatus === ReportingStatusEnum.ARCHIVED) {
      return <StyledArchivedTag accent={Accent.PRIMARY}>Archivé</StyledArchivedTag>
    }

    if (reporting.missionId && !reporting.detachedFromMissionAtUtc) {
      return <LinkToMissionTag />
    }

    return null
  }

  return (
    <>
      {`SIGNALEMENT ${getFormattedReportingId(reportingId)}`}
      {statusTag()}
    </>
  )
}

export const createIdForNewReporting = reportings => {
  const maxNewReportingId = _.chain(reportings)
    .filter(newReporting => isNewReporting(newReporting.reporting.id))
    .maxBy(filteredNewReporting => Number(filteredNewReporting?.reporting?.id?.split('new-')[1]))
    .value()

  const id =
    maxNewReportingId && maxNewReportingId.reporting.id
      ? `new-${Number(maxNewReportingId?.reporting?.id?.split('new-')[1]) + 1}`
      : 'new-1'

  return id
}

export const getFormattedReportingId = (reportingId: number | undefined) => {
  if (!reportingId) {
    return ''
  }

  return `${String(reportingId).slice(0, 2)}-${String(reportingId).slice(2)}`
}

export const getTargetDetailsAsText = ({
  targetDetails,
  targetType,
  vehicleType
}: {
  targetDetails: TargetDetails[] | undefined
  targetType: ReportingTargetTypeEnum | undefined
  vehicleType: VehicleTypeEnum | undefined
}) => {
  let targetDetailsAsText = ''

  if (!targetDetails || !targetType) {
    return targetDetailsAsText
  }

  if (targetDetails.length === 1) {
    if (targetType !== ReportingTargetTypeEnum.VEHICLE) {
      targetDetailsAsText = targetDetails[0]?.operatorName || targetDetails[0]?.vesselName || ''
    } else {
      targetDetailsAsText =
        targetDetails[0]?.vesselName ||
        targetDetails[0]?.mmsi ||
        targetDetails[0]?.operatorName ||
        targetDetails[0]?.externalReferenceNumber ||
        ''
    }
  } else if (targetDetails.length > 1) {
    targetDetailsAsText = `${targetDetails.length} ${ReportingTargetTypeLabels[targetType]}s`
  }

  if (targetDetailsAsText === '') {
    if (targetType === ReportingTargetTypeEnum.VEHICLE && vehicleType) {
      return vehicleTypeLabels[vehicleType].label
    }

    return ReportingTargetTypeLabels[targetType]
  }

  return targetDetailsAsText
}

type TargetDataProps = {
  targetDetails: TargetDetails[] | undefined
  targetType: ReportingTargetTypeEnum | undefined
  vehicleType: VehicleTypeEnum | undefined
}

export function sortTargetDetails(targetDetailsA: TargetDataProps, targetDetailsB: TargetDataProps) {
  const targetDetailsAsTextA = getTargetDetailsAsText({
    targetDetails: targetDetailsA.targetDetails,
    targetType: targetDetailsA.targetType,
    vehicleType: targetDetailsA.vehicleType
  })

  const targetDetailsAsTextB = getTargetDetailsAsText({
    targetDetails: targetDetailsB.targetDetails,
    targetType: targetDetailsB.targetType,
    vehicleType: targetDetailsB.vehicleType
  })

  return targetDetailsAsTextA.localeCompare(targetDetailsAsTextB)
}
