import { useGetCurrentUserAuthorizationQuery } from '@api/authorizationAPI'
import { paths } from 'paths'
import { Navigate } from 'react-router'

export function RequireAuth({ children, redirect = false, requireSuperUser = false }) {
  const { data: user } = useGetCurrentUserAuthorizationQuery()

  const handleRedirect = (path, shouldRedirect) => {
    if (shouldRedirect) {
      return <Navigate replace to={path} />
    }

    return null
  }
  if (requireSuperUser && !user?.isSuperUser) {
    return handleRedirect(paths.register, redirect)
  }

  return children
}
