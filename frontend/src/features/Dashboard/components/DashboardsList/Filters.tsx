import { RTK_DEFAULT_QUERY_OPTIONS } from '@api/constants'
import { useGetControlUnitsQuery } from '@api/controlUnitsAPI'
import { useGetTagsQuery } from '@api/tagsAPI'
import { TagsContainer } from '@components/style'
import { ReinitializeFiltersButton } from '@features/commonComponents/ReinitializeFiltersButton'
import { StyledSelect } from '@features/Reportings/Filters/style'
import { getTagsAsOptions } from '@features/Tags/useCases/getTagsAsOptions'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import {
  CheckPicker,
  CustomSearch,
  DateRangePicker,
  getOptionsFromIdAndName,
  SingleTag,
  type DateAsStringRange,
  type OptionValueType
} from '@mtes-mct/monitor-ui'
import { isNotArchived } from '@utils/isNotArchived'
import { DateRangeEnum, dateRangeOptions } from 'domain/entities/dateRange'
import { getTitle } from 'domain/entities/layers/utils'
import { SeaFrontLabels } from 'domain/entities/seaFrontType'
import { isArray, isEqual } from 'lodash'
import { useMemo } from 'react'
import styled from 'styled-components'

import { dashboardFiltersActions, INITIAL_LIST_FILTERS_STATE, type DashboardsListFilters } from '../DashboardForm/slice'

type Orientation = 'row' | 'column'
export function Filters({ orientation = 'row' }: { orientation?: Orientation }) {
  const dispatch = useAppDispatch()
  const { controlUnits, regulatoryTags, seaFronts, specificPeriod, updatedAt } = useAppSelector(
    state => state.dashboardFilters.filters
  )
  const seaFrontsAsOptions = Object.values(SeaFrontLabels)

  const { data: allControlUnits } = useGetControlUnitsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)
  const activeControlUnitsOptions = useMemo(
    () => getOptionsFromIdAndName(allControlUnits?.filter(isNotArchived)),
    [allControlUnits]
  )
  const updateSeaFrontFilter = (nextValue: string[] | undefined) => {
    dispatch(dashboardFiltersActions.setListFilters({ seaFronts: nextValue ?? [] }))
  }
  const resetFilter = () => {
    dispatch(dashboardFiltersActions.resetFilters())
  }
  const updateControlUnitFilter = (nextValue: number[] | undefined) => {
    dispatch(dashboardFiltersActions.setListFilters({ controlUnits: nextValue ?? [] }))
  }
  const updateRegulatoryTagsFilter = (nextValue: string[] | undefined) => {
    dispatch(dashboardFiltersActions.setListFilters({ regulatoryTags: nextValue ?? [] }))
  }
  const updateUpdatedAtFilter = (nextValue: OptionValueType | undefined) => {
    const value = nextValue as DateRangeEnum
    dispatch(dashboardFiltersActions.setListFilters({ updatedAt: value }))
  }
  const updateUpdateAtSpecificPeriodFilter = (nextValue: DateAsStringRange | undefined) => {
    dispatch(dashboardFiltersActions.setListFilters({ specificPeriod: nextValue }))
  }
  const controlUnitCustomSearch = useMemo(
    () => new CustomSearch(activeControlUnitsOptions ?? [], ['label'], { isStrict: true, threshold: 0.2 }),
    [activeControlUnitsOptions]
  )

  const { data: tags } = useGetTagsQuery()

  const regulatoryTagsAsOptions = getTagsAsOptions(Object.values(tags ?? []))

  const regulatoryTagsCustomSearch = useMemo(
    () => new CustomSearch(regulatoryTagsAsOptions, ['label']),
    [regulatoryTagsAsOptions]
  )

  const onDeleteTag = (
    valueToDelete: string | number,
    filterKey: keyof DashboardsListFilters,
    filter: (string | number)[] | string
  ) => {
    let updatedFilter: (string | number)[] | string | undefined = filter

    if (isArray(filter)) {
      updatedFilter = filter.filter(unit => unit !== valueToDelete)
    }
    dispatch(
      dashboardFiltersActions.updateFilters({
        key: filterKey,
        value: updatedFilter
      })
    )
  }

  const hasFilters = !isEqual(INITIAL_LIST_FILTERS_STATE, {
    controlUnits,
    regulatoryTags,
    seaFronts,
    specificPeriod,
    updatedAt
  })

  const seaFrontTags = (
    <>
      {seaFronts?.map(seaFront => (
        <SingleTag key={seaFront} onDelete={() => onDeleteTag(seaFront, 'seaFronts', seaFronts)}>
          {String(`Façade ${seaFront}`)}
        </SingleTag>
      ))}
    </>
  )

  const controlUnitTags = (
    <>
      {controlUnits?.map(controlUnit => (
        <SingleTag key={controlUnit} onDelete={() => onDeleteTag(controlUnit, 'controlUnits', controlUnits)}>
          {String(`Unité ${allControlUnits?.find(control => control.id === controlUnit)?.name}`)}
        </SingleTag>
      ))}
    </>
  )

  const regulatoryTagsTags = (
    <>
      {regulatoryTags?.map(tag => (
        <SingleTag key={tag} onDelete={() => onDeleteTag(tag, 'regulatoryTags', regulatoryTags)}>
          {String(`${orientation === 'row' ? 'Thématique ' : ''}${getTitle(tag)}`)}
        </SingleTag>
      ))}
    </>
  )

  const specificPeriodDatePicker = (
    <>
      {updatedAt === DateRangeEnum.CUSTOM && (
        <DateRangePicker
          key="dashboard-specificPeriod-filter"
          defaultValue={specificPeriod}
          isLabelHidden={orientation === 'column'}
          isStringDate
          label="Période spécifique de la date de mise à jour"
          name="updatedAtDateRange"
          onChange={updateUpdateAtSpecificPeriodFilter}
        />
      )}
    </>
  )

  return (
    <Wrapper $orientation={orientation}>
      <FiltersContainer $orientation={orientation}>
        <FilterWrapper $orientation={orientation}>
          <CheckPicker
            isLabelHidden
            isTransparent
            label="Façade"
            name="seaFront"
            onChange={updateSeaFrontFilter}
            options={seaFrontsAsOptions ?? []}
            placeholder="Façade"
            renderValue={() => seaFronts && <OptionValue>{`Façade (${seaFronts.length})`}</OptionValue>}
            style={{ width: 181 }}
            value={seaFronts}
          />
          {orientation === 'column' && seaFrontTags}
        </FilterWrapper>
        <FilterWrapper $orientation={orientation}>
          <StyledSelect
            isCleanable={false}
            isLabelHidden
            isTransparent
            label="Période de mise à jour"
            name="updatedAt"
            onChange={updateUpdatedAtFilter}
            options={dateRangeOptions}
            placeholder="Période de mise à jour"
            style={{ width: 180 }}
            value={updatedAt}
          />
          {orientation === 'column' && specificPeriodDatePicker}
        </FilterWrapper>
        <FilterWrapper $orientation={orientation}>
          <CheckPicker
            key={activeControlUnitsOptions?.length}
            customSearch={controlUnitCustomSearch}
            data-cy="select-units-filter"
            isLabelHidden
            isTransparent
            label="Unité"
            name="controlUnit"
            onChange={updateControlUnitFilter}
            options={activeControlUnitsOptions ?? []}
            placeholder="Unité"
            popupWidth={300}
            renderValue={() => controlUnits && <OptionValue>{`Unité (${controlUnits.length})`}</OptionValue>}
            style={{ width: 200 }}
            value={controlUnits}
          />
          {orientation === 'column' && controlUnitTags}
        </FilterWrapper>
        <FilterWrapper $orientation={orientation}>
          <CheckPicker
            key={regulatoryTagsAsOptions.length}
            customSearch={regulatoryTagsCustomSearch}
            isLabelHidden
            isTransparent
            label="Thématique réglementaire"
            name="regulatoryTags"
            onChange={updateRegulatoryTagsFilter}
            options={regulatoryTagsAsOptions}
            placeholder="Thématique réglementaire"
            renderValue={() =>
              regulatoryTags && <OptionValue>{`Thématique réglementaire (${regulatoryTags.length})`}</OptionValue>
            }
            style={{ width: 320 }}
            value={regulatoryTags}
          />
          {orientation === 'column' && regulatoryTagsTags}
        </FilterWrapper>
      </FiltersContainer>
      <TagsContainer>
        {orientation === 'row' && [specificPeriodDatePicker, seaFrontTags, controlUnitTags, regulatoryTagsTags]}

        {orientation === 'row' && hasFilters && <ReinitializeFiltersButton onClick={resetFilter} />}
      </TagsContainer>
    </Wrapper>
  )
}

const Wrapper = styled.div<{ $orientation: Orientation }>`
  display: flex;
  flex-direction: column;
  gap: 16px;
  ${p => p.$orientation === 'column' && 'padding: 12px 4px;'}
`

const FiltersContainer = styled.div<{ $orientation: Orientation }>`
  align-items: center;
  display: flex;
  flex-wrap: wrap;

  ${p => p.$orientation === 'row' && 'gap: 16px;'}
`

const FilterWrapper = styled.div<{ $orientation: Orientation }>`
  ${p =>
    p.$orientation === 'column' &&
    `
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 8px;
  width: 100%;

  > * {
    width: 100% !important;
  }
    `}
`
const OptionValue = styled.span`
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
