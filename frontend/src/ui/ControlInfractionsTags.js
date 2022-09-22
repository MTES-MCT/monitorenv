import React from 'react'
import { Tag, TagGroup } from 'rsuite'

import { getControlInfractionsTags } from '../features/missions/Missions.helpers'

export function ControlInfractionsTags({ actionNumberOfControls, infractions }) {
  const { infra, infraSansPV, med, ras } = getControlInfractionsTags(actionNumberOfControls, infractions)

  return (
    <TagGroup>
      <Tag>{ras} RAS</Tag>
      <Tag>{infra} INF</Tag>
      <Tag>{infraSansPV} INF SANS PV</Tag>
      <Tag>{med} MED</Tag>
    </TagGroup>
  )
}
