import { FormikMultiSelect } from '@mtes-mct/monitor-ui'
import _ from 'lodash'
import { useMemo } from 'react'
import styled from 'styled-components'

import { useGetControlThemesQuery } from '../../../../../api/controlThemesAPI'

import type { ControlTheme } from '../../../../../domain/entities/controlThemes'

export function SubThemesSelector({ isLight = false, label, name, theme }) {
  const { data: controlThemes, isError, isLoading } = useGetControlThemesQuery()

  const availableThemes = useMemo(
    () =>
      _.chain(controlThemes)
        .filter((t): t is ControlTheme & { themeLevel2: string } => t.themeLevel1 === theme && !!t.themeLevel2)
        .uniqBy('themeLevel2')
        .map(t => ({ label: t.themeLevel2, value: t.themeLevel2 }))
        .value(),
    [controlThemes, theme]
  )

  return (
    <>
      {isError && <Msg>Erreur</Msg>}
      {isLoading && <Msg>Chargement</Msg>}
      {!isError && !isLoading && (
        <FormikMultiSelect
          // force update when name or theme changes
          key={`${theme}`}
          data-cy="reporting-subtheme-selector"
          disabled={!theme}
          isErrorMessageHidden
          isLight={isLight}
          label={label}
          name={name}
          options={availableThemes}
        />
      )}
    </>
  )
}

const Msg = styled.div``
