import { useGetCurrentUserAuthorizationQueryOverride } from '@hooks/useGetCurrentUserAuthorizationQueryOverride'
import { getOIDCConfig } from 'auth/getOIDCConfig'
import { paths } from 'paths'
import { useAuth } from 'react-oidc-context'
import { Navigate } from 'react-router'

export function RequireAuth({ children, redirect = false, requireSuperUser = false }) {
  const oidcConfig = getOIDCConfig()
  const auth = useAuth()
  const { data: user } = useGetCurrentUserAuthorizationQueryOverride({ skip: !auth?.isAuthenticated })

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
    return handleRedirect(paths.login, redirect)
  }
  if (requireSuperUser && !user?.isSuperUser) {
    return handleRedirect(paths.register, redirect)
  }

  return children
}
