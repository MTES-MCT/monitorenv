import { useVirtualizer } from '@tanstack/react-virtual'
import { useCallback } from 'react'

type UseTableVirtualizerProps = {
  estimateSize: number
  overscan?: number
  ref: React.RefObject<HTMLDivElement>
  rows: any[]
}

export function useTableVirtualizer({ estimateSize, ref, rows }: UseTableVirtualizerProps) {
  return useVirtualizer({
    count: rows.length,
    estimateSize: () => estimateSize,
    getItemKey: useCallback((index: number) => `${rows[index]?.id}`, [rows]),
    getScrollElement: () => ref.current,
    overscan: 5,
    scrollPaddingEnd: 40,
    scrollPaddingStart: 40
  })
}
