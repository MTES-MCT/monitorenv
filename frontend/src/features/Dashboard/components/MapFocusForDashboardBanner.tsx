import { useAppDispatch } from '@hooks/useAppDispatch'
import { LinkButton } from '@mtes-mct/monitor-ui'
import { restorePreviousDisplayedItems } from 'domain/shared_slices/Global'
import styled from 'styled-components'

import { dashboardActions } from '../slice'

export function MapFocusForDashboardBanner() {
  const dispatch = useAppDispatch()
  const disableDashboardMapFocus = () => {
    dispatch(dashboardActions.setMapFocus(false))
    dispatch(restorePreviousDisplayedItems())
  }

  return (
    <Container>
      <span>Un focus est activé sur l&apos;activité récente du brief ouvert dans la deuxième fenêtre.</span>
      <LinkButton onClick={disableDashboardMapFocus}>Désactiver le focus</LinkButton>
    </Container>
  )
}

const Container = styled.div`
  align-items: center;
  background-color: ${p => p.theme.color.gunMetal};
  display: flex;
  justify-content: center;
  height: 50px;
  position: absolute;
  width: 100%;
  z-index: 10;

  > * {
    color: ${p => p.theme.color.white};
    font-size: 16px;
  }
`
