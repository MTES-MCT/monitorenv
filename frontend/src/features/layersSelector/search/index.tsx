import { useGetVigilanceAreasQuery } from '@api/vigilanceAreasAPI'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useGetCurrentUserAuthorizationQueryOverride } from '@hooks/useGetCurrentUserAuthorizationQueryOverride'
import { getOptionsFromLabelledEnum, type DateAsStringRange, type Option } from '@mtes-mct/monitor-ui'
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
import {
  setFilteredAmpTypes,
  setFilteredRegulatoryThemes,
  setFilteredVigilanceAreaPeriod,
  setGlobalSearchText,
  setVigilanceAreaSpecificPeriodFilter
} from './slice'
import { useGetAMPsQuery } from '../../../api/ampsAPI'
import { useGetRegulatoryLayersQuery } from '../../../api/regulatoryLayersAPI'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'

export function LayerSearch() {
  const dispatch = useAppDispatch()

  const { data: user } = useGetCurrentUserAuthorizationQueryOverride()
  const isSuperUser = user?.isSuperUser

  const { data: amps } = useGetAMPsQuery()
  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()
  const { data: vigilanceAreaLayers } = useGetVigilanceAreasQuery(undefined, { skip: !isSuperUser })
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

  const debouncedSearchLayers = useSearchLayers({
    amps,
    regulatoryLayers,
    vigilanceAreaLayers
  })

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

  const handleSetFilteredVigilanceAreaPeriod = (
    nextVigilanceAreaPeriod: VigilanceArea.VigilanceAreaFilterPeriod | undefined
  ) => {
    dispatch(setFilteredVigilanceAreaPeriod(nextVigilanceAreaPeriod))

    if (nextVigilanceAreaPeriod !== VigilanceArea.VigilanceAreaFilterPeriod.SPECIFIC_PERIOD) {
      dispatch(setVigilanceAreaSpecificPeriodFilter(undefined))
    }

    const nextVigilanceAreaSpecificPeriodFilter =
      nextVigilanceAreaPeriod === VigilanceArea.VigilanceAreaFilterPeriod.SPECIFIC_PERIOD
        ? vigilanceAreaSpecificPeriodFilter
        : undefined

    debouncedSearchLayers({
      ampTypes: filteredAmpTypes,
      extent: searchExtent,
      regulatoryThemes: filteredRegulatoryThemes,
      searchedText: globalSearchText,
      shouldSearchByExtent: shouldFilterSearchOnMapExtent,
      vigilanceAreaPeriodFilter: nextVigilanceAreaPeriod,
      vigilanceAreaSpecificPeriodFilter: nextVigilanceAreaSpecificPeriodFilter
    })
  }

  const handleResetFilters = () => {
    dispatch(setFilteredRegulatoryThemes([]))
    dispatch(setFilteredAmpTypes([]))
    dispatch(setFilteredVigilanceAreaPeriod(undefined))
    dispatch(setVigilanceAreaSpecificPeriodFilter(undefined))
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

  const vigilanceAreaPeriodOptions = getOptionsFromLabelledEnum(VigilanceArea.VigilanceAreaFilterPeriodLabel)

  const allowResetResults =
    !_.isEmpty(regulatoryLayersSearchResult) || !_.isEmpty(ampsSearchResult) || !_.isEmpty(vigilanceAreaSearchResult)

  return (
    <>
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
            isSuperUser={isSuperUser}
            regulatoryThemes={regulatoryThemes}
            setFilteredAmpTypes={handleSetFilteredAmpTypes}
            setFilteredRegulatoryThemes={handleSetFilteredRegulatoryThemes}
            setFilteredVigilanceAreaPeriod={handleSetFilteredVigilanceAreaPeriod}
            updateDateRangeFilter={updateDateRangeFilter}
            vigilanceAreaPeriodOptions={vigilanceAreaPeriodOptions}
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
