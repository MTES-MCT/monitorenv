import { LinkToMissionTag } from '../../LinkToMissionTag'

export function CellAttachedtoMission({
  detachedFromMissionAtUtc,
  missionId
}: {
  detachedFromMissionAtUtc: string | undefined
  missionId: number
}) {
  if (!missionId || (missionId && detachedFromMissionAtUtc)) {
    return null
  }

  return <LinkToMissionTag />
}
