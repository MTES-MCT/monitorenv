import { setGlobalSearchText } from '@features/layersSelector/search/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Size, TextInput } from '@mtes-mct/monitor-ui'
import { useCallback } from 'react'
import styled from 'styled-components'

export function SearchFilter() {
  const dispatch = useAppDispatch()
  const searchQueryFilter = useAppSelector(state => state.layerSearch.globalSearchText)

  const onQuery = useCallback(
    (value: string | undefined) => {
      dispatch(setGlobalSearchText(value ?? ''))
    },
    [dispatch]
  )

  return (
    <StyledSearch
      isLabelHidden
      isLight
      isSearchInput
      label="Rechercher dans les zones de vigilance"
      name="vigilance-area-search"
      onChange={onQuery}
      placeholder="Rechercher dans les zones de vigilance"
      size={Size.LARGE}
      value={searchQueryFilter}
    />
  )
}

const StyledSearch = styled(TextInput)`
  border: 1px solid ${p => p.theme.color.lightGray};
  width: 330px;
`
