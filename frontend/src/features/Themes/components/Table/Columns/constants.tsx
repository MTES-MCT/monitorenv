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
    accessorFn: row => row.index,
    cell: ({ getValue }) => (
      <FormikTextInput
        isErrorMessageHidden
        isLabelHidden
        label={`Sous-thématique ${getValue()}`}
        name={`subThemes[${getValue()}].name`}
        placeholder="Nom de la sous-thématique"
        style={{ width: '100%' }}
      />
    ),
    header: () => 'Sous-thématique',
    id: 'name',
    size: 549
  },
  {
    accessorFn: row => row.index,
    cell: ({ getValue }) => (
      <StyledFormikDatePicker
        isErrorMessageHidden
        isLabelHidden
        isRequired
        isStringDate
        label={`Début de validité de la sous-thématique ${getValue()}`}
        name={`subThemes[${getValue()}].startedAt`}
      />
    ),
    header: () => 'Début validité',
    id: 'startedAt',
    size: 100
  },
  {
    accessorFn: row => row.index,
    cell: ({ getValue }) => (
      <StyledFormikDatePicker
        isEndDate
        isErrorMessageHidden
        isLabelHidden
        isStringDate
        label={`Fin de validité de la sous-thématique ${getValue()}`}
        name={`subThemes[${getValue()}].endedAt`}
      />
    ),
    header: () => 'Fin validité',
    id: 'endedAt',
    size: 100
  },
  {
    accessorFn: row => row.index,
    cell: ({ getValue, row, table }) =>
      row.depth === 0 && (
        <DeleteButton
          accent={Accent.TERTIARY}
          Icon={Icon.Delete}
          onClick={e => {
            e.stopPropagation()
            table.options.meta?.onDelete(getValue())
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

const StyledFormikDatePicker = styled(FormikDatePicker)`
  background-color: ${p => p.theme.color.gainsboro};
`
