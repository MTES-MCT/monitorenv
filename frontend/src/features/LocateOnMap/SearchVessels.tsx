import { useVessels } from '@features/LocateOnMap/hook/useVessels'
import { VesselSearchItem } from '@features/LocateOnMap/VesselSearchItem'
import { CustomSearch, Search, Size } from '@mtes-mct/monitor-ui'
import { getColorWithAlpha } from '@utils/utils'
import { useState } from 'react'
import styled from 'styled-components'

import type { Vessel } from '@api/vesselsAPI'
import type { RsuiteDataItem } from '@mtes-mct/monitor-ui/types/internals'

export function SearchVessel() {
  const [query, setQuery] = useState<string | undefined>()
  const { options } = useVessels(query)

  const vesselCustomSearch = new CustomSearch(options ?? [], ['label'])

  return (
    <StyledSearch
      key="vessel-search"
      customSearch={vesselCustomSearch}
      data-cy="vessel-search-input"
      isLabelHidden
      isLight
      isSearchIconHidden
      label="Rechercher un navire"
      name="search-vessel"
      onChange={() => {
        // TODO: SELECT VESSEL HERE
      }}
      onQuery={nextQuery => {
        setQuery(nextQuery)
      }}
      options={options}
      optionValueKey="id"
      placeholder="Rechercher un navire"
      renderMenu={node => <StyledMenu>{node}</StyledMenu>}
      renderMenuItem={(_, item) => {
        const rsuiteItem = item as RsuiteDataItem
        const vessel = rsuiteItem.optionValue as unknown as Vessel

        return (
          <VesselSearchItem
            key={vessel.id}
            flag={vessel.flag}
            immatriculation={vessel.immatriculation}
            imo={vessel.imo}
            mmsi={vessel.mmsi}
            searchQuery={query}
            vesselName={vessel.shipName}
          />
        )
      }}
      size={Size.LARGE}
    />
  )
}

const StyledSearch = styled(Search)`
  box-shadow: 0px 3px 6px ${p => getColorWithAlpha(p.theme.color.slateGray, 0.25)};
  flex-grow: 1;
  width: 400px;
`

const StyledMenu = styled.div`
  > div > div {
    border-bottom: 1px solid ${p => p.theme.color.lightGray};
  }
`
