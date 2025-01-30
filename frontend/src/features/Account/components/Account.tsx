import { StyledMapMenuDialogContainer } from '@components/style'
import { MenuWithCloseButton } from '@features/commonStyles/map/MenuWithCloseButton'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Button, Icon, MapMenuDialog, Size } from '@mtes-mct/monitor-ui'
import { getOIDCConfig } from 'auth/getOIDCConfig'
import { globalActions } from 'domain/shared_slices/Global'
import { useAuth } from 'react-oidc-context'

export function Account() {
  const dispatch = useAppDispatch()
  const isAccountVisible = useAppSelector(state => state.global.visibility.isAccountDialogVisible)
  const auth = useAuth()

  const oidcConfig = getOIDCConfig()

  const logout = () => {
    auth.signoutRedirect()
  }
  const toggle = () => {
    dispatch(globalActions.hideSideButtons())
    dispatch(globalActions.setDisplayedItems({ visibility: { isAccountDialogVisible: !isAccountVisible } }))
  }

  if (!oidcConfig.IS_OIDC_ENABLED) {
    return null
  }

  return (
    <>
      {isAccountVisible && (
        <StyledMapMenuDialogContainer>
          <MapMenuDialog.Header>
            <MapMenuDialog.Title>Déconnexion</MapMenuDialog.Title>
          </MapMenuDialog.Header>
          <MapMenuDialog.Body>
            {auth?.user?.profile.email ?? 'Vous n’êtes pas connecté avec Cerbère'}
          </MapMenuDialog.Body>
          {auth?.user?.profile.email && (
            <MapMenuDialog.Footer>
              <Button accent={Accent.SECONDARY} Icon={Icon.Logout} isFullWidth onClick={logout}>
                Se déconnecter
              </Button>
            </MapMenuDialog.Footer>
          )}
        </StyledMapMenuDialogContainer>
      )}

      <MenuWithCloseButton.ButtonOnMap
        className={isAccountVisible ? '_active' : undefined}
        data-cy="account-button"
        Icon={Icon.Account}
        onClick={toggle}
        size={Size.LARGE}
        title="Mon compte"
      />
    </>
  )
}
