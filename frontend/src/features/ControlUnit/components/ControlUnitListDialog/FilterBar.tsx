import {
  ControlUnit,
  CustomSearch,
  Field,
  Icon,
  MultiCheckbox,
  Select,
  Size,
  TextInput,
  getOptionsFromIdAndName,
  getOptionsFromLabelledEnum
} from '@mtes-mct/monitor-ui'
import { useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { controlUnitListDialogActions } from './slice'
import { useGetAdministrationsQuery } from '../../../../api/administrationsAPI'
import { RTK_DEFAULT_QUERY_OPTIONS } from '../../../../api/constants'
import { useGetStationsQuery } from '../../../../api/stationsAPI'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { isNotArchived } from '../../../../utils/isNotArchived'

export function FilterBar() {
  const dispatch = useAppDispatch()
  const mapControlUnitListDialog = useAppSelector(store => store.mapControlUnitListDialog)
  const { data: administrations } = useGetAdministrationsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)
  const { data: bases } = useGetStationsQuery(undefined, RTK_DEFAULT_QUERY_OPTIONS)

  const administrationsAsOptions = useMemo(
    () => getOptionsFromIdAndName((administrations ?? []).filter(isNotArchived)),
    [administrations]
  )
  const basesAsOptions = useMemo(() => getOptionsFromIdAndName(bases), [bases])
  const categoriesAsOptions = useMemo(
    () => getOptionsFromLabelledEnum(ControlUnit.ControlUnitResourceCategoryLabel),
    []
  )
  const typesAsOptions = useMemo(() => getOptionsFromLabelledEnum(ControlUnit.ControlUnitResourceTypeLabel), [])

  const updateAdministrationId = useCallback(
    (nextValue: number | undefined) => {
      dispatch(controlUnitListDialogActions.setFilter({ key: 'administrationId', value: nextValue }))
    },
    [dispatch]
  )

  const updateBaseId = useCallback(
    (nextValue: number | undefined) => {
      dispatch(controlUnitListDialogActions.setFilter({ key: 'stationId', value: nextValue }))
    },
    [dispatch]
  )

  const updateCategory = useCallback(
    (nextValue: ControlUnit.ControlUnitResourceCategory[] | undefined) => {
      dispatch(controlUnitListDialogActions.setFilter({ key: 'categories', value: nextValue }))
    },
    [dispatch]
  )

  const updateQuery = useCallback(
    (nextValue: string | undefined) => {
      dispatch(controlUnitListDialogActions.setFilter({ key: 'query', value: nextValue }))
    },
    [dispatch]
  )

  const updateType = useCallback(
    (nextValue: string | undefined) => {
      dispatch(controlUnitListDialogActions.setFilter({ key: 'type', value: nextValue }))
    },
    [dispatch]
  )

  const administrationCustomSearch = new CustomSearch(structuredClone(administrationsAsOptions ?? []), ['label'], {
    cacheKey: 'CONTROL_UNIT_FILTERS_ADMINISTRATIONS',
    isStrict: true,
    withCacheInvalidation: true
  })

  const typeCustomSearch = new CustomSearch(structuredClone(typesAsOptions ?? []), ['label'], {
    cacheKey: 'CONTROL_UNIT_FILTERS_TYPES',
    isStrict: true,
    withCacheInvalidation: true
  })

  const baseCustomSearch = new CustomSearch(structuredClone(basesAsOptions ?? []), ['label'], {
    cacheKey: 'CONTROL_UNIT_FILTERS_BASES',
    isStrict: true,
    withCacheInvalidation: true
  })

  if (!administrationsAsOptions || !basesAsOptions) {
    return <p>Chargement en cours...</p>
  }

  return (
    <Wrapper>
      <TextInput
        Icon={Icon.Search}
        isLabelHidden
        isTransparent
        label="Rechercher une unité"
        name="query"
        onChange={updateQuery}
        placeholder="Rechercher une unité"
        size={Size.LARGE}
        value={mapControlUnitListDialog.filtersState.query}
      />
      <Select
        key={String(administrationsAsOptions.length)}
        customSearch={administrationCustomSearch}
        isLabelHidden
        isTransparent
        label="Administration"
        name="administrationId"
        onChange={updateAdministrationId}
        options={administrationsAsOptions}
        placeholder="Administration"
        searchable
        value={mapControlUnitListDialog.filtersState.administrationId}
      />
      <Select
        key={String(typesAsOptions.length)}
        customSearch={typeCustomSearch}
        isLabelHidden
        isTransparent
        label="Type de moyen"
        name="type"
        onChange={updateType}
        options={typesAsOptions}
        placeholder="Type de moyen"
        searchable
        value={mapControlUnitListDialog.filtersState.type}
      />
      <Select
        key={String(basesAsOptions.length)}
        customSearch={baseCustomSearch}
        isLabelHidden
        isTransparent
        label="Base du moyen"
        name="stationId"
        onChange={updateBaseId}
        options={basesAsOptions}
        placeholder="Base du moyen"
        searchable
        value={mapControlUnitListDialog.filtersState.stationId}
      />
      <Field>
        <MultiCheckbox
          isInline
          isLabelHidden
          label="Catégorie de moyen"
          name="category"
          onChange={updateCategory}
          options={categoriesAsOptions}
          value={mapControlUnitListDialog.filtersState.categories}
        />
      </Field>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  margin-bottom: 32px;

  > .Element-Field {
    &:first-child {
      margin-bottom: 8px;
    }

    &:not(:first-child) {
      margin-top: 8px;
    }
  }
`
