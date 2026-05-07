import { DateCell } from '@components/Table/Cells/DateCell'
import { validate } from '@features/Tags/components/Table/utils'
import { DatePicker } from '@mtes-mct/monitor-ui'
import { useState } from 'react'
import styled from 'styled-components'

export function EditableDateCell({
  columnId,
  initialValue,
  isEditing,
  isEndDate = false,
  label,
  onCommit,
  pastDate
}: {
  columnId: string
  initialValue: string
  isEditing: boolean
  isEndDate?: boolean
  label: string
  onCommit: (value: string) => void
  pastDate?: string
}) {
  const [value, setValue] = useState(initialValue)
  const error = validate(columnId, value, pastDate)

  return isEditing ? (
    <DateWrapper>
      <DatePicker
        defaultValue={value ?? undefined}
        error={error}
        isEndDate={isEndDate}
        isErrorMessageHidden
        isLabelHidden
        isRequired
        isStringDate
        label={label}
        name={columnId}
        onChange={nextValue => {
          setValue(nextValue ?? '')
          onCommit(nextValue ?? '')
        }}
        onClick={e => e.stopPropagation()}
      />
    </DateWrapper>
  ) : (
    <DateCell date={value} format="DD/MM/YYYY" withoutTime />
  )
}

const DateWrapper = styled.div`
  .Field-DatePicker__CalendarPicker {
    position: absolute;
  }

  white-space: pre;
`
