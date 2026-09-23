import { SUBTHEME_TABLE_COLUMNS } from '@features/Themes/components/Table/Columns/constants'
import { Accent, Button, Icon, SimpleTable } from '@mtes-mct/monitor-ui'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useMemo } from 'react'
import styled from 'styled-components'

import type { ThemeTable } from 'domain/entities/themes'

type ThemeFormProps = {
  onAdd: <X extends any = any>(obj: X) => void
  onDelete: <X extends any = any>(index: number) => X | undefined
  subThemes: ThemeTable[]
}
export function SubThemeTable({ onAdd, onDelete, subThemes }: ThemeFormProps) {
  const columns = useMemo(() => SUBTHEME_TABLE_COLUMNS, [])

  const table = useReactTable({
    columns,
    data: subThemes ?? [],
    enableSortingRemoval: true,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      onAdd,
      onDelete
    },
    rowCount: subThemes?.length ?? 0
  })

  const { rows } = table.getRowModel()

  return (
    <>
      <StyledTable>
        <StyledHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <SimpleTable.Th key={header.id} $width={header.column.getSize()}>
                  {!header.isPlaceholder && (
                    <SimpleTable.SortContainer>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </SimpleTable.SortContainer>
                  )}
                </SimpleTable.Th>
              ))}
            </tr>
          ))}
        </StyledHeader>

        <tbody>
          {rows.map(row => (
            <SimpleTable.BodyTr key={row.id} data-id={row?.id} data-index={row?.index}>
              {row?.getVisibleCells().map(cell => (
                <SimpleTable.Td key={cell.id}>
                  <SimpleTable.SortContainer>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </SimpleTable.SortContainer>
                </SimpleTable.Td>
              ))}
            </SimpleTable.BodyTr>
          ))}
        </tbody>
      </StyledTable>
      <CellButton accent={Accent.TERTIARY} Icon={Icon.Plus} onClick={onAdd} type="button">
        Ajouter une sous-thématique
      </CellButton>
    </>
  )
}

const StyledTable = styled(SimpleTable.Table)`
  td:nth-child(n + 1) {
    overflow: visible !important;
  }
`

const StyledHeader = styled(SimpleTable.Head)`
  th:nth-child(-n + 2) div {
    width: fit-content;
    &::after {
      content: '*';
      color: ${p => p.theme.color.maximumRed};
    }
  }
`

const CellButton = styled(Button)`
  border-left: 1px solid ${p => p.theme.color.lightGray};
  border-bottom: 1px solid ${p => p.theme.color.lightGray};
  border-right: 1px solid ${p => p.theme.color.lightGray};
  color: ${p => p.theme.color.slateGray};
  flex: none;
  height: 38px;
  justify-content: start;
  width: 100%;
`
