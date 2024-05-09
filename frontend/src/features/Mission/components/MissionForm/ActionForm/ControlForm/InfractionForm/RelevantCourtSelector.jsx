import { Mission } from '@features/Mission/mission.type'
import { FormikSelect } from '@mtes-mct/monitor-ui'

export function RelevantCourtSelector({ infractionPath }) {
  const relevantCourtFieldList = Object.values(Mission.relevantCourtEnum).map(o => ({
    label: o.libelle,
    value: o.code
  }))

  return (
    <FormikSelect
      label="Tribunal compétent "
      name={`${infractionPath}.relevantCourt`}
      options={relevantCourtFieldList}
      style={{ width: '200px' }}
    />
  )
}
