import styled from 'styled-components'

import { ReportingTargetTypeEnum, ReportingTargetTypeLabels } from '../../../../domain/entities/targetType'

import type { TargetDetails } from '../../../../domain/entities/reporting'

export function CellTarget({
  targetDetails,
  targetType
}: {
  targetDetails: TargetDetails[]
  targetType: ReportingTargetTypeEnum
}) {
  let targetDetailsAsText = ''
  if (targetType !== ReportingTargetTypeEnum.VEHICLE) {
    targetDetailsAsText = targetDetails[0]?.operatorName || ''
  } else {
    targetDetailsAsText = targetDetails[0]?.vesselName || targetDetails[0]?.mmsi || targetDetails[0]?.operatorName || ''
  }

  if (targetDetailsAsText === '') {
    return (
      <ItalicTarget title={ReportingTargetTypeLabels[targetType]}>{ReportingTargetTypeLabels[targetType]}</ItalicTarget>
    )
  }

  return <span title={targetDetailsAsText}>{targetDetailsAsText}</span>
}

const ItalicTarget = styled.span`
  font-style: italic;
`
