import { NumberOfFilters } from '@features/map/shared/style'
import { useGetFilteredVigilanceAreasQuery } from '@features/VigilanceArea/hooks/useGetFilteredVigilanceAreasQuery'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Icon, IconButton, Size } from '@mtes-mct/monitor-ui'
import { layerSidebarActions } from 'domain/shared_slices/LayerSidebar'
import { debounce, isEmpty } from 'lodash'
import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import { LayerFilters } from './LayerFilters'
import { ResultList } from './ResultsList'
import { SearchInput } from './SearchInput'
import { SearchOnExtentExtraButtons } from './SearchOnExtentExtraButtons'
import { setGlobalSearchText } from './slice'

export function LayerSearch({ numberOfFilters }: { numberOfFilters: number }) {
  const dispatch = useAppDispatch()

  const ampsSearchResult = useAppSelector(state => state.layerSearch.ampsSearchResult)
  const regulatoryLayersSearchResult = useAppSelector(state => state.layerSearch.regulatoryLayersSearchResult)
  const { vigilanceAreas } = useGetFilteredVigilanceAreasQuery()

  const [query, setQuery] = useState<string | undefined>(undefined)
  const globalSearchText = useAppSelector(state => state.layerSearch.globalSearchText)

  const filteredVigilanceAreaPeriod = useAppSelector(state => state.vigilanceAreaFilters.period)

  const displayRegFilters = useAppSelector(state => state.layerSidebar.areRegFiltersOpen)
  const displayLayersSidebar = useAppSelector(state => state.global.menus.displayLayersSidebar)

  const debouncedSearch = useMemo(() => debounce(value => dispatch(setGlobalSearchText(value)), 300), [dispatch])

  const handleSearchInputChange = useCallback(
    (searchedText: string | undefined) => {
      setQuery(searchedText)
      debouncedSearch(searchedText)
    },
    [debouncedSearch]
  )

  const openOrCloseRegFilters = useCallback(() => {
    dispatch(layerSidebarActions.toggleRegFilters())
  }, [dispatch])

  const allowResetResults =
    !isEmpty(regulatoryLayersSearchResult) ||
    !isEmpty(ampsSearchResult) ||
    (!isEmpty(vigilanceAreas.ids) &&
      filteredVigilanceAreaPeriod !== VigilanceArea.VigilanceAreaFilterPeriod.NEXT_THREE_MONTHS)

  return (
    <SearchContainer>
      <Search>
        <SearchInput
          globalSearchText={query}
          placeholder="Rechercher une zone"
          setGlobalSearchText={handleSearchInputChange}
        >
          <div>
            {displayLayersSidebar && numberOfFilters > 0 && <NumberOfFilters>{numberOfFilters}</NumberOfFilters>}
            <IconButton
              accent={Accent.PRIMARY}
              className={displayRegFilters ? '_active' : ''}
              Icon={Icon.FilterBis}
              onClick={openOrCloseRegFilters}
              size={Size.LARGE}
              title="Filtrer par type de zones"
            />
          </div>
        </SearchInput>

        {displayRegFilters && <LayerFilters />}
        <ResultList searchedText={globalSearchText} />
      </Search>

      <SearchOnExtentExtraButtons allowResetResults={allowResetResults} />
    </SearchContainer>
  )
}

const SearchContainer = styled.div`
  display: flex;
`
const Search = styled.div`
  width: 352px;
`
