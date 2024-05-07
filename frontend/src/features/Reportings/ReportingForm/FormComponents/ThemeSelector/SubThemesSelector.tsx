import { customDayjs, FormikMultiSelect } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import styled from 'styled-components'

import { useGetControlPlansByYear } from '../../../../../hooks/useGetControlPlansByYear'

import type { Reporting } from '../../../../../domain/entities/reporting'

type SubThemesSelectorProps = {
  isLight?: boolean
  label: string
  name: string
  theme: number
}
export function SubThemesSelector({ isLight = false, label, name, theme }: SubThemesSelectorProps) {
  const { values } = useFormikContext<Reporting>()
  const year = customDayjs(values.createdAt ?? new Date().toISOString()).year()
  const { isError, isLoading, subThemesByYearAsOptions } = useGetControlPlansByYear({
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
          key={`${year}-${theme}`}
          data-cy="reporting-subtheme-selector"
          disabled={!theme}
          isErrorMessageHidden
          isLight={isLight}
          isRequired
          label={label}
          name={name}
          options={subThemesByYearAsOptions}
        />
      )}
    </>
  )
}

const Msg = styled.div``
