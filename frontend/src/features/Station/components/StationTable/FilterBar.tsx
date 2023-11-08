import { Icon, TextInput } from '@mtes-mct/monitor-ui'
import { useCallback } from 'react'
import styled from 'styled-components'

import { stationTableActions } from './slice'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'

export function FilterBar() {
  const dispatch = useAppDispatch()
  const stationTable = useAppSelector(store => store.stationTable)

  const updateQuery = useCallback(
    (nextValue: string | undefined) => {
      dispatch(stationTableActions.setFilter({ key: 'query', value: nextValue }))
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
        value={stationTable.filtersState.query}
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
`
