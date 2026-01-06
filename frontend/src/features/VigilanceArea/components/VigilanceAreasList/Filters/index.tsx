import { useGetTrigramsQuery } from '@api/vigilanceAreasAPI'
import { RegulatoryTagsFilter } from '@components/RegulatoryTagsFilter'
import { RegulatoryThemesFilter } from '@components/RegulatoryThemesFilter'
import { CustomPeriodContainer, CustomPeriodLabel, TagsContainer } from '@components/style'
import { ReinitializeFiltersButton } from '@features/commonComponents/ReinitializeFiltersButton'
import {
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

  const filteredRegulatoryTags = useAppSelector(state => state.layerSearch.filteredRegulatoryTags)
  const filteredRegulatoryThemes = useAppSelector(state => state.layerSearch.filteredRegulatoryThemes)
  const searchExtent = useAppSelector(state => state.layerSearch.searchExtent)
  const searchText = useAppSelector(state => state.layerSearch.globalSearchText)

  const {
    createdBy: createdByFilter,
    nbOfFiltersSetted: nbOfVigilanceAreaFilters,
    period: periodFilter,
    seaFronts: seaFrontFilter,
    status: statusFilter,
    visibility: visibilityFilter
  } = useAppSelector(state => state.vigilanceAreaFilters)

  const seaFrontsAsOptions = Object.values(SeaFrontLabels)
  const visibilityOptions = getOptionsFromLabelledEnum(VigilanceArea.VisibilityLabel)

  const updateSeaFrontFilter = (selectedSeaFronts: string[] | undefined) => {
    dispatch(vigilanceAreaFiltersActions.updateFilters({ key: 'seaFronts', value: selectedSeaFronts ?? [] }))
  }

  const updateCreatedByFilter = (selectedCreatedBy: string[] | undefined) => {
    dispatch(vigilanceAreaFiltersActions.updateFilters({ key: 'createdBy', value: selectedCreatedBy ?? [] }))
  }

  const updateStatusFilter = (checked: boolean | undefined, status: VigilanceArea.Status) => {
    const filter = [...statusFilter]

    if (checked) {
      filter.push(status)
    } else {
      filter.splice(filter.indexOf(status), 1)
    }

    dispatch(vigilanceAreaFiltersActions.updateFilters({ key: 'status', value: filter }))
  }

  const resetFilters = () => {
    dispatch(vigilanceAreaFiltersActions.resetFilters())
    dispatch(setFilteredRegulatoryTags([]))
    dispatch(setFilteredRegulatoryThemes([]))
    dispatch(setIsVigilanceAreaSearchResultsVisible(false))
    dispatch(setGlobalSearchText(''))

    if (searchExtent) {
      dispatch(setSearchExtent(undefined))
      dispatch(setIsAmpSearchResultsVisible(false))
      dispatch(setIsRegulatorySearchResultsVisible(false))
      dispatch(setShouldFilterSearchOnMapExtent(false))
    }
  }

  const updateVisibilityFilter = (visibilityOption: Option, isChecked: boolean | undefined) => {
    const currentVisibilityFilter = visibilityFilter
    let newVisibilityFilter: VigilanceArea.Visibility[]
    const optionValue = visibilityOption.value as VigilanceArea.Visibility

    if (isChecked) {
      newVisibilityFilter = [...currentVisibilityFilter, optionValue]
    } else {
      newVisibilityFilter = currentVisibilityFilter.filter(visibility => visibility !== optionValue)
    }

    dispatch(vigilanceAreaFiltersActions.updateFilters({ key: 'visibility', value: newVisibilityFilter }))
  }

  const nbOfFilters = nbOfVigilanceAreaFilters + filteredRegulatoryTags.length + filteredRegulatoryThemes.length

  const hasCustomPeriodFilter = periodFilter === VigilanceArea.VigilanceAreaFilterPeriod.SPECIFIC_PERIOD

  const hasFilters = nbOfFilters > 0 || hasCustomPeriodFilter || searchExtent || !!searchText

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
        <VigilanceAreaTypeFilter style={{ width: 320 }} />
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
      {hasFilters && (
        <TagsContainer>
          {hasCustomPeriodFilter && (
            <CustomPeriodContainer>
              <CustomPeriodLabel>Période spécifique</CustomPeriodLabel>
              <SpecificPeriodFilter />
            </CustomPeriodContainer>
          )}

          <FilterTags />

          <ReinitializeFiltersButton onClick={resetFilters} />
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
