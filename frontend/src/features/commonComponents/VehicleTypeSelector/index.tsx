/* eslint-disable react/jsx-props-no-spreading */
import { Select } from '@mtes-mct/monitor-ui'
import { type MutableRefObject, useRef } from 'react'
import styled from 'styled-components'

import { vehicleTypeLabels } from '../../../domain/entities/vehicleType'

import type { Promisable } from 'type-fest'

type VehicleTypeSelectorProps = {
  dataCy?: string
  disabled: boolean
  error?: string
  isLight?: boolean
  isRequired?: boolean
  name: string
  onChange: (nextValue: string | undefined) => Promisable<void>
  value?: string
}
export function VehicleTypeSelector({
  dataCy,
  disabled,
  error,
  isLight = true,
  isRequired = false,
  name,
  onChange,
  value
}: VehicleTypeSelectorProps) {
  const vehicleTypeSelectorRef = useRef() as MutableRefObject<HTMLDivElement>
  const vehicleTypeFieldList = Object.values(vehicleTypeLabels)

  return (
    <SelectorWrapper ref={vehicleTypeSelectorRef}>
      <Select
        data-cy={dataCy}
        disabled={disabled}
        error={error}
        isErrorMessageHidden
        isLight={isLight}
        isRequired={isRequired}
        label="Type de véhicule"
        name={name}
        onChange={onChange}
        options={vehicleTypeFieldList}
        searchable={false}
        value={value}
      />
    </SelectorWrapper>
  )
}

const SelectorWrapper = styled.div`
  width: 176px;
`
