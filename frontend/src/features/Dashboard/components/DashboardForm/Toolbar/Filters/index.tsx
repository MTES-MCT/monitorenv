import { useGetThemesByRegulatoryAreasQuery } from '@api/themesAPI'
import { type DashboardType } from '@features/Dashboard/slice'
import { getThemesAsOptions } from '@features/Themes/useCases/getThemesAsOptions'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import {
  Checkbox,
  CheckPicker,
  CustomSearch,
  getOptionsFromLabelledEnum,
  Icon,
  Select,
  THEME,
  type OptionValueType
} from '@mtes-mct/monitor-ui'
import { getAmpsAsOptions } from '@utils/getAmpsAsOptions'
import { useMemo } from 'react'
import styled from 'styled-components'

import { dashboardFiltersActions } from '../../slice'
import { SelectedPinButton } from '../../ToggleSelectAll/style'

type FiltersProps = {
  dashboard: DashboardType
}

export function DashboardFilters({ dashboard }: FiltersProps) {
  const dispatch = useAppDispatch()
  const { extractedArea } = dashboard
  const { id } = dashboard.dashboard

  const filters = useAppSelector(state => state.dashboardFilters.dashboards[id]?.filters)

  const allRegulatoryAreaIds = extractedArea?.regulatoryAreas.flatMap(reg => reg.id) ?? []
  const { data: regulatoryThemes } = useGetThemesByRegulatoryAreasQuery(allRegulatoryAreaIds)
  const regulatoryThemesAsOptions = getThemesAsOptions(Object.values(regulatoryThemes ?? []))
  const regulatoryThemesCustomSearch = useMemo(
    () => new CustomSearch(regulatoryThemesAsOptions, ['label']),
    [regulatoryThemesAsOptions]
  )

  const ampsAsOptions = useMemo(() => getAmpsAsOptions(extractedArea?.amps ?? []), [extractedArea?.amps])
  const ampCustomSearch = useMemo(() => new CustomSearch(ampsAsOptions, ['label']), [ampsAsOptions])

  const vigilanceAreaPeriodOptions = getOptionsFromLabelledEnum(VigilanceArea.VigilanceAreaFilterPeriodLabel)

  const setFilteredRegulatoryThemes = (value: string[] | undefined) => {
    dispatch(dashboardFiltersActions.setFilters({ filters: { regulatoryThemes: value }, id }))
  }

  const areAllRegulatoryChecked = useMemo(
    () => filters?.regulatoryThemes?.length === regulatoryThemesAsOptions?.length,
    [filters?.regulatoryThemes, regulatoryThemesAsOptions]
  )

  const indeterminate = useMemo(
    () => filters?.regulatoryThemes && filters.regulatoryThemes.length > 0 && !areAllRegulatoryChecked,
    [filters?.regulatoryThemes, areAllRegulatoryChecked]
  )

  const checkAll = () => {
    if (areAllRegulatoryChecked) {
      dispatch(dashboardFiltersActions.setFilters({ filters: { regulatoryThemes: undefined }, id }))

      return
    }
    const allRegulatoryAreasIds = regulatoryThemesAsOptions.map(regulatory => regulatory.value)

    dispatch(dashboardFiltersActions.setFilters({ filters: { regulatoryThemes: allRegulatoryAreasIds }, id }))
  }
  const renderExtraFooter = () => (
    <SelectAllRegulatoryAreasContainer>
      <Checkbox
        checked={areAllRegulatoryChecked}
        indeterminate={indeterminate}
        inline
        label="Tout sélectionner"
        name="selectAll"
        onChange={checkAll}
      >
        Check all
      </Checkbox>
    </SelectAllRegulatoryAreasContainer>
  )

  const setFilteredAmpTypes = (value: string[] | undefined) => {
    dispatch(dashboardFiltersActions.setFilters({ filters: { amps: value }, id }))
  }

  const setFilteredVigilancePeriod = (nextValue: OptionValueType | undefined) => {
    const value = nextValue as VigilanceArea.VigilanceAreaFilterPeriod | undefined
    dispatch(dashboardFiltersActions.setFilters({ filters: { vigilanceAreaPeriod: value }, id }))
  }

  const showSelectedItems = () => {
    dispatch(dashboardFiltersActions.setFilters({ filters: { previewSelection: true }, id }))
  }

  return (
    <FiltersContainer>
      <div>
        <CheckPicker
          customSearch={regulatoryThemesAsOptions.length > 10 ? regulatoryThemesCustomSearch : undefined}
          isLabelHidden
          isTransparent
          label="Thématique réglementaire"
          name="regulatoryThemes"
          onChange={setFilteredRegulatoryThemes}
          options={regulatoryThemesAsOptions}
          placeholder="Thématique réglementaire"
          renderExtraFooter={renderExtraFooter}
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
          customSearch={ampsAsOptions.length > 10 ? ampCustomSearch : undefined}
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
      <SelectedPinButton onClick={showSelectedItems} type="button">
        <Icon.Pin color={THEME.color.slateGray} />
        Prévisualiser la sélection
      </SelectedPinButton>
    </FiltersContainer>
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

const SelectAllRegulatoryAreasContainer = styled.div`
  border-top: 1px solid ${p => p.theme.color.lightGray};
  padding: 8px;
`
