import { saveDashboard } from '@features/Dashboard/useCases/saveDashboard'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Button, Icon } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export function Footer() {
  const dispatch = useAppDispatch()
  const activeDashboardId = useAppSelector(state => state.dashboard.activeDashboardId)
  const dashboardForm = useAppSelector(state =>
    activeDashboardId ? state.dashboard.dashboards[activeDashboardId] : undefined
  )
  if (!dashboardForm) {
    return null
  }

  return (
    <Wrapper>
      <SaveButton
        accent={Accent.SECONDARY}
        disabled={!activeDashboardId}
        Icon={Icon.Save}
        onClick={() => dispatch(saveDashboard(dashboardForm.dashboard))}
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
