import { Icon, Select, TextInput, getOptionsFromIdAndName } from '@mtes-mct/monitor-ui'
import { useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { backOfficeControlUnitListActions } from './slice'
import { useGetAdministrationsQuery } from '../../../api/administrationsAPI'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'

export function FilterBar() {
  const dispatch = useAppDispatch()
  const backOfficeControlUnitList = useAppSelector(store => store.backOfficeControlUnitList)
  const { data: administrations } = useGetAdministrationsQuery()

  const administrationsAsOptions = useMemo(() => getOptionsFromIdAndName(administrations), [administrations])

  const updateAdministrationId = useCallback(
    (nextValue: number | undefined) => {
      dispatch(backOfficeControlUnitListActions.setFilter({ key: 'administrationId', value: nextValue }))
    },
    [dispatch]
  )

  const updateQuery = useCallback(
    (nextValue: string | undefined) => {
      dispatch(backOfficeControlUnitListActions.setFilter({ key: 'query', value: nextValue }))
    },
    [dispatch]
  )

  return (
    <Wrapper>
      <TextInput
        Icon={Icon.Search}
        isLabelHidden
        label="Rechercher..."
        name="query"
        onChange={updateQuery}
        placeholder="Rechercher..."
        value={backOfficeControlUnitList.filtersState.query}
      />
      {administrationsAsOptions && (
        <Select
          isLabelHidden
          label="Administration"
          name="administrationId"
          onChange={updateAdministrationId}
          options={administrationsAsOptions}
          placeholder="Administration"
          searchable
          value={backOfficeControlUnitList.filtersState.administrationId}
        />
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;

  > .Element-Field:not(:first-child) {
    margin-left: 24px;
    width: 240px;
  }
`
