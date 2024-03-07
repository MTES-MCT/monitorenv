import { customDayjs, Select } from '@mtes-mct/monitor-ui'
import { useField, useFormikContext } from 'formik'
import { useEffect } from 'react'
import styled from 'styled-components'

import { INDIVIDUAL_ANCHORING_THEME_ID, type Reporting } from '../../../../../domain/entities/reporting'
import { useGetControlPlansByYear } from '../../../../../hooks/useGetControlPlansByYear'
import { updateTheme } from '../../formikUseCases/updateReportingThemes'

export function ThemeSelector({ isLight = true, label, name }) {
  const [currentThemeField] = useField<number | undefined>(name)
  const { setFieldValue, values } = useFormikContext<Reporting>()

  const year = customDayjs(values.createdAt ?? new Date().toISOString()).year()
  const { isError, isLoading, themesByYearAsOptions } = useGetControlPlansByYear({
    year
  })
  const handleUpdateTheme = (theme: number | undefined) => {
    updateTheme(setFieldValue)(theme)

    if (theme !== INDIVIDUAL_ANCHORING_THEME_ID) {
      setFieldValue('withVHFAnswer', undefined)
    }
  }

  useEffect(() => {
    updateTheme(setFieldValue)(undefined)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year])

  return (
    <>
      {isError && <Msg>Erreur</Msg>}
      {isLoading && <Msg>Chargement</Msg>}
      {!isError && !isLoading && (
        <Select
          key={name}
          data-cy="reporting-theme-selector"
          isErrorMessageHidden
          isLight={isLight}
          label={label}
          name={name}
          onChange={handleUpdateTheme}
          options={themesByYearAsOptions}
          searchable={themesByYearAsOptions.length > 10}
          value={currentThemeField.value}
        />
      )}
    </>
  )
}

const Msg = styled.div``
