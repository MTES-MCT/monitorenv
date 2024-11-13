import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type RowSelectionState,
  type SortingState,
  type Table
} from '@tanstack/react-table'

type UseTableProps = {
  columns: any
  data: any
  rowSelection?: RowSelectionState
  setRowSelection?: (updaterOrValue: RowSelectionState | ((old: RowSelectionState) => RowSelectionState)) => void
  setSorting: (sorting: SortingState | ((old: SortingState) => SortingState)) => void
  sorting: SortingState
  withRowSelection: boolean
}
export function useTable({
  columns,
  data,
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
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row: any) => row.id,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: withRowSelection ? setRowSelection : undefined,
    onSortingChange: setSorting,
    state: {
      rowSelection: withRowSelection ? rowSelection : undefined,
      sorting
    }
  })
}
