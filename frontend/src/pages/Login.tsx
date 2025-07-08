/* import { useGetCurrentUserAuthorizationQuery } from '@api/authorizationAPI'
import { useGetCurrentUserAuthorizationQueryOverride } from '@hooks/useGetCurrentUserAuthorizationQueryOverride'
import { Button } from '@mtes-mct/monitor-ui'
import { paths } from 'paths'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router' */
import styled from 'styled-components'
import { LoadingSpinnerWall } from 'ui/LoadingSpinnerWall'

export function Login() {
  // const { data: user, isError, isLoading } = useGetCurrentUserAuthorizationQuery()

  /* const logout = () => {
    window.location.href = 'http://localhost:3000/login'
  } */

  const onConnect = () => {
    window.location.href = 'http://localhost:8880/oauth2/authorization/proconnect'
  }

  /*   if (auth?.isAuthenticated && isSuccess && user?.isSuperUser) {
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
      */

  /*   if (user) {
    return (
      <Wrapper>
        Hello {user.isSuperUser ? 'Super User' : 'User'}
        <br />
        <Button onClick={logout}>Se déconnecter</Button>
      </Wrapper>
    )
  } */

  return (
    <Wrapper>
      {false ? (
        <LoadingSpinnerWall />
      ) : (
        <div>
          <form action="#" method="post">
            <button
              aria-label="Se connecter avec ProConnect"
              className="proconnect-button"
              onClick={onConnect}
              type="button"
            >
              Se connecter avec ProConnect
            </button>
          </form>
          <p>
            <a
              href="https://www.proconnect.gouv.fr/"
              rel="noopener noreferrer"
              target="_blank"
              title="Qu’est-ce que ProConnect ? - nouvelle fenêtre"
            >
              Qu’est-ce que ProConnect ?
            </a>
          </p>
        </div>
      )}
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
