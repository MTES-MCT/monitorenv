import { useGetCurrentUserAuthorizationQueryOverride } from '@hooks/useGetCurrentUserAuthorizationQueryOverride'
import { Button } from '@mtes-mct/monitor-ui'
import { getOIDCConfig } from 'auth/getOIDCConfig'
import { paths } from 'paths'
import { useAuth } from 'react-oidc-context'
import { Navigate } from 'react-router'
import styled from 'styled-components'
import { LoadingSpinnerWall } from 'ui/LoadingSpinnerWall'

export function Login() {
  const oidcConfig = getOIDCConfig()
  const auth = useAuth()
  const { data: user, isSuccess } = useGetCurrentUserAuthorizationQueryOverride({
    skip: !auth?.isAuthenticated
  })

  const logout = () => {
    auth.removeUser()
    auth.signoutRedirect()
  }

  if (!oidcConfig.IS_OIDC_ENABLED) {
    return <div>OIDC is disabled</div>
  }

  if (auth?.isAuthenticated && isSuccess && user?.isSuperUser) {
    return <Navigate to={paths.home} />
  }

  if (auth?.isAuthenticated && isSuccess && !user?.isSuperUser) {
    return <Navigate to={paths.ext} />
  }

  if (!auth) {
    return <div>Contexte d authentification absent</div>
  }
  switch (auth.activeNavigator) {
    case 'signinSilent':
      return <div>Connexion en cours...</div>
    case 'signoutRedirect':
      return <div>Déconnexion en cours...</div>
    default:
      break
  }

  if (auth.isAuthenticated) {
    return (
      <Wrapper>
        Hello {auth.user?.profile.email}
        <br />
        <Button onClick={logout}>Se déconnecter</Button>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      {auth.isLoading ? (
        <LoadingSpinnerWall isVesselShowed />
      ) : (
        <Button onClick={() => auth.signinRedirect()}>Se connecter</Button>
      )}
      {auth.error && <div>Oops... {auth.error?.message}</div>}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  color: white;
  font-size: 13px;
  text-align: center;
  width: 100vw;
  padding-top: 43vh;
  height: 100vh;
  overflow: hidden;

  background: url('landing_background.png') no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
`
