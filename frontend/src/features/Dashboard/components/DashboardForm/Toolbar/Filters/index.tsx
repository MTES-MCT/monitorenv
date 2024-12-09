import { CustomPeriodContainer, CustomPeriodLabel } from '@components/style'
import { ReinitializeFiltersButton } from '@features/commonComponents/ReinitializeFiltersButton'
import { type DashboardType } from '@features/Dashboard/slice'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import {
  CheckPicker,
  CustomSearch,
  DateRangePicker,
  getOptionsFromLabelledEnum,
  Icon,
  Select,
  SingleTag,
  THEME,
  type DateAsStringRange,
  type Option,
  type OptionValueType
} from '@mtes-mct/monitor-ui'
import { getAmpsAsOptions } from '@utils/getAmpsAsOptions'
import { getRegulatoryThemesAsOptions } from '@utils/getRegulatoryThemesAsOptions'
import { useMemo } from 'react'
import styled from 'styled-components'

import { dashboardFiltersActions } from '../../slice'

type FiltersProps = {
  dashboard: DashboardType
}
export function DashboardFilters({ dashboard }: FiltersProps) {
  const dispatch = useAppDispatch()
  const { extractedArea } = dashboard
  const { id } = dashboard.dashboard

  const filters = useAppSelector(state => state.dashboardFilters.dashboards[id]?.filters)

  const regulatoryThemesAsOption = getRegulatoryThemesAsOptions(extractedArea?.regulatoryAreas ?? [])
  const regulatoryThemesCustomSearch = useMemo(
    () => new CustomSearch(regulatoryThemesAsOption as Array<Option<string>>, ['label']),
    [regulatoryThemesAsOption]
  )

  const ampsAsOptions = useMemo(() => getAmpsAsOptions(extractedArea?.amps ?? []), [extractedArea?.amps])
  const AMPCustomSearch = useMemo(() => new CustomSearch(ampsAsOptions as Array<Option>, ['label']), [ampsAsOptions])

  const vigilanceAreaPeriodOptions = getOptionsFromLabelledEnum(VigilanceArea.VigilanceAreaFilterPeriodLabel)

  const setFilteredRegulatoryThemes = (value: string[] | undefined) => {
    dispatch(dashboardFiltersActions.setFilters({ filters: { regulatoryThemes: value }, id }))
  }

  const setFilteredAmpTypes = (value: string[] | undefined) => {
    dispatch(dashboardFiltersActions.setFilters({ filters: { amps: value }, id }))
  }

  const setFilteredVigilancePeriod = (nextValue: OptionValueType | undefined) => {
    const value = nextValue as VigilanceArea.VigilanceAreaFilterPeriod | undefined
    dispatch(dashboardFiltersActions.setFilters({ filters: { vigilanceAreaPeriod: value }, id }))
  }

  const deleteRegulatoryTheme = (regulatoryThemeToDelete: string) => {
    setFilteredRegulatoryThemes(filters?.regulatoryThemes?.filter(theme => theme !== regulatoryThemeToDelete))
  }

  const deleteAmpType = (ampTypeToDelete: string) => {
    setFilteredAmpTypes(filters?.amps?.filter(type => type !== ampTypeToDelete))
  }

  const updateDateRangeFilter = (dateRange: DateAsStringRange | undefined) => {
    dispatch(dashboardFiltersActions.setFilters({ filters: { specificPeriod: dateRange }, id }))
  }

  const resetFilters = () => {
    dispatch(dashboardFiltersActions.resetDashboardFilters({ id }))
  }

  const showSelectedItems = () => {
    dispatch(dashboardFiltersActions.setFilters({ filters: { previewSelection: true }, id }))
  }

  const hasFilters = !!(
    (filters?.regulatoryThemes && filters?.regulatoryThemes.length > 0) ||
    (filters?.amps && filters?.amps.length > 0) ||
    filters?.vigilanceAreaPeriod
  )

  return (
    <>
      <FiltersContainer>
        <div>
          <CheckPicker
            customSearch={regulatoryThemesAsOption.length > 10 ? regulatoryThemesCustomSearch : undefined}
            isLabelHidden
            isTransparent
            label="Thématique réglementaire"
            name="regulatoryThemes"
            onChange={setFilteredRegulatoryThemes}
            options={regulatoryThemesAsOption}
            placeholder="Thématique réglementaire"
            renderValue={() =>
              filters?.regulatoryThemes && (
                <OptionValue>{`Thématique réglementaire (${filters?.regulatoryThemes.length})`}</OptionValue>
              )
            }
            style={{ width: '310px' }}
            value={filters?.regulatoryThemes}
          />
          <Select
            isLabelHidden
            isTransparent
            label="Période de vigilance"
            name="periodOfVigilanceArea"
            onChange={setFilteredVigilancePeriod}
            options={vigilanceAreaPeriodOptions}
            placeholder="Période de vigilance"
            style={{ width: '310px' }}
            value={filters?.vigilanceAreaPeriod}
          />
          <CheckPicker
            customSearch={ampsAsOptions.length > 10 ? AMPCustomSearch : undefined}
            isLabelHidden
            isTransparent
            label="Type d'AMP"
            name="ampTypes"
            onChange={setFilteredAmpTypes}
            options={ampsAsOptions}
            placeholder="Type d'AMP"
            renderValue={() => filters?.amps && <OptionValue>{`Type d'AMP (${filters?.amps.length})`}</OptionValue>}
            style={{ width: '310px' }}
            value={filters?.amps}
          />
        </div>
        <StyledButton onClick={showSelectedItems} type="button">
          <Icon.Pin color={THEME.color.slateGray} />
          Prévisualiser la sélection
        </StyledButton>
      </FiltersContainer>
      {(hasFilters || filters?.vigilanceAreaPeriod === VigilanceArea.VigilanceAreaFilterPeriod.SPECIFIC_PERIOD) && (
        <TagsContainer data-cy="dashboard-filter-tags">
          {filters?.vigilanceAreaPeriod === VigilanceArea.VigilanceAreaFilterPeriod.SPECIFIC_PERIOD && (
            <CustomPeriodContainer>
              <CustomPeriodLabel>Période spécifique</CustomPeriodLabel>
              <DateRangePicker
                key="dateRange"
                defaultValue={filters?.specificPeriod ?? undefined}
                isLabelHidden
                isStringDate
                label="Période spécifique"
                name="dateRange"
                onChange={updateDateRangeFilter}
              />
            </CustomPeriodContainer>
          )}
          {filters?.regulatoryThemes?.map(theme => (
            <SingleTag key={theme} onDelete={() => deleteRegulatoryTheme(theme)} title={theme}>
              {theme}
            </SingleTag>
          ))}

          {filters?.amps?.map(type => (
            <SingleTag key={type} onDelete={() => deleteAmpType(type)} title={type}>
              {type}
            </SingleTag>
          ))}

          <ReinitializeFiltersButton onClick={resetFilters} />
        </TagsContainer>
      )}
    </>
  )
}

const OptionValue = styled.span`
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const FiltersContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  > div {
    display: flex;
    gap: 16px;
  }
`
const TagsContainer = styled.div`
  align-items: end;
  display: flex;
  gap: 16px;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 100%;
`

const StyledButton = styled.button`
  background-color: ${p => p.theme.color.white};
  color: ${p => p.theme.color.slateGray};
  display: flex;
  gap: 4px;
  text-decoration: underline;
`
