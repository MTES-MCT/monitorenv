import { RegulatoryThemesFilter } from '@components/RegulatoryThemesFilter'
import { CustomPeriodContainer, CustomPeriodLabel, TagsContainer } from '@components/style'
import { ReinitializeFiltersButton } from '@features/commonComponents/ReinitializeFiltersButton'
import {
  setFilteredRegulatoryThemes,
  setFilteredVigilanceAreaPeriod,
  setVigilanceAreaSpecificPeriodFilter
} from '@features/layersSelector/search/slice'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Checkbox, CheckPicker } from '@mtes-mct/monitor-ui'
import { seaFrontLabels } from 'domain/entities/seaFrontType'
import styled from 'styled-components'

import { FilterTags } from './FiltersTag'
import { SearchFilter } from './SearchFilter'
import { vigilanceAreaFiltersActions } from './slice'
import { PeriodFilter } from '../../PeriodFilter'
import { SpecificPeriodFilter } from '../../SpecificPeriodFilter'

const CREATED_BY_OPTIONS = [
  { label: 'ABC', value: 'ABC' },
  { label: 'DEF', value: 'DEF' },
  { label: 'GHI', value: 'GHI' },
  { label: 'JKL', value: 'JKL' }
]
export function VigilanceAreasFilters() {
  const dispatch = useAppDispatch()

  const filteredVigilanceAreaPeriod = useAppSelector(state => state.layerSearch.filteredVigilanceAreaPeriod)
  const filteredRegulatoryThemes = useAppSelector(state => state.layerSearch.filteredRegulatoryThemes)

  const {
    createdBy: createdByFilter,
    seaFronts: seaFrontFilter,
    searchQuery: searchQueryFilter,
    status: statusFilter
  } = useAppSelector(state => state.vigilanceAreaFilters)

  const seaFrontsAsOptions = Object.values(seaFrontLabels)

  const hasFilters =
    seaFrontFilter.length > 0 ||
    createdByFilter.length > 0 ||
    statusFilter.length !== 2 ||
    !!searchQueryFilter ||
    filteredVigilanceAreaPeriod !== VigilanceArea.VigilanceAreaFilterPeriod.NEXT_THREE_MONTHS ||
    filteredRegulatoryThemes.length > 0

  const updateSeaFrontFilter = selectedSeaFronts => {
    dispatch(vigilanceAreaFiltersActions.setSeaFronts(selectedSeaFronts))
  }

  const updateCreatedByFilter = selectedCreatedBy => {
    dispatch(vigilanceAreaFiltersActions.setCreatedBy(selectedCreatedBy))
  }

  const updateStatusFilter = (checked, status) => {
    const filter = [...statusFilter]

    if (checked) {
      filter.push(status)
    } else {
      filter.splice(filter.indexOf(status), 1)
    }

    dispatch(vigilanceAreaFiltersActions.setStatus(filter))
  }
  const resetFilters = () => {
    dispatch(vigilanceAreaFiltersActions.resetFilters())
    dispatch(setFilteredRegulatoryThemes([]))
    dispatch(setFilteredVigilanceAreaPeriod(VigilanceArea.VigilanceAreaFilterPeriod.NEXT_THREE_MONTHS))
    dispatch(setVigilanceAreaSpecificPeriodFilter(undefined))
  }

  const hasCustomPeriodFilter = filteredVigilanceAreaPeriod === VigilanceArea.VigilanceAreaFilterPeriod.SPECIFIC_PERIOD

  return (
    <Wrapper>
      <SearchFilter />

      <FilterContainer>
        <PeriodFilter style={{ width: 320 }} />
        <RegulatoryThemesFilter style={{ width: 320 }} />

        <CheckPicker
          isLabelHidden
          isTransparent
          label="Zone créée par..."
          name="createdBy"
          onChange={updateCreatedByFilter}
          options={CREATED_BY_OPTIONS}
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
      </FilterContainer>
      {(hasCustomPeriodFilter || hasFilters) && (
        <TagsContainer $withTopMargin={false}>
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

const FilterContainer = styled.div`
  align-items: center;
  display: flex;
  gap: 16px;
`
const OptionValue = styled.span`
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
