import { matchPath } from 'react-router'

import { sideWindowPaths } from '../domain/entities/sideWindow'

export function editMissionPageRoute(path: string) {
  return matchPath<'id', string>(
    {
      end: true,
      path: sideWindowPaths.MISSION
    },
    path as string
  )
}

export function newMissionPageRoute(path: string) {
  return matchPath<'id', string>(
    {
      end: true,
      path: sideWindowPaths.MISSION_NEW
    },
    path as string
  )
}
