import { Select, useNewWindow, type Option } from '@mtes-mct/monitor-ui'
import { useField, useFormikContext } from 'formik'
import styled from 'styled-components'

import { updateTheme } from '../../../formikUseCases/updateActionThemes'

import type { Mission } from '../../../../../../domain/entities/missions'

type ActionThemeProps = {
  actionIndex: number
  isError: boolean
  isLoading: boolean
  label: string
  themeIndex: number
  themes: Array<Option<number>>
}
export function ThemeSelector({ actionIndex, isError, isLoading, label, themeIndex, themes }: ActionThemeProps) {
  const { newWindowContainerRef } = useNewWindow()
  const [currentThemeField, currentThemeProps] = useField<string>(
    `envActions[${actionIndex}].controlPlans[${themeIndex}].themeId`
  )
  const { setFieldValue, values } = useFormikContext<Mission>()

  const handleUpdateTheme = theme => {
    updateTheme(setFieldValue, values)(theme, actionIndex, themeIndex)
  }

  return (
    <>
      {isError && <Msg>Erreur</Msg>}
      {isLoading && <Msg>Chargement</Msg>}
      {!isError && !isLoading && (
        <Select
          key={themes.length}
          baseContainer={newWindowContainerRef.current}
          data-cy="envaction-theme-selector"
          error={currentThemeProps.error}
          isLight
          label={label}
          name={`${actionIndex}-${themeIndex}`}
          onChange={handleUpdateTheme}
          options={themes}
          searchable={themes.length > 10}
          value={currentThemeField.value}
        />
      )}
    </>
  )
}

const Msg = styled.div``
