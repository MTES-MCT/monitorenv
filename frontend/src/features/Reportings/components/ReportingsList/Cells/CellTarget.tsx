import { getTargetDetailsAsText } from '@features/Reportings/utils'
import { Flag } from '@features/Vessel/components/VesselSearch/VesselSearchItem'
import { useAppSelector } from '@hooks/useAppSelector'
import { GENERIC_TARGET_TYPE, ReportingTargetTypeEnum } from 'domain/entities/targetType'
import { VehicleTypeEnum } from 'domain/entities/vehicleType'
import countries from 'i18n-iso-countries'
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

  const targetFlags = targetDetails.filter(target => target.vesselShipId).map(target => target.vesselFlag)

  if (GENERIC_TARGET_TYPE.includes(targetDetailsAsText)) {
    return (
      <Wrapper>
        {VehicleTypeEnum.VESSEL === vehicleType && <Flags flags={targetFlags} />}
        <StyledHighlighter
          autoEscape
          highlightClassName="highlight"
          searchWords={searchQueryFilter ? [searchQueryFilter.toLowerCase()] : []}
          textToHighlight={targetDetailsAsText ?? ''}
          title={targetDetailsAsText}
        />
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      {VehicleTypeEnum.VESSEL === vehicleType && <Flags flags={targetFlags} />}
      <Highlighter
        autoEscape
        highlightClassName="highlight"
        searchWords={searchQueryFilter ? [searchQueryFilter] : []}
        textToHighlight={targetDetailsAsText ?? ''}
        title={targetDetailsAsText}
      />
    </Wrapper>
  )
}

const StyledHighlighter = styled(Highlighter)`
  font-style: italic;
`

function Flags({ flags }: { flags: (string | undefined)[] }) {
  return flags.map(flag => {
    const flagName = flag ? `${flag.toLowerCase()}.svg` : 'unknown.png'

    const flagUrl = flag && `${window.location.origin}/flags/${flagName}`

    return <Flag rel="preload" src={flagUrl} title={flag ? countries.getName(flag, 'fr') : 'Inconnu'} />
  })
}

const Wrapper = styled.div`
  display: flex;
  gap: 8px;
`
