import { Accent, Select, Tag } from '@mtes-mct/monitor-ui'
import { useState } from 'react'
import styled from 'styled-components'

import type { StatusValue } from '@features/MissionTags/components/Table/FilterBar'

const STATUS_AS_OPTIONS: { label: string; value: StatusValue }[] = [
  {
    label: 'Actif',
    value: 'ACTIVE'
  },
  {
    label: 'Archivé',
    value: 'ARCHIVED'
  }
]

export function EditableSelectCell({
  initialValue,
  isEditing,
  onCommit
}: {
  initialValue: StatusValue | undefined
  isEditing: boolean
  onCommit: (value: StatusValue | undefined) => void
}) {
  const [value, setValue] = useState(initialValue)

  return isEditing ? (
    <Wrapper>
      <Select
        cleanable={false}
        isErrorMessageHidden
        isLabelHidden
        label="Statut"
        name="status"
        onChange={(nextValue: StatusValue | undefined) => {
          setValue(nextValue)
          onCommit(nextValue)
        }}
        options={STATUS_AS_OPTIONS}
        style={{ width: '120px' }}
        value={value}
      />
    </Wrapper>
  ) : (
    value === 'ARCHIVED' && <Tag accent={Accent.PRIMARY}>Archivé</Tag>
  )
}

const Wrapper = styled.div`
  overflow: 'visible';
`
