import { useGetThemesQuery } from '@api/themesAPI'
import { CheckTreePicker } from '@mtes-mct/monitor-ui'
import { getThemesAsOptions } from '@utils/getThemesAsOptions'
import { useMemo } from 'react'

import type { ThemeOption } from '../domain/entities/themes'

export function RegulatoryThemesFilter({
  onChange,
  style,
  value
}: {
  onChange: (nextThemes: ThemeOption[] | undefined) => void
  style?: React.CSSProperties
  value: ThemeOption[]
}) {
  const { data: themes } = useGetThemesQuery()

  const themesOptions = useMemo(() => getThemesAsOptions(Object.values(themes ?? [])), [themes])

  return (
    <CheckTreePicker
      key={`regulatory-themes-${themesOptions.length}`}
      childrenKey="subThemes"
      isLabelHidden
      isTransparent
      label="Filtre thématiques et sous-thématiques"
      labelKey="name"
      name="regulatoryThemes"
      onChange={onChange}
      options={themesOptions}
      placeholder="Thématiques et sous-thématiques"
      renderedChildrenValue="Sous-thém."
      renderedValue="Thématiques"
      shouldShowLabels={false}
      style={style}
      value={value}
      valueKey="id"
    />
  )
}
