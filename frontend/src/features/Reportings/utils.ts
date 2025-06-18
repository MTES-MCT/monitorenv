import { addMainWindowBanner } from '@features/MainWindow/useCases/addMainWindowBanner'
import { addSideWindowBanner } from '@features/SideWindow/useCases/addSideWindowBanner'
import { customDayjs, Level } from '@mtes-mct/monitor-ui'
import { ReportingContext } from 'domain/shared_slices/Global'
import _ from 'lodash'

import {
  type Reporting,
  type ReportingSource,
  ReportingSourceEnum,
  type TargetDetails
} from '../../domain/entities/reporting'
import { ReportingTargetTypeEnum, ReportingTargetTypeLabels } from '../../domain/entities/targetType'
import { VehicleTypeEnum, vehicleTypeLabels } from '../../domain/entities/vehicleType'

import type { AtLeast } from '../../types'
import type { HomeAppDispatch } from '@store/index'
import type { Dayjs } from 'dayjs'

export const createNewReportingSource: () => ReportingSource = () => ({
  controlUnitId: undefined,
  id: undefined,
  reportingId: undefined,
  semaphoreId: undefined,
  sourceName: undefined,
  sourceType: ReportingSourceEnum.SEMAPHORE
})

export function getReportingInitialValues(reporting: AtLeast<Reporting, 'id'> | Reporting): AtLeast<Reporting, 'id'> {
  return {
    geom: undefined,
    isInfractionProven: true,
    reportingSources: [createNewReportingSource()],
    tags: [],
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
  description,
  targetDetails,
  targetType,
  vehicleType
}: {
  description: string | undefined
  targetDetails: TargetDetails[] | undefined
  targetType: ReportingTargetTypeEnum | undefined
  vehicleType: VehicleTypeEnum | undefined
}) => {
  let targetDetailsAsText = ''

  if (targetType === ReportingTargetTypeEnum.OTHER && description) {
    return description
  }

  if (!targetDetails || !targetType) {
    return targetDetailsAsText
  }

  if (targetDetails.length === 1) {
    if (targetType !== ReportingTargetTypeEnum.VEHICLE) {
      targetDetailsAsText = targetDetails[0]?.operatorName ?? targetDetails[0]?.vesselName ?? ''
    } else {
      targetDetailsAsText =
        targetDetails[0]?.vesselName ??
        targetDetails[0]?.mmsi ??
        targetDetails[0]?.operatorName ??
        targetDetails[0]?.externalReferenceNumber ??
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
  description: string | undefined
  targetDetails: TargetDetails[] | undefined
  targetType: ReportingTargetTypeEnum | undefined
  vehicleType: VehicleTypeEnum | undefined
}

export function sortTargetDetails(targetDetailsA: TargetDataProps, targetDetailsB: TargetDataProps) {
  const targetDetailsAsTextA = getTargetDetailsAsText({
    description: targetDetailsA.description,
    targetDetails: targetDetailsA.targetDetails,
    targetType: targetDetailsA.targetType,
    vehicleType: targetDetailsA.vehicleType
  })

  const targetDetailsAsTextB = getTargetDetailsAsText({
    description: targetDetailsB.description,
    targetDetails: targetDetailsB.targetDetails,
    targetType: targetDetailsB.targetType,
    vehicleType: targetDetailsB.vehicleType
  })

  return targetDetailsAsTextA.localeCompare(targetDetailsAsTextB)
}

export function getTimeLeft(endOfValidity: string | Dayjs | Date) {
  return customDayjs(endOfValidity).diff(customDayjs(), 'hour', true)
}

export function getTargetName({ target, targetType, vehicleType }) {
  if (targetType === ReportingTargetTypeEnum.VEHICLE) {
    if (vehicleType === VehicleTypeEnum.VESSEL) {
      return target?.vesselName ?? ''
    }

    return target?.externalReferenceNumber ?? ''
  }

  return target?.operatorName ?? ''
}

export function getTargetDetailsSubText({ target, targetType, vehicleType }) {
  if (targetType === ReportingTargetTypeEnum.VEHICLE) {
    if (vehicleType === VehicleTypeEnum.VESSEL) {
      let targetId = ''
      if (target?.mmsi) {
        targetId = `MMSI ${target?.mmsi}`
      } else if (!target?.mmsi && target?.externalReferenceNumber) {
        targetId = `Immat ${target?.externalReferenceNumber}`
      } else if (!target?.mmsi && !target?.externalReferenceNumber && target?.imo) {
        targetId = `IMO ${target?.imo}`
      }

      if (targetId !== '') {
        return `${targetId}${target?.size ? ` - ${target?.size}m` : ''}`
      }

      return `${target?.size ? `(${target?.size}m)` : ''}`
    }

    return target?.operatorName
  }

  return target?.vesselName
}

export function displayReportingBanner({
  context,
  dispatch,
  level,
  message
}: {
  context: ReportingContext
  dispatch: HomeAppDispatch
  level: Level
  message: string
}) {
  if (context === ReportingContext.SIDE_WINDOW) {
    dispatch(
      addSideWindowBanner({
        children: message,
        isClosable: true,
        isFixed: true,
        level,
        withAutomaticClosing: true
      })
    )

    return
  }

  dispatch(
    addMainWindowBanner({
      children: message,
      isClosable: true,
      isFixed: true,
      level,
      withAutomaticClosing: true
    })
  )
}
