/* eslint-disable react/jsx-props-no-spreading */
import { Select, useNewWindow } from '@mtes-mct/monitor-ui'
import { useField, useFormikContext } from 'formik'
import _ from 'lodash'
import { useMemo } from 'react'
import styled from 'styled-components'

import { useGetControlThemesQuery } from '../../../../api/controlThemesAPI'
import { updateTheme } from '../formikUseCases/updateReportingThemes'

import type { Reporting } from '../../../../domain/entities/reporting'

export function ThemeSelector({ isInNewWindow = false, isLight = true, label, name }) {
  const { data: controlThemes, isError, isLoading } = useGetControlThemesQuery()
  const { newWindowContainerRef } = useNewWindow()
  const [currentThemeField] = useField<string>(`${name}`)
  const { setFieldValue } = useFormikContext<Reporting>()

  const availableThemes = useMemo(
    () =>
      _.chain(controlThemes)
        .uniqBy('themeLevel1')
        .map(t => ({ label: t.themeLevel1, value: t.themeLevel1 }))
        .value(),
    [controlThemes]
  )
  const handleUpdateTheme = theme => {
    updateTheme(setFieldValue)(theme)
  }

  return (
    <>
      {isError && <Msg>Erreur</Msg>}
      {isLoading && <Msg>Chargement</Msg>}
      {!isError && !isLoading && (
        <Select
          key={`${name}`}
          baseContainer={isInNewWindow ? newWindowContainerRef.current : null}
          data-cy="envaction-theme-selector"
          isErrorMessageHidden
          isLight={isLight}
          label={label}
          name={`${name}`}
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
