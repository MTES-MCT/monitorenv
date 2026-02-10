import { RegulatoryTagsFilter } from '@components/RegulatoryTagsFilter'
import { RegulatoryThemesFilter } from '@components/RegulatoryThemesFilter'
import { OptionValue } from '@features/Reportings/Filters/style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { CheckPicker, Icon, Select, TextInput } from '@mtes-mct/monitor-ui'
import { SeaFrontLabels } from 'domain/entities/seaFrontType'
import styled from 'styled-components'

import { regulatoryAreaTableActions } from './slice'

import type { TagOption } from 'domain/entities/tags'
import type { ThemeOption } from 'domain/entities/themes'

const SEA_FRONT_OPTIONS = Object.values(SeaFrontLabels)

export function RegulatoryAreaFilters() {
  const dispatch = useAppDispatch()

  const filters = useAppSelector(store => store.regulatoryAreaTable.filtersState)

  const updateQuery = (nextQuery: string | undefined) => {
    dispatch(regulatoryAreaTableActions.setFilter({ key: 'searchQuery', value: nextQuery }))
  }

  const updateGroupFilter = (nextValue: 'CONTROL_PLAN' | 'SEA_FRONT' | undefined) => {
    if (!nextValue) {
      return
    }
    dispatch(regulatoryAreaTableActions.setFilter({ key: 'groupBy', value: nextValue }))
  }

  const updateThemesFilter = (nextThemes: ThemeOption[] | undefined) => {
    dispatch(regulatoryAreaTableActions.setFilter({ key: 'themes', value: nextThemes }))
  }
  const updateTagsFilter = (nextTags: TagOption[] | undefined) => {
    dispatch(regulatoryAreaTableActions.setFilter({ key: 'tags', value: nextTags }))
  }

  const updateSeaFrontFilter = (nextSeaFronts: string[] | undefined) => {
    dispatch(regulatoryAreaTableActions.setFilter({ key: 'seaFronts', value: nextSeaFronts }))
  }

  return (
    <Wrapper>
      <FiltersContainer>
        <TextInput
          Icon={Icon.Search}
          isLabelHidden
          isTransparent
          label="Rechercher dans les zones réglementaires"
          name="query"
          onChange={updateQuery}
          placeholder="Rechercher dans les zones réglementaires"
          style={{ width: '500px' }}
          value={filters.searchQuery}
        />
        <Select
          isCleanable={false}
          isLabelHidden
          isTransparent
          label="Grouper les zones réglementaires"
          name="regulatoryAreaControlPlan"
          onChange={updateGroupFilter}
          options={[
            { label: 'Grouper par plan de contrôle', value: 'CONTROL_PLAN' },
            { label: 'Grouper par façade', value: 'SEA_FRONT' }
          ]}
          placeholder="Grouper les zones réglementaires"
          style={{ flex: 1 }}
          value={filters.groupBy}
        />
      </FiltersContainer>
      <FiltersContainer>
        <RegulatoryThemesFilter onChange={updateThemesFilter} style={{ flex: 1 }} value={filters.themes ?? []} />
        <RegulatoryTagsFilter onChange={updateTagsFilter} style={{ flex: 1 }} value={filters.tags ?? []} />
        <CheckPicker
          isLabelHidden
          isTransparent
          label="Façade"
          name="seaFront"
          onChange={updateSeaFrontFilter}
          options={SEA_FRONT_OPTIONS ?? []}
          placeholder="Façade"
          renderValue={() => filters.seaFronts && <OptionValue>{`Façade (${filters.seaFronts.length})`}</OptionValue>}
          style={{ flex: 1 }}
          value={filters.seaFronts}
        />
      </FiltersContainer>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
`

const FiltersContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
`
