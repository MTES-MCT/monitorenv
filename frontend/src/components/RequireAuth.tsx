import { useGetCurrentUserAuthorizationQueryOverride } from '@hooks/useGetCurrentUserAuthorizationQueryOverride'
import { Wrapper } from '@pages/Login'
import { paths } from 'paths'
import { Navigate } from 'react-router'
import { LoadingSpinnerWall } from 'ui/LoadingSpinnerWall'

export function RequireAuth({ children, redirect = false, requireSuperUser = false }) {
  const { data: user, isLoading } = useGetCurrentUserAuthorizationQueryOverride()

  const handleRedirect = (path, shouldRedirect) => {
    if (shouldRedirect) {
      return <Navigate replace to={path} />
    }

    return null
  }

  if (isLoading) {
    return (
      <Wrapper>
        <LoadingSpinnerWall />
      </Wrapper>
    )
  }
  if (!user) {
    return handleRedirect(paths.login, redirect)
  }
  if (requireSuperUser && !user?.isSuperUser) {
    return handleRedirect(paths.register, redirect)
  }

  return children
}
