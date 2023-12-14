import { customDayjs, Select, useNewWindow } from '@mtes-mct/monitor-ui'
import { useField, useFormikContext } from 'formik'
import styled from 'styled-components'

import { useGetControlPlansByYear } from '../../../../../hooks/useGetControlPlansByYear'
import { updateTheme } from '../../formikUseCases/updateReportingThemes'

import type { Reporting } from '../../../../../domain/entities/reporting'

export function ThemeSelector({ isInNewWindow = false, isLight = true, label, name }) {
  const { newWindowContainerRef } = useNewWindow()
  const [currentThemeField] = useField<string>(name)
  const { setFieldValue, values } = useFormikContext<Reporting>()

  const year = customDayjs(values.createdAt || new Date().toISOString()).year()
  const { isError, isLoading, themesByYearAsOptions } = useGetControlPlansByYear({
    year
  })
  const handleUpdateTheme = theme => {
    updateTheme(setFieldValue)(theme)
  }

  return (
    <>
      {isError && <Msg>Erreur</Msg>}
      {isLoading && <Msg>Chargement</Msg>}
      {!isError && !isLoading && (
        <Select
          key={name}
          baseContainer={isInNewWindow ? newWindowContainerRef.current : null}
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
