import { Accent, Tag, TagGroup } from '@mtes-mct/monitor-ui'

import { getControlInfractionsTags } from '../Missions.helpers'

export function ControlInfractionsTags({ actionNumberOfControls, infractions }) {
  const {
    infractionsWithoutReport,
    infractionsWithReport,
    infractionsWithWaitingReport,
    med,
    ras,
    regulAdmin,
    sanctionAdmin,
    seizures
  } = getControlInfractionsTags(actionNumberOfControls, infractions)

  return (
    <TagGroup data-cy="mission-timeline-infractions-tags">
      {ras > 0 && <Tag accent={Accent.PRIMARY}>{ras} RAS</Tag>}
      {infractionsWithReport > 0 && <Tag accent={Accent.PRIMARY}>{infractionsWithReport} PV</Tag>}
      {infractionsWithoutReport > 0 && <Tag accent={Accent.PRIMARY}>{infractionsWithoutReport} INF SANS PV</Tag>}
      {infractionsWithWaitingReport > 0 && (
        <Tag accent={Accent.PRIMARY}>{infractionsWithWaitingReport} PV EN ATTENTE</Tag>
      )}
      {med > 0 && <Tag accent={Accent.PRIMARY}>{med} MED</Tag>}
      {sanctionAdmin > 0 && <Tag accent={Accent.PRIMARY}>{sanctionAdmin} SANCT. ADMIN</Tag>}
      {regulAdmin > 0 && <Tag accent={Accent.PRIMARY}>{regulAdmin} RÉGUL. ADMIN</Tag>}
      {seizures > 0 && <Tag accent={Accent.PRIMARY}>{seizures} APPR./SAISIE</Tag>}
    </TagGroup>
  )
}
