/* eslint-disable react/jsx-props-no-spreading */
import { useMemo } from 'react'

export function CellActionThemes({ subThemes, theme }: { subThemes: any[]; theme: string }) {
  const cellContent = useMemo(() => {
    if (theme) {
      if (subThemes.length > 0) {
        return `${theme}: ${subThemes.join(', ')}`
      }

      return theme
    }

    return ''
  }, [theme, subThemes])

  return cellContent !== '' ? (
    <span data-cy="cell-theme" title={cellContent}>
      {cellContent}
    </span>
  ) : null
}
