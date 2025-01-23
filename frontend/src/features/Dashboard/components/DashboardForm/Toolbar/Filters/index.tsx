import { type DashboardType } from '@features/Dashboard/slice'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import {
  CheckPicker,
  CustomSearch,
  getOptionsFromLabelledEnum,
  Icon,
  Select,
  THEME,
  type OptionValueType
} from '@mtes-mct/monitor-ui'
import { getAmpsAsOptions } from '@utils/getAmpsAsOptions'
import { getRegulatoryThemesAsOptions } from '@utils/getRegulatoryThemesAsOptions'
import { useMemo } from 'react'
import styled from 'styled-components'

import { dashboardFiltersActions } from '../../slice'
import { SelectedPinButton } from '../../style'

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
    () => new CustomSearch(regulatoryThemesAsOption, ['label']),
    [regulatoryThemesAsOption]
  )

  const ampsAsOptions = useMemo(() => getAmpsAsOptions(extractedArea?.amps ?? []), [extractedArea?.amps])
  const AMPCustomSearch = useMemo(() => new CustomSearch(ampsAsOptions, ['label']), [ampsAsOptions])

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

  const showSelectedItems = () => {
    dispatch(dashboardFiltersActions.setFilters({ filters: { previewSelection: true }, id }))
  }

  return (
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
