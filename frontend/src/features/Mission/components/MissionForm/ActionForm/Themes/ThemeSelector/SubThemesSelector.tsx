import { Mission } from '@features/Mission/mission.type'
import { MultiSelect, type Option } from '@mtes-mct/monitor-ui'
import { useField, useFormikContext } from 'formik'
import { useEffect } from 'react'
import styled from 'styled-components'

import { updateSubThemes } from '../../../formikUseCases/updateActionThemes'

type SubThemesSelectorProps = {
  actionIndex: number
  isError: boolean
  isLoading: boolean
  label: string
  subThemes: Array<Option<number>>
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
  const { setFieldValue } = useFormikContext<Mission.Mission>()
  const [currentSubThemesField, currentSubThemesProps] = useField<number[]>(
    `envActions[${actionIndex}].controlPlans[${themeIndex}].subThemeIds`
  )

  const handleUpdateSubTheme = subTheme => {
    updateSubThemes(setFieldValue)(subTheme, actionIndex, themeIndex)
  }

  useEffect(() => {
    if (subThemes.length === 1) {
      setFieldValue(`envActions[${actionIndex}].controlPlans[${themeIndex}].subThemeIds`, [subThemes[0]?.value])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subThemes, actionIndex, themeIndex])

  return (
    <>
      {isError && <Msg>Erreur</Msg>}
      {isLoading && <Msg>Chargement</Msg>}
      {!isError && !isLoading && (
        <MultiSelect
          // force update when name or theme changes
          key={`${actionIndex}-${themeId}-${subThemes.length}`}
          data-cy="envaction-subtheme-selector"
          disabled={!themeId}
          error={currentSubThemesProps.error}
          isErrorMessageHidden
          isLight
          isRequired
          label={label}
          name={`${actionIndex}-${themeIndex}`}
          onChange={handleUpdateSubTheme}
          options={subThemes}
          value={currentSubThemesField.value?.map(value => value) as any[]}
        />
      )}
    </>
  )
}

const Msg = styled.div``
