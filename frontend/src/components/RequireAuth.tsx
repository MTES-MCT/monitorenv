import { useAuth } from 'react-oidc-context'
import { Navigate, useLocation } from 'react-router-dom'

export function RequireAuth({ children }) {
  const auth = useAuth()
  const location = useLocation()
  if (!auth) {
    return children
  }

  if (!auth.isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  return children
}
