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
        .filter(theme => theme.name !== GENERAL_SURVEILLANCE)
        .sort(sortThemes)
    }

    return getThemesAsOptions(Object.values(data ?? []))
  }, [actionType, data])

  const label =
    envActions[actionIndex]?.actionType === ActionTypeEnum.CONTROL
      ? 'Thématiques et sous-thématiques de contrôle'
      : 'Thématiques et sous-thématiques de surveillance'

  return (
    <ActionThemeWrapper data-cy="envaction-theme-element">
      <CheckTreePicker
        key={themesOptions.length}
        childrenKey="subThemes"
        error={error.error}
        isErrorMessageHidden
        isLight
        isMultiSelect={actionType === ActionTypeEnum.SURVEILLANCE}
        isRequired
        label={label}
        labelKey="name"
        name={`envActions[${actionIndex}].themes`}
        onChange={option => {
          setFieldValue(`envActions[${actionIndex}].themes`, parseOptionsToThemes(option))
        }}
        options={themesOptions}
        value={envActions[actionIndex]?.themes}
        valueKey="id"
        virtualized
      />
    </ActionThemeWrapper>
  )
}

const ActionThemeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
  max-width: 100%;
`
