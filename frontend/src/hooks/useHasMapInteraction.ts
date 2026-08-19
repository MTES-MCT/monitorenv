import { getIsLinkingZonesToVigilanceArea, VigilanceAreaFormTypeOpen } from '@features/VigilanceArea/slice'

import { useAppSelector } from './useAppSelector'

// Returns true if the user is currently interacting with the map
// (drawing, attaching a mission to a reporting, or attaching a reporting to a mission)
export function useHasMapInteraction() {
  const listener = useAppSelector(state => state.draw.listener)
  const isMissionAttachmentInProgress = useAppSelector(
    state => state.attachMissionToReporting.isMissionAttachmentInProgress
  )
  const isReportingAttachmentInProgress = useAppSelector(
    state => state.attachReportingToMission.isReportingAttachmentInProgress
  )
  const isDrawingVigilanceArea = useAppSelector(
    state => state.vigilanceArea.formTypeOpen === VigilanceAreaFormTypeOpen.DRAW
  )
  const isLinkingZonesToVigilanceArea = useAppSelector(state => getIsLinkingZonesToVigilanceArea(state))
  const isDrawingInterestPoint = useAppSelector(state => state.interestPoint.isDrawing)
  const isDrawingRecentActivity = useAppSelector(state => state.recentActivity.isDrawing)
  const isDrawingDashboard = useAppSelector(state => state.dashboard.isDrawing)

  return (
    !!listener ||
    isMissionAttachmentInProgress ||
    isReportingAttachmentInProgress ||
    isDrawingVigilanceArea ||
    isDrawingInterestPoint ||
    isLinkingZonesToVigilanceArea ||
    isDrawingRecentActivity ||
    isDrawingDashboard
  )
}
