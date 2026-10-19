import { PageWrapper } from '@components/style'
import { accountActions } from '@features/Account/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useGetCurrentUserAuthorizationQueryOverride } from '@hooks/useGetCurrentUserAuthorizationQueryOverride'
import { useEffect } from 'react'
import { Navigate } from 'react-router'

import { paths } from '../../paths'
import { LoadingSpinnerWall } from '../../ui/LoadingSpinnerWall'

export function RequireAuth({ children, redirect = false, requireSuperUser = false }) {
  const dispatch = useAppDispatch()
  const { data: user, isLoading } = useGetCurrentUserAuthorizationQueryOverride()

  useEffect(() => {
    dispatch(accountActions.setIsSuperUser(user?.isSuperUser))
  }, [user, dispatch])

  const handleRedirect = (path: string, shouldRedirect: boolean) => {
    if (shouldRedirect) {
      return <Navigate replace to={path} />
    }

    return null
  }

  if (isLoading) {
    return (
      <PageWrapper>
        <LoadingSpinnerWall />
      </PageWrapper>
    )
  }
  if (!user) {
    return handleRedirect(paths.login, redirect)
  }
  if (requireSuperUser && !user?.isSuperUser) {
    return handleRedirect(paths.register, redirect)
  }

  return children
}
