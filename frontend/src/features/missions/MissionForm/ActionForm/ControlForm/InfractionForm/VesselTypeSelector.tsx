import { FormikSelect, getOptionsFromLabelledEnum } from '@mtes-mct/monitor-ui'

import { vesselTypeLabel } from '../../../../../../domain/entities/missions'

export function VesselTypeSelector({ infractionPath }) {
  const vesselTypeFieldList = getOptionsFromLabelledEnum(vesselTypeLabel)

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
