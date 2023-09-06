import {
  Icon,
  Select,
  Size,
  TextInput,
  getOptionsFromIdAndName,
  getOptionsFromLabelledEnum
} from '@mtes-mct/monitor-ui'
import { useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { mapControlUnitListDialogActions } from './slice'
import { useGetAdministrationsQuery } from '../../../api/administrationsAPI'
import { useGetBasesQuery } from '../../../api/basesAPI'
import { ControlUnit } from '../../../domain/entities/controlUnit'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'

export function FilterBar() {
  const dispatch = useAppDispatch()
  const mapControlUnitListDialog = useAppSelector(store => store.mapControlUnitListDialog)
  const { data: administrations } = useGetAdministrationsQuery()
  const { data: bases } = useGetBasesQuery()

  const administrationsAsOptions = useMemo(() => getOptionsFromIdAndName(administrations), [administrations])
  const basesAsOptions = useMemo(() => getOptionsFromIdAndName(bases), [bases])
  const typesAsOptions = useMemo(() => getOptionsFromLabelledEnum(ControlUnit.ControlUnitResourceType), [])

  const updateAdministrationId = useCallback(
    (nextValue: number | undefined) => {
      dispatch(mapControlUnitListDialogActions.setFilter({ key: 'administrationId', value: nextValue }))
    },
    [dispatch]
  )

  const updateBaseId = useCallback(
    (nextValue: number | undefined) => {
      dispatch(mapControlUnitListDialogActions.setFilter({ key: 'baseId', value: nextValue }))
    },
    [dispatch]
  )

  const updateQuery = useCallback(
    (nextValue: string | undefined) => {
      dispatch(mapControlUnitListDialogActions.setFilter({ key: 'query', value: nextValue }))
    },
    [dispatch]
  )

  const updateType = useCallback(
    (nextValue: string | undefined) => {
      dispatch(mapControlUnitListDialogActions.setFilter({ key: 'type', value: nextValue }))
    },
    [dispatch]
  )

  if (!administrationsAsOptions || !basesAsOptions) {
    return <p>Chargement en cours...</p>
  }

  return (
    <Wrapper>
      <TextInput
        Icon={Icon.Search}
        isLabelHidden
        isLight
        label="Rechercher une unité"
        name="query"
        onChange={updateQuery}
        placeholder="Rechercher une unité"
        size={Size.LARGE}
        value={mapControlUnitListDialog.filtersState.query}
      />
      <Select
        isLabelHidden
        isLight
        label="Administration"
        name="administrationId"
        onChange={updateAdministrationId}
        options={administrationsAsOptions}
        placeholder="Administration"
        searchable
        value={mapControlUnitListDialog.filtersState.administrationId}
      />
      <Select
        isLabelHidden
        isLight
        label="Type de moyen"
        name="type"
        onChange={updateType}
        options={typesAsOptions}
        placeholder="Type de moyen"
        searchable
        value={mapControlUnitListDialog.filtersState.type}
      />
      <Select
        isLabelHidden
        isLight
        label="Base du moyen"
        name="baseId"
        onChange={updateBaseId}
        options={basesAsOptions}
        placeholder="Base du moyen"
        searchable
        value={mapControlUnitListDialog.filtersState.baseId}
      />
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
