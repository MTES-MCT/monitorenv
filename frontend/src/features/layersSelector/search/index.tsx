import { useGetAMPsQuery } from '@api/ampsAPI'
import { NumberOfFilters } from '@features/map/shared/style'
import {
  INITIAL_STATE,
  vigilanceAreaFiltersActions
} from '@features/VigilanceArea/components/VigilanceAreasList/Filters/slice'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, type DateAsStringRange, Icon, IconButton, Size } from '@mtes-mct/monitor-ui'
import { getAmpsAsOptions } from '@utils/getAmpsAsOptions'
import { layerSidebarActions } from 'domain/shared_slices/LayerSidebar'
import { isEmpty } from 'lodash'
import { useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { LayerFilters } from './LayerFilters'
import { ResultList } from './ResultsList'
import { SearchInput } from './SearchInput'
import { SearchOnExtentExtraButtons } from './SearchOnExtentExtraButtons'
import {
  resetFilters,
  setFilteredAmpTypes,
  setFilteredRegulatoryTags,
  setFilteredRegulatoryThemes,
  setGlobalSearchText
} from './slice'

import type { TagOption } from 'domain/entities/tags'
import type { ThemeOption } from 'domain/entities/themes'

export function LayerSearch({ numberOfFilters }: { numberOfFilters: number }) {
  const dispatch = useAppDispatch()

  const { data: amps } = useGetAMPsQuery()

  const ampsSearchResult = useAppSelector(state => state.layerSearch.ampsSearchResult)
  const regulatoryLayersSearchResult = useAppSelector(state => state.layerSearch.regulatoryLayersSearchResult)
  const vigilanceAreaSearchResult = useAppSelector(state => state.layerSearch.vigilanceAreaSearchResult)

  const globalSearchText = useAppSelector(state => state.layerSearch.globalSearchText)

  const filteredRegulatoryTags = useAppSelector(state => state.layerSearch.filteredRegulatoryTags)
  const filteredRegulatoryThemes = useAppSelector(state => state.layerSearch.filteredRegulatoryThemes)
  const filteredAmpTypes = useAppSelector(state => state.layerSearch.filteredAmpTypes)
  const filteredVigilanceAreaPeriod = useAppSelector(state => state.vigilanceAreaFilters.period)

  const displayRegFilters = useAppSelector(state => state.layerSidebar.areRegFiltersOpen)
  const displayLayersSidebar = useAppSelector(state => state.global.menus.displayLayersSidebar)

  const handleSearchInputChange = useCallback(
    searchedText => {
      dispatch(setGlobalSearchText(searchedText))
    },
    [dispatch]
  )

  const handleSetFilteredAmpTypes = useCallback(
    filteredTypes => {
      dispatch(setFilteredAmpTypes(filteredTypes))
    },
    [dispatch]
  )

  const handleSetFilteredRegulatoryTags = useCallback(
    (filteredTags: TagOption[]) => {
      dispatch(setFilteredRegulatoryTags(filteredTags))
    },
    [dispatch]
  )

  const handleSetFilteredRegulatoryThemes = useCallback(
    (filteredThemes: ThemeOption[]) => {
      dispatch(setFilteredRegulatoryThemes(filteredThemes))
    },
    [dispatch]
  )

  const handleResetFilters = useCallback(() => {
    dispatch(resetFilters())
    dispatch(vigilanceAreaFiltersActions.resetFilters())

    dispatch(
      vigilanceAreaFiltersActions.updateFilters({
        key: 'visibility',
        value: INITIAL_STATE.visibility
      })
    )
    dispatch(
      vigilanceAreaFiltersActions.updateFilters({
        key: 'status',
        value: INITIAL_STATE.status
      })
    )
    dispatch(
      vigilanceAreaFiltersActions.updateFilters({
        key: 'period',
        value: INITIAL_STATE.period
      })
    )
    dispatch(
      vigilanceAreaFiltersActions.updateFilters({
        key: 'specificPeriod',
        value: INITIAL_STATE.specificPeriod
      })
    )
  }, [dispatch])

  const updateDateRangeFilter = useCallback(
    (dateRange: DateAsStringRange | undefined) => {
      dispatch(vigilanceAreaFiltersActions.updateFilters({ key: 'specificPeriod', value: dateRange }))
    },
    [dispatch]
  )

  const openOrCloseRegFilters = useCallback(() => {
    dispatch(layerSidebarActions.toggleRegFilters())
  }, [dispatch])

  const ampTypes = useMemo(() => getAmpsAsOptions(amps ?? []), [amps])

  const allowResetResults =
    !isEmpty(regulatoryLayersSearchResult) ||
    !isEmpty(ampsSearchResult) ||
    (!isEmpty(vigilanceAreaSearchResult) &&
      filteredVigilanceAreaPeriod !== VigilanceArea.VigilanceAreaFilterPeriod.NEXT_THREE_MONTHS)

  return (
    <SearchContainer>
      <Search>
        <SearchInput
          globalSearchText={globalSearchText}
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
