import { matchPath } from 'react-router-dom'

import { useAppSelector } from '../../hooks/useAppSelector'

import type { ReactElement } from 'react-markdown'

// SideWindowRouter doesn't have a switch behavior (i.e. renders all routes that matches)
// be careful to write routes that never collides
// (i.e. 'missions/new' would collide with 'missions/:id' -> rewritten to 'missions_new' or '/missions/new/' used with strict + exact)

// Unlike original Route component, exact and strict are default to true,
// so it's easier to use non-colliding routes
/**
 *
 * @param {Object} route
 * @param {string} route.path
 * @param {boolean} route.exact
 * @param {boolean} route.strict
 * @param {React.ReactElement[]} route.children
 * @returns
 */
export function SideWindowRoute({
  children,
  exact = true,
  path,
  strict = true
}: {
  children: ReactElement
  exact?: boolean
  path: string | string[]
  strict?: boolean
}) {
  const { sideWindowPath } = useAppSelector(state => state.sideWindowRouter)

  const routeParams = matchPath(sideWindowPath, {
    exact,
    path,
    strict
  })

  return routeParams ? children : null
}
