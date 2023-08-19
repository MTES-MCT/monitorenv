import { SimpleTable } from '@mtes-mct/monitor-ui'
import { ColumnDef, SortingState, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { useState } from 'react'

import { Table } from '.'

export type DefaultTableProps<
  T extends {
    id: number
  }
> = {
  columns: Array<ColumnDef<T, any>>
  data: T[] | undefined
}
export function DefaultTable<
  T extends {
    id: number
  }
>({ columns, data }: DefaultTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([{ desc: false, id: 'name' }])

  const table = useReactTable({
    columns,
    data: data || [],
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting
    }
  })

  const { rows } = table.getRowModel()

  return (
    <>
      {!data && <p>Chargement en cours...</p>}

      {data && (
        <>
          {!data.length && <p>Aucune donnée.</p>}

          {data.length > 0 && (
            <SimpleTable.Table>
              <SimpleTable.Head>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <Table.Th header={header} />
                    ))}
                  </tr>
                ))}
              </SimpleTable.Head>

              <tbody>
                {rows.map(row => (
                  <SimpleTable.BodyTr>
                    {row.getVisibleCells().map(cell => (
                      <Table.Td cell={cell} />
                    ))}
                  </SimpleTable.BodyTr>
                ))}
              </tbody>
            </SimpleTable.Table>
          )}
        </>
      )}
    </>
  )
}
