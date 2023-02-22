import { FormikMultiSelect } from '@mtes-mct/monitor-ui'
import _ from 'lodash'
import { useMemo } from 'react'
import styled from 'styled-components'

import { useGetControlThemesQuery } from '../../../../../api/controlThemesAPI'
import { useNewWindow } from '../../../../../ui/NewWindow'

type SubTheme = {
  id: number
  themeLevel1: string
  themeLevel2: string
}
export function SubThemesSelector({ label, name, theme }) {
  const { data: controlThemes, isError, isLoading } = useGetControlThemesQuery()
  const { newWindowContainerRef } = useNewWindow()

  const availableThemes = useMemo(
    () =>
      _.chain(controlThemes)
        .uniqBy('themeLevel2')
        .filter((t): t is SubTheme => t.themeLevel1 === theme && !!t.themeLevel2)
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
          key={name + theme}
          baseContainer={newWindowContainerRef.current}
          disabled={!theme}
          isLight
          label={label}
          name={name}
          options={availableThemes}
        />
      )}
    </>
  )
}

const Msg = styled.div``
