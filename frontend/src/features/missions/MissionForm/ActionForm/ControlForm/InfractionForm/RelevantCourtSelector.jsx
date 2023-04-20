import { FormikSelect } from '@mtes-mct/monitor-ui'

import { relevantCourtEnum } from '../../../../../../domain/entities/missions'
import { useNewWindow } from '../../../../../../ui/NewWindow'

export function RelevantCourtSelector({ infractionPath }) {
  const { newWindowContainerRef } = useNewWindow()
  const relevantCourtFieldList = Object.values(relevantCourtEnum).map(o => ({ label: o.libelle, value: o.code }))

  return (
    <FormikSelect
      baseContainer={newWindowContainerRef.current}
      label="Tribunal compétent "
      name={`${infractionPath}.relevantCourt`}
      options={relevantCourtFieldList}
    />
  )
}
