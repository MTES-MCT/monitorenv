import { useGetTrigramsQuery } from '@api/vigilanceAreasAPI'
import { RegulatoryTagsFilter } from '@components/RegulatoryTagsFilter'
import { RegulatoryThemesFilter } from '@components/RegulatoryThemesFilter'
import { TagsContainer } from '@components/style'
import { ShowFilters } from '@components/Table/style'
import {
  setAreRecentsAreasChecked,
  setFilteredRegulatoryTags,
  setFilteredRegulatoryThemes,
  setGlobalSearchText,
  setIsAmpSearchResultsVisible,
  setIsRegulatorySearchResultsVisible,
  setIsVigilanceAreaSearchResultsVisible,
  setSearchExtent,
  setShouldFilterSearchOnMapExtent
} from '@features/layersSelector/search/slice'
import { VigilanceAreaTypeFilter } from '@features/VigilanceArea/components/VigilanceAreaTypeFilter'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { CheckPicker, getOptionsFromLabelledEnum, Icon, Select } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { FilterTags } from './FiltersTag'
import { SearchFilter } from './SearchFilter'
import { vigilanceAreaFiltersActions } from './slice'
import { useGetSeaFrontsQuery } from '../../../../../api/seaFrontsAPI'
import { ResetButton } from '../../../../commonComponents/ResetButton'
import { PeriodFilter } from '../../PeriodFilter'

import type { TagOption } from 'domain/entities/tags'
import type { ThemeOption } from 'domain/entities/themes'

export function VigilanceAreasFilters() {
  const dispatch = useAppDispatch()

  const { data: trigrams } = useGetTrigramsQuery()
  const trigramsAsOptions = trigrams?.map(trigram => ({ label: trigram, value: trigram })) ?? []

  const filteredRegulatoryTags = useAppSelector(state => state.layerSearch.filteredRegulatoryTags)
  const filteredRegulatoryThemes = useAppSelector(state => state.layerSearch.filteredRegulatoryThemes)
  const searchExtent = useAppSelector(state => state.layerSearch.searchExtent)
  const searchText = useAppSelector(state => state.layerSearch.globalSearchText)
  const areRecentsAreasChecked = useAppSelector(state => state.layerSearch.areRecentsAreasChecked)

  const {
    areFiltersVisible,
    createdBy: createdByFilter,
    nbOfFiltersSetted: nbOfVigilanceAreaFilters,
    seaFronts: seaFrontFilter,
    status: statusFilter,
    visibility: visibilityFilter
  } = useAppSelector(state => state.vigilanceAreaFilters)

  const { data } = useGetSeaFrontsQuery()
  const seaFrontsAsOptions = data
    ?.map(facade => ({ label: facade, value: facade }))
    .sort((a, b) => a.label.localeCompare(b.label))
  const visibilityOptions = getOptionsFromLabelledEnum(VigilanceArea.VisibilityLabel)
  const statusOptions = getOptionsFromLabelledEnum(VigilanceArea.StatusLabel)

  const updateSeaFrontFilter = (selectedSeaFronts: string[] | undefined) => {
    dispatch(vigilanceAreaFiltersActions.updateFilters({ key: 'seaFronts', value: selectedSeaFronts ?? [] }))
  }

  const updateCreatedByFilter = (selectedCreatedBy: string[] | undefined) => {
    dispatch(vigilanceAreaFiltersActions.updateFilters({ key: 'createdBy', value: selectedCreatedBy ?? [] }))
  }

  const updateStatusFilter = (status: 'DRAFT' | 'PUBLISHED' | undefined) => {
    dispatch(vigilanceAreaFiltersActions.updateFilters({ key: 'status', value: status }))
  }

  const resetFilters = () => {
    dispatch(vigilanceAreaFiltersActions.resetFilters())
    dispatch(setFilteredRegulatoryTags([]))
    dispatch(setFilteredRegulatoryThemes([]))
    dispatch(setIsVigilanceAreaSearchResultsVisible(false))
    dispatch(setGlobalSearchText(''))
    dispatch(setAreRecentsAreasChecked(false))

    if (searchExtent) {
      dispatch(setSearchExtent(undefined))
      dispatch(setIsAmpSearchResultsVisible(false))
      dispatch(setIsRegulatorySearchResultsVisible(false))
      dispatch(setShouldFilterSearchOnMapExtent(false))
    }
  }

  const updateVisibilityFilter = (visibility: 'PUBLIC' | 'PRIVATE' | undefined) => {
    dispatch(vigilanceAreaFiltersActions.updateFilters({ key: 'visibility', value: visibility }))
  }

  const handleSetFilteredRegulatoryThemes = (nextThemes: ThemeOption[] | undefined = []) => {
    dispatch(setFilteredRegulatoryThemes(nextThemes))
  }

  const handleSetFilteredRegulatoryTags = (nextTags: TagOption[] | undefined = []) => {
    dispatch(setFilteredRegulatoryTags(nextTags))
  }

  const setFiltersVisibility = () => {
    dispatch(vigilanceAreaFiltersActions.setFiltersVisibility(!areFiltersVisible))
  }

  const nbOfFilters = nbOfVigilanceAreaFilters + filteredRegulatoryTags.length + filteredRegulatoryThemes.length

  const hasFilters = nbOfFilters > 0 || searchExtent || !!searchText || areRecentsAreasChecked

  return (
    <Wrapper>
      <FiltersFirstLine>
        <SearchFilter />
        <ShowFilters Icon={Icon.FilterBis} onClick={setFiltersVisibility}>
          {areFiltersVisible ? 'Masquer les filtres' : 'Afficher les filtres'}
        </ShowFilters>
      </FiltersFirstLine>

      {areFiltersVisible && (
        <FilterContainer>
          <PeriodFilter style={{ width: 220 }} />
          <VigilanceAreaTypeFilter menuStyle={{ width: '300px' }} style={{ width: 245 }} />
          <RegulatoryThemesFilter
            onChange={handleSetFilteredRegulatoryThemes}
            popupStyle={{ width: 400 }}
            style={{ width: 265 }}
            value={filteredRegulatoryThemes}
          />
          <RegulatoryTagsFilter
            onChange={handleSetFilteredRegulatoryTags}
            popupStyle={{ width: 400 }}
            style={{ width: 265 }}
            value={filteredRegulatoryTags}
          />

          <CheckPicker
            isLabelHidden
            isTransparent
            label="Zone créée par..."
            name="createdBy"
            onChange={updateCreatedByFilter}
            options={trigramsAsOptions}
            placeholder="Zone créée par..."
            renderValue={() => createdByFilter && <OptionValue>{`Créée par (${createdByFilter.length})`}</OptionValue>}
            searchable
            style={{ width: 170 }}
            value={createdByFilter}
          />
          <CheckPicker
            isLabelHidden
            isTransparent
            label="Façade"
            name="seaFront"
            onChange={updateSeaFrontFilter}
            options={seaFrontsAsOptions ?? []}
            placeholder="Façade"
            renderValue={() => seaFrontFilter && <OptionValue>{`Façade (${seaFrontFilter.length})`}</OptionValue>}
            style={{ width: 165 }}
            value={seaFrontFilter}
          />
          <Select
            isCleanable
            isLabelHidden
            isTransparent
            label="Statut"
            name="status"
            onChange={updateStatusFilter}
            options={statusOptions}
            placeholder="Statut"
            style={{ width: 165 }}
            value={statusFilter}
          />
          <Select
            isCleanable
            isLabelHidden
            isTransparent
            label="Visibilité"
            name="visibility"
            onChange={updateVisibilityFilter}
            options={visibilityOptions}
            placeholder="Visibilité"
            style={{ width: 165 }}
            value={visibilityFilter}
          />
        </FilterContainer>
      )}
      {hasFilters && (
        <TagsContainer>
          <FilterTags />

          <ResetButton onClick={resetFilters} />
        </TagsContainer>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`
const FiltersFirstLine = styled.div`
  align-items: center;
  display: flex;
  gap: 16px;
`

const FilterContainer = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`
const OptionValue = styled.span`
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
