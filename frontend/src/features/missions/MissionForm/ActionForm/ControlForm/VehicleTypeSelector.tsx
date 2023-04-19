/* eslint-disable react/jsx-props-no-spreading */
import { Select } from '@mtes-mct/monitor-ui'
import { MutableRefObject, useRef } from 'react'
import styled from 'styled-components'

import { vehicleTypeEnum } from '../../../../../domain/entities/missions'
import { useNewWindow } from '../../../../../ui/NewWindow'

export function VehicleTypeSelector({ currentActionIndex, disabled, error, onChange, value }) {
  const { newWindowContainerRef } = useNewWindow()
  const vehicleTypeSelectorRef = useRef() as MutableRefObject<HTMLDivElement>
  const vehicleTypeFieldList = Object.values(vehicleTypeEnum).map(o => ({ label: o.libelle, value: o.code }))

  return (
    <SelectorWrapper ref={vehicleTypeSelectorRef}>
      <Select
        baseContainer={newWindowContainerRef.current}
        defaultValue={value}
        disabled={disabled}
        error={error}
        isLight
        label="Type de véhicule"
        name={`envActions.${currentActionIndex}.vehicleType`}
        onChange={onChange}
        options={vehicleTypeFieldList}
        searchable={false}
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
