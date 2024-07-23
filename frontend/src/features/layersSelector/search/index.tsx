import { useGetVigilanceAreasQuery } from '@api/vigilanceAreasAPI'
import { type Option } from '@mtes-mct/monitor-ui'
import { getRegulatoryThemesAsOptions } from '@utils/getRegulatoryThemesAsOptions'
import { layerSidebarActions } from 'domain/shared_slices/LayerSidebar'
import _ from 'lodash'
import { useMemo } from 'react'
import styled from 'styled-components'

import { useSearchLayers } from './hooks/useSearchLayers'
import { LayerFilters } from './LayerFilters'
import { ResultList } from './ResultsList'
import { SearchInput } from './SearchInput'
import { SearchOnExtentExtraButtons } from './SearchOnExtentExtraButtons'
import { setFilteredAmpTypes, setFilteredRegulatoryThemes, setGlobalSearchText } from './slice'
import { useGetAMPsQuery } from '../../../api/ampsAPI'
import { useGetRegulatoryLayersQuery } from '../../../api/regulatoryLayersAPI'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'

export function LayerSearch() {
  const dispatch = useAppDispatch()
  const { data: amps } = useGetAMPsQuery()
  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()
  const { data: vigilanceAreaLayers } = useGetVigilanceAreasQuery()
  const ampsSearchResult = useAppSelector(state => state.layerSearch.ampsSearchResult)
  const regulatoryLayersSearchResult = useAppSelector(state => state.layerSearch.regulatoryLayersSearchResult)
  const vigilanceAreaSearchResult = useAppSelector(state => state.layerSearch.vigilanceAreaSearchResult)

  const searchExtent = useAppSelector(state => state.layerSearch.searchExtent)
  const globalSearchText = useAppSelector(state => state.layerSearch.globalSearchText)

  const filteredRegulatoryThemes = useAppSelector(state => state.layerSearch.filteredRegulatoryThemes)
  const filteredAmpTypes = useAppSelector(state => state.layerSearch.filteredAmpTypes)
  const filteredVigilanceAreasThemes = useAppSelector(state => state.layerSearch.filteredVigilanceAreasThemes)

  const shouldFilterSearchOnMapExtent = useAppSelector(state => state.layerSearch.shouldFilterSearchOnMapExtent)
  const displayRegFilters = useAppSelector(state => state.layerSidebar.areRegFiltersOpen)

  const debouncedSearchLayers = useSearchLayers({ amps, regulatoryLayers, vigilanceAreaLayers })

  const handleSearchInputChange = searchedText => {
    dispatch(setGlobalSearchText(searchedText))
    debouncedSearchLayers({
      ampTypes: filteredAmpTypes,
      extent: searchExtent,
      regulatoryThemes: filteredRegulatoryThemes,
      searchedText,
      shouldSearchByExtent: shouldFilterSearchOnMapExtent,
      vigilanceAreaThemes: filteredVigilanceAreasThemes
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
      vigilanceAreaThemes: filteredVigilanceAreasThemes
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
      vigilanceAreaThemes: filteredVigilanceAreasThemes
    })
  }

  const handleResetFilters = () => {
    dispatch(setFilteredRegulatoryThemes([]))
    dispatch(setFilteredAmpTypes([]))
    debouncedSearchLayers({
      ampTypes: [],
      extent: searchExtent,
      regulatoryThemes: [],
      searchedText: globalSearchText,
      shouldSearchByExtent: shouldFilterSearchOnMapExtent,
      vigilanceAreaThemes: []
    })
  }

  const openOrCloseRegFilters = () => {
    dispatch(layerSidebarActions.toggleRegFilters())
  }

  const ampTypes = useMemo(
    () =>
      _.chain(amps?.entities)
        .map(l => l?.type?.trim())
        .uniq()
        .filter(l => !!l)
        .map(l => ({ label: l, value: l }))
        .sortBy('label')
        .value() as Option<string>[],
    [amps]
  )

  const regulatoryThemes = useMemo(() => getRegulatoryThemesAsOptions(regulatoryLayers), [regulatoryLayers])

  const allowResetResults =
    !_.isEmpty(regulatoryLayersSearchResult) || !_.isEmpty(ampsSearchResult) || !_.isEmpty(vigilanceAreaSearchResult)

  return (
    <>
      <Search>
        <SearchInput
          displayRegFilters={displayRegFilters}
          filteredAmpTypes={filteredAmpTypes}
          filteredRegulatoryThemes={filteredRegulatoryThemes}
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
            handleResetFilters={handleResetFilters}
            regulatoryThemes={regulatoryThemes}
            setFilteredAmpTypes={handleSetFilteredAmpTypes}
            setFilteredRegulatoryThemes={handleSetFilteredRegulatoryThemes}
          />
        )}
        <ResultList searchedText={globalSearchText} />
      </Search>

      <SearchOnExtentExtraButtons allowResetResults={allowResetResults} debouncedSearchLayers={debouncedSearchLayers} />
    </>
  )
}

const Search = styled.div`
  width: 352px;
`
