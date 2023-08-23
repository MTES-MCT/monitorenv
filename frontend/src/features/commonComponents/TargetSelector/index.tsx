import { Select, getOptionsFromLabelledEnum, useNewWindow } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import type { Promisable } from 'type-fest'

type TargetSelectorProps = {
  dataCy?: string
  error?: string | undefined
  name: string
  onChange: (nextValue: string | undefined) => Promisable<void>
  options: Record<string, string>
  value?: string
}
export function TargetSelector({ dataCy, error, name, onChange, options, value }: TargetSelectorProps) {
  const { newWindowContainerRef } = useNewWindow()
  const actionTargetFieldList = getOptionsFromLabelledEnum(options)

  return (
    <SelectorWrapper>
      <Select
        baseContainer={newWindowContainerRef.current}
        data-cy={dataCy}
        error={error}
        isErrorMessageHidden
        isLight
        label="Type de cible"
        name={name}
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
