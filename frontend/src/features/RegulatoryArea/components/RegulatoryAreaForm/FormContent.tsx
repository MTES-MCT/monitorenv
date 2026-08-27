import { useGetRegulatoryAreaGroupByIdQuery } from '@api/regulatoryAreasAPI'
import { Localisation } from '@features/RegulatoryArea/components/RegulatoryAreaForm/Localisation'
import { RegulatoryTexts } from '@features/RegulatoryArea/components/RegulatoryAreaForm/RegulatoryTexts'
import { skipToken } from '@reduxjs/toolkit/query'
import { useState } from 'react'

import { Identification } from './Identification'

export function FormContent({ groupId, isEditing }: { groupId: string | null; isEditing: boolean }) {
  const [currentGroupId, setCurrentGroupId] = useState(
    groupId != null && !Number.isNaN(+groupId) ? +groupId : undefined
  )

  const { data: regulatoryAreaGroup } = useGetRegulatoryAreaGroupByIdQuery(
    currentGroupId && !Number.isNaN(+currentGroupId) ? +currentGroupId : skipToken
  )

  return (
    <>
      <Identification onChangeGroup={setCurrentGroupId} />
      <Localisation isEditing={isEditing} />
      {regulatoryAreaGroup && <RegulatoryTexts regulatoryAreaGroup={regulatoryAreaGroup} />}
    </>
  )
}
