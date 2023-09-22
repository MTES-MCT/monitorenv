import { Icon, TextInput } from '@mtes-mct/monitor-ui'
import { useCallback } from 'react'
import styled from 'styled-components'

import { backOfficeAdministrationListActions } from './slice'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'

export function FilterBar() {
  const dispatch = useAppDispatch()
  const backOfficeAdministrationList = useAppSelector(store => store.backOfficeAdministrationList)

  const updateQuery = useCallback(
    (nextValue: string | undefined) => {
      dispatch(backOfficeAdministrationListActions.setFilter({ key: 'query', value: nextValue }))
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
        value={backOfficeAdministrationList.filtersState.query}
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
`
