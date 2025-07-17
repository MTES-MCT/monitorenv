import { StyledMapMenuDialogContainer } from '@components/style'
import { MenuWithCloseButton } from '@features/commonStyles/map/MenuWithCloseButton'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useGetCurrentUserAuthorizationQueryOverride } from '@hooks/useGetCurrentUserAuthorizationQueryOverride'
import { Accent, Button, Icon, MapMenuDialog, Size } from '@mtes-mct/monitor-ui'
import { globalActions } from 'domain/shared_slices/Global'

export function Account() {
  const dispatch = useAppDispatch()
  const isAccountVisible = useAppSelector(state => state.global.visibility.isAccountDialogVisible)

  const oidcEnabled = import.meta.env.FRONTEND_OIDC_ENABLED
  const isOidcEnabled = oidcEnabled === 'true'

  const { data: user } = useGetCurrentUserAuthorizationQueryOverride()
  const toggle = () => {
    dispatch(globalActions.hideAllDialogs())
    dispatch(globalActions.setDisplayedItems({ visibility: { isAccountDialogVisible: !isAccountVisible } }))
  }
  const logout = () => {
    window.location.href = '/logout'
  }

  if (!isOidcEnabled) {
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
