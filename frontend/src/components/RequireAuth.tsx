import { useGetCurrentUserAuthorizationQueryOverride } from '@hooks/useGetCurrentUserAuthorizationQueryOverride'
import { getOIDCConfig } from 'auth/getOIDCConfig'
import { useAuth } from 'react-oidc-context'
import { Navigate } from 'react-router-dom'

export function RequireAuth({ children, redirect = false, requireSuperUser = false }) {
  const oidcConfig = getOIDCConfig()
  const auth = useAuth()
  const { data: user } = useGetCurrentUserAuthorizationQueryOverride(undefined, { skip: !auth?.isAuthenticated })

  const handleRedirect = (path, shouldRedirect) => {
    if (shouldRedirect) {
      return <Navigate replace to={path} />
    }

    return null
  }

  if (!oidcConfig.IS_OIDC_ENABLED) {
    return children
  }
  if (!auth.isAuthenticated) {
    return handleRedirect('/login', redirect)
  }
  if (requireSuperUser && !user?.isSuperUser) {
    return handleRedirect('/register', redirect)
  }

  return children
}
