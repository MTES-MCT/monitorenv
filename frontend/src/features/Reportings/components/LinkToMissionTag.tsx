import { Icon, THEME, Tag } from '@mtes-mct/monitor-ui'

export function LinkToMissionTag() {
  return (
    <Tag backgroundColor={THEME.color.mediumSeaGreen} color={THEME.color.white} Icon={Icon.Link}>
      Mission
    </Tag>
  )
}
