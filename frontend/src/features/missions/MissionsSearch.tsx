import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Size, TextInput, usePrevious } from '@mtes-mct/monitor-ui'
import { MissionFiltersEnum, updateFilters } from 'domain/shared_slices/MissionFilters'
import { debounce } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

export function MissionSearch() {
  const dispatch = useAppDispatch()
  const searchQuery = useAppSelector(state => state.missionFilters.searchQuery)
  const previousSearchQuery = usePrevious(searchQuery)
  const [searchText, setSearchText] = useState(searchQuery)

  const onQuery = useCallback(
    value => {
      if (value && value.length > 2) {
        dispatch(updateFilters({ key: MissionFiltersEnum.SEARCH_QUERY_FILTER, value }))
      } else {
        dispatch(updateFilters({ key: MissionFiltersEnum.SEARCH_QUERY_FILTER, value: undefined }))
      }
    },
    [dispatch]
  )

  // when filters are reinitialzed, reset search text
  useEffect(() => {
    if (previousSearchQuery && !searchQuery) {
      setSearchText(undefined)
    }
  }, [searchQuery, previousSearchQuery])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandleChange = useCallback(debounce(onQuery, 500), [])

  return (
    <StyledSearch
      isLabelHidden
      isLight
      isSearchInput
      label="Rechercher dans un contrôle (navire, personne morale ou physique)"
      name="mission-search"
      onChange={value => {
        setSearchText(value)
        debouncedHandleChange(value)
      }}
      placeholder="Rechercher dans un contrôle (navire, personne morale ou physique)"
      size={Size.LARGE}
      value={searchText}
    />
  )
}

const StyledSearch = styled(TextInput)`
  border: 1px solid ${p => p.theme.color.lightGray};
  width: 280px;
`
