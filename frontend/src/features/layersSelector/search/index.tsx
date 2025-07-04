import { useGetAMPsQuery } from '@api/ampsAPI'
import { vigilanceAreaFiltersActions } from '@features/VigilanceArea/components/VigilanceAreasList/Filters/slice'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
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
  setFilteredRegulatoryTags,
  setFilteredRegulatoryThemes,
  setGlobalSearchText,
  setVigilanceAreaSpecificPeriodFilter
} from './slice'

import type { TagOption } from 'domain/entities/tags'
import type { ThemeOption } from 'domain/entities/themes'

export function LayerSearch() {
  const dispatch = useAppDispatch()

  const { data: amps } = useGetAMPsQuery()

  const ampsSearchResult = useAppSelector(state => state.layerSearch.ampsSearchResult)
  const regulatoryLayersSearchResult = useAppSelector(state => state.layerSearch.regulatoryLayersSearchResult)
  const vigilanceAreaSearchResult = useAppSelector(state => state.layerSearch.vigilanceAreaSearchResult)

  const searchExtent = useAppSelector(state => state.layerSearch.searchExtent)
  const globalSearchText = useAppSelector(state => state.layerSearch.globalSearchText)

  const filteredRegulatoryTags = useAppSelector(state => state.layerSearch.filteredRegulatoryTags)
  const filteredRegulatoryThemes = useAppSelector(state => state.layerSearch.filteredRegulatoryThemes)
  const filteredAmpTypes = useAppSelector(state => state.layerSearch.filteredAmpTypes)
  const filteredVigilanceAreaPeriod = useAppSelector(state => state.layerSearch.filteredVigilanceAreaPeriod)
  const vigilanceAreaSpecificPeriodFilter = useAppSelector(state => state.layerSearch.vigilanceAreaSpecificPeriodFilter)

  const shouldFilterSearchOnMapExtent = useAppSelector(state => state.layerSearch.shouldFilterSearchOnMapExtent)
  const displayRegFilters = useAppSelector(state => state.layerSidebar.areRegFiltersOpen)

  const debouncedSearchLayers = useSearchLayers()

  const genericSearchParams = {
    ampTypes: filteredAmpTypes,
    extent: searchExtent,
    regulatoryTags: filteredRegulatoryTags,
    regulatoryThemes: filteredRegulatoryThemes,
    searchedText: globalSearchText,
    shouldSearchByExtent: shouldFilterSearchOnMapExtent,
    vigilanceAreaPeriodFilter: filteredVigilanceAreaPeriod,
    vigilanceAreaSpecificPeriodFilter
  }

  const handleSearchInputChange = searchedText => {
    dispatch(setGlobalSearchText(searchedText))

    debouncedSearchLayers({
      ...genericSearchParams,
      searchedText
    })
  }

  const handleSetFilteredAmpTypes = filteredTypes => {
    dispatch(setFilteredAmpTypes(filteredTypes))
    debouncedSearchLayers({
      ...genericSearchParams,
      ampTypes: filteredTypes
    })
  }

  const handleSetFilteredRegulatoryTags = (filteredTags: TagOption[]) => {
    dispatch(setFilteredRegulatoryTags(filteredTags))
    debouncedSearchLayers({
      ...genericSearchParams,
      regulatoryTags: filteredTags
    })
  }

  const handleSetFilteredRegulatoryThemes = (filteredThemes: ThemeOption[]) => {
    dispatch(setFilteredRegulatoryThemes(filteredThemes))
    debouncedSearchLayers({
      ...genericSearchParams,
      regulatoryThemes: filteredThemes
    })
  }

  const handleResetFilters = () => {
    dispatch(resetFilters())
    debouncedSearchLayers({
      ...genericSearchParams,
      ampTypes: [],
      regulatoryTags: [],
      regulatoryThemes: [],
      vigilanceAreaPeriodFilter: VigilanceArea.VigilanceAreaFilterPeriod.NEXT_THREE_MONTHS,
      vigilanceAreaSpecificPeriodFilter: undefined
    })
    dispatch(
      vigilanceAreaFiltersActions.setVisibility([VigilanceArea.Visibility.PUBLIC, VigilanceArea.Visibility.PRIVATE])
    )
    dispatch(vigilanceAreaFiltersActions.setStatus([VigilanceArea.Status.DRAFT, VigilanceArea.Status.PUBLISHED]))
  }

  const updateDateRangeFilter = (dateRange: DateAsStringRange | undefined) => {
    dispatch(setVigilanceAreaSpecificPeriodFilter(dateRange))
    debouncedSearchLayers({
      ...genericSearchParams,
      vigilanceAreaSpecificPeriodFilter: dateRange
    })
  }

  const openOrCloseRegFilters = () => {
    dispatch(layerSidebarActions.toggleRegFilters())
  }

  const ampTypes = useMemo(() => getAmpsAsOptions(amps ?? []), [amps])

  const allowResetResults =
    !_.isEmpty(regulatoryLayersSearchResult) ||
    !_.isEmpty(ampsSearchResult) ||
    (!_.isEmpty(vigilanceAreaSearchResult) &&
      filteredVigilanceAreaPeriod !== VigilanceArea.VigilanceAreaFilterPeriod.NEXT_THREE_MONTHS)

  return (
    <SearchContainer>
      <Search>
        <SearchInput
          displayRegFilters={displayRegFilters}
          filteredAmpTypes={filteredAmpTypes}
          filteredRegulatoryTags={filteredRegulatoryTags}
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
            filteredRegulatoryTags={filteredRegulatoryTags}
            filteredRegulatoryThemes={filteredRegulatoryThemes}
            filteredVigilanceAreaPeriod={filteredVigilanceAreaPeriod}
            handleResetFilters={handleResetFilters}
            setFilteredAmpTypes={handleSetFilteredAmpTypes}
            setFilteredRegulatoryTags={handleSetFilteredRegulatoryTags}
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
