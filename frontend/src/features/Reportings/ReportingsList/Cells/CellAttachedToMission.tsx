import { LinkToMissionTag } from '../../components/LinkToMissionTag'

export function CellAttachedtoMission({ missionId }: { missionId: number }) {
  if (!missionId) {
    return null
  }

  return <LinkToMissionTag />
}
