import { MultiSelect, useNewWindow } from '@mtes-mct/monitor-ui'
import { useField, useFormikContext } from 'formik'
import _ from 'lodash'
import { useMemo } from 'react'
import styled from 'styled-components'

import { useGetControlThemesQuery } from '../../../../../../api/controlThemesAPI'
import { updateSubThemes } from '../../../formikUseCases/updateActionThemes'

import type { ControlTheme } from '../../../../../../domain/entities/controlThemes'
import type { Mission } from '../../../../../../domain/entities/missions'

export function SubThemesSelector({ actionIndex, label, theme, themeIndex }) {
  const { data: controlThemes, isError, isLoading } = useGetControlThemesQuery()
  const { newWindowContainerRef } = useNewWindow()
  const { setFieldValue } = useFormikContext<Mission>()
  const [currentSubThemesField, currentSubThemesProps] = useField<string[]>(
    `envActions[${actionIndex}].themes[${themeIndex}].subThemes`
  )

  const availableThemes = useMemo(
    () =>
      _.chain(controlThemes)
        .filter((t): t is ControlTheme & { themeLevel2: string } => t.themeLevel1 === theme && !!t.themeLevel2)
        .uniqBy('themeLevel2')
        .map(t => ({ label: t.themeLevel2, value: t.themeLevel2 }))
        .value(),
    [controlThemes, theme]
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
          key={`${actionIndex}-${themeIndex}-${theme}`}
          baseContainer={newWindowContainerRef.current}
          data-cy="envaction-subtheme-selector"
          disabled={!theme}
          error={currentSubThemesProps.error}
          isLight
          label={label}
          name={`${actionIndex}-${themeIndex}`}
          onChange={handleUpdateSubTheme}
          options={availableThemes}
          value={currentSubThemesField.value}
        />
      )}
    </>
  )
}

const Msg = styled.div``
