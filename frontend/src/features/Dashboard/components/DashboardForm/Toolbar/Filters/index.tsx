import { useGetTagsByRegulatoryAreaIdsQuery } from '@api/tagsAPI'
import { type DashboardType } from '@features/Dashboard/slice'
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
  type OptionValueType,
  Select,
  THEME
} from '@mtes-mct/monitor-ui'
import { getAmpsAsOptions } from '@utils/getAmpsAsOptions'
import { getTagsAsOptions } from '@utils/getTagsAsOptions'
import { useMemo } from 'react'
import styled from 'styled-components'

import { dashboardFiltersActions } from '../../slice'
import { SelectedPinButton } from '../../ToggleSelectAll/style'

import type { TagOption } from '../../../../../../domain/entities/tags'

type FiltersProps = {
  dashboard: DashboardType
  dashboardKey: string
}

export function DashboardFilters({ dashboard, dashboardKey: id }: FiltersProps) {
  const dispatch = useAppDispatch()
  const { extractedArea } = dashboard

  const filters = useAppSelector(state => state.dashboardFilters.dashboards[id]?.filters)

  const allRegulatoryAreaIds = extractedArea?.regulatoryAreas.flatMap(reg => reg.id) ?? []
  const { data: regulatoryTags } = useGetTagsByRegulatoryAreaIdsQuery(allRegulatoryAreaIds)
  const regulatoryTagsAsOptions = getTagsAsOptions(Object.values(regulatoryTags ?? []))
  // const regulatoryTagsCustomSearch = useMemo(
  //   () => new CustomSearch(regulatoryTagsAsOptions, ['label']),
  //   [regulatoryTagsAsOptions]
  // )

  const ampsAsOptions = useMemo(() => getAmpsAsOptions(extractedArea?.amps ?? []), [extractedArea?.amps])
  const ampCustomSearch = useMemo(() => new CustomSearch(ampsAsOptions, ['label']), [ampsAsOptions])

  const vigilanceAreaPeriodOptions = getOptionsFromLabelledEnum(VigilanceArea.VigilanceAreaFilterPeriodLabel)

  const setFilteredRegulatoryTags = (nextTag: TagOption[] | undefined) => {
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

    dispatch(dashboardFiltersActions.setFilters({ filters: { regulatoryTags: regulatoryTagsAsOptions }, id }))
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
          labelKey="name"
          name="regulatoryTags"
          onChange={setFilteredRegulatoryTags}
          options={regulatoryTagsAsOptions}
          placeholder="Thématique réglementaire"
          renderExtraFooter={renderExtraFooter}
          shouldShowLabels={false}
          style={{ width: '310px' }}
          value={filters?.regulatoryTags}
          valueKey="id"
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
