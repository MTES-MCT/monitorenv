import { Accent, Icon, IconButton, THEME } from '@mtes-mct/monitor-ui'
import { missionTypeEnum, MissionTypeEnum } from 'domain/entities/missions'

export function MissionTypeCell({ missionTypes }: { missionTypes: MissionTypeEnum[] }) {
  return (
    <span>
      {missionTypes?.map(missionType => {
        const icon = getIcon(missionType)
        if (!icon) {
          return null
        }

        return (
          <IconButton
            key={missionType}
            accent={Accent.TERTIARY}
            color={THEME.color.slateGray}
            data-cy={`mission-type-${missionTypeEnum[missionType].libelle}`}
            Icon={icon}
            title={missionTypeEnum[missionType].libelle}
          />
        )
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
