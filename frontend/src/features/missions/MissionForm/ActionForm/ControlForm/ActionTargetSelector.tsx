/* eslint-disable react/jsx-props-no-spreading */
import { Select, useNewWindow } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { targetTypeLabels } from '../../../../../domain/entities/targetType'

import type { Promisable } from 'type-fest'

type ActionTargetSelectorProps = {
  currentActionIndex: number
  error: string
  onChange: (nextValue: string | undefined) => Promisable<void>
  value?: string
}
export function ActionTargetSelector({ currentActionIndex, error, onChange, value }: ActionTargetSelectorProps) {
  const { newWindowContainerRef } = useNewWindow()
  const actionTargetFieldList = Object.values(targetTypeLabels)

  return (
    <SelectorWrapper>
      <Select
        baseContainer={newWindowContainerRef.current}
        error={error}
        isErrorMessageHidden
        isLight
        label="Type de cible"
        name={`envActions.${currentActionIndex}.actionTargetType`}
        onChange={onChange}
        options={actionTargetFieldList}
        searchable={false}
        value={value}
      />
    </SelectorWrapper>
  )
}

const SelectorWrapper = styled.div`
  width: 150px;
`
