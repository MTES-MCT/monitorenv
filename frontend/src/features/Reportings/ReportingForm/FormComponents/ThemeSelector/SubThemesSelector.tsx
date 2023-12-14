import { customDayjs, FormikMultiSelect } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import styled from 'styled-components'

import { useGetControlPlansByYear } from '../../../../../hooks/useGetControlPlansByYear'

import type { Reporting } from '../../../../../domain/entities/reporting'

export function SubThemesSelector({ isLight = false, label, name, theme }) {
  const { values } = useFormikContext<Reporting>()
  const year = customDayjs(values.createdAt || new Date().toISOString()).year()
  const { isError, isLoading, subThemesAsOptions } = useGetControlPlansByYear({
    selectedTheme: theme,
    year
  })

  return (
    <>
      {isError && <Msg>Erreur</Msg>}
      {isLoading && <Msg>Chargement</Msg>}
      {!isError && !isLoading && (
        <FormikMultiSelect
          // force update when name or theme changes
          key={theme}
          data-cy="reporting-subtheme-selector"
          disabled={!theme}
          isErrorMessageHidden
          isLight={isLight}
          label={label}
          name={name}
          options={subThemesAsOptions}
        />
      )}
    </>
  )
}

const Msg = styled.div``
