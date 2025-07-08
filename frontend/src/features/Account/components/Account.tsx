import { useGetCurrentUserAuthorizationQuery } from '@api/authorizationAPI'
import { StyledMapMenuDialogContainer } from '@components/style'
import { MenuWithCloseButton } from '@features/commonStyles/map/MenuWithCloseButton'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Button, Icon, MapMenuDialog, Size } from '@mtes-mct/monitor-ui'
import { globalActions } from 'domain/shared_slices/Global'

export function Account() {
  const dispatch = useAppDispatch()
  const isAccountVisible = useAppSelector(state => state.global.visibility.isAccountDialogVisible)
  const oidcEnabled = import.meta.env.FRONTEND_OIDC_ENABLED
  const { data: user } = useGetCurrentUserAuthorizationQuery()

  const toggle = () => {
    dispatch(globalActions.hideAllDialogs())
    dispatch(globalActions.setDisplayedItems({ visibility: { isAccountDialogVisible: !isAccountVisible } }))
  }
  const logout = () => {
    window.location.href =
      'http://localhost:8085/realms/monitor/protocol/openid-connect/logout?post_logout_redirect_uri=http://localhost:3000/login'
  }

  if (!oidcEnabled) {
    return null
  }

  return (
    <>
      {isAccountVisible && (
        <StyledMapMenuDialogContainer>
          <MapMenuDialog.Header>
            <MapMenuDialog.Title>Déconnexion</MapMenuDialog.Title>
          </MapMenuDialog.Header>

          {user && (
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
