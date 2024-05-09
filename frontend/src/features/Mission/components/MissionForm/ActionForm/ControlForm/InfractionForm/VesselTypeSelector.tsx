import { Mission } from '@features/Mission/mission.type'
import { FormikSelect, getOptionsFromLabelledEnum } from '@mtes-mct/monitor-ui'

export function VesselTypeSelector({ infractionPath }) {
  const vesselTypeFieldList = getOptionsFromLabelledEnum(Mission.vesselTypeLabel)

  return (
    <FormikSelect
      block
      cleanable={false}
      data-cy="vessel-type-selector"
      label="Type de navire"
      name={`${infractionPath}.vesselType`}
      options={vesselTypeFieldList}
      searchable={false}
      style={{ width: '170px' }}
    />
  )
}
