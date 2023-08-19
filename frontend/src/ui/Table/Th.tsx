import { Icon, SimpleTable } from '@mtes-mct/monitor-ui'
import { flexRender, Header } from '@tanstack/react-table'

import { SortingIcon } from './SortingIcon'

import type { ReactNode } from 'react'

export type ThProps = {
  children?: ReactNode
  header: Header<any, unknown>
}
export function Th({ children, header }: ThProps) {
  const controlledChildren =
    children || !header.isPlaceholder ? (
      <SimpleTable.SortContainer
        className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
        onClick={header.column.getToggleSortingHandler()}
      >
        {flexRender(header.column.columnDef.header, header.getContext())}

        {header.column.getCanSort() &&
          ({
            asc: <SortingIcon />,
            desc: <SortingIcon $isDescending />
          }[header.column.getIsSorted() as string] ?? <Icon.SortingArrows size={14} />)}
      </SimpleTable.SortContainer>
    ) : undefined

  return (
    <SimpleTable.Th
      key={header.id}
      style={{
        maxWidth: header.column.getSize() !== 150 ? header.column.getSize() : 'auto',
        minWidth: header.column.getSize() !== 150 ? header.column.getSize() : 'auto',
        width: header.column.getSize() !== 150 ? header.column.getSize() : 'auto'
      }}
    >
      {controlledChildren}
    </SimpleTable.Th>
  )
}
