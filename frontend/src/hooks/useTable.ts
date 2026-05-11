import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type RowSelectionState,
  type SortingState,
  type ColumnDef,
  type ColumnPinningState,
  type Table
} from '@tanstack/react-table'

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
  return useReactTable({
    columns,
    data,
    enableMultiRowSelection: withRowSelection,
    enableRowSelection: withRowSelection,
    enableSortingRemoval: true,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row: any) => row.id,
    getSortedRowModel: getSortedRowModel(),
    meta,
    onRowSelectionChange: withRowSelection ? setRowSelection : undefined,
    onSortingChange: setSorting,
    state: {
      columnPinning,
      rowSelection: withRowSelection ? rowSelection : undefined,
      sorting
    }
  })
}
