import { tagTableActions } from '@features/Tags/components/Table/slice'
import { Icon, Select, TextInput } from '@mtes-mct/monitor-ui'
import { useCallback } from 'react'
import styled from 'styled-components'

import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'

const VALIDITY_AS_OPTIONS = [
  {
    label: 'En cours de validité',
    value: 'IN_PROGRESS'
  },
  {
    label: 'Fin de validité dépassée',
    value: 'OUTDATED'
  }
]

export function FilterBar() {
  const dispatch = useAppDispatch()
  const stationTable = useAppSelector(store => store.stationTable)

  const updateQuery = useCallback(
    (nextValue: string | undefined) => {
      dispatch(tagTableActions.setFilter({ key: 'query', value: nextValue }))
    },
    [dispatch]
  )

  return (
    <Wrapper>
      <TextInput
        Icon={Icon.Search}
        isLabelHidden
        isTransparent
        label="Rechercher..."
        name="query"
        onChange={updateQuery}
        placeholder="Rechercher..."
        style={{ width: '350px' }}
        value={stationTable.filtersState.query}
      />
      <Select
        isLabelHidden
        isTransparent
        label="Validité"
        name="validity"
        options={VALIDITY_AS_OPTIONS}
        style={{ width: '170px' }}
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  gap: 8px;
`
