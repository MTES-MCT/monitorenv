import { Accent, Tag, TagGroup } from '@mtes-mct/monitor-ui'

import { getControlInfractionsTags } from '../features/missions/Missions.helpers'

export function ControlInfractionsTags({ actionNumberOfControls, infractions }) {
  const { infra, infraSansPV, med, ras } = getControlInfractionsTags(actionNumberOfControls, infractions)

  return (
    <TagGroup>
      {ras > 0 && <Tag accent={Accent.PRIMARY}>{ras} RAS</Tag>}
      {infra > 0 && <Tag accent={Accent.PRIMARY}>{infra} INF</Tag>}
      {infraSansPV > 0 && <Tag accent={Accent.PRIMARY}>{infraSansPV} INF SANS PV</Tag>}
      {med > 0 && <Tag accent={Accent.PRIMARY}>{med} MED</Tag>}
    </TagGroup>
  )
}
