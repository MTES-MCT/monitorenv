import { useGetThemesQuery } from '@api/themesAPI'
import { CheckTreePicker } from '@mtes-mct/monitor-ui'
import { getThemesAsOptions, parseOptionsToThemes, sortThemes } from '@utils/getThemesAsOptions'
import { useFormikContext } from 'formik'
import { useMemo } from 'react'
import styled from 'styled-components'

import {
  ActionTypeEnum,
  type EnvActionControl,
  type EnvActionSurveillance,
  type Mission
} from '../../../../../../domain/entities/missions'

export const GENERAL_SURVEILLANCE = 'Surveillance générale'

type ActionThemeProps = {
  actionIndex: number
  actionType: ActionTypeEnum
}
export function ActionThemes({ actionIndex, actionType }: ActionThemeProps) {
  const {
    setFieldValue,
    values: { endDateTimeUtc, envActions, startDateTimeUtc }
  } = useFormikContext<Mission<EnvActionSurveillance | EnvActionControl>>()
  const startDate = envActions[actionIndex]?.actionStartDateTimeUtc ?? (startDateTimeUtc || new Date().toISOString())
  const endDate =
    actionType === ActionTypeEnum.SURVEILLANCE
      ? envActions[actionIndex]?.actionEndDateTimeUtc ?? endDateTimeUtc ?? new Date().toISOString()
      : startDate

  const { data } = useGetThemesQuery([startDate, endDate])

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
            setFieldValue(`envActions[${actionIndex}].themes`, parseOptionsToThemes(option))
          } else {
            setFieldValue(`envActions[${actionIndex}].themes`, [])
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
