import { Accent, Tag, TagGroup } from '@mtes-mct/monitor-ui'

import { getControlInfractionsTags } from '../features/missions/Missions.helpers'

export function ControlInfractionsTags({ actionNumberOfControls, infractions }) {
  const { infra, infraWithoutPV, infraWithWaitingPv, med, ras } = getControlInfractionsTags(
    actionNumberOfControls,
    infractions
  )

  return (
    <TagGroup>
      {ras > 0 && <Tag accent={Accent.PRIMARY}>{ras} RAS</Tag>}
      {infra > 0 && <Tag accent={Accent.PRIMARY}>{infra} INF</Tag>}
      {infraWithoutPV > 0 && <Tag accent={Accent.PRIMARY}>{infraWithoutPV} INF SANS PV</Tag>}
      {infraWithWaitingPv > 0 && <Tag accent={Accent.PRIMARY}>{infraWithWaitingPv} INF AVEC PV EN ATTENTE</Tag>}
      {med > 0 && <Tag accent={Accent.PRIMARY}>{med} MED</Tag>}
    </TagGroup>
  )
}
