import { saveDashboard } from '@features/Dashboard/useCases/saveDashboard'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Button, Icon } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import type { Dashboard } from '@features/Dashboard/types'

export function Footer() {
  const dispatch = useAppDispatch()
  const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)
  const dashboardForm = useAppSelector(state =>
    activeDashboardId ? state.dashboard.dashboards[activeDashboardId] : undefined
  )
  if (!dashboardForm) {
    return null
  }
  const dashboardToSave: Dashboard.DashboardToApi = {
    ...dashboardForm.dashboard,
    id: dashboardForm.dashboard.id?.includes('new-') ? undefined : dashboardForm.dashboard.id,
    reportings: dashboardForm.dashboard.reportings.map(reporting => +reporting.id)
  }

  return (
    <Wrapper>
      <SaveButton
        accent={Accent.SECONDARY}
        disabled={!activeDashboardId}
        Icon={Icon.Save}
        onClick={() => dispatch(saveDashboard(dashboardToSave))}
      >
        Enregistrer le tableau
      </SaveButton>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background-color: ${p => p.theme.color.white};
  box-shadow: 0pc 3px 6px #00000029;
  padding: 16px 24px;

  position: sticky;
  bottom: 0;
`

const SaveButton = styled(Button)`
  float: right;
`
