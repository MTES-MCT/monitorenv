import { SimpleTable } from '@mtes-mct/monitor-ui'
import { flexRender, type Cell } from '@tanstack/react-table'

import type { ReactNode } from 'react'

export type TdProps = {
  cell: Cell<any, unknown>
  children?: ReactNode
}
export function Td({ cell, children }: TdProps) {
  const controlledChildren = children || flexRender(cell.column.columnDef.cell, cell.getContext())

  return (
    <SimpleTable.Td
      key={cell.id}
      style={{
        maxWidth: cell.column.getSize() !== 150 ? cell.column.getSize() : 'auto',
        minWidth: cell.column.getSize() !== 150 ? cell.column.getSize() : 'auto',
        width: cell.column.getSize() !== 150 ? cell.column.getSize() : 'auto'
      }}
    >
      {controlledChildren}
    </SimpleTable.Td>
  )
}
