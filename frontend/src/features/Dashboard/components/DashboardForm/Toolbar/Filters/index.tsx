import { useGetTagsByRegulatoryAreasQuery } from '@api/tagsAPI'
import { type DashboardType } from '@features/Dashboard/slice'
import { getTagsAsOptions, parseOptionsToTags } from '@features/Tags/utils/getTagsAsOptions'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import {
  Checkbox,
  CheckPicker,
  CheckTreePicker,
  CustomSearch,
  getOptionsFromLabelledEnum,
  Icon,
  Select,
  THEME,
  type CheckTreePickerOption,
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
  const { data: regulatoryTags } = useGetTagsByRegulatoryAreasQuery(allRegulatoryAreaIds)
  const regulatoryTagsAsOptions = getTagsAsOptions(Object.values(regulatoryTags ?? []))
  // const regulatoryTagsCustomSearch = useMemo(
  //   () => new CustomSearch(regulatoryTagsAsOptions, ['label']),
  //   [regulatoryTagsAsOptions]
  // )

  const ampsAsOptions = useMemo(() => getAmpsAsOptions(extractedArea?.amps ?? []), [extractedArea?.amps])
  const ampCustomSearch = useMemo(() => new CustomSearch(ampsAsOptions, ['label']), [ampsAsOptions])

  const vigilanceAreaPeriodOptions = getOptionsFromLabelledEnum(VigilanceArea.VigilanceAreaFilterPeriodLabel)

  const setFilteredRegulatoryTags = (value: CheckTreePickerOption[] | undefined) => {
    const nextTag = value ? parseOptionsToTags(value) : undefined
    dispatch(dashboardFiltersActions.setFilters({ filters: { regulatoryTags: nextTag }, id }))
  }

  const areAllRegulatoryChecked = useMemo(
    () => filters?.regulatoryTags?.length === regulatoryTagsAsOptions?.length,
    [filters?.regulatoryTags, regulatoryTagsAsOptions]
  )

  const indeterminate = useMemo(
    () => filters?.regulatoryTags && filters.regulatoryTags.length > 0 && !areAllRegulatoryChecked,
    [filters?.regulatoryTags, areAllRegulatoryChecked]
  )

  const checkAll = () => {
    if (areAllRegulatoryChecked) {
      dispatch(dashboardFiltersActions.setFilters({ filters: { regulatoryTags: undefined }, id }))

      return
    }
    const allRegulatoryAreas = parseOptionsToTags(regulatoryTagsAsOptions)

    dispatch(dashboardFiltersActions.setFilters({ filters: { regulatoryTags: allRegulatoryAreas }, id }))
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
        <CheckTreePicker
          // customSearch={regulatoryTagsAsOptions.length > 10 ? regulatoryTagsCustomSearch : undefined}
          isLabelHidden
          isTransparent
          label="Thématique réglementaire"
          name="regulatoryTags"
          onChange={setFilteredRegulatoryTags}
          options={regulatoryTagsAsOptions}
          placeholder="Thématique réglementaire"
          renderExtraFooter={renderExtraFooter}
          renderValue={() =>
            filters?.regulatoryTags && (
              <OptionValue>{`Thématique réglementaire (${filters?.regulatoryTags.length})`}</OptionValue>
            )
          }
          style={{ width: '310px' }}
          value={getTagsAsOptions(filters?.regulatoryTags ?? [])}
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
