import { useGetThemesQuery } from '@api/themesAPI'
import { CheckTreePicker } from '@mtes-mct/monitor-ui'
import { getThemesAsOptions, parseOptionsToThemes, sortThemes } from '@utils/getThemesAsOptions'
import { useField, useFormikContext } from 'formik'
import { useMemo } from 'react'
import styled from 'styled-components'

import {
  ActionTypeEnum,
  type EnvActionControl,
  type EnvActionSurveillance,
  type Mission
} from '../../../../../../domain/entities/missions'

import type { ThemeFromAPI } from 'domain/entities/themes'

export const GENERAL_SURVEILLANCE = 'Surveillance générale'

type ActionThemeProps = {
  actionIndex: number
  actionType: ActionTypeEnum
}
export function ActionThemes({ actionIndex, actionType }: ActionThemeProps) {
  const {
    setFieldValue,
    values: { envActions, startDateTimeUtc }
  } = useFormikContext<Mission<EnvActionSurveillance | EnvActionControl>>()
  const [, error] = useField<ThemeFromAPI[]>(`envActions[${actionIndex}].themes`)

  const startDate = envActions[actionIndex]?.actionStartDateTimeUtc ?? (startDateTimeUtc || new Date().toISOString())

  const { data } = useGetThemesQuery([startDate, startDate])

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
        error={error.error}
        isErrorMessageHidden
        isLight
        isMultiSelect={actionType === ActionTypeEnum.SURVEILLANCE}
        isRequired
        label="Thématiques et sous-thématiques de contrôle"
        name={`envActions[${actionIndex}].themes`}
        onChange={option => {
          if (option) {
            setFieldValue(`envActions[${actionIndex}].themes`, parseOptionsToThemes(option))
          } else {
            setFieldValue(`envActions[${actionIndex}].themes`, undefined)
          }
        }}
        options={themesOptions}
        value={getThemesAsOptions(envActions[actionIndex]?.themes ?? [])}
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
