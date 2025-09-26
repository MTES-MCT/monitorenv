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
import { getThemesAsOptions } from '@utils/getThemesAsOptions'
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

  const tags = extractedArea?.tags ?? []
  const tagsAsOptions = getTagsAsOptions(Object.values(tags))

  const themes = extractedArea?.themes ?? []
  const themesAsOptions = getThemesAsOptions(Object.values(themes))

  const ampsAsOptions = useMemo(() => getAmpsAsOptions(extractedArea?.amps ?? []), [extractedArea?.amps])
  const ampCustomSearch = useMemo(() => new CustomSearch(structuredClone(ampsAsOptions), ['label']), [ampsAsOptions])

  const vigilanceAreaPeriodOptions = getOptionsFromLabelledEnum(VigilanceArea.VigilanceAreaFilterPeriodLabel)

  const setFilteredRegulatoryTags = (nextTag: TagOption[] | undefined) => {
    dispatch(dashboardFiltersActions.setFilters({ filters: { tags: nextTag }, id }))
  }

  const areAllTagsChecked = useMemo(
    () => filters?.tags?.length === tagsAsOptions?.length,
    [filters?.tags, tagsAsOptions]
  )

  const indeterminateTags = useMemo(
    () => filters?.tags && filters.tags.length > 0 && !areAllTagsChecked,
    [filters?.tags, areAllTagsChecked]
  )

  const checkAllTags = () => {
    if (areAllTagsChecked) {
      dispatch(dashboardFiltersActions.setFilters({ filters: { tags: undefined }, id }))

      return
    }

    dispatch(dashboardFiltersActions.setFilters({ filters: { tags: tagsAsOptions }, id }))
  }

  const renderTagsExtraFooter = () => (
    <SelectAllContainer>
      <Checkbox
        checked={areAllTagsChecked}
        indeterminate={indeterminateTags}
        inline
        label="Sélectionner tous les tags"
        name="selectAllTags"
        onChange={checkAllTags}
      >
        Sélectionner tous les tags
      </Checkbox>
    </SelectAllContainer>
  )

  const setFilteredThemes = (nextTheme: TagOption[] | undefined) => {
    dispatch(dashboardFiltersActions.setFilters({ filters: { themes: nextTheme }, id }))
  }

  const areAllThemesChecked = useMemo(
    () => filters?.themes?.length === themesAsOptions?.length,
    [filters?.themes, themesAsOptions]
  )

  const indeterminateThemes = useMemo(
    () => filters?.themes && filters.themes.length > 0 && !areAllThemesChecked,
    [filters?.themes, areAllThemesChecked]
  )

  const checkAllThemes = () => {
    if (areAllThemesChecked) {
      dispatch(dashboardFiltersActions.setFilters({ filters: { themes: undefined }, id }))

      return
    }

    dispatch(dashboardFiltersActions.setFilters({ filters: { themes: themesAsOptions }, id }))
  }

  const renderThemesExtraFooter = () => (
    <SelectAllContainer>
      <Checkbox
        checked={areAllThemesChecked}
        indeterminate={indeterminateThemes}
        inline
        label="Sélectionner toutes les thématiques"
        name="selectAllThemes"
        onChange={checkAllThemes}
      >
        Sélectionner toutes les thématiques
      </Checkbox>
    </SelectAllContainer>
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
      <CheckTreePicker
        key={`tags-${tagsAsOptions.length}`}
        disabled={tagsAsOptions.length === 0}
        isLabelHidden
        isTransparent
        label="Tag"
        labelKey="name"
        name="tags"
        onChange={setFilteredRegulatoryTags}
        options={tagsAsOptions}
        placeholder="Tag"
        renderedValue="Tag"
        renderExtraFooter={renderTagsExtraFooter}
        shouldShowLabels={false}
        style={{ width: '310px' }}
        value={filters?.tags}
        valueKey="id"
      />
      <CheckTreePicker
        key={`themes-${themesAsOptions.length}`}
        disabled={themesAsOptions.length === 0}
        isLabelHidden
        isTransparent
        label="Thématique"
        labelKey="name"
        name="themes"
        onChange={setFilteredThemes}
        options={themesAsOptions}
        placeholder="Thématique"
        renderExtraFooter={renderThemesExtraFooter}
        shouldShowLabels={false}
        style={{ width: '310px' }}
        value={filters?.themes}
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

  flex-wrap: wrap;
  gap: 16px;
`

const SelectAllContainer = styled.div`
  border-top: 1px solid ${p => p.theme.color.lightGray};
  padding: 8px;
`
