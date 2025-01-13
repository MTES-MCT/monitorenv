import { CustomSearch, MultiSelect, type Option } from '@mtes-mct/monitor-ui'
import { sortControlPlans } from '@utils/sortControlPlans'
import { useField, useFormikContext } from 'formik'
import { useEffect, useMemo } from 'react'
import styled from 'styled-components'

import { updateSubThemes } from '../../../formikUseCases/updateActionThemes'

import type { Mission } from '../../../../../../../domain/entities/missions'

type SubThemesSelectorProps = {
  actionIndex: number
  isError: boolean
  isLoading: boolean
  label: string
  subThemes: {
    [key: number]: {
      id: number
      subTheme: string
      themeId: number
    }
  }
  themeId: number
  themeIndex: number
}
export function SubThemesSelector({
  actionIndex,
  isError,
  isLoading,
  label,
  subThemes,
  themeId,
  themeIndex
}: SubThemesSelectorProps) {
  const subThemesByYearAsOptions: Array<Option<number>> = useMemo(
    () =>
      Object.values(subThemes ?? {})
        ?.filter(subTheme => (themeId ? subTheme.themeId === themeId : true))
        .map(({ id, subTheme }) => ({ label: subTheme, value: id }))
        .sort(sortControlPlans) || [],
    [subThemes, themeId]
  )

  const { setFieldValue } = useFormikContext<Mission>()
  const [currentSubThemesField, currentSubThemesProps] = useField<number[]>(
    `envActions[${actionIndex}].controlPlans[${themeIndex}].subThemeIds`
  )

  const handleUpdateSubTheme = (subThemeIds: number[] | undefined) => {
    const subThemeId = subThemeIds?.[0]
    const themeOfSubThemeId = subThemeId ? subThemes[subThemeId]?.themeId : undefined

    updateSubThemes(setFieldValue)(subThemeIds, actionIndex, themeIndex, themeId, themeOfSubThemeId)
  }

  useEffect(() => {
    if (subThemesByYearAsOptions.length === 1) {
      setFieldValue(`envActions[${actionIndex}].controlPlans[${themeIndex}].subThemeIds`, [
        subThemesByYearAsOptions[0]?.value
      ])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subThemesByYearAsOptions, actionIndex, themeIndex])

  const customSearch = new CustomSearch(subThemesByYearAsOptions, ['label'], {
    cacheKey: 'MISSION_SUB_THEMES',
    isStrict: true,
    withCacheInvalidation: true
  })

  return (
    <>
      {isError && <Msg>Erreur</Msg>}
      {isLoading && <Msg>Chargement</Msg>}
      {!isError && !isLoading && (
        <MultiSelect
          // force update when name or theme changes
          key={`${actionIndex}-${themeId}-${subThemesByYearAsOptions.length}`}
          customSearch={customSearch}
          data-cy="envaction-subtheme-selector"
          error={currentSubThemesProps.error}
          isErrorMessageHidden
          isLight
          isRequired
          label={label}
          name={`${actionIndex}-${themeIndex}`}
          onChange={handleUpdateSubTheme}
          options={subThemesByYearAsOptions}
          searchable={subThemesByYearAsOptions.length > 10}
          value={currentSubThemesField.value?.map(value => value)}
        />
      )}
    </>
  )
}

const Msg = styled.div``
