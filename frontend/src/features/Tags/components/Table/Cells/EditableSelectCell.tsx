import { Accent, CustomSearch, type Option, Select, Tag } from '@mtes-mct/monitor-ui'
import { useMemo, useState } from 'react'
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
  options: Option[] | undefined
}) {
  const [value, setValue] = useState<string | undefined>(initialValue)
  const selectedOption = useMemo(() => options?.find(option => option.value === value), [options, value])

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
        options={options ?? []}
        placeholder="Code FAO"
        style={{ width: '250px' }}
        value={value}
        virtualized
      />
    </Wrapper>
  ) : (
    selectedOption && <Tag accent={Accent.PRIMARY}>{selectedOption.label}</Tag>
  )
}

const Wrapper = styled.div`
  overflow: 'visible';
`
