import { Accent, CustomSearch, Select, Tag } from '@mtes-mct/monitor-ui'
import { useState } from 'react'
import styled from 'styled-components'

export function EditableSelectCell({
  customSearch,
  initialValue,
  isEditing,
  onCommit,
  options
}: {
  customSearch: CustomSearch<any>
  initialValue: string
  isEditing: boolean
  onCommit: (value: string | undefined) => void
  options: any[]
}) {
  const [value, setValue] = useState<string | undefined>(initialValue)

  return isEditing ? (
    <Wrapper>
      <Select
        cleanable
        customSearch={customSearch}
        isErrorMessageHidden
        isLabelHidden
        label="Code FAO"
        name="codeFAO"
        onChange={(nextValue: string | undefined) => {
          setValue(nextValue)
          onCommit(nextValue)
        }}
        options={options}
        placeholder="Code FAO"
        style={{ width: '250px' }}
        value={value}
      />
    </Wrapper>
  ) : (
    value && <Tag accent={Accent.PRIMARY}>{value}</Tag>
  )
}

const Wrapper = styled.div`
  overflow: 'visible';
`
