import { DateCell } from '@components/Table/Cells/DateCell'
import { Accent, FormikDatePicker, FormikTextInput, Icon, IconButton } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export const THEME_TABLE_COLUMNS = [
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
    cell: ({ getValue, row }) => <Value $isChild={row.depth === 1}>{getValue() ?? '-'}</Value>,
    header: () => 'Thématique',
    id: 'name'
  },
  {
    accessorFn: row => row.subRows?.length,
    cell: ({ getValue, row }) => row.depth !== 1 && <span>{getValue() ? getValue() : '-'}</span>,
    header: () => 'Sous-thém.',
    id: 'subThemesCount',
    size: 115
  },
  {
    accessorFn: row => row.startedAt,
    cell: ({ getValue }) => <DateCell date={getValue()} format="DD/MM/YYYY" withoutTime />,
    header: () => 'Début validité',
    id: 'startedAt',
    size: 140
  },
  {
    accessorFn: row => row.endedAt,
    cell: ({ getValue }) => <DateCell date={getValue()} format="DD/MM/YYYY" withoutTime />,
    header: () => 'Fin validité',
    id: 'endedAt',
    size: 140
  },
  {
    accessorFn: row => row.id,
    cell: ({ row, table }) =>
      row.depth === 0 && (
        <StyledIconButton
          accent={Accent.TERTIARY}
          Icon={Icon.Edit}
          onClick={e => {
            e.stopPropagation()
            table.options.meta?.onEdit(row.id)
          }}
          title="Éditer cette thématique"
        />
      ),
    enableSorting: false,
    header: () => '',
    id: 'edit',
    size: 44
  }
]

export const SUBTHEME_TABLE_COLUMNS = [
  {
    accessorFn: row => row.name,
    cell: ({ row }) => (
      <FormikTextInput
        isErrorMessageHidden
        isLabelHidden
        label={`Sous-thématique ${row.index}`}
        name={`subThemes[${row.index}].name`}
        placeholder="Nom de la sous-thématique"
        style={{ width: '100%' }}
      />
    ),
    header: () => 'Sous-thématique',
    id: 'name',
    size: 459
  },
  {
    accessorFn: row => row.startedAt,
    cell: ({ row }) => (
      <FormikDatePicker
        isErrorMessageHidden
        isLabelHidden
        isRequired
        isStringDate
        label={`Début de validité de la sous-thématique ${row.index}`}
        name={`subThemes[${row.index}].startedAt`}
      />
    ),
    header: () => 'Début validité',
    id: 'startedAt',
    size: 119
  },
  {
    accessorFn: row => row.endedAt,
    cell: ({ row }) => (
      <FormikDatePicker
        isEndDate
        isErrorMessageHidden
        isLabelHidden
        isStringDate
        label={`Fin de validité de la sous-thématique ${row.index}`}
        name={`subThemes[${row.index}].endedAt`}
      />
    ),
    header: () => 'Fin validité',
    id: 'endedAt',
    size: 115
  },
  {
    accessorFn: row => row.id,
    cell: ({ row, table }) =>
      row.depth === 0 && (
        <DeleteButton
          accent={Accent.TERTIARY}
          Icon={Icon.Delete}
          onClick={e => {
            e.stopPropagation()
            table.options.meta?.onDelete(row.id)
          }}
          title="Supprimer cette sous-thématique"
        />
      ),
    enableSorting: false,
    header: () => '',
    id: 'delete',
    size: 44
  }
]

const StyledChevron = styled(Icon.Chevron)<{ $isExpanded: boolean }>`
  transform: ${props => (!props.$isExpanded ? 'rotate(-90deg)' : 'rotate(0deg)')};
  transition: all 0.5s;
`

const StyledIconButton = styled(IconButton)`
  padding: 0;
`

const DeleteButton = styled(StyledIconButton)`
  color: ${p => p.theme.color.maximumRed};
`
const Value = styled.span<{ $isChild: boolean }>`
  ${p => p.$isChild && 'padding-left: 16px;'}
`
