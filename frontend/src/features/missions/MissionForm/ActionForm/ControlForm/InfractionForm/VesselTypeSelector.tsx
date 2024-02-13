import { FormikSelect, getOptionsFromLabelledEnum } from '@mtes-mct/monitor-ui'
import { type MutableRefObject, useRef } from 'react'

import { vesselTypeLabel } from '../../../../../../domain/entities/missions'

export function VesselTypeSelector({ infractionPath }) {
  const vesselTypeSelectorRef = useRef() as MutableRefObject<HTMLDivElement>
  const vesselTypeFieldList = getOptionsFromLabelledEnum(vesselTypeLabel)

  return (
    <FormikSelect
      baseContainer={vesselTypeSelectorRef.current}
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
