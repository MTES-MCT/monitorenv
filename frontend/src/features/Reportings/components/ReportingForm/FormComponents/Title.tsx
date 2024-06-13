import { ReportingInfos } from '@features/Reportings/style'
import { getFormattedReportingId, getTargetDetailsAsText, isNewReporting } from '@features/Reportings/utils'
import { GENERIC_TARGET_TYPE } from 'domain/entities/targetType'
import styled from 'styled-components'

export function Title({ reporting }) {
  if (!reporting) {
    return undefined
  }
  const { id, reportingId } = reporting || {}

  if (isNewReporting(id)) {
    return `NOUVEAU SIGNALEMENT (${String(id).slice(4)})`
  }

  const targetAsText = getTargetDetailsAsText({
    description: reporting.description,
    targetDetails: reporting.targetDetails,
    targetType: reporting.targetType,
    vehicleType: reporting.vehicleType
  })

  return (
    <ReportingInfos>
      <span>{`${getFormattedReportingId(reportingId)} - `}</span>
      {GENERIC_TARGET_TYPE.includes(targetAsText) ? (
        <ItalicTarget title={targetAsText}>{targetAsText}</ItalicTarget>
      ) : (
        <span title={targetAsText}>{targetAsText}</span>
      )}
    </ReportingInfos>
  )
}

const ItalicTarget = styled.span`
  font-style: italic;
`
