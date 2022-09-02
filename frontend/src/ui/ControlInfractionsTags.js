import React from 'react'
import { Tag, TagGroup } from 'rsuite'
import { getControlInfractionsTags } from '../features/missions/Missions.helpers'

export const ControlInfractionsTags = ({actionNumberOfControls, infractions}) => {

  const {ras, infra, infraSansPV, med} = getControlInfractionsTags(actionNumberOfControls, infractions)
  
  return (
    <TagGroup>
      <Tag>{ras} RAS</Tag>
      <Tag>{infra} INF</Tag>
      <Tag>{infraSansPV} INF SANS PV</Tag>
      <Tag>{med} MED</Tag>
    </TagGroup>
  )
}