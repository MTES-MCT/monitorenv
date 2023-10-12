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
export function isMissionPage(path: string) {
  return !!matchPath<'id', string>(
    {
      end: true,
      path: sideWindowPaths.MISSION
    },
    path as string
  )
}

export function isMissionOrMissionsPage(path: string) {
  const isMissionsPage = !!matchPath(
    {
      end: true,
      path: sideWindowPaths.MISSIONS
    },
    path as string
  )

  return isMissionPage(path) || isMissionsPage
}

export function isReportingsPage(path: string) {
  return !!matchPath(
    {
      end: true,
      path: sideWindowPaths.REPORTINGS
    },
    path as string
  )
}
