import { matchPath } from 'react-router'

import { sideWindowPaths } from '../domain/entities/sideWindow'

export function getMissionPageRoute(path: string) {
  return matchPath<'id', string>(
    {
      end: true,
      path: sideWindowPaths.MISSION
    },
    path as string
  )
}
