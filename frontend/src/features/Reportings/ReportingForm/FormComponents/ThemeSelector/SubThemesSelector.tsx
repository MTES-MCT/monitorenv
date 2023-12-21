import { customDayjs, FormikMultiSelect, useNewWindow } from '@mtes-mct/monitor-ui'
import { useFormikContext } from 'formik'
import { useRef } from 'react'
import styled from 'styled-components'

import { ReportingContext } from '../../../../../domain/shared_slices/Global'
import { useGetControlPlansByYear } from '../../../../../hooks/useGetControlPlansByYear'

import type { Reporting } from '../../../../../domain/entities/reporting'

type SubThemesSelectorProps = {
  context: ReportingContext
  isLight?: boolean
  label: string
  name: string
  theme: number
}
export function SubThemesSelector({ context, isLight = false, label, name, theme }: SubThemesSelectorProps) {
  const { newWindowContainerRef } = useNewWindow()
  const ref = useRef<HTMLDivElement>(null)
  const { values } = useFormikContext<Reporting>()
  const year = customDayjs(values.createdAt || new Date().toISOString()).year()
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
          baseContainer={context === ReportingContext.MAP ? ref.current : newWindowContainerRef.current}
          data-cy="reporting-subtheme-selector"
          disabled={!theme}
          isErrorMessageHidden
          isLight={isLight}
          label={label}
          name={name}
          options={subThemesByYearAsOptions}
        />
      )}
    </>
  )
}

const Msg = styled.div``
