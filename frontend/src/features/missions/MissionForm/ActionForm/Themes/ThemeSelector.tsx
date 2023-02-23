/* eslint-disable react/jsx-props-no-spreading */
import { FormikSelect } from '@mtes-mct/monitor-ui'
import _ from 'lodash'
import { useMemo } from 'react'
import styled from 'styled-components'

import { useGetControlThemesQuery } from '../../../../../api/controlThemesAPI'
import { useNewWindow } from '../../../../../ui/NewWindow'

export function ThemeSelector({ label, name }) {
  const { data: controlThemes, isError, isLoading } = useGetControlThemesQuery()
  const { newWindowContainerRef } = useNewWindow()

  const availableThemes = useMemo(
    () =>
      _.chain(controlThemes)
        .uniqBy('themeLevel1')
        .map(t => ({ label: t.themeLevel1, value: t.themeLevel1 }))
        .value(),
    [controlThemes]
  )

  return (
    <>
      {isError && <Msg>Erreur</Msg>}
      {isLoading && <Msg>Chargement</Msg>}
      {!isError && !isLoading && (
        <FormikSelect
          key={name}
          baseContainer={newWindowContainerRef.current}
          data-cy="envaction-theme-selector"
          isLight
          label={label}
          name={name}
          options={availableThemes}
          searchable={availableThemes.length > 10}
        />
      )}
    </>
  )
}

const Msg = styled.div``
