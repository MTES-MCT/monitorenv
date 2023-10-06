import { Accent, Tag, TagGroup } from '@mtes-mct/monitor-ui'

import { getControlInfractionsTags } from '../features/missions/Missions.helpers'

export function ControlInfractionsTags({ actionNumberOfControls, infractions }) {
  const { infractionsWithoutPV, infractionsWithPV, infractionsWithWaitingPv, med, ras } = getControlInfractionsTags(
    actionNumberOfControls,
    infractions
  )

  return (
    <TagGroup>
      {ras > 0 && <Tag accent={Accent.PRIMARY}>{ras} RAS</Tag>}
      {infractionsWithPV > 0 && <Tag accent={Accent.PRIMARY}>{infractionsWithPV} PV</Tag>}
      {infractionsWithoutPV > 0 && <Tag accent={Accent.PRIMARY}>{infractionsWithoutPV} INF SANS PV</Tag>}
      {infractionsWithWaitingPv > 0 && <Tag accent={Accent.PRIMARY}>{infractionsWithWaitingPv} PV EN ATTENTE</Tag>}
      {med > 0 && <Tag accent={Accent.PRIMARY}>{med} MED</Tag>}
    </TagGroup>
  )
}
