import { useVessels } from '@features/Vessel/hooks/useVessels'
import { vesselAction } from '@features/Vessel/slice'
import { VesselSearchItem } from '@features/Vessel/VesselSearchItem'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { CustomSearch, Search, Size } from '@mtes-mct/monitor-ui'
import { getColorWithAlpha } from '@utils/utils'
import { useState } from 'react'
import styled from 'styled-components'
import { useDebounce } from 'use-debounce'

import type { Vessel } from '@features/Vessel/types'
import type { RsuiteDataItem } from '@mtes-mct/monitor-ui/types/internals'

export function SearchVessel() {
  const dispatch = useAppDispatch()
  const [query, setQuery] = useState<string | undefined>()
  const [debouncedQuery] = useDebounce(query, 300)
  const { options } = useVessels(debouncedQuery)

  const vesselCustomSearch = new CustomSearch(options ?? [], [
    'label',
    'value.imo',
    'value.mmsi',
    'value.immatriculation'
  ])

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
      onChange={(item: Vessel.Identity) => {
        dispatch(vesselAction.setSelectedVesselId(item.id))
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
        const vessel = rsuiteItem.optionValue as unknown as Vessel.Identity

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
