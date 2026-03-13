import { useGetThemesQuery } from '@api/themesAPI'
import { CheckTreePicker } from '@mtes-mct/monitor-ui'
import { getThemesAsOptions } from '@utils/getThemesAsOptions'
import { useMemo } from 'react'

import type { ThemeFromAPI, ThemeOption } from '../domain/entities/themes'

export function RegulatoryThemesFilter({
  error = undefined,
  isErrorMessageHidden = false,
  isLabelHidden = true,
  isRequired = false,
  isTransparent = true,
  label,
  onChange,
  style,
  value
}: {
  error?: string
  isErrorMessageHidden?: boolean
  isLabelHidden?: boolean
  isRequired?: boolean
  isTransparent?: boolean
  label?: string
  onChange: (nextThemes: ThemeOption[] | ThemeFromAPI[] | undefined) => void
  style?: React.CSSProperties
  value: ThemeOption[] | ThemeFromAPI[]
}) {
  const { data: themes } = useGetThemesQuery()

  const themesOptions = useMemo(() => getThemesAsOptions(Object.values(themes ?? [])), [themes])

  return (
    <CheckTreePicker
      key={`regulatory-themes-${themesOptions.length}`}
      childrenKey="subThemes"
      error={error}
      isErrorMessageHidden={isErrorMessageHidden}
      isLabelHidden={isLabelHidden}
      isRequired={isRequired}
      isTransparent={isTransparent}
      label={label ?? 'Filtre thématiques et sous-thématiques'}
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
