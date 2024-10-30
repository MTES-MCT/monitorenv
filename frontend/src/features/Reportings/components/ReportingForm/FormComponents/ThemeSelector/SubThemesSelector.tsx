import { useGetControlPlansByYear } from '@hooks/useGetControlPlansByYear'
import { customDayjs, MultiSelect, type Option } from '@mtes-mct/monitor-ui'
import { sortControlPlans } from '@utils/sortControlPlans'
import { useField, useFormikContext } from 'formik'
import { useMemo } from 'react'
import styled from 'styled-components'

import type { Reporting } from 'domain/entities/reporting'

type SubThemesSelectorProps = {
  label: string
  name: string
}
export function SubThemesSelector({ label, name }: SubThemesSelectorProps) {
  const { setFieldValue, values } = useFormikContext<Reporting>()
  const [, currentSubThemesMeta] = useField<number | undefined>(name)
  const year = customDayjs(values.createdAt ?? new Date().toISOString()).year()
  const { isError, isLoading, subThemesByYear } = useGetControlPlansByYear({
    selectedTheme: values.themeId,
    year
  })

  const subThemesByYearAsOptions: Array<Option<number>> = useMemo(
    () =>
      Object.values(subThemesByYear ?? {})
        ?.filter(subTheme => (values.themeId ? subTheme.themeId === values.themeId : true))
        .map(({ id, subTheme }) => ({ label: subTheme, value: id }))
        .sort(sortControlPlans) || [],
    [subThemesByYear, values.themeId]
  )

  const selectSubThemes = (subThemes: number[] | undefined) => {
    setFieldValue(name, subThemes)

    if (!values.themeId) {
      const subThemeId = subThemes?.[0]
      const themeId = subThemeId ? subThemesByYear[subThemeId]?.themeId : undefined
      setFieldValue('themeId', themeId)
    }
  }

  return (
    <>
      {isError && <Msg>Erreur</Msg>}
      {isLoading && <Msg>Chargement</Msg>}
      {!isError && !isLoading && (
        <MultiSelect
          data-cy="reporting-subtheme-selector"
          error={currentSubThemesMeta.error}
          isErrorMessageHidden
          isRequired
          label={label}
          name={name}
          onChange={selectSubThemes}
          options={subThemesByYearAsOptions}
          searchable={subThemesByYearAsOptions.length > 10}
          value={values.subThemeIds}
        />
      )}
    </>
  )
}

const Msg = styled.div``
