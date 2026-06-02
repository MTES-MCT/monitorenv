import { EditableSelectCell } from '@features/MissionTags/components/Table/Cells/EditableSelectCell'
import { EditableTextCell } from '@features/MissionTags/components/Table/Cells/EditableTextCell'
import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export const MISSION_TAG_TABLE_COLUMNS = [
  {
    accessorFn: row => row.name,
    cell: ({ getValue, row, table }) => (
      <EditableTextCell
        columnId="name"
        initialValue={getValue()}
        isArchived={table.options.meta?.getMissionTag(row.id)?.isArchived}
        isEditing={table.options.meta?.isEditing(row)}
        label="Nom de l'étiquette de mission"
        onCommit={value => table.options.meta?.updateData(row.id, 'name', value)}
      />
    ),
    header: () => 'Étiquette de mission',
    id: 'name'
  },
  {
    accessorFn: row => row.isArchived,
    cell: ({ getValue, row, table }) => (
      <EditableSelectCell
        initialValue={getValue() ? 'ARCHIVED' : 'ACTIVE'}
        isEditing={table.options.meta?.isEditing(row)}
        onCommit={value => table.options.meta?.updateData(row.id, 'isArchived', value === 'ARCHIVED')}
      />
    ),
    header: () => 'Statut',
    id: 'isArchived',
    size: 140
  },
  {
    accessorFn: row => row.id,
    cell: ({ row, table }) =>
      table.options.meta?.isEditing(row) ? (
        <StyledIconButton
          accent={Accent.TERTIARY}
          disabled={!table.options.meta?.isValid(row.id)}
          Icon={Icon.Save}
          onClick={e => {
            e.stopPropagation()
            table.options.meta?.onSubmit(row.id)
          }}
          title="Sauvegarder cette étiquette de mission"
        />
      ) : (
        <StyledIconButton
          accent={Accent.TERTIARY}
          Icon={Icon.Edit}
          onClick={e => {
            e.stopPropagation()
            table.options.meta?.onEdit(row.id)
          }}
          title="Éditer cette étiquette de mission"
        />
      ),
    enableSorting: false,
    header: () => '',
    id: 'edit',
    size: 44
  }
]

const StyledIconButton = styled(IconButton)`
  padding: 0;
`
