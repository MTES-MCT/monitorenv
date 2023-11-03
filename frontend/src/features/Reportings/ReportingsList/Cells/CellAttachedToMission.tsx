import { Icon, THEME, Tag } from '@mtes-mct/monitor-ui'

export function CellAttachedtoMission({ attachedMissionId }: { attachedMissionId: number }) {
  if (!attachedMissionId) {
    return null
  }

  return (
    <Tag backgroundColor={THEME.color.mediumSeaGreen} color={THEME.color.white} Icon={Icon.Link}>
      Lié à une mission
    </Tag>
  )
}
