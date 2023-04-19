/* eslint-disable react/jsx-props-no-spreading */
import { Select } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { actionTargetTypeEnum } from '../../../../../domain/entities/missions'
import { useNewWindow } from '../../../../../ui/NewWindow'

import type { Promisable } from 'type-fest'

type ActionTargetSelectorProps = {
  currentActionIndex: number
  error: string
  onChange: (nextValue: string | undefined) => Promisable<void>
  value?: string
}
export function ActionTargetSelector({ currentActionIndex, error, onChange, value }: ActionTargetSelectorProps) {
  const { newWindowContainerRef } = useNewWindow()
  const actionTargetFieldList = Object.values(actionTargetTypeEnum).map(o => ({ label: o.libelle, value: o.code }))

  return (
    <SelectorWrapper>
      <Select
        baseContainer={newWindowContainerRef.current}
        defaultValue={value}
        error={error}
        isLight
        label="Type de cible"
        name={`envActions.${currentActionIndex}.actionTargetType`}
        onChange={onChange}
        options={actionTargetFieldList}
        searchable={false}
      />
    </SelectorWrapper>
  )
}

const SelectorWrapper = styled.div`
  width: 150px;
`
