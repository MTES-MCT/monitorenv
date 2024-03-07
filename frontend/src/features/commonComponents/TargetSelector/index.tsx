import { type Option, Select } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import type { Promisable } from 'type-fest'

type TargetSelectorProps = {
  dataCy?: string
  error?: string | undefined
  name: string
  onChange: (nextValue: string | undefined) => Promisable<void>
  options: Option[]
  value?: string
}
export function TargetSelector({ dataCy, error, name, onChange, options, value }: TargetSelectorProps) {
  return (
    <SelectorWrapper>
      <Select
        data-cy={dataCy}
        error={error}
        isErrorMessageHidden
        label="Type de cible"
        name={name}
        onChange={onChange}
        options={options}
        searchable={false}
        value={value}
      />
    </SelectorWrapper>
  )
}

const SelectorWrapper = styled.div`
  width: 150px;
`
