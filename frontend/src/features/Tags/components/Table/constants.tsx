import { DateCell } from '@components/Table/DateCell'
import { tagTableActions } from '@features/Tags/components/Table/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, DatePicker, Icon, IconButton, TextInput } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export const TAG_TABLE_COLUMNS = () => {
  const dispatch = useAppDispatch()
  const editingRows = useAppSelector(store => store.tagTable.editingRows)
  const isEditing = ({ depth, index, original }) =>
    !original.id || editingRows?.find(editingRow => editingRow.depth === depth && editingRow.index === index)

  return [
    {
      accessorFn: row => row.subTags,
      cell: info =>
        info.getValue()?.length > 0 && <StyledChevron $isExpanded={info.row.getIsExpanded()} size={14} type="button" />,
      enableSorting: false,
      header: () => '',
      id: 'id',
      size: 38
    },
    {
      accessorFn: row => row.name,
      cell: info =>
        isEditing(info.row) ? (
          <TextInput isLabelHidden label="Nom du tag" name="name" value={info.getValue()} />
        ) : (
          <span>{info.getValue() ? info.getValue() : '-'}</span>
        ),
      header: () => 'Tag',
      id: 'name',
      size: 1135
    },
    {
      accessorFn: row => row.subTags.length,
      cell: info =>
        isEditing(info.row) ? (
          <HAlign>
            {info.getValue()}
            <IconButton accent={Accent.SECONDARY} Icon={Icon.Plus} />
          </HAlign>
        ) : (
          <span>{info.getValue() ? info.getValue() : '-'}</span>
        ),
      header: () => 'Sous-tags',
      id: 'subTagsCount',
      size: 115
    },
    {
      accessorFn: row => row.startedAt,
      cell: info =>
        isEditing(info.row) ? (
          <DatePicker
            defaultValue={info.getValue() ?? undefined}
            isLabelHidden
            isRequired
            isStringDate
            label="Date du début du tag"
            name="startedAt"
            onChange={() => {}}
          />
        ) : (
          <DateCell date={info.getValue()} format="DD/MM/YYYY" withoutTime />
        ),
      header: () => 'Début validité',
      id: 'startedAt',
      size: 140
    },
    {
      accessorFn: row => row.endedAt,
      cell: info =>
        isEditing(info.row) ? (
          <DatePicker
            defaultValue={info.getValue() ?? undefined}
            isLabelHidden
            isRequired
            isStringDate
            label="Date du fin du tag"
            name="endedAt"
            onChange={() => {}}
          />
        ) : (
          <DateCell date={info.getValue()} format="DD/MM/YYYY" withoutTime />
        ),
      header: () => 'Fin validité',
      id: 'endedAt',
      size: 140
    },
    {
      accessorFn: row => row.id,
      cell: info =>
        isEditing(info.row) ? (
          <IconButton
            accent={Accent.TERTIARY}
            Icon={Icon.Save}
            onClick={e => {
              e.stopPropagation()
              const tableRow = { depth: info.row.depth, index: info.row.index, parentId: info.row.parentId }

              dispatch(tagTableActions.removeEditingRow(tableRow))
            }}
            style={{ padding: 0 }}
            title="Sauvegarder ce tag"
          />
        ) : (
          <IconButton
            accent={Accent.TERTIARY}
            Icon={Icon.Edit}
            onClick={e => {
              e.stopPropagation()
              const tableRow = { depth: info.row.depth, index: info.row.index, parentId: info.row.parentId }
              dispatch(tagTableActions.addEditingRow(tableRow))
            }}
            style={{ padding: 0 }}
            title="Éditer ce tag"
          />
        ),
      enableSorting: false,
      header: () => '',
      id: 'edit',
      size: 44
    }
  ]
}

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
