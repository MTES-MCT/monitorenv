import { useGetTrigramsQuery } from '@api/vigilanceAreasAPI'
import { RegulatoryTagsFilter } from '@components/RegulatoryTagsFilter'
import { RegulatoryThemesFilter } from '@components/RegulatoryThemesFilter'
import { CustomPeriodContainer, CustomPeriodLabel, TagsContainer } from '@components/style'
import { ReinitializeFiltersButton } from '@features/commonComponents/ReinitializeFiltersButton'
import { useSearchLayers } from '@features/layersSelector/search/hooks/useSearchLayers'
import {
  setFilteredRegulatoryTags,
  setFilteredRegulatoryThemes,
  setFilteredVigilanceAreaPeriod,
  setIsRegulatorySearchResultsVisible,
  setIsVigilanceAreaSearchResultsVisible,
  setVigilanceAreaSpecificPeriodFilter
} from '@features/layersSelector/search/slice'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Checkbox, CheckPicker, getOptionsFromLabelledEnum, type Option } from '@mtes-mct/monitor-ui'
import { SeaFrontLabels } from 'domain/entities/seaFrontType'
import styled from 'styled-components'

import { FilterTags } from './FiltersTag'
import { SearchFilter } from './SearchFilter'
import { vigilanceAreaFiltersActions } from './slice'
import { PeriodFilter } from '../../PeriodFilter'
import { SpecificPeriodFilter } from '../../SpecificPeriodFilter'

export function VigilanceAreasFilters() {
  const dispatch = useAppDispatch()

  const { data: trigrams } = useGetTrigramsQuery()
  const trigramsAsOptions = trigrams?.map(trigram => ({ label: trigram, value: trigram })) ?? []

  const filteredVigilanceAreaPeriod = useAppSelector(state => state.layerSearch.filteredVigilanceAreaPeriod)
  const filteredRegulatoryTags = useAppSelector(state => state.layerSearch.filteredRegulatoryTags)
  const filteredRegulatoryThemes = useAppSelector(state => state.layerSearch.filteredRegulatoryThemes)
  const searchExtent = useAppSelector(state => state.layerSearch.searchExtent)
  const globalSearchText = useAppSelector(state => state.layerSearch.globalSearchText)
  const shouldFilterSearchOnMapExtent = useAppSelector(state => state.layerSearch.shouldFilterSearchOnMapExtent)
  const filteredAmpTypes = useAppSelector(state => state.layerSearch.filteredAmpTypes)

  const {
    createdBy: createdByFilter,
    seaFronts: seaFrontFilter,
    searchQuery: searchQueryFilter,
    status: statusFilter,
    visibility: visibilityFilter
  } = useAppSelector(state => state.vigilanceAreaFilters)

  const seaFrontsAsOptions = Object.values(SeaFrontLabels)
  const visibilityOptions = getOptionsFromLabelledEnum(VigilanceArea.VisibilityLabel)

  const hasFilters =
    seaFrontFilter?.length > 0 ||
    createdByFilter?.length > 0 ||
    statusFilter.length !== 2 ||
    !!searchQueryFilter ||
    filteredVigilanceAreaPeriod !== VigilanceArea.VigilanceAreaFilterPeriod.NEXT_THREE_MONTHS ||
    filteredRegulatoryTags.length > 0 ||
    filteredRegulatoryThemes.length > 0

  const updateSeaFrontFilter = (selectedSeaFronts: string[] | undefined) => {
    dispatch(vigilanceAreaFiltersActions.setSeaFronts(selectedSeaFronts ?? []))
  }

  const updateCreatedByFilter = (selectedCreatedBy: string[] | undefined) => {
    dispatch(vigilanceAreaFiltersActions.setCreatedBy(selectedCreatedBy ?? []))
  }

  const updateStatusFilter = (checked: boolean | undefined, status: VigilanceArea.Status) => {
    const filter = [...statusFilter]

    if (checked) {
      filter.push(status)
    } else {
      filter.splice(filter.indexOf(status), 1)
    }

    dispatch(vigilanceAreaFiltersActions.setStatus(filter))
  }
  const debouncedSearchLayers = useSearchLayers()

  const resetFilters = () => {
    dispatch(vigilanceAreaFiltersActions.resetFilters())

    dispatch(setFilteredRegulatoryTags([]))
    dispatch(setFilteredRegulatoryThemes([]))
    dispatch(setIsRegulatorySearchResultsVisible(false))
    dispatch(setFilteredVigilanceAreaPeriod(VigilanceArea.VigilanceAreaFilterPeriod.NEXT_THREE_MONTHS))
    dispatch(setIsVigilanceAreaSearchResultsVisible(false))
    dispatch(setVigilanceAreaSpecificPeriodFilter(undefined))

    debouncedSearchLayers({
      ampTypes: filteredAmpTypes,
      extent: searchExtent,
      regulatoryTags: [],
      regulatoryThemes: [],
      searchedText: globalSearchText,
      shouldSearchByExtent: shouldFilterSearchOnMapExtent,
      vigilanceAreaPeriodFilter: VigilanceArea.VigilanceAreaFilterPeriod.NEXT_THREE_MONTHS,
      vigilanceAreaSpecificPeriodFilter: undefined
    })
  }

  const updateVisibilityFilter = (visibilityOption: Option<string>, isChecked: boolean | undefined) => {
    const currentVisibilityFilter = visibilityFilter
    let newVisibilityFilter: VigilanceArea.Visibility[] = []
    if (isChecked) {
      newVisibilityFilter = [...currentVisibilityFilter, visibilityOption.value as VigilanceArea.Visibility]
    } else {
      newVisibilityFilter = currentVisibilityFilter.filter(
        visibility => visibility !== (visibilityOption.value as VigilanceArea.Visibility)
      )
    }

    dispatch(vigilanceAreaFiltersActions.setVisibility(newVisibilityFilter))
  }

  const hasCustomPeriodFilter = filteredVigilanceAreaPeriod === VigilanceArea.VigilanceAreaFilterPeriod.SPECIFIC_PERIOD

  return (
    <Wrapper>
      <FiltersFirstLine>
        <SearchFilter />
        <StyledStatusFilter>
          {visibilityOptions.map(visibility => (
            <Checkbox
              key={visibility.label}
              checked={visibilityFilter?.includes(visibility.value as VigilanceArea.Visibility)}
              label={visibility.label}
              name={visibility.label}
              onChange={isChecked => updateVisibilityFilter(visibility, isChecked)}
            />
          ))}
          <Separator />
          <>
            <Checkbox
              key={VigilanceArea.StatusLabel.PUBLISHED}
              checked={statusFilter.includes(VigilanceArea.Status.PUBLISHED)}
              label={VigilanceArea.StatusLabel.PUBLISHED}
              name={VigilanceArea.StatusLabel.PUBLISHED}
              onChange={checked => updateStatusFilter(checked, VigilanceArea.Status.PUBLISHED)}
            />
            <Checkbox
              key={VigilanceArea.StatusLabel.DRAFT}
              checked={statusFilter.includes(VigilanceArea.Status.DRAFT)}
              label={VigilanceArea.StatusLabel.DRAFT}
              name={VigilanceArea.StatusLabel.DRAFT}
              onChange={checked => updateStatusFilter(checked, VigilanceArea.Status.DRAFT)}
            />
          </>
        </StyledStatusFilter>
      </FiltersFirstLine>

      <FilterContainer>
        <PeriodFilter style={{ width: 320 }} />
        <RegulatoryThemesFilter style={{ width: 320 }} />
        <RegulatoryTagsFilter style={{ width: 320 }} />

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
          style={{ width: 181 }}
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
          style={{ width: 181 }}
          value={seaFrontFilter}
        />
      </FilterContainer>
      {(hasCustomPeriodFilter || hasFilters) && (
        <TagsContainer>
          {hasCustomPeriodFilter && (
            <CustomPeriodContainer>
              <CustomPeriodLabel>Période spécifique</CustomPeriodLabel>
              <SpecificPeriodFilter />
            </CustomPeriodContainer>
          )}

          <FilterTags />

          {(hasFilters || hasCustomPeriodFilter) && <ReinitializeFiltersButton onClick={resetFilters} />}
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
  display: flex;
  justify-content: space-between;
`
export const StyledStatusFilter = styled.div`
  align-items: end;
  display: flex;
  flex-wrap: wrap;
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
export const Separator = styled.div`
  border-right: ${p => `1px solid ${p.theme.color.slateGray}`};
  height: 50%;
  width: 2px;
`
