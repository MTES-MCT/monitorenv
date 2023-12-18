import { MultiSelect, useNewWindow, type Option } from '@mtes-mct/monitor-ui'
import { useField, useFormikContext } from 'formik'
import styled from 'styled-components'

import { updateSubThemes } from '../../../formikUseCases/updateActionThemes'

import type { Mission } from '../../../../../../domain/entities/missions'

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
  const { newWindowContainerRef } = useNewWindow()
  const { setFieldValue } = useFormikContext<Mission>()
  const [currentSubThemesField, currentSubThemesProps] = useField<number[]>(
    `envActions[${actionIndex}].controlPlans[${themeIndex}].subThemeIds`
  )

  const handleUpdateSubTheme = subTheme => {
    updateSubThemes(setFieldValue)(subTheme, actionIndex, themeIndex)
  }

  return (
    <>
      {isError && <Msg>Erreur</Msg>}
      {isLoading && <Msg>Chargement</Msg>}
      {!isError && !isLoading && (
        <MultiSelect
          // force update when name or theme changes
          key={`${actionIndex}-${themeId}-${subThemes.length}`}
          baseContainer={newWindowContainerRef.current}
          data-cy="envaction-subtheme-selector"
          disabled={!themeId}
          error={currentSubThemesProps.error}
          isLight
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
