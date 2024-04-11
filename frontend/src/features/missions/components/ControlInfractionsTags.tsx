import { Accent, Tag, TagGroup } from '@mtes-mct/monitor-ui'

import { getControlInfractionsTags } from '../Missions.helpers'

export function ControlInfractionsTags({ actionNumberOfControls, infractions }) {
  const { infractionsWithoutReport, infractionsWithReport, infractionsWithWaitingReport, med, ras } =
    getControlInfractionsTags(actionNumberOfControls, infractions)

  return (
    <TagGroup>
      {ras > 0 && <Tag accent={Accent.PRIMARY}>{ras} RAS</Tag>}
      {infractionsWithReport > 0 && <Tag accent={Accent.PRIMARY}>{infractionsWithReport} PV</Tag>}
      {infractionsWithoutReport > 0 && <Tag accent={Accent.PRIMARY}>{infractionsWithoutReport} INF SANS PV</Tag>}
      {infractionsWithWaitingReport > 0 && (
        <Tag accent={Accent.PRIMARY}>{infractionsWithWaitingReport} PV EN ATTENTE</Tag>
      )}
      {med > 0 && <Tag accent={Accent.PRIMARY}>{med} MED</Tag>}
    </TagGroup>
  )
}
