import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Checkbox, getOptionsFromLabelledEnum, type Option } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { dashboardFiltersActions, getVigilanceAreaFilters } from '../slice'

export function Filters() {
  const dispatch = useAppDispatch()
  const dashboardId = useAppSelector(state => state.dashboard.activeDashboardId)

  const vigilanceAreaFilters = useAppSelector(state => getVigilanceAreaFilters(state.dashboardFilters, dashboardId))
  const statusOptions = getOptionsFromLabelledEnum(VigilanceArea.VisibilityLabel)

  const setVisibilityFilter = (visibilityOption: Option<string>, isChecked: boolean | undefined) => {
    if (isChecked) {
      const currentVisibilityFilter = vigilanceAreaFilters?.visibility || []
      dispatch(
        dashboardFiltersActions.setVigilanceAreaFilters({
          filters: { visibility: [...currentVisibilityFilter, visibilityOption.value as VigilanceArea.Visibility] },
          id: dashboardId
        })
      )
    } else {
      dispatch(
        dashboardFiltersActions.setVigilanceAreaFilters({
          filters: {
            visibility:
              vigilanceAreaFilters?.visibility?.filter(
                visibility => visibility !== (visibilityOption.value as VigilanceArea.Visibility)
              ) ?? []
          },
          id: dashboardId
        })
      )
    }
  }

  return (
    <Wrapper>
      {statusOptions.map(statusOption => (
        <StyledCheckbox
          key={statusOption.label}
          checked={vigilanceAreaFilters?.visibility?.includes(statusOption.value as VigilanceArea.Visibility)}
          inline
          label={statusOption.label}
          name={statusOption.label}
          onChange={isChecked => setVisibilityFilter(statusOption, isChecked)}
        />
      ))}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  padding: 16px 24px;
`
const StyledCheckbox = styled(Checkbox)`
  justify-content: center;
`
