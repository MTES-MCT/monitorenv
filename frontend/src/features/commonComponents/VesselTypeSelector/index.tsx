import { FormikSelect, getOptionsFromLabelledEnum } from '@mtes-mct/monitor-ui'
import { vesselTypeLabel } from 'domain/entities/vesselType'

import type { CSSProperties } from 'styled-components'

type VesselTypeSelectorProps = {
  disabled?: boolean
  isLight?: boolean
  name: string
  style?: CSSProperties
}
export function VesselTypeSelector({ disabled = false, isLight = false, name, style }: VesselTypeSelectorProps) {
  const vesselTypeFieldList = getOptionsFromLabelledEnum(vesselTypeLabel)

  return (
    <FormikSelect
      block
      data-cy="vessel-type-selector"
      disabled={disabled}
      isLight={isLight}
      isUndefinedWhenDisabled
      label="Type de navire"
      name={name}
      options={vesselTypeFieldList}
      searchable={false}
      style={style}
    />
  )
}
