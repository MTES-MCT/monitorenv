import { accountActions } from '@features/Account/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useGetCurrentUserAuthorizationQueryOverride } from '@hooks/useGetCurrentUserAuthorizationQueryOverride'
import { getOIDCConfig } from 'auth/getOIDCConfig'
import { paths } from 'paths'
import { useEffect } from 'react'
import { useAuth } from 'react-oidc-context'
import { Navigate } from 'react-router'

export function RequireAuth({ children, redirect = false, requireSuperUser = false }) {
  const dispatch = useAppDispatch()
  const oidcConfig = getOIDCConfig()
  const auth = useAuth()
  const { data: user } = useGetCurrentUserAuthorizationQueryOverride({ skip: !auth?.isAuthenticated })

  useEffect(() => {
    dispatch(accountActions.setIsSuperUser(user.isSuperUser))
  }, [user, dispatch])

  const handleRedirect = (path: string, shouldRedirect: boolean) => {
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
