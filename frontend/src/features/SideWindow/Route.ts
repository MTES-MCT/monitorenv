import { matchPath } from 'react-router-dom'

import { useAppSelector } from '../../hooks/useAppSelector'

import type { ReactElement } from 'react'

export type RouteProps = {
  element: ReactElement
  path: string
}
export function Route({ element, path }: RouteProps) {
  const { currentPath } = useAppSelector(state => state.sideWindow)

  const routeParams = matchPath<'id', string>(
    {
      end: true,
      path
    },
    currentPath
  )

  return routeParams ? element : null
}
