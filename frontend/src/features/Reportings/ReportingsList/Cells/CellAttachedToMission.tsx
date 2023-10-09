import { LinkToMissionTag } from '../../components/LinkToMissionTag'

export function CellAttachedtoMission({ attachedMissionId }: { attachedMissionId: number }) {
  if (!attachedMissionId) {
    return null
  }

  return <LinkToMissionTag />
}
