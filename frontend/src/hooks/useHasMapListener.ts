import { useAppSelector } from './useAppSelector'

export function useHasMapListener() {
  const listener = useAppSelector(state => state.draw.listener)
  const attachMissionListener = useAppSelector(state => state.attachMissionToReporting.attachMissionListener)
  const attachReportingListener = useAppSelector(state => state.attachReportingToMission.attachReportingListener)

  return listener || attachMissionListener || attachReportingListener
}
