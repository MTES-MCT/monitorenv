import styled from 'styled-components'

import { ReportingTargetTypeEnum, ReportingTargetTypeLabels } from '../../../../domain/entities/targetType'
import { getTargetDetailsAsText } from '../../utils'

import type { TargetDetails } from '../../../../domain/entities/reporting'

export function CellTarget({
  targetDetails,
  targetType
}: {
  targetDetails: TargetDetails[]
  targetType: ReportingTargetTypeEnum
}) {
  if (targetDetails.length === 0 && targetType !== ReportingTargetTypeEnum.OTHER) {
    return <span>-</span>
  }
  const targetDetailsAsText = getTargetDetailsAsText({ targetDetails, targetType })

  if (targetDetailsAsText === '' || targetType === ReportingTargetTypeEnum.OTHER) {
    return <ItalicTarget>{ReportingTargetTypeLabels[targetType]}</ItalicTarget>
  }

  return <span title={targetDetailsAsText}>{targetDetailsAsText}</span>
}

const ItalicTarget = styled.span`
  font-style: italic;
`
