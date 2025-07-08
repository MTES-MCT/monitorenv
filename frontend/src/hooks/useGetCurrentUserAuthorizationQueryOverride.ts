import { useGetCurrentUserAuthorizationQuery } from '@api/authorizationAPI'

type UseQueryOptions = Parameters<typeof useGetCurrentUserAuthorizationQuery>[1]

export const useGetCurrentUserAuthorizationQueryOverride = (options: UseQueryOptions = {}) => {
  const { skip, ...optionsWithoutSkip } = options

  const response = useGetCurrentUserAuthorizationQuery(undefined, {
    skip,
    ...optionsWithoutSkip
  })

  /* const location = useLocation()

  if (!oidcConfig.IS_OIDC_ENABLED) {
    if (location.pathname === paths.ext) {
      return { data: { isAuthenticated: true, isSuperUser: false }, isSuccess: true }
    }

    return { data: { isAuthenticated: true, isSuperUser: true }, isSuccess: true }
  } */

  return response
}
