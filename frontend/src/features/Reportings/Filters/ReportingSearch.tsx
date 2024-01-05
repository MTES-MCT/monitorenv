import { Icon, Size, TextInput } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { ReportingsFiltersEnum, reportingsFiltersActions } from '../../../domain/shared_slices/ReportingsFilters'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'

export function ReportingSearch() {
  const dispatch = useAppDispatch()
  const searchFilter = useAppSelector(state => state.reportingFilters.searchFilter)

  const onQuery = value => {
    dispatch(reportingsFiltersActions.updateFilters({ key: ReportingsFiltersEnum.SEARCH_FILTER, value }))
  }

  return (
    <StyledSearch
      Icon={Icon.Search}
      isLabelHidden
      isLight
      label="Rechercher une cible"
      name="reporting-search"
      onChange={onQuery}
      placeholder="Rechercher une cible"
      size={Size.LARGE}
      value={searchFilter}
    />
  )
}

const StyledSearch = styled(TextInput)`
  border: 1px solid ${p => p.theme.color.lightGray};
  width: 280px;
`
