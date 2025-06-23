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
  const visibilityOptions = getOptionsFromLabelledEnum(VigilanceArea.VisibilityLabel)

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
      {visibilityOptions.map(visibilityOption => (
        <StyledCheckbox
          key={visibilityOption.label}
          checked={vigilanceAreaFilters?.visibility?.includes(visibilityOption.value as VigilanceArea.Visibility)}
          inline
          label={visibilityOption.label}
          name={visibilityOption.label}
          onChange={isChecked => setVisibilityFilter(visibilityOption, isChecked)}
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
