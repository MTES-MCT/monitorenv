import { ReinitializeFiltersButton } from '@features/commonComponents/ReinitializeFiltersButton'
import { dashboardActions } from '@features/Dashboard/slice'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import {
  Accent,
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

export function DashboardFilters() {
  const dispatch = useAppDispatch()
  const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)
  const filters = useAppSelector(state =>
    activeDashboardId ? state.dashboard.dashboards?.[activeDashboardId]?.filters : undefined
  )

  const regulatoryAreas = useAppSelector(state =>
    activeDashboardId ? state.dashboard.dashboards?.[activeDashboardId]?.extractedArea?.regulatoryAreas : undefined
  )

  const regulatoryThemesAsOption = getRegulatoryThemesAsOptions(regulatoryAreas ?? [])
  const regulatoryThemesCustomSearch = useMemo(
    () => new CustomSearch(regulatoryThemesAsOption as Array<Option<string>>, ['label']),
    [regulatoryThemesAsOption]
  )

  const amps = useAppSelector(state =>
    activeDashboardId ? state.dashboard.dashboards?.[activeDashboardId]?.extractedArea?.amps : undefined
  )
  const ampsAsOptions = useMemo(() => getAmpsAsOptions(amps ?? []), [amps])
  const AMPCustomSearch = useMemo(() => new CustomSearch(ampsAsOptions as Array<Option>, ['label']), [ampsAsOptions])

  const vigilanceAreaPeriodOptions = getOptionsFromLabelledEnum(VigilanceArea.VigilanceAreaFilterPeriodLabel)

  const setFilteredRegulatoryThemes = (value: string[] | undefined) => {
    dispatch(dashboardActions.setDashboardFilters({ regulatoryThemes: value }))
  }

  const setFilteredAmpTypes = (value: string[] | undefined) => {
    dispatch(dashboardActions.setDashboardFilters({ amps: value }))
  }

  const setFilteredVigilancePeriod = (nextValue: OptionValueType | undefined) => {
    const value = nextValue as VigilanceArea.VigilanceAreaFilterPeriod | undefined
    dispatch(dashboardActions.setDashboardFilters({ vigilanceAreaPeriod: value }))
  }

  const deleteRegulatoryTheme = (regulatoryThemeToDelete: string) => {
    setFilteredRegulatoryThemes(filters?.regulatoryThemes?.filter(theme => theme !== regulatoryThemeToDelete))
  }

  const deleteAmpType = (ampTypeToDelete: string) => {
    setFilteredAmpTypes(filters?.amps?.filter(type => type !== ampTypeToDelete))
  }

  const updateDateRangeFilter = (dateRange: DateAsStringRange | undefined) => {
    dispatch(dashboardActions.setDashboardFilters({ specificPeriod: dateRange }))
  }

  const resetFilters = () => {
    dispatch(dashboardActions.resetDashboardFilters())
  }

  const showSelectedItems = () => {
    dispatch(dashboardActions.setDashboardFilters({ previewSelection: true }))
  }

  const hasFilters = !!(
    (filters?.regulatoryThemes && filters?.regulatoryThemes.length > 0) ??
    (filters?.amps && filters?.amps.length > 0) ??
    filters?.vigilanceAreaPeriod
  )

  return (
    <Wrapper>
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
      {(hasFilters || filters?.specificPeriod) && (
        <TagsContainer>
          {filters?.vigilanceAreaPeriod === VigilanceArea.VigilanceAreaFilterPeriod.SPECIFIC_PERIOD && (
            <StyledCustomPeriodContainer>
              <StyledCutomPeriodLabel>Période spécifique</StyledCutomPeriodLabel>
              <DateRangePicker
                key="dateRange"
                defaultValue={filters?.specificPeriod ?? undefined}
                isLabelHidden
                isStringDate
                label="Période spécifique"
                name="dateRange"
                onChange={updateDateRangeFilter}
              />
            </StyledCustomPeriodContainer>
          )}
          {filters?.regulatoryThemes?.map(theme => (
            <SingleTag
              key={theme}
              accent={Accent.SECONDARY}
              onDelete={() => deleteRegulatoryTheme(theme)}
              title={theme}
            >
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
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background-color: ${p => p.theme.color.white};
  box-shadow: 0pc 3px 6px #00000029;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px 24px;
`

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
  flex: 0 1 50%;
  gap: 16px;
`
export const StyledCustomPeriodContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`
export const StyledCutomPeriodLabel = styled.div`
  color: ${p => p.theme.color.slateGray};
  font-size: 13px;
`
const StyledButton = styled.button`
  background-color: ${p => p.theme.color.white};
  color: ${p => p.theme.color.slateGray};
  display: flex;
  gap: 4px;
  text-decoration: underline;
`
