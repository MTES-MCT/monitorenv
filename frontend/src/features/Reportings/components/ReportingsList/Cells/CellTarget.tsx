import { getTargetDetailsAsText } from '@features/Reportings/utils'
import { useAppSelector } from '@hooks/useAppSelector'
import { GENERIC_TARGET_TYPE, ReportingTargetTypeEnum } from 'domain/entities/targetType'
import { type VehicleTypeEnum } from 'domain/entities/vehicleType'
import Highlighter from 'react-highlight-words'
import styled from 'styled-components'

import type { TargetDetails } from 'domain/entities/reporting'

export function CellTarget({
  description,
  targetDetails,
  targetType,
  vehicleType
}: {
  description: string
  targetDetails: TargetDetails[]
  targetType: ReportingTargetTypeEnum | undefined
  vehicleType: VehicleTypeEnum | undefined
}) {
  const searchQueryFilter = useAppSelector(state => state.reportingFilters.searchQueryFilter)
  if (!targetType) {
    return <span>-</span>
  }

  const targetDetailsAsText = getTargetDetailsAsText({ description, targetDetails, targetType, vehicleType })

  if (GENERIC_TARGET_TYPE.includes(targetDetailsAsText)) {
    return (
      <StyledHighlighter
        autoEscape
        highlightClassName="highlight"
        searchWords={searchQueryFilter ? [searchQueryFilter.toLowerCase()] : []}
        textToHighlight={targetDetailsAsText ?? ''}
        title={targetDetailsAsText}
      />
    )
  }

  return (
    <Highlighter
      autoEscape
      highlightClassName="highlight"
      searchWords={searchQueryFilter ? [searchQueryFilter] : []}
      textToHighlight={targetDetailsAsText ?? ''}
      title={targetDetailsAsText}
    />
  )
}

const StyledHighlighter = styled(Highlighter)`
  font-style: italic;
`
