import { useGetAdministrationsQuery } from '@api/administrationsAPI'
import { RTK_DEFAULT_QUERY_OPTIONS } from '@api/constants'
import { useGetControlUnitsQuery } from '@api/controlUnitsAPI'
import { useGetSeaFrontsQuery } from '@api/seaFrontsAPI'
import { useGetTagsQuery } from '@api/tagsAPI'
import { useGetThemesQuery } from '@api/themesAPI'
import { Italic, TagsContainer } from '@components/style'
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
  pluralize,
  SingleTag
} from '@mtes-mct/monitor-ui'
import { getTagsAsOptionsLegacy } from '@utils/getTagsAsOptions'
import { getThemesAsOptionsCheckPicker } from '@utils/getThemesAsOptions'
import { isNotArchived } from '@utils/isNotArchived'
import { DateRangeEnum, dateRangeOptions } from 'domain/entities/dateRange'
import { isArray } from 'lodash'
import { Fragment, useMemo } from 'react'
import styled from 'styled-components'

import { ResetButton } from '../../../commonComponents/ResetButton'
import { dashboardFiltersActions, type DashboardsListFilters } from '../DashboardForm/slice'

type Orientation = 'row' | 'column'

export function Filters({ orientation = 'row' }: { orientation?: Orientation }) {
  const dispatch = useAppDispatch()
  const { administrations, controlUnits, seaFronts, specificPeriod, tags, themes, updatedAt } = useAppSelector(
    state => state.dashboardFilters.filters
  )
  const nbOfFiltersSetted = useAppSelector(state => state.dashboardFilters.nbOfFiltersSetted)

  const { data } = useGetSeaFrontsQuery()
  const seaFrontsAsOptions = data
    ?.map(facade => ({ label: facade, value: facade }))
    .sort((a, b) => a.label.localeCompare(b.label))
  const { data: allAdmins } = useGetAdministrationsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)

  const administrationsOptions = useMemo(
    () =>
      (allAdmins ?? []).filter(isNotArchived).map(admin => ({
        label: admin.name,
        value: admin.id
      })),
    [allAdmins]
  )
  const { data: allControlUnits } = useGetControlUnitsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)
  const activeControlUnitsOptions = useMemo(
    () => getOptionsFromIdAndName(allControlUnits?.filter(isNotArchived)),
    [allControlUnits]
  )
  const updateSeaFrontFilter = (nextValue: string[] | undefined) => {
    dispatch(dashboardFiltersActions.updateListFilters({ key: 'seaFronts', value: nextValue ?? [] }))
  }
  const resetFilter = () => {
    dispatch(dashboardFiltersActions.resetListFilters())
  }
  const updateControlUnitFilter = (nextValue: number[] | undefined) => {
    dispatch(dashboardFiltersActions.updateListFilters({ key: 'controlUnits', value: nextValue ?? [] }))
  }
  const updateAdminFilter = (nextValue: number[] | undefined) => {
    dispatch(dashboardFiltersActions.updateListFilters({ key: 'administrations', value: nextValue ?? [] }))
  }
  const updateTagsFilter = (nextValue: number[] | undefined) => {
    dispatch(dashboardFiltersActions.updateListFilters({ key: 'tags', value: nextValue ?? [] }))
  }
  const updateThemesFilter = (nextValue: number[] | undefined) => {
    dispatch(dashboardFiltersActions.updateListFilters({ key: 'themes', value: nextValue ?? [] }))
  }
  const updateUpdatedAtFilter = (nextValue: OptionValueType | undefined) => {
    const value = nextValue as DateRangeEnum
    dispatch(dashboardFiltersActions.updateListFilters({ key: 'updatedAt', value }))
  }
  const updateUpdateAtSpecificPeriodFilter = (nextValue: DateAsStringRange | undefined) => {
    dispatch(dashboardFiltersActions.updateListFilters({ key: 'specificPeriod', value: nextValue ?? [] }))
  }
  const controlUnitCustomSearch = useMemo(
    () => new CustomSearch(activeControlUnitsOptions ?? [], ['label'], { isStrict: true, threshold: 0.2 }),
    [activeControlUnitsOptions]
  )

  const { data: allTags } = useGetTagsQuery()

  const tagsAsOptions = getTagsAsOptionsLegacy(Object.values(allTags ?? []))

  const tagsCustomSearch = useMemo(() => new CustomSearch(tagsAsOptions, ['label']), [tagsAsOptions])

  const { data: allThemes } = useGetThemesQuery()

  const themesAsOptions = getThemesAsOptionsCheckPicker(Object.values(allThemes ?? []))

  const themesCustomSearch = useMemo(() => new CustomSearch(themesAsOptions, ['label']), [themesAsOptions])

  const onDeleteTag = (
    valueToDelete: string | number,
    filterKey: keyof DashboardsListFilters,
    filter: DashboardsListFilters[keyof DashboardsListFilters]
  ) => {
    let updatedFilter = filter

    if (isArray(filter)) {
      // FIXME(09/09/2025): Admission of weakness: any
      updatedFilter = (filter as any).filter(unit => unit !== valueToDelete)
    }
    dispatch(
      dashboardFiltersActions.updateListFilters({
        key: filterKey,
        value: updatedFilter
      })
    )
  }

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

  const administrationTags = (
    <Fragment key={`dashboard-administrationTags-${orientation === 'row' ? 'row' : 'column'}`}>
      {administrations?.map(adminId => (
        <SingleTag key={adminId} onDelete={() => onDeleteTag(adminId, 'administrations', administrations)}>
          {String(
            `${orientation === 'row' ? 'Administration ' : ''} ${allAdmins?.find(admin => admin.id === adminId)?.name}`
          )}
        </SingleTag>
      ))}
    </Fragment>
  )

  const tagTags = (
    <Fragment key={`dashboard-tagTags-${orientation === 'row' ? 'row' : 'column'}`}>
      {tags?.map(tag => (
        <SingleTag key={tag} onDelete={() => onDeleteTag(tag, 'tags', tags)}>
          {String(
            `${orientation === 'row' ? 'Tag ' : ''}${Object.values(allTags ?? []).find(tagAPI => tagAPI.id === tag)?.name}`
          )}
        </SingleTag>
      ))}
    </Fragment>
  )

  const themeTags = (
    <Fragment key={`dashboard-themes-${orientation === 'row' ? 'row' : 'column'}`}>
      {themes?.map(theme => (
        <SingleTag key={theme} onDelete={() => onDeleteTag(theme, 'themes', themes)}>
          {String(
            `${orientation === 'row' ? 'Thématique ' : ''}${Object.values(allThemes ?? []).find(themeAPI => themeAPI.id === theme)?.name}`
          )}
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
        {orientation === 'column' &&
          (nbOfFiltersSetted > 0 ? (
            <FiltersText>
              <span>{`${nbOfFiltersSetted} ${pluralize('filtre', nbOfFiltersSetted)} actif${
                nbOfFiltersSetted > 1 ? 's' : ''
              }`}</span>
              <ResetButton onClick={resetFilter} />
            </FiltersText>
          ) : (
            <StyledItalic>Aucun filtre actif</StyledItalic>
          ))}
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
            isLabelHidden
            isTransparent
            label="Administration"
            name="administration"
            onChange={updateAdminFilter}
            options={administrationsOptions}
            placeholder="Administration"
            renderValue={() =>
              administrations && <OptionValue>{`Administration (${administrations.length})`}</OptionValue>
            }
            searchable
            style={{ width: 200 }}
            value={administrations}
          />
          {orientation === 'column' && administrationTags}
        </FilterWrapper>

        <FilterWrapper $orientation={orientation}>
          <CheckPicker
            key={themesAsOptions.length}
            customSearch={themesCustomSearch}
            isLabelHidden
            isTransparent
            label="Thématiques"
            name="themes"
            onChange={updateThemesFilter}
            options={themesAsOptions}
            placeholder="Thématiques"
            renderValue={() => themes && <OptionValue>{`Thématiques (${themes.length})`}</OptionValue>}
            style={{ width: 320 }}
            value={themes}
          />
          {orientation === 'column' && themeTags}
        </FilterWrapper>
        <FilterWrapper $orientation={orientation}>
          <CheckPicker
            key={tagsAsOptions.length}
            customSearch={tagsCustomSearch}
            isLabelHidden
            isTransparent
            label="Tags"
            name="tags"
            onChange={updateTagsFilter}
            options={tagsAsOptions}
            placeholder="Tag"
            renderValue={() => tags && <OptionValue>{`Tag (${tags.length})`}</OptionValue>}
            style={{ width: 320 }}
            value={tags}
          />
          {orientation === 'column' && tagTags}
        </FilterWrapper>
      </FiltersContainer>
      {orientation === 'row' && (
        <TagsContainer>
          {[specificPeriodDatePicker, seaFrontTags, controlUnitTags, administrationTags, tagTags, themeTags]}

          {nbOfFiltersSetted > 0 && <ResetButton onClick={resetFilter} />}
        </TagsContainer>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div<{ $orientation: Orientation }>`
  display: flex;
  flex-direction: column;
  gap: 16px;
  ${p => p.$orientation === 'column' && 'padding: 0px 4px 12px 4px'}
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
const FiltersText = styled.div`
  display: flex;
  gap: 8px;
  padding-bottom: 6px;

  > span {
    color: ${p => p.theme.color.slateGray};
  }
`

const StyledItalic = styled(Italic)`
  color: ${p => p.theme.color.slateGray};
  padding-bottom: 13px;
`
