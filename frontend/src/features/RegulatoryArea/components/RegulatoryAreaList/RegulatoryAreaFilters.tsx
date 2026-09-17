import { RegulatoryTagsFilter } from '@components/RegulatoryTagsFilter'
import { RegulatoryThemesFilter } from '@components/RegulatoryThemesFilter'
import { ResetButton } from '@features/commonComponents/ResetButton'
import { OptionValue } from '@features/Reportings/Filters/style'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { CheckPicker, type DateAsStringRange, DateRangePicker, Select, Size, TextInput } from '@mtes-mct/monitor-ui'
import { debounce } from 'lodash'
import { useCallback, useState } from 'react'
import styled from 'styled-components'

import { regulatoryAreaTableActions } from './slice'
import { useGetSeaFrontsQuery } from '../../../../api/seaFrontsAPI'

import type { TagOption } from 'domain/entities/tags'
import type { ThemeOption } from 'domain/entities/themes'

export function RegulatoryAreaFilters() {
  const dispatch = useAppDispatch()

  const filters = useAppSelector(store => store.regulatoryAreaTable.filtersState)

  const hasFilters = !!(
    (filters?.tags && filters?.tags.length > 0) ||
    (filters?.themes && filters?.themes.length > 0) ||
    (filters?.seaFronts && filters?.seaFronts.length > 0) ||
    filters?.searchQuery ||
    filters?.regHelper ||
    filters?.period
  )

  const { data } = useGetSeaFrontsQuery()
  const seaFrontsAsOptions = data
    ?.map(facade => ({ label: facade, value: facade }))
    .sort((a, b) => a.label.localeCompare(b.label))

  const groupByOptions: { label: string; value: 'CONTROL_PLAN' | 'SEA_FRONT' }[] = [
    { label: 'Grouper par plan de contrôle', value: 'CONTROL_PLAN' },
    { label: 'Grouper par façade', value: 'SEA_FRONT' }
  ]

  const sortByOptions: { label: string; value: 'ALPHA_ASC' | 'CREATE_ASC' | 'CREATE_DESC' }[] = [
    { label: 'Ordre alphabétique (croissant)', value: 'ALPHA_ASC' },
    { label: 'Création / modif. (croissant)', value: 'CREATE_ASC' },
    { label: 'Création / modif. (décroissant)', value: 'CREATE_DESC' }
  ]

  const lastModificationOptions: { label: string; value: '1_MONTH' | '6_MONTHS' | 'ONE_YEAR' | 'CUSTOM' }[] = [
    { label: 'Il y a plus d’un mois', value: '1_MONTH' },
    { label: 'Il y a plus de 6 mois', value: '6_MONTHS' },
    { label: 'Il y a plus d’un an', value: 'ONE_YEAR' },
    { label: 'Période spécifique', value: 'CUSTOM' }
  ]

  const regHelperOptions: { label: string; value: 'WITHOUT_THEME' | 'WITHOUT_TAG' | 'OUTDATED' }[] = [
    { label: 'Reg. sans thématique associée', value: 'WITHOUT_THEME' },
    { label: 'Reg. sans tag associée', value: 'WITHOUT_TAG' },
    { label: 'Reg. dont la date de validité est dépassée', value: 'OUTDATED' }
  ]

  const [searchQuery, setSearchQuery] = useState(filters.searchQuery)

  const onQuery = (nextQuery: string | undefined) => {
    dispatch(regulatoryAreaTableActions.setFilter({ key: 'searchQuery', value: nextQuery }))
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandleChange = useCallback(debounce(onQuery, 500), [])

  const updateGroupFilter = (nextValue: 'CONTROL_PLAN' | 'SEA_FRONT' | undefined) => {
    if (!nextValue) {
      return
    }
    dispatch(regulatoryAreaTableActions.setFilter({ key: 'groupBy', value: nextValue }))
  }

  const updateSortByFilter = (nextValue: 'ALPHA_ASC' | 'CREATE_ASC' | 'CREATE_DESC' | undefined) => {
    dispatch(regulatoryAreaTableActions.setFilter({ key: 'sortBy', value: nextValue }))
  }

  const updatePeriodFilter = (nextValue: string | undefined) => {
    dispatch(regulatoryAreaTableActions.setFilter({ key: 'to', value: undefined }))
    dispatch(regulatoryAreaTableActions.setFilter({ key: 'from', value: undefined }))
    dispatch(regulatoryAreaTableActions.setFilter({ key: 'period', value: nextValue }))
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

  const updateRegHelperFilter = (nextValue: 'WITHOUT_THEME' | 'WITHOUT_TAG' | 'OUTDATED' | undefined) => {
    dispatch(regulatoryAreaTableActions.setFilter({ key: 'regHelper', value: nextValue }))
  }

  const updateDateRangeFilter = useCallback(
    (date: DateAsStringRange | undefined) => {
      // Inverted from and to because filter is from last modification
      dispatch(
        regulatoryAreaTableActions.setFilter({
          key: 'from',
          value: date?.[1] ? date[1] : undefined
        })
      )
      dispatch(
        regulatoryAreaTableActions.setFilter({
          key: 'to',
          value: date?.[0] ? date[0] : undefined
        })
      )
    },
    [dispatch]
  )

  const resetFilters = () => {
    dispatch(regulatoryAreaTableActions.resetFilters())
  }

  return (
    <Wrapper>
      <FiltersContainer>
        <TextInput
          isLabelHidden
          isSearchInput
          isTransparent
          label="Rechercher dans les zones réglementaires"
          name="query"
          onChange={nextQuery => {
            setSearchQuery(nextQuery)
            debouncedHandleChange(nextQuery)
          }}
          placeholder="Rechercher dans les zones réglementaires"
          size={Size.LARGE}
          style={{ width: '100%' }}
          value={searchQuery}
        />
      </FiltersContainer>
      <FiltersContainer>
        <Select
          isCleanable={false}
          isLabelHidden
          isTransparent
          label="Grouper les zones réglementaires"
          name="regulatoryAreaControlPlan"
          onChange={updateGroupFilter}
          options={groupByOptions}
          placeholder="Grouper par"
          style={{ flex: 4 }}
          value={filters.groupBy}
        />
        <Select
          isCleanable
          isLabelHidden
          isTransparent
          label="Trier les zones réglementaires"
          name="sortByFilter"
          onChange={updateSortByFilter}
          options={sortByOptions}
          placeholder="Trier par"
          style={{ flex: 4 }}
          value={filters.sortBy}
        />
        <Select
          isCleanable
          isLabelHidden
          isTransparent
          label="Dernière modification"
          name="periodFilter"
          onChange={updatePeriodFilter}
          options={lastModificationOptions}
          placeholder="Dernière modification"
          style={{ flex: 3 }}
          value={filters.period}
        />
      </FiltersContainer>
      <FiltersContainer>
        <RegulatoryThemesFilter onChange={updateThemesFilter} style={{ flex: 4 }} value={filters.themes ?? []} />
        <RegulatoryTagsFilter onChange={updateTagsFilter} style={{ flex: 4 }} value={filters.tags ?? []} />
        <CheckPicker
          isLabelHidden
          isTransparent
          label="Façade"
          name="seaFront"
          onChange={updateSeaFrontFilter}
          options={seaFrontsAsOptions ?? []}
          placeholder="Façade"
          renderValue={() => filters.seaFronts && <OptionValue>{`Façade (${filters.seaFronts.length})`}</OptionValue>}
          style={{ flex: 3 }}
          value={filters.seaFronts}
        />
      </FiltersContainer>
      <FiltersContainer>
        <Select
          isCleanable
          isLabelHidden
          isTransparent
          label="Aide à la gestion des réglementations"
          name="regHelperFilter"
          onChange={updateRegHelperFilter}
          options={regHelperOptions}
          placeholder="Aide à la gestion des réglementations"
          style={{ width: '100%' }}
          value={filters.regHelper}
        />
        {filters.period === 'CUSTOM' && (
          <DateRangePicker
            defaultValue={filters.from && filters.to ? [new Date(filters.from), new Date(filters.to)] : undefined}
            isStringDate
            label="Période spécifique"
            name="filterDateRange"
            onChange={updateDateRangeFilter}
          />
        )}
      </FiltersContainer>
      {hasFilters && <ResetButton onClick={resetFilters} />}
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
  gap: 12px;
  flex-wrap: wrap;
`
