import { Accent, Icon, IconButton, THEME } from '@mtes-mct/monitor-ui'
import { MissionTypeEnum } from 'domain/entities/missions'

export function MissionTypeCell({ missionTypes }: { missionTypes: MissionTypeEnum[] }) {
  return (
    <span>
      {missionTypes?.map(missionType => {
        const icon = getIcon(missionType)
        if (!icon) {
          return null
        }

        return <IconButton key={missionType} accent={Accent.TERTIARY} color={THEME.color.slateGray} Icon={icon} />
      })}
    </span>
  )
}

function getIcon(missionType: MissionTypeEnum) {
  switch (missionType) {
    case MissionTypeEnum.AIR:
      return Icon.Plane
    case MissionTypeEnum.LAND:
      return Icon.Car
    case MissionTypeEnum.SEA:
      return Icon.VesselPro
    default:
      return undefined
  }
}
