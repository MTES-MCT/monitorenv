import { useAppDispatch } from '@hooks/useAppDispatch'
import { LinkButton } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { dashboardActions } from '../slice'

export function MapFocusForDashboardBanner() {
  const dispatch = useAppDispatch()
  const disableDashboardMapFocus = () => {
    dispatch(dashboardActions.setMapFocus(false))
  }

  return (
    <Container>
      <span>Un focus est activé sur l&apos;activité récente du brief ouvert dans la deuxième fenêtre.</span>
      <LinkButton onClick={disableDashboardMapFocus}>Désactiver le focus</LinkButton>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${p => p.theme.color.gunMetal};
  z-index: 10;
  height: 50px;
  > * {
    color: ${p => p.theme.color.white};
    font-size: 16px;
  }
`
