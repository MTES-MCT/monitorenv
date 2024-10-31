import { type DateAsStringRange } from '@mtes-mct/monitor-ui'
import { getAmpsAsOptions } from '@utils/getAmpsAsOptions'
import { layerSidebarActions } from 'domain/shared_slices/LayerSidebar'
import _ from 'lodash'
import { useMemo } from 'react'
import styled from 'styled-components'

import { useSearchLayers } from './hooks/useSearchLayers'
import { LayerFilters } from './LayerFilters'
import { ResultList } from './ResultsList'
import { SearchInput } from './SearchInput'
import { SearchOnExtentExtraButtons } from './SearchOnExtentExtraButtons'
import {
  resetFilters,
  setFilteredAmpTypes,
  setFilteredRegulatoryThemes,
  setGlobalSearchText,
  setVigilanceAreaSpecificPeriodFilter
} from './slice'
import { useGetAMPsQuery } from '../../../api/ampsAPI'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'

export function LayerSearch() {
  const dispatch = useAppDispatch()

  const { data: amps } = useGetAMPsQuery()

  const ampsSearchResult = useAppSelector(state => state.layerSearch.ampsSearchResult)
  const regulatoryLayersSearchResult = useAppSelector(state => state.layerSearch.regulatoryLayersSearchResult)
  const vigilanceAreaSearchResult = useAppSelector(state => state.layerSearch.vigilanceAreaSearchResult)

  const searchExtent = useAppSelector(state => state.layerSearch.searchExtent)
  const globalSearchText = useAppSelector(state => state.layerSearch.globalSearchText)

  const filteredRegulatoryThemes = useAppSelector(state => state.layerSearch.filteredRegulatoryThemes)
  const filteredAmpTypes = useAppSelector(state => state.layerSearch.filteredAmpTypes)
  const filteredVigilanceAreaPeriod = useAppSelector(state => state.layerSearch.filteredVigilanceAreaPeriod)
  const vigilanceAreaSpecificPeriodFilter = useAppSelector(state => state.layerSearch.vigilanceAreaSpecificPeriodFilter)

  const shouldFilterSearchOnMapExtent = useAppSelector(state => state.layerSearch.shouldFilterSearchOnMapExtent)
  const displayRegFilters = useAppSelector(state => state.layerSidebar.areRegFiltersOpen)

  const debouncedSearchLayers = useSearchLayers()

  const handleSearchInputChange = searchedText => {
    dispatch(setGlobalSearchText(searchedText))
    debouncedSearchLayers({
      ampTypes: filteredAmpTypes,
      extent: searchExtent,
      regulatoryThemes: filteredRegulatoryThemes,
      searchedText,
      shouldSearchByExtent: shouldFilterSearchOnMapExtent,
      vigilanceAreaPeriodFilter: filteredVigilanceAreaPeriod,
      vigilanceAreaSpecificPeriodFilter
    })
  }

  const handleSetFilteredAmpTypes = filteredTypes => {
    dispatch(setFilteredAmpTypes(filteredTypes))
    debouncedSearchLayers({
      ampTypes: filteredTypes,
      extent: searchExtent,
      regulatoryThemes: filteredRegulatoryThemes,
      searchedText: globalSearchText,
      shouldSearchByExtent: shouldFilterSearchOnMapExtent,
      vigilanceAreaPeriodFilter: filteredVigilanceAreaPeriod,
      vigilanceAreaSpecificPeriodFilter
    })
  }

  const handleSetFilteredRegulatoryThemes = filteredThemes => {
    dispatch(setFilteredRegulatoryThemes(filteredThemes))
    debouncedSearchLayers({
      ampTypes: filteredAmpTypes,
      extent: searchExtent,
      regulatoryThemes: filteredThemes,
      searchedText: globalSearchText,
      shouldSearchByExtent: shouldFilterSearchOnMapExtent,
      vigilanceAreaPeriodFilter: filteredVigilanceAreaPeriod,
      vigilanceAreaSpecificPeriodFilter
    })
  }

  const handleResetFilters = () => {
    dispatch(resetFilters())
    debouncedSearchLayers({
      ampTypes: [],
      extent: searchExtent,
      regulatoryThemes: [],
      searchedText: globalSearchText,
      shouldSearchByExtent: shouldFilterSearchOnMapExtent,
      vigilanceAreaPeriodFilter: undefined,
      vigilanceAreaSpecificPeriodFilter: undefined
    })
  }

  const updateDateRangeFilter = (dateRange: DateAsStringRange | undefined) => {
    dispatch(setVigilanceAreaSpecificPeriodFilter(dateRange))
    debouncedSearchLayers({
      ampTypes: filteredAmpTypes,
      extent: searchExtent,
      regulatoryThemes: filteredRegulatoryThemes,
      searchedText: globalSearchText,
      shouldSearchByExtent: shouldFilterSearchOnMapExtent,
      vigilanceAreaPeriodFilter: filteredVigilanceAreaPeriod,
      vigilanceAreaSpecificPeriodFilter: dateRange
    })
  }

  const openOrCloseRegFilters = () => {
    dispatch(layerSidebarActions.toggleRegFilters())
  }

  const ampTypes = useMemo(() => getAmpsAsOptions(amps ?? []), [amps])

  const allowResetResults =
    !_.isEmpty(regulatoryLayersSearchResult) || !_.isEmpty(ampsSearchResult) || !_.isEmpty(vigilanceAreaSearchResult)

  return (
    <SearchContainer>
      <Search>
        <SearchInput
          displayRegFilters={displayRegFilters}
          filteredAmpTypes={filteredAmpTypes}
          filteredRegulatoryThemes={filteredRegulatoryThemes}
          filteredVigilanceAreaPeriod={filteredVigilanceAreaPeriod}
          globalSearchText={globalSearchText}
          placeholder="Rechercher une zone"
          setGlobalSearchText={handleSearchInputChange}
          toggleRegFilters={openOrCloseRegFilters}
        />
        {displayRegFilters && (
          <LayerFilters
            ampTypes={ampTypes}
            filteredAmpTypes={filteredAmpTypes}
            filteredRegulatoryThemes={filteredRegulatoryThemes}
            filteredVigilanceAreaPeriod={filteredVigilanceAreaPeriod}
            handleResetFilters={handleResetFilters}
            setFilteredAmpTypes={handleSetFilteredAmpTypes}
            setFilteredRegulatoryThemes={handleSetFilteredRegulatoryThemes}
            updateDateRangeFilter={updateDateRangeFilter}
          />
        )}
        <ResultList searchedText={globalSearchText} />
      </Search>

      <SearchOnExtentExtraButtons allowResetResults={allowResetResults} debouncedSearchLayers={debouncedSearchLayers} />
    </SearchContainer>
  )
}

const SearchContainer = styled.div`
  display: flex;
`
const Search = styled.div`
  width: 352px;
`
