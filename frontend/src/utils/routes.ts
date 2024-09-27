import { matchPath } from 'react-router'

import { sideWindowPaths } from '../domain/entities/sideWindow'

export function getMissionPageRoute(path: string) {
  return matchPath<'id', string>(
    {
      end: true,
      path: sideWindowPaths.MISSION
    },
    path
  )
}
export function isMissionPage(path: string) {
  return !!matchPath<'id', string>(
    {
      end: true,
      path: sideWindowPaths.MISSION
    },
    path
  )
}

export function isMissionOrMissionsPage(path: string) {
  const isMissionsPage = !!matchPath(
    {
      end: true,
      path: sideWindowPaths.MISSIONS
    },
    path
  )

  return isMissionPage(path) || isMissionsPage
}

export function isReportingsPage(path: string) {
  return !!matchPath(
    {
      end: true,
      path: sideWindowPaths.REPORTINGS
    },
    path
  )
}

export function isDashboardsPage(path: string) {
  return !!matchPath(
    {
      end: true,
      path: sideWindowPaths.DASHBOARDS
    },
    path
  )
}

export function isDashboardPage(path: string) {
  return !!matchPath(
    {
      end: true,
      path: sideWindowPaths.DASHBOARD
    },
    path
  )
}
