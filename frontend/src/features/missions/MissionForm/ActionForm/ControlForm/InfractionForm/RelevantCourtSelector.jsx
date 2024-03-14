import { FormikSelect, useNewWindow } from '@mtes-mct/monitor-ui'

import { relevantCourtEnum } from '../../../../../../domain/entities/missions'

export function RelevantCourtSelector({ infractionPath }) {
  const { newWindowContainerRef } = useNewWindow()
  const relevantCourtFieldList = Object.values(relevantCourtEnum).map(o => ({ label: o.libelle, value: o.code }))

  return (
    <FormikSelect
      baseContainer={newWindowContainerRef.current}
      label="Tribunal compétent "
      name={`${infractionPath}.relevantCourt`}
      options={relevantCourtFieldList}
      style={{ width: '200px' }}
    />
  )
}
