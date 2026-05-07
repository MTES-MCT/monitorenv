import { EditableTextCell } from '@features/Tags/components/Table/Cells/EditableTextCell'
import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { EditableDateCell } from '../Cells/EditableDateCell'

export const TAG_TABLE_COLUMNS = [
  {
    accessorFn: row => row.subRows,
    cell: info =>
      info.getValue()?.length > 0 && <StyledChevron $isExpanded={info.row.getIsExpanded()} size={14} type="button" />,
    enableSorting: false,
    header: () => '',
    id: 'id',
    size: 38
  },
  {
    accessorFn: row => row.name,
    cell: ({ getValue, row, table }) => (
      <EditableTextCell
        columnId="name"
        initialValue={getValue()}
        isEditing={table.options.meta?.isEditing(row)}
        label="Nom du tag"
        onCommit={value => table.options.meta?.updateData(row.id, 'name', value, row.parentId)}
      />
    ),
    header: () => 'Tag',
    id: 'name',
    size: 1135
  },
  {
    accessorFn: row => row.subRows?.length,
    cell: ({ getValue, row, table }) =>
      !row.parentId && table.options.meta?.isEditing(row) ? (
        <HAlign>
          {getValue()}
          <IconButton
            accent={Accent.SECONDARY}
            Icon={Icon.Plus}
            onClick={e => {
              e.stopPropagation()
              table.options.meta?.onAddSubTag(row.id)
            }}
            title="Ajouter un sous-tag"
          />
        </HAlign>
      ) : (
        <span>{getValue() || row.depth === 0 ? getValue() : '-'}</span>
      ),
    header: () => 'Sous-tags',
    id: 'subTagsCount',
    size: 115
  },
  {
    accessorFn: row => row.startedAt,
    cell: ({ getValue, row, table }) => (
      <EditableDateCell
        columnId="startedAt"
        initialValue={getValue()}
        isEditing={table.options.meta?.isEditing(row)}
        label="Date de début du tag"
        onCommit={value => table.options.meta?.updateData(row.id, 'startedAt', value, row.parentId)}
      />
    ),
    header: () => 'Début validité',
    id: 'startedAt',
    size: 140
  },
  {
    accessorFn: row => row.endedAt,
    cell: ({ getValue, row, table }) => (
      <EditableDateCell
        columnId="endedAt"
        initialValue={getValue()}
        isEditing={table.options.meta?.isEditing(row)}
        isEndDate
        label="Date de fin du tag"
        onCommit={value => table.options.meta?.updateData(row.id, 'endedAt', value, row.parentId)}
        pastDate={table.options.meta?.getDraftTag(row.id)?.startedAt}
      />
    ),
    header: () => 'Fin validité',
    id: 'endedAt',
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
          title="Sauvegarder ce tag"
        />
      ) : (
        <StyledIconButton
          accent={Accent.TERTIARY}
          Icon={Icon.Edit}
          onClick={e => {
            e.stopPropagation()
            table.options.meta?.onEdit(row.id)
          }}
          title="Éditer ce tag"
        />
      ),
    enableSorting: false,
    header: () => '',
    id: 'edit',
    size: 44
  }
]

const StyledChevron = styled(Icon.Chevron)<{ $isExpanded: boolean }>`
  transform: ${props => (!props.$isExpanded ? 'rotate(-90deg)' : 'rotate(0deg)')};
  transition: all 0.5s;
`

const HAlign = styled.span`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const StyledIconButton = styled(IconButton)`
  padding: 0;
`
