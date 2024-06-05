import { FormikSelect, getOptionsFromLabelledEnum } from '@mtes-mct/monitor-ui'
import { vesselTypeLabel } from 'domain/entities/vesselType'

import type { CSSProperties } from 'styled-components'

type VesselTypeSelectorProps = {
  isLight?: boolean
  name: string
  style?: CSSProperties
}
export function VesselTypeSelector({ isLight = false, name, style }: VesselTypeSelectorProps) {
  const vesselTypeFieldList = getOptionsFromLabelledEnum(vesselTypeLabel)

  return (
    <FormikSelect
      block
      cleanable={false}
      data-cy="vessel-type-selector"
      isLight={isLight}
      label="Type de navire"
      name={name}
      options={vesselTypeFieldList}
      searchable={false}
      style={style}
    />
  )
}
