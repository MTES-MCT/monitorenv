import { useGetCurrentUserAuthorization } from 'domain/use_cases/authorization/useGetCurrentUserAuthorization'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { hasAuthParams, useAuth } from 'react-oidc-context'

import type { UserAuthorization } from 'domain/entities/authorization/types'

export function useCustomAuth() {
  const auth = useAuth()
  const [userAuthorization, setUserAuthorization] = useState<UserAuthorization | undefined>(undefined)

  useGetCurrentUserAuthorization()

  const logout = useCallback(() => {
    const idTokenHint = auth?.user?.id_token

    auth?.removeUser()
    auth?.removeUser()
    auth?.signoutRedirect({ id_token_hint: idTokenHint ?? '' })
  }, [auth])

  const userAccount = useMemo(
    () => ({
      email: auth?.user?.profile?.email,
      isSuperUser: userAuthorization?.isSuperUser ?? false,
      logout
    }),
    [logout, userAuthorization, auth?.user?.profile?.email]
  )

  useEffect(() => {
    if (!auth) {
      // remove this
      setUserAuthorization({ isLogged: false, isSuperUser: false, mustReload: false })

      return
    }

    // automatically sign-in
    if (!hasAuthParams() && !auth?.isAuthenticated && !auth?.activeNavigator && !auth?.isLoading) {
      // eslint-disable-next-line no-console
      console.log('Redirect after Cerbère sign-in.')
      auth?.signinRedirect()
    }

    //   if (!auth.isLoading && auth?.isAuthenticated && userAuthorization?.mustReload) {
    //     // eslint-disable-next-line no-console
    //     console.log('Re-trying to login with the latest token...')

    //     setTimeout(async () => {
    //       const nextUserAuthorization = await getCurrentUserAuthorization()

    //       setUserAuthorization(nextUserAuthorization)
    //     }, 250)
    //   }
  }, [
    auth,
    auth?.isAuthenticated,
    auth?.activeNavigator,
    auth?.isLoading,
    auth?.signinRedirect,
    userAuthorization?.mustReload
  ])

  if (!userAuthorization || userAuthorization?.isLogged === undefined) {
    return { isAuthorized: false, isLoading: true, userAccount: undefined }
  }

  if (auth && !auth.isLoading && !auth.isAuthenticated) {
    return { isAuthorized: false, isLoading: false, userAccount: undefined }
  }

  return { isAuthorized: true, isLoading: false, userAccount }
}
