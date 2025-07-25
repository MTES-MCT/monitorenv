import { RTK_DEFAULT_QUERY_OPTIONS } from '@api/constants'
import { useGetControlUnitsQuery } from '@api/controlUnitsAPI'
import { useGetTagsQuery } from '@api/tagsAPI'
import { TagsContainer } from '@components/style'
import { ReinitializeFiltersButton } from '@features/commonComponents/ReinitializeFiltersButton'
import { StyledSelect } from '@features/Reportings/Filters/style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import {
  CheckPicker,
  CustomSearch,
  type DateAsStringRange,
  DateRangePicker,
  getOptionsFromIdAndName,
  type OptionValueType,
  SingleTag
} from '@mtes-mct/monitor-ui'
import { getTagsAsOptionsLegacy } from '@utils/getTagsAsOptions'
import { isNotArchived } from '@utils/isNotArchived'
import { DateRangeEnum, dateRangeOptions } from 'domain/entities/dateRange'
import { getTitle } from 'domain/entities/layers/utils'
import { SeaFrontLabels } from 'domain/entities/seaFrontType'
import { isArray, isEqual } from 'lodash'
import { Fragment, useMemo } from 'react'
import styled from 'styled-components'

import { dashboardFiltersActions, type DashboardsListFilters, INITIAL_LIST_FILTERS_STATE } from '../DashboardForm/slice'

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

  const regulatoryTagsAsOptions = getTagsAsOptionsLegacy(Object.values(tags ?? []))

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
    <Fragment key={`dashboard-seaFronts-${orientation === 'row' ? 'row' : 'column'}`}>
      {seaFronts?.map(seaFront => (
        <SingleTag key={seaFront} onDelete={() => onDeleteTag(seaFront, 'seaFronts', seaFronts)}>
          {String(`${orientation === 'row' ? 'Façade ' : ''} ${seaFront}`)}
        </SingleTag>
      ))}
    </Fragment>
  )

  const controlUnitTags = (
    <Fragment key={`dashboard-controlUnitTags-${orientation === 'row' ? 'row' : 'column'}`}>
      {controlUnits?.map(controlUnit => (
        <SingleTag key={controlUnit} onDelete={() => onDeleteTag(controlUnit, 'controlUnits', controlUnits)}>
          {String(
            `${orientation === 'row' ? 'Unité ' : ''} ${
              allControlUnits?.find(control => control.id === controlUnit)?.name
            }`
          )}
        </SingleTag>
      ))}
    </Fragment>
  )

  const regulatoryTagsTags = (
    <Fragment key={`dashboard-regulatoryTags-${orientation === 'row' ? 'row' : 'column'}`}>
      {regulatoryTags?.map(tag => (
        <SingleTag key={tag} onDelete={() => onDeleteTag(tag, 'regulatoryTags', regulatoryTags)}>
          {String(`${orientation === 'row' ? 'Thématique ' : ''}${getTitle(tag)}`)}
        </SingleTag>
      ))}
    </Fragment>
  )

  const specificPeriodDatePicker = (
    <Fragment key={`dashboard-specificPeriod-${orientation === 'row' ? 'row' : 'column'}`}>
      {updatedAt === DateRangeEnum.CUSTOM && (
        <DateRangePicker
          defaultValue={specificPeriod}
          isLabelHidden={orientation === 'column'}
          isStringDate
          label="Période spécifique de la date de mise à jour"
          name="updatedAtDateRange"
          onChange={updateUpdateAtSpecificPeriodFilter}
        />
      )}
    </Fragment>
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
            label="Tags"
            name="regulatoryTags"
            onChange={updateRegulatoryTagsFilter}
            options={regulatoryTagsAsOptions}
            placeholder="Tag"
            renderValue={() => regulatoryTags && <OptionValue>{`Tag (${regulatoryTags.length})`}</OptionValue>}
            style={{ width: 320 }}
            value={regulatoryTags}
          />
          {orientation === 'column' && regulatoryTagsTags}
        </FilterWrapper>
      </FiltersContainer>
      {orientation === 'row' && (
        <TagsContainer>
          {[specificPeriodDatePicker, seaFrontTags, controlUnitTags, regulatoryTagsTags]}

          {hasFilters && <ReinitializeFiltersButton onClick={resetFilter} />}
        </TagsContainer>
      )}
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
