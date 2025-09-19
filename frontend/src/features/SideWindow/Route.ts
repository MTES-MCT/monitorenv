import { isArray } from 'lodash-es'
import { matchPath } from 'react-router'

import { useAppSelector } from '../../hooks/useAppSelector'

import type { ReactElement } from 'react'

export type RouteProps = {
  element: ReactElement
  path: string | string[]
}
export function Route({ element, path }: RouteProps) {
  const currentPath = useAppSelector(state => state.sideWindow.currentPath)
  if (typeof path === 'string') {
    const routeParams = matchPath<'id', string>(
      {
        end: true,
        path
      },
      currentPath
    )

    return routeParams ? element : null
  }
  if (isArray(path)) {
    const routeParams = path.map(p =>
      matchPath<'id', string>(
        {
          end: true,
          path: p
        },
        currentPath
      )
    )

    return routeParams.some(p => p !== null) ? element : null
  }

  return null
}
