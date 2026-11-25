import { useGetThemesQuery } from '@api/themesAPI'
import { CheckTreePicker } from '@mtes-mct/monitor-ui'
import { getThemesAsOptions } from '@utils/getThemesAsOptions'
import { useMemo, type CSSProperties } from 'react'

import type { ThemeFromAPI, ThemeOption } from '../domain/entities/themes'

export function RegulatoryThemesFilter({
  className,
  error = undefined,
  isErrorMessageHidden = false,
  isLabelHidden = true,
  isRequired = false,
  isTransparent = true,
  label,
  onChange,
  popupStyle,
  readOnly = false,
  shouldShowLabels = false,
  style,
  value
}: {
  className?: string
  error?: string
  isErrorMessageHidden?: boolean
  isLabelHidden?: boolean
  isRequired?: boolean
  isTransparent?: boolean
  label?: string
  onChange: (nextThemes: ThemeOption[] | ThemeFromAPI[] | undefined) => void
  popupStyle?: CSSProperties
  readOnly?: boolean
  shouldShowLabels?: boolean
  style?: CSSProperties
  value: ThemeOption[] | ThemeFromAPI[]
}) {
  const { data: themes } = useGetThemesQuery()

  const themesOptions = useMemo(() => getThemesAsOptions(Object.values(themes ?? [])), [themes])

  return (
    <CheckTreePicker
      key={`regulatory-themes-${themesOptions.length}`}
      childrenKey="subThemes"
      className={className}
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
      popupStyle={popupStyle}
      readOnly={readOnly}
      renderedChildrenValue="Sous-thém."
      renderedValue="Thématiques"
      shouldShowLabels={shouldShowLabels}
      style={style}
      value={value}
      valueKey="id"
      withAllChildrenInResults
    />
  )
}
