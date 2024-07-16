import { useGetCurrentUserAuthorizationQuery } from '@api/authorizationAPI'
import { getOIDCConfig } from 'auth/getOIDCConfig'
import { useLocation } from 'react-router-dom'

export const useGetCurrentUserAuthorizationQueryOverride = (options = {}) => {
  const oidcConfig = getOIDCConfig()
  const location = useLocation()
  const response = useGetCurrentUserAuthorizationQuery(undefined, { skip: !oidcConfig.IS_OIDC_ENABLED, ...options })

  if (!oidcConfig.IS_OIDC_ENABLED) {
    if (location.pathname === '/ext') {
      return { data: { isAuthenticated: true, isSuperUser: false }, isSuccess: true }
    }

    return { data: { isAuthenticated: true, isSuperUser: true }, isSuccess: true }
  }

  return response
}
