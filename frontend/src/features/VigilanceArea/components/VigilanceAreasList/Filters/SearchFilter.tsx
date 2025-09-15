import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { TextInput, usePrevious } from '@mtes-mct/monitor-ui'
import { debounce } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import { vigilanceAreaFiltersActions } from './slice'

export function SearchFilter() {
  const dispatch = useAppDispatch()
  const searchQueryFilter = useAppSelector(state => state.vigilanceAreaFilters.searchQuery)
  const previousSearchQueryFilter = usePrevious(searchQueryFilter)
  const [searchText, setSearchText] = useState(searchQueryFilter)

  const onQuery = useCallback(
    (value: string | undefined) => {
      dispatch(vigilanceAreaFiltersActions.updateFilters({ key: 'searchQuery', value }))
    },
    [dispatch]
  )

  // when filters are reinitialzed, reset search text
  useEffect(() => {
    if (previousSearchQueryFilter && !searchQueryFilter) {
      setSearchText(undefined)
    }
  }, [searchQueryFilter, previousSearchQueryFilter])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandleChange = useCallback(debounce(onQuery, 500), [])

  return (
    <StyledSearch
      isLabelHidden
      isLight
      isSearchInput
      label="Rechercher dans les zones de vigilance"
      name="vigilance-area-search"
      onChange={value => {
        setSearchText(value)
        debouncedHandleChange(value)
      }}
      placeholder="Rechercher dans les zones de vigilance"
      value={searchText}
    />
  )
}

const StyledSearch = styled(TextInput)`
  border: 1px solid ${p => p.theme.color.lightGray};
  width: 320px;
`
