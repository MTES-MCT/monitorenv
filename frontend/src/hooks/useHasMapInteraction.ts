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

  return listener || isMissionAttachmentInProgress || isReportingAttachmentInProgress
}
