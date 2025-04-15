import { useGetControlPlansByYear } from '@hooks/useGetControlPlansByYear'
import { customDayjs, Message, Select } from '@mtes-mct/monitor-ui'
import { INDIVIDUAL_ANCHORING_THEME_ID, type Reporting } from 'domain/entities/reporting'
import { VehicleTypeEnum } from 'domain/entities/vehicleType'
import { useField, useFormikContext } from 'formik'
import { useEffect, useMemo } from 'react'
import styled from 'styled-components'

export function ThemeSelector({ label, name }) {
  const [currentThemeField, currentThemeMeta] = useField<number | undefined>(name)
  const { setFieldValue, values } = useFormikContext<Reporting>()

  const year = customDayjs(values.createdAt ?? new Date().toISOString()).year()
  const { isError, isLoading, themesByYearAsOptions } = useGetControlPlansByYear({
    year
  })
  const handleUpdateTheme = (theme: number | undefined) => {
    setFieldValue('themeId', theme)
    setFieldValue('subThemeIds', [])

    // TODO(02/04/2025): Be careful here
    if (theme !== INDIVIDUAL_ANCHORING_THEME_ID) {
      setFieldValue('withVHFAnswer', undefined)
    }
  }

  useEffect(() => {
    setFieldValue('themeId', undefined)
    setFieldValue('subThemeIds', [])

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year])

  const isVesselInformationRequested = useMemo(() => {
    // TODO(02/04/2025): Be careful here
    if (values.themeId !== INDIVIDUAL_ANCHORING_THEME_ID || values.vehicleType !== VehicleTypeEnum.VESSEL) {
      return false
    }

    return (
      values.targetDetails.filter(
        target =>
          !target.vesselName ||
          !target.vesselType ||
          !target.size ||
          !(target.mmsi ?? target.imo ?? target.externalReferenceNumber)
      ).length > 0
    )
  }, [values.themeId, values.targetDetails, values.vehicleType])

  return (
    <>
      {isError && <Msg>Erreur</Msg>}
      {isLoading && <Msg>Chargement</Msg>}
      {!isError && !isLoading && (
        <Select
          key={name}
          data-cy="reporting-theme-selector"
          error={currentThemeMeta.error}
          isErrorMessageHidden
          isRequired
          label={label}
          name={name}
          onChange={handleUpdateTheme}
          options={themesByYearAsOptions}
          searchable={themesByYearAsOptions.length > 10}
          value={currentThemeField.value}
        />
      )}
      {isVesselInformationRequested && (
        <Message data-cy="reporting-target-info-message">
          <MessageTitle>Informations du navire</MessageTitle>
          <MessageText>
            N’oubliez pas d’identifier le navire (id, nom, taille, type) afin de permettre un bon traitement du
            signalement
          </MessageText>
        </Message>
      )}
    </>
  )
}

const Msg = styled.div``

export const MessageTitle = styled.header`
  font-weight: 500;
`
export const MessageText = styled.p``
