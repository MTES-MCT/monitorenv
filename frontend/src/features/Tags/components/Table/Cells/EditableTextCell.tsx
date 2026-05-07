import { validate } from '@features/Tags/components/Table/utils'
import { TextInput } from '@mtes-mct/monitor-ui'
import { useState } from 'react'

export function EditableTextCell({
  columnId,
  initialValue,
  isEditing,
  label,
  onCommit
}: {
  columnId: string
  initialValue: string
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
    <span>{value ?? '-'}</span>
  )
}
