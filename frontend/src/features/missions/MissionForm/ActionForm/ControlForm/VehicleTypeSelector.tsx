/* eslint-disable react/jsx-props-no-spreading */
import { Select } from '@mtes-mct/monitor-ui'
import { MutableRefObject, useRef } from 'react'
import styled from 'styled-components'

import { vehicleTypeLabels } from '../../../../../domain/entities/missions'
import { useNewWindow } from '../../../../../ui/NewWindow'

import type { Promisable } from 'type-fest'

type VehicleTypeSelectorProps = {
  currentActionIndex: number
  disabled: boolean
  error: string
  onChange: (nextValue: string | undefined) => Promisable<void>
  value?: string
}
export function VehicleTypeSelector({
  currentActionIndex,
  disabled,
  error,
  onChange,
  value
}: VehicleTypeSelectorProps) {
  const { newWindowContainerRef } = useNewWindow()
  const vehicleTypeSelectorRef = useRef() as MutableRefObject<HTMLDivElement>
  const vehicleTypeFieldList = Object.values(vehicleTypeLabels).map(o => ({ label: o.libelle, value: o.code }))

  return (
    <SelectorWrapper ref={vehicleTypeSelectorRef}>
      <Select
        baseContainer={newWindowContainerRef.current}
        disabled={disabled}
        error={error}
        isLight
        label="Type de véhicule"
        name={`envActions.${currentActionIndex}.vehicleType`}
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
