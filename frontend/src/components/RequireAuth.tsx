import { useGetCurrentUserAuthorizationQuery } from '@api/authorizationAPI'
import { paths } from 'paths'
import { Navigate } from 'react-router'

export function RequireAuth({ children, redirect = false, requireSuperUser = false }) {
  const { data: user } = useGetCurrentUserAuthorizationQuery()
  const oidcEnabled = import.meta.env.FRONTEND_OIDC_ENABLED

  const handleRedirect = (path, shouldRedirect) => {
    if (shouldRedirect) {
      return <Navigate replace to={path} />
    }

    return null
  }

  if (!oidcEnabled) {
    return children
  }
  if (!user) {
    return handleRedirect(paths.login, redirect)
  }
  if (requireSuperUser && !user?.isSuperUser) {
    return handleRedirect(paths.register, redirect)
  }

  return children
}
