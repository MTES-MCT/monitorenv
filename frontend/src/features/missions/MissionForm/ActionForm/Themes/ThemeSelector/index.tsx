/* eslint-disable react/jsx-props-no-spreading */
import { Select, useNewWindow } from '@mtes-mct/monitor-ui'
import { useField, useFormikContext } from 'formik'
import _ from 'lodash'
import { useMemo } from 'react'
import styled from 'styled-components'

import { useGetControlThemesQuery } from '../../../../../../api/controlThemesAPI'
import { updateTheme } from '../../../formikUseCases/updateActionThemes'

import type { Mission } from '../../../../../../domain/entities/missions'

export function ThemeSelector({ actionIndex, label, themeIndex }) {
  const { data: controlThemes, isError, isLoading } = useGetControlThemesQuery()
  const { newWindowContainerRef } = useNewWindow()
  const [currentThemeField] = useField<string>(`envActions[${actionIndex}].themes[${themeIndex}].theme`)
  const { setFieldValue, values } = useFormikContext<Mission>()

  const availableThemes = useMemo(
    () =>
      _.chain(controlThemes)
        .uniqBy('themeLevel1')
        .map(t => ({ label: t.themeLevel1, value: t.themeLevel1 }))
        .value(),
    [controlThemes]
  )
  const handleUpdateTheme = theme => {
    updateTheme(setFieldValue, values)(theme, actionIndex, themeIndex)
  }

  return (
    <>
      {isError && <Msg>Erreur</Msg>}
      {isLoading && <Msg>Chargement</Msg>}
      {!isError && !isLoading && (
        <Select
          key={`${actionIndex}-${themeIndex}`}
          baseContainer={newWindowContainerRef.current}
          data-cy="envaction-theme-selector"
          isErrorMessageHidden
          isLight
          label={label}
          name={`${actionIndex}-${themeIndex}`}
          onChange={handleUpdateTheme}
          options={availableThemes}
          searchable={availableThemes.length > 10}
          value={currentThemeField.value}
        />
      )}
    </>
  )
}

const Msg = styled.div``
