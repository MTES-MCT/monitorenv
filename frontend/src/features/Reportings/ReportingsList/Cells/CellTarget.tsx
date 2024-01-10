import styled from 'styled-components'

import { ReportingTargetTypeEnum, ReportingTargetTypeLabels } from '../../../../domain/entities/targetType'
import { vehicleTypeLabels, type VehicleTypeEnum } from '../../../../domain/entities/vehicleType'
import { getTargetDetailsAsText } from '../../utils'

import type { TargetDetails } from '../../../../domain/entities/reporting'

const ITALIC_WORDS = [
  ReportingTargetTypeLabels.COMPANY,
  ReportingTargetTypeLabels.OTHER,
  ReportingTargetTypeLabels.VEHICLE,
  ReportingTargetTypeLabels.INDIVIDUAL,
  vehicleTypeLabels.OTHER_SEA.label,
  vehicleTypeLabels.VEHICLE_AIR.label,
  vehicleTypeLabels.VEHICLE_LAND.label,
  vehicleTypeLabels.VESSEL.label
]
export function CellTarget({
  targetDetails,
  targetType,
  vehicleType
}: {
  targetDetails: TargetDetails[]
  targetType: ReportingTargetTypeEnum | undefined
  vehicleType: VehicleTypeEnum | undefined
}) {
  if (!targetType) {
    return <span>-</span>
  }

  if (targetType === ReportingTargetTypeEnum.OTHER) {
    return <ItalicTarget>{ReportingTargetTypeLabels[targetType]}</ItalicTarget>
  }
  const targetDetailsAsText = getTargetDetailsAsText({ targetDetails, targetType, vehicleType })

  if (ITALIC_WORDS.includes(targetDetailsAsText)) {
    return <ItalicTarget title={targetDetailsAsText}>{targetDetailsAsText}</ItalicTarget>
  }

  return <span title={targetDetailsAsText}>{targetDetailsAsText}</span>
}

const ItalicTarget = styled.span`
  font-style: italic;
`
