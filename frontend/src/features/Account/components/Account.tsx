import { MenuWithCloseButton } from '@features/commonStyles/map/MenuWithCloseButton'
import { ButtonWrapper } from '@features/MainWindow/components/RightMenu/ButtonWrapper'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Button, Icon, MapMenuDialog, Size } from '@mtes-mct/monitor-ui'
import { globalActions } from 'domain/shared_slices/Global'
import { useContext } from 'react'
import styled from 'styled-components'

import { UserAccountContext } from '../../../context/UserAccountContext'

const MARGIN_TOP = 388

export function Account() {
  const dispatch = useAppDispatch()
  const userAccount = useContext(UserAccountContext)
  const isAccountVisible = useAppSelector(state => state.global.isAccountDialogVisible)

  const toggle = () => {
    dispatch(globalActions.hideSideButtons())
    dispatch(globalActions.setDisplayedItems({ isAccountDialogVisible: !isAccountVisible }))
  }

  return (
    <ButtonWrapper topPosition={MARGIN_TOP}>
      {isAccountVisible && (
        <StyledContainer>
          <MapMenuDialog.Header>
            <MapMenuDialog.Title>Déconnexion</MapMenuDialog.Title>
          </MapMenuDialog.Header>
          <MapMenuDialog.Body>{userAccount.email ?? 'Vous n’êtes pas connecté avec Cerbère'}</MapMenuDialog.Body>
          {userAccount.email && (
            <MapMenuDialog.Footer>
              <Button accent={Accent.SECONDARY} Icon={Icon.Logout} isFullWidth onClick={userAccount.logout}>
                Se déconnecter
              </Button>
            </MapMenuDialog.Footer>
          )}
        </StyledContainer>
      )}

      <MenuWithCloseButton.ButtonOnMap
        className={isAccountVisible ? '_active' : undefined}
        data-cy="account-button"
        Icon={Icon.Account}
        onClick={toggle}
        size={Size.LARGE}
        title="Mon compte"
      />
    </ButtonWrapper>
  )
}

const StyledContainer = styled(MapMenuDialog.Container)`
  margin-right: unset;
`
