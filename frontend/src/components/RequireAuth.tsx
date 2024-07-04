import { useGetCurrentUserAuthorizationQuery } from '@api/authorizationAPI'
import { getOIDCConfig } from 'auth/getOIDCConfig'
import { useAuth } from 'react-oidc-context'
import { Navigate } from 'react-router-dom'

export function RequireAuth({ children, redirect = false, requireSuperUser = false }) {
  const oidcConfig = getOIDCConfig()
  const auth = useAuth()
  const { data: user } = useGetCurrentUserAuthorizationQuery(undefined, { skip: !auth?.isAuthenticated })

  if (!oidcConfig.IS_OIDC_ENABLED) {
    return children
  }

  if (!auth.isAuthenticated) {
    if (redirect) {
      return <Navigate replace to="/login" />
    }

    return null
  }

  if (requireSuperUser && !user?.isSuperUser) {
    if (redirect) {
      return <Navigate replace to="/register" />
    }

    return null
  }

  return children
}
