import { notUndefined, Virtualizer, type VirtualItem } from '@tanstack/react-virtual'

export function PaddingForVirtualizeTable({
  columLength,
  height,
  name
}: {
  columLength: number
  height: number
  name: string
}) {
  return (
    <tr>
      <td aria-label={`padding ${name}`} colSpan={columLength} style={{ height }} />
    </tr>
  )
}

export const getPaddingValuesForVirtualizeTable = (
  virtualRows: VirtualItem<any>[],
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>
): [number, number] =>
  virtualRows?.length > 0
    ? [
        notUndefined(virtualRows[0]).start - rowVirtualizer.options.scrollMargin,
        rowVirtualizer.getTotalSize() - notUndefined(virtualRows[virtualRows.length - 1]).end
      ]
    : [0, 0]
