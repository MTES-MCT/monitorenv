import { useGetAdministrationsQuery } from '@api/administrationsAPI'
import { RTK_DEFAULT_QUERY_OPTIONS } from '@api/constants'
import { useGetControlUnitsQuery } from '@api/controlUnitsAPI'
import { CustomPeriodContainer } from '@components/style'
import {
  recentActivityActions,
  RecentActivityFiltersEnum,
  type RecentActivityState
} from '@features/RecentActivity/slice'
import { RecentActivity } from '@features/RecentActivity/types'
import { resetDrawingZone } from '@features/RecentActivity/useCases/resetDrawingZone'
import { OptionValue } from '@features/Reportings/Filters/style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useGetControlPlans } from '@hooks/useGetControlPlans'
import {
  Accent,
  Button,
  Checkbox,
  CheckPicker,
  CustomSearch,
  DateRangePicker,
  getOptionsFromIdAndName,
  getOptionsFromLabelledEnum,
  Icon,
  IconButton,
  Label,
  Select,
  SingleTag,
  type DateAsStringRange
} from '@mtes-mct/monitor-ui'
import { isNotArchived } from '@utils/isNotArchived'
import { centerOnMap } from 'domain/use_cases/map/centerOnMap'
import { useMemo } from 'react'
import styled from 'styled-components'

import type { Coordinate } from 'ol/coordinate'

export function RecentActivityFilters() {
  const dispatch = useAppDispatch()
  const filters = useAppSelector(state => state.recentActivity.filters)

  const { data: administrations, isLoading: isLoadingAdministrations } = useGetAdministrationsQuery(
    undefined,
    RTK_DEFAULT_QUERY_OPTIONS
  )
  const { data: controlUnits, isLoading: isLoadingControlUnits } = useGetControlUnitsQuery(
    undefined,
    RTK_DEFAULT_QUERY_OPTIONS
  )
  const { isLoading: isLoadingThemes, themesAsOptions } = useGetControlPlans()

  const administrationsOptions = useMemo(
    () =>
      (administrations ?? []).filter(isNotArchived).map(admin => ({
        label: admin.name,
        value: admin.id
      })),
    [administrations]
  )

  const controlUnitsAsOptions = useMemo(() => {
    const activeControlUnits = (controlUnits ?? []).filter(isNotArchived)
    const selectableControlUnits = activeControlUnits?.filter(
      activeControlUnit =>
        filters.administrationIds?.length === 0 ||
        !filters.administrationIds ||
        filters.administrationIds?.includes(activeControlUnit.administrationId)
    )

    return getOptionsFromIdAndName(selectableControlUnits) ?? []
  }, [controlUnits, filters.administrationIds])

  const dateRangeOptions = getOptionsFromLabelledEnum(RecentActivity.RecentActivityDateRangeLabels)
  const infractionsStatusOptions = getOptionsFromLabelledEnum(RecentActivity.InfractionsStatusFilterLabels)

  const controlUnitCustomSearch = useMemo(
    () => new CustomSearch(controlUnitsAsOptions ?? [], ['label'], { isStrict: true, threshold: 0.2 }),
    [controlUnitsAsOptions]
  )

  const themeCustomSearch = useMemo(() => new CustomSearch(themesAsOptions ?? [], ['label']), [themesAsOptions])

  const updateCheckboxFilter = (isChecked: boolean | undefined, value: RecentActivity.StatusFilterEnum) => {
    const updatedFilter = [...(filters.infractionsStatus ?? [])]
    let newFilter
    if (!isChecked && updatedFilter.includes(value)) {
      newFilter = updatedFilter.filter(status => status !== value)
    }
    if (isChecked && !updatedFilter.includes(value)) {
      newFilter = [...updatedFilter, value]
    }
    dispatch(
      recentActivityActions.updateFilters({ key: RecentActivityFiltersEnum.INFRACTIONS_STATUS, value: newFilter })
    )
    if (newFilter.length === 1) {
      dispatch(recentActivityActions.updateDistinctionFilter(RecentActivity.DistinctionFilterEnum.WITHOUT_DISTINCTION))
    }
  }

  const updatePeriodFilter = period => {
    dispatch(recentActivityActions.updateFilters({ key: RecentActivityFiltersEnum.PERIOD_FILTER, value: period }))

    // these filters are only uses when user selects a date range
    dispatch(recentActivityActions.updateFilters({ key: RecentActivityFiltersEnum.STARTED_AFTER, value: undefined }))
    dispatch(recentActivityActions.updateFilters({ key: RecentActivityFiltersEnum.STARTED_BEFORE, value: undefined }))
  }

  const updateDateRangeFilter = (date: DateAsStringRange | undefined) => {
    dispatch(
      recentActivityActions.updateFilters({
        key: RecentActivityFiltersEnum.STARTED_AFTER,
        value: date?.[0] ?? undefined
      })
    )
    dispatch(
      recentActivityActions.updateFilters({
        key: RecentActivityFiltersEnum.STARTED_BEFORE,
        value: date?.[1] ?? undefined
      })
    )
  }

  const setFilters = (
    newFilters: RecentActivityState['filters'][keyof RecentActivityState['filters']],
    key: RecentActivityFiltersEnum
  ) => {
    dispatch(recentActivityActions.updateFilters({ key, value: newFilters }))
  }

  const onDeleteTag = (valueToDelete: number | string, filterKey: RecentActivityFiltersEnum) => {
    if (!Array.isArray(filters[filterKey])) {
      return
    }

    const nextSelectedValues = filters[filterKey].filter(selectedValue => selectedValue !== valueToDelete)
    dispatch(
      dispatch(
        recentActivityActions.updateFilters({
          key: filterKey,
          value: nextSelectedValues.length === 0 ? undefined : nextSelectedValues
        })
      )
    )
  }

  const onDrawZone = () => {
    dispatch(recentActivityActions.setIsDrawing(true))
  }

  const handleCenterOnMap = (coordinates: Coordinate[][]) => {
    dispatch(centerOnMap(coordinates[0]))
  }

  const updateZone = () => {
    dispatch(recentActivityActions.setIsDrawing(true))
    dispatch(recentActivityActions.setInitialGeometry(filters.geometry))
  }

  const deleteZone = (index: number) => {
    const nextCoordinates = filters?.geometry?.coordinates.filter((_, i) => i !== index)
    if (!filters.geometry) {
      return
    }

    if (filters.geometry?.coordinates?.length === 1 || !nextCoordinates || nextCoordinates.length === 0) {
      dispatch(resetDrawingZone())
      dispatch(recentActivityActions.setInitialGeometry(undefined))
      dispatch(recentActivityActions.updateFilters({ key: RecentActivityFiltersEnum.GEOMETRY, value: undefined }))

      return
    }

    const newGeom = {
      ...filters.geometry,
      coordinates: nextCoordinates
    }

    dispatch(
      recentActivityActions.updateFilters({
        key: RecentActivityFiltersEnum.GEOMETRY,
        value: newGeom
      })
    )
    dispatch(recentActivityActions.setGeometry(newGeom))
  }

  if (isLoadingThemes || isLoadingAdministrations || isLoadingControlUnits) {
    return null
  }

  return (
    <FilterWrapper>
      <StyledBloc>
        <StyledStatusFilter>
          {infractionsStatusOptions.map(status => (
            <Checkbox
              key={status.label}
              checked={filters?.infractionsStatus?.includes(status.value as RecentActivity.StatusFilterEnum)}
              data-cy={`recent-activity-filter-${status.label}`}
              label={status.label}
              name={status.label}
              onChange={isChecked => updateCheckboxFilter(isChecked, status.value as RecentActivity.StatusFilterEnum)}
            />
          ))}
        </StyledStatusFilter>

        <Select
          cleanable={false}
          isLabelHidden
          isTransparent
          label="Période"
          name="Période"
          onChange={updatePeriodFilter}
          options={dateRangeOptions}
          placeholder="Date de signalement depuis"
          value={filters.periodFilter}
        />
        {filters.periodFilter === RecentActivity.RecentActivityDateRangeEnum.CUSTOM && (
          <StyledCustomPeriodContainer>
            <DateRangePicker
              key="dateRange"
              defaultValue={
                filters.startedAfter && filters.startedBefore
                  ? [new Date(filters.startedAfter), new Date(filters.startedBefore)]
                  : undefined
              }
              hasSingleCalendar
              isCompact
              isLabelHidden
              isStringDate
              label="Période spécifique"
              name="recentActivityDateRange"
              onChange={updateDateRangeFilter}
            />
          </StyledCustomPeriodContainer>
        )}
      </StyledBloc>

      <StyledBloc>
        <CheckPicker
          isLabelHidden
          isTransparent
          label="Administration"
          name="administration"
          onChange={value => setFilters(value, RecentActivityFiltersEnum.ADMINISTRATION_IDS)}
          options={administrationsOptions}
          placeholder="Administration"
          renderValue={() =>
            filters.administrationIds && (
              <OptionValue>{`Administration (${filters.administrationIds.length})`}</OptionValue>
            )
          }
          searchable
          value={filters.administrationIds}
        />
        {filters.administrationIds &&
          filters.administrationIds?.length > 0 &&
          filters.administrationIds.map(adminId => (
            <SingleTag
              key={adminId}
              onDelete={() => onDeleteTag(adminId, RecentActivityFiltersEnum.ADMINISTRATION_IDS)}
            >
              {`Admin. ${administrations?.find(admin => admin.id === adminId)?.name}`}
            </SingleTag>
          ))}
        <CheckPicker
          key={controlUnitsAsOptions?.length}
          customSearch={controlUnitCustomSearch}
          isLabelHidden
          isTransparent
          label="Unité"
          name="controlUnits"
          onChange={value => setFilters(value, RecentActivityFiltersEnum.CONTROL_UNIT_IDS)}
          options={controlUnitsAsOptions}
          placeholder="Unité"
          renderValue={() =>
            filters.controlUnitIds && <OptionValue>{`Unité (${filters.controlUnitIds.length})`}</OptionValue>
          }
          searchable
          value={filters.controlUnitIds}
        />
        {filters.controlUnitIds &&
          filters.controlUnitIds?.length > 0 &&
          filters.controlUnitIds.map(controlUnitId => (
            <SingleTag
              key={controlUnitId}
              onDelete={() => onDeleteTag(controlUnitId, RecentActivityFiltersEnum.CONTROL_UNIT_IDS)}
            >
              {`Admin. ${controlUnits?.find(controlunit => controlunit.id === controlUnitId)?.name}`}
            </SingleTag>
          ))}
      </StyledBloc>
      <StyledBloc>
        <CheckPicker
          key={themesAsOptions?.length}
          customSearch={themeCustomSearch}
          isLabelHidden
          isTransparent
          label="Thématique"
          name="theme"
          onChange={value => setFilters(value, RecentActivityFiltersEnum.THEME_IDS)}
          options={themesAsOptions}
          placeholder="Thématique"
          renderValue={() => filters.themeIds && <OptionValue>{`Type (${filters.themeIds.length})`}</OptionValue>}
          searchable
          value={filters.themeIds}
        />
        {filters.themeIds &&
          filters.themeIds?.length > 0 &&
          filters.themeIds.map(themeId => (
            <SingleTag key={themeId} onDelete={() => onDeleteTag(themeId, RecentActivityFiltersEnum.THEME_IDS)}>
              {`Theme ${themesAsOptions?.find(theme => theme.value === themeId)?.label}`}
            </SingleTag>
          ))}
      </StyledBloc>
      <div>
        <Label>Filter sur une zone</Label>
        <Button accent={Accent.SECONDARY} Icon={Icon.Plus} isFullWidth onClick={onDrawZone}>
          Définir un tracé pour la zone à filtrer
        </Button>
        {filters.geometry &&
          'coordinates' in filters.geometry &&
          filters.geometry.coordinates.length > 0 &&
          (filters.geometry.coordinates as Coordinate[][][]).map((polygonCoordinates, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Row key={`zone-${index}`}>
              <ZoneWrapper>
                <span>Polygone dessiné {index + 1}</span>
                <IconButton
                  accent={Accent.TERTIARY}
                  Icon={Icon.FocusZones}
                  onClick={() => handleCenterOnMap(polygonCoordinates)}
                  title="Centrer sur la carte"
                />
              </ZoneWrapper>

              <>
                <IconButton accent={Accent.SECONDARY} Icon={Icon.Edit} onClick={updateZone} />
                <IconButton
                  accent={Accent.SECONDARY}
                  aria-label="Supprimer cette zone"
                  Icon={Icon.Delete}
                  onClick={() => deleteZone(index)}
                />
              </>
            </Row>
          ))}
      </div>
    </FilterWrapper>
  )
}

const FilterWrapper = styled.div`
  display: flex;
  gap: 32px;
  flex-direction: column;
  padding: 12px 4px;
`

export const StyledStatusFilter = styled.div`
  align-items: end;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 8px;
`

const StyledCustomPeriodContainer = styled(CustomPeriodContainer)`
  align-items: start;
  text-align: left;
`
const StyledBloc = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Row = styled.div`
  align-items: center;
  display: flex;
  margin: 4px 0 0;
  width: 100%;

  > button {
    margin: 0 0 0 4px;
  }
`

const ZoneWrapper = styled.div`
  align-items: center;
  background-color: ${p => p.theme.color.gainsboro};
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  padding: 5px 8px 5px;
  line-height: 1;

  > button {
    padding: 0px;
  }
`
