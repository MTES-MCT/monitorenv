import { useGetCurrentUserAuthorizationQuery } from '@api/authorizationAPI'
import { paths } from 'paths'
import { useLocation } from 'react-router'

export const useGetCurrentUserAuthorizationQueryOverride = () => {
  const oidcEnabled = import.meta.env.FRONTEND_OIDC_ENABLED
  const location = useLocation()

  const { data } = useGetCurrentUserAuthorizationQuery(undefined, {
    skip: !oidcEnabled
  })

  if (!oidcEnabled) {
    if (location.pathname === paths.ext) {
      return { isSuperUser: false }
    }

    return { isSuperUser: true }
  }

  return data
}
