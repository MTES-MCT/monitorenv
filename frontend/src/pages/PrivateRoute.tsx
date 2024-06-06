import { useAppSelector } from '@hooks/useAppSelector'
import { Route, Navigate } from 'react-router-dom'

export function PrivateRoute({ element, ...rest }) {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Route {...rest} element={isAuthenticated ? element : <Navigate replace to="/login" />} />
}
