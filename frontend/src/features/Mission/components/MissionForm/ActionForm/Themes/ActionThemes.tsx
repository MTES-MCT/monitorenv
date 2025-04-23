import { useGetThemesQuery } from '@api/themesAPI'
import { getThemesAsOptions, parseOptionsToThemes, sortThemes } from '@features/Themes/utils/getThemesAsOptions'
import { CheckTreePicker } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import { useMemo } from 'react'
import styled from 'styled-components'

import { ActionTypeEnum } from '../../../../../../domain/entities/missions'

import type { ThemeAPI } from 'domain/entities/themes'

export const GENERAL_SURVEILLANCE = 'Surveillance générale'

type ActionThemeProps = {
  actionIndex: number
  actionType: ActionTypeEnum
}
export function ActionThemes({ actionIndex, actionType }: ActionThemeProps) {
  const [currentTheme, , helpers] = useField<ThemeAPI[]>(`envActions[${actionIndex}].themes`)

  const { data } = useGetThemesQuery()

  const themesOptions = useMemo(() => {
    if (actionType === ActionTypeEnum.CONTROL) {
      return getThemesAsOptions(Object.values(data ?? []))
        .filter(theme => theme.label !== GENERAL_SURVEILLANCE)
        .sort(sortThemes)
    }

    return getThemesAsOptions(Object.values(data ?? []))
  }, [actionType, data])

  return (
    <ActionThemeWrapper data-cy="envaction-theme-element">
      <CheckTreePicker
        childrenKey="subThemes"
        isLight
        isMultiSelect={actionType === ActionTypeEnum.SURVEILLANCE}
        label="Thématiques et sous-thématiques de contrôle"
        name={`envActions[${actionIndex}].themes`}
        onChange={option => {
          if (option) {
            helpers.setValue(parseOptionsToThemes(option))
          } else {
            helpers.setValue([])
          }
        }}
        options={themesOptions}
        value={getThemesAsOptions(currentTheme.value)}
      />
    </ActionThemeWrapper>
  )
}

const ActionThemeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
  max-width: 567px;
`
