/* eslint-disable react/jsx-props-no-spreading */
import { Select } from '@mtes-mct/monitor-ui'
import { MutableRefObject, useRef } from 'react'
import styled from 'styled-components'

import { vehicleTypeLabels } from '../../../../../domain/entities/vehicleType'
import { useNewWindow } from '../../../../../ui/NewWindow'

import type { Promisable } from 'type-fest'

type VehicleTypeSelectorProps = {
  disabled: boolean
  error: string
  name: string
  onChange: (nextValue: string | undefined) => Promisable<void>
  value?: string
}
export function VehicleTypeSelector({ disabled, error, name, onChange, value }: VehicleTypeSelectorProps) {
  const { newWindowContainerRef } = useNewWindow()
  const vehicleTypeSelectorRef = useRef() as MutableRefObject<HTMLDivElement>
  const vehicleTypeFieldList = Object.values(vehicleTypeLabels)

  return (
    <SelectorWrapper ref={vehicleTypeSelectorRef}>
      <Select
        baseContainer={newWindowContainerRef.current}
        disabled={disabled}
        error={error}
        isErrorMessageHidden
        isLight
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
  width: 150px;
  .rs-picker-menu {
    position: relative;
    margin-top: -50px;
  }
`
