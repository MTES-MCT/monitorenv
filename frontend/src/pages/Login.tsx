import { useGetCurrentUserAuthorizationQuery } from '@api/authorizationAPI'
import { paths } from 'paths'
import { Navigate } from 'react-router'
import styled from 'styled-components'
import { LoadingSpinnerWall } from 'ui/LoadingSpinnerWall'

export function Login() {
  const { data: user, isLoading } = useGetCurrentUserAuthorizationQuery()

  const onConnect = () => {
    window.location.href = 'http://localhost:8880/oauth2/authorization/proconnect'
  }

  if (user && user?.isSuperUser) {
    return <Navigate to={paths.home} />
  }

  if (user && !user?.isSuperUser) {
    return <Navigate to={paths.ext} />
  }

  return (
    <Wrapper>
      {isLoading ? (
        <LoadingSpinnerWall />
      ) : (
        <div>
          <form action="#" method="post">
            <button
              aria-label="Se connecter avec ProConnect"
              className="proconnect-button"
              onClick={onConnect}
              type="button"
            />
          </form>

          <StyledLink
            href="https://www.proconnect.gouv.fr/"
            rel="noopener noreferrer"
            target="_blank"
            title="Qu’est-ce que ProConnect ? - nouvelle fenêtre"
          >
            Qu’est-ce que ProConnect ?
          </StyledLink>
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
const StyledLink = styled.a`
  color: ${p => p.theme.color.white} !important;
`
