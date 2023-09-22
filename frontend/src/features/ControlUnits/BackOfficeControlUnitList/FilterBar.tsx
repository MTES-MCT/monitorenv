import { Icon, TextInput } from '@mtes-mct/monitor-ui'
import { useCallback } from 'react'
import styled from 'styled-components'

import { backOfficeControlUnitListActions } from './slice'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'

export function FilterBar() {
  const dispatch = useAppDispatch()
  const backOfficeControlUnitList = useAppSelector(store => store.backOfficeControlUnitList)

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
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
`
