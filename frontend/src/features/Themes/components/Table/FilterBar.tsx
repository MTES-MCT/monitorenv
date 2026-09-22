import { themeTableActions } from '@features/Themes/components/Table/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Icon, Select, TextInput } from '@mtes-mct/monitor-ui'
import { useCallback } from 'react'
import styled from 'styled-components'

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
  const { query, validity } = useAppSelector(store => store.themeTable.filtersState)

  const updateQuery = useCallback(
    (nextValue: string | undefined) => {
      dispatch(themeTableActions.setFilter({ key: 'query', value: nextValue }))
    },
    [dispatch]
  )

  const updateValidity = useCallback(
    (nextValue: string | undefined) => {
      dispatch(themeTableActions.setFilter({ key: 'validity', value: nextValue }))
    },
    [dispatch]
  )

  return (
    <Wrapper>
      <TextInput
        Icon={Icon.Search}
        isLabelHidden
        isTransparent
        label="Rechercher dans les thématiques"
        name="query"
        onChange={updateQuery}
        placeholder="Rechercher dans les thématiques"
        style={{ width: '350px' }}
        value={query}
      />
      <Select
        isLabelHidden
        isTransparent
        label="Validité"
        name="validity"
        onChange={updateValidity}
        options={VALIDITY_AS_OPTIONS}
        style={{ width: '210px' }}
        value={validity}
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  gap: 8px;
`
