import { missionTagTableActions } from '@features/MissionTags/components/Table/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Icon, Select, TextInput } from '@mtes-mct/monitor-ui'
import { useCallback } from 'react'
import styled from 'styled-components'

export type StatusValue = 'ACTIVE' | 'ARCHIVED'
const STATUS_AS_OPTIONS: { label: string; value: StatusValue }[] = [
  {
    label: 'Actifs',
    value: 'ACTIVE'
  },
  {
    label: 'Archivés',
    value: 'ARCHIVED'
  }
]

export function FilterBar() {
  const dispatch = useAppDispatch()
  const { query, status } = useAppSelector(store => store.missionTagTable.filtersState)

  const updateQuery = useCallback(
    (nextValue: string | undefined) => {
      dispatch(missionTagTableActions.setFilter({ key: 'query', value: nextValue }))
    },
    [dispatch]
  )

  const updateStatus = useCallback(
    (nextValue: string | undefined) => {
      dispatch(missionTagTableActions.setFilter({ key: 'status', value: nextValue }))
    },
    [dispatch]
  )

  return (
    <Wrapper>
      <TextInput
        Icon={Icon.Search}
        isLabelHidden
        isTransparent
        label="Rechercher dans les étiquettes de mission"
        name="query"
        onChange={updateQuery}
        placeholder="Rechercher dans les étiquettes de mission"
        style={{ width: '350px' }}
        value={query}
      />
      <Select
        isLabelHidden
        isTransparent
        label="Rechercher par statut"
        name="status"
        onChange={updateStatus}
        options={STATUS_AS_OPTIONS}
        style={{ width: '210px' }}
        value={status}
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  gap: 8px;
`
