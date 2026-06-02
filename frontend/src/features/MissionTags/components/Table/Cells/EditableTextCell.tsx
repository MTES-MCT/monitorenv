import { validate } from '@features/MissionTags/components/Table/utils'
import { TextInput } from '@mtes-mct/monitor-ui'
import { useState } from 'react'
import styled from 'styled-components'

export function EditableTextCell({
  columnId,
  initialValue,
  isArchived,
  isEditing,
  label,
  onCommit
}: {
  columnId: string
  initialValue: string
  isArchived: boolean
  isEditing: boolean
  label: string
  onCommit: (value: string) => void
}) {
  const [value, setValue] = useState(initialValue)
  const error = validate(columnId, value)

  return isEditing ? (
    <TextInput
      error={error}
      isErrorMessageHidden
      isLabelHidden
      label={label}
      name={columnId}
      onChange={nextValue => {
        setValue(nextValue ?? '')
        onCommit(nextValue ?? '')
      }}
      onClick={e => e.stopPropagation()}
      value={value}
    />
  ) : (
    <Value $isArchived={isArchived}>{value ?? '-'}</Value>
  )
}

const Value = styled.span<{ $isArchived: boolean }>`
  ${({ $isArchived, theme }) =>
    $isArchived &&
    `font-style: italic;
    color: ${theme.color.slateGray};
    font-weight: 500;
    `}
`
