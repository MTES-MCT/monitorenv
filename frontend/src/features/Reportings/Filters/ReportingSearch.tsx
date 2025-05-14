import { TextInput, usePrevious } from '@mtes-mct/monitor-ui'
import { debounce } from 'lodash-es'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import { reportingsFiltersActions, ReportingsFiltersEnum } from './slice'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'

export function ReportingSearch() {
  const dispatch = useAppDispatch()
  const searchQueryFilter = useAppSelector(state => state.reportingFilters.searchQueryFilter)
  const previousSearchQueryFilter = usePrevious(searchQueryFilter)
  const [searchText, setSearchText] = useState(searchQueryFilter)

  const onQuery = useCallback(
    (value: string | undefined) => {
      dispatch(reportingsFiltersActions.updateFilters({ key: ReportingsFiltersEnum.SEARCH_QUERY_FILTER, value }))
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
      label="Rechercher une cible"
      name="reporting-search"
      onChange={value => {
        setSearchText(value)
        debouncedHandleChange(value)
      }}
      placeholder="Rechercher une cible"
      value={searchText}
    />
  )
}

const StyledSearch = styled(TextInput)`
  border: 1px solid ${p => p.theme.color.lightGray};
  width: 280px;
`
