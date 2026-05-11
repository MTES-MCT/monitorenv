import {
  type ColumnDef,
  type ColumnPinningState,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  type RowSelectionState,
  type SortingState,
  type Table,
  useReactTable
} from '@tanstack/react-table'
import { useState } from 'react'

type UseTableProps = {
  columnPinning?: ColumnPinningState
  columns: ColumnDef<any>[]
  data: any
  meta?: any
  rowSelection?: RowSelectionState
  setRowSelection?: (updaterOrValue: RowSelectionState | ((old: RowSelectionState) => RowSelectionState)) => void
  setSorting: (sorting: SortingState | ((old: SortingState) => SortingState)) => void
  sorting: SortingState
  withRowSelection: boolean
}

export function useTable({
  columnPinning = {
    left: [],
    right: []
  },
  columns,
  data,
  meta,
  rowSelection,
  setRowSelection,
  setSorting,
  sorting,
  withRowSelection
}: UseTableProps): Table<any> {
  const [expanded, setExpanded] = useState({})

  return useReactTable({
    columns,
    data,
    enableMultiRowSelection: withRowSelection,
    enableRowSelection: withRowSelection,
    enableSortingRemoval: true,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowId: (row: any) => row.id,
    getSortedRowModel: getSortedRowModel(),
    getSubRows: (row: any) => row.subRows,
    meta,
    onExpandedChange: setExpanded,
    onRowSelectionChange: withRowSelection ? setRowSelection : undefined,
    onSortingChange: setSorting,
    state: {
      columnPinning,
      expanded,
      rowSelection: withRowSelection ? rowSelection : undefined,
      sorting
    }
  })
}
