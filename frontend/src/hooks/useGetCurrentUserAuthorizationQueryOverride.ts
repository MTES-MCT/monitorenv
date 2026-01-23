import { useGetCurrentUserAuthorizationQuery } from '@api/authorizationAPI'
import { paths } from 'paths'
import { useLocation } from 'react-router'

export const useGetCurrentUserAuthorizationQueryOverride = () => {
  const oidcEnabled = import.meta.env.FRONTEND_OIDC_ENABLED
  const isOidcEnabled = oidcEnabled === 'true'

  const location = useLocation()
  const { data, isLoading } = useGetCurrentUserAuthorizationQuery(undefined, {
    skip: !isOidcEnabled
  })

  if (!isOidcEnabled) {
    const normalizedPath = location.pathname.replace(/\/$/, '')
    if (normalizedPath === paths.ext) {
      return { data: { isSuperUser: false } }
    }

    return { data: { isSuperUser: true } }
  }

  return {
    data,
    isLoading
  }
}
