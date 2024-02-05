import { FormikSelect, getOptionsFromLabelledEnum } from '@mtes-mct/monitor-ui'
import { type MutableRefObject, useRef } from 'react'

import { vesselSizeLabel } from '../../../../../../domain/entities/missions'

export function VesselSizeSelector({ infractionPath }) {
  const vesselSizeSelectorRef = useRef() as MutableRefObject<HTMLDivElement>
  const vesselSizeFieldList = getOptionsFromLabelledEnum(vesselSizeLabel)

  return (
    <FormikSelect
      baseContainer={vesselSizeSelectorRef.current}
      cleanable={false}
      label="Taille du navire"
      name={`${infractionPath}.vesselSize`}
      options={vesselSizeFieldList}
      searchable={false}
    />
  )
}
