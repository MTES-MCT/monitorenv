import styled from 'styled-components'

import {
  GENERIC_TARGET_TYPE,
  ReportingTargetTypeEnum,
  ReportingTargetTypeLabels
} from '../../../../domain/entities/targetType'
import { type VehicleTypeEnum } from '../../../../domain/entities/vehicleType'
import { getTargetDetailsAsText } from '../../utils'

import type { TargetDetails } from '../../../../domain/entities/reporting'

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

  if (GENERIC_TARGET_TYPE.includes(targetDetailsAsText)) {
    return <ItalicTarget title={targetDetailsAsText}>{targetDetailsAsText}</ItalicTarget>
  }

  return <span title={targetDetailsAsText}>{targetDetailsAsText}</span>
}

const ItalicTarget = styled.span`
  font-style: italic;
`