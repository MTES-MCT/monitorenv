import { useGetThemesQuery } from '@api/themesAPI'
import { setFilteredRegulatoryThemes } from '@features/layersSelector/search/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { CheckTreePicker } from '@mtes-mct/monitor-ui'
import { getThemesAsOptions } from '@utils/getThemesAsOptions'
import { useMemo } from 'react'

import type { ThemeOption } from '../domain/entities/themes'

export function RegulatoryThemesFilter({ style }: { style?: React.CSSProperties }) {
  const dispatch = useAppDispatch()

  const { data: themes } = useGetThemesQuery()

  const themesOptions = useMemo(() => getThemesAsOptions(Object.values(themes ?? [])), [themes])

  const filteredRegulatoryThemes = useAppSelector(state => state.layerSearch.filteredRegulatoryThemes)

  const handleSetFilteredRegulatoryThemes = (nextThemes: ThemeOption[] | undefined = []) => {
    dispatch(setFilteredRegulatoryThemes(nextThemes))
  }

  return (
    <CheckTreePicker
      key={`regulatory-themes-${themesOptions.length}`}
      childrenKey="subThemes"
      isLabelHidden
      isTransparent
      label="Filtre thématiques et sous-thématiques"
      labelKey="name"
      name="regulatoryThemes"
      onChange={handleSetFilteredRegulatoryThemes}
      options={themesOptions}
      placeholder="Thématiques et sous-thématiques"
      renderedChildrenValue="Sous-thém."
      renderedValue="Thématiques"
      shouldShowLabels={false}
      style={style}
      value={filteredRegulatoryThemes}
      valueKey="id"
    />
  )
}
