import { VesselTypeSelector } from '@features/commonComponents/VesselTypeSelector'
import { StyledVesselForm } from '@features/Reportings/style'
import { VesselSearchForm } from '@features/Vessel/components/VesselSearchForm'
import { isVesselsEnabled } from '@features/Vessel/utils'
import { FormikNumberInput, FormikTextInput } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import { useState } from 'react'

type VesselFormProps = {
  index: number
  isDisabled: boolean
  isLight?: boolean
  path: string
}

export function TargetDetailsVesselForm({ index, isDisabled, isLight = true, path }: VesselFormProps) {
  const [{ value }] = useField(`targetDetails.${index}`)

  const isUnknown =
    !value.vesselShipId &&
    !!(
      value.mmsi ||
      value.imo ||
      value.controlledPersonIdentity ||
      value.vesselName ||
      value.vesselSize ||
      value.vesselType ||
      value.registrationNumber
    )
  const [isUnknownVessel, setIsUnknownVessel] = useState(isUnknown)

  return (
    <>
      <VesselSearchForm
        batchId={value.vesselBatchId}
        forceHistorySearch
        isLight={isLight}
        isUnknown={isUnknownVessel}
        onIsUnknown={isChecked => setIsUnknownVessel(!!isChecked)}
        path={path}
        reportingId={value.id}
        rowNumber={value.vesselRowNumber}
        shipId={value.vesselShipId}
      />
      {(isUnknownVessel || !isVesselsEnabled()) && (
        <>
          <StyledVesselForm>
            <FormikTextInput
              disabled={isDisabled}
              isErrorMessageHidden
              isLight
              isUndefinedWhenDisabled
              label="MMSI"
              name={`${path}.mmsi`}
            />
            <FormikTextInput
              data-cy="targetDetails[index]-form-vesselName"
              disabled={isDisabled}
              isErrorMessageHidden
              isLight
              isUndefinedWhenDisabled
              label="Nom du navire"
              name={`${path}.vesselName`}
            />
          </StyledVesselForm>
          <StyledVesselForm>
            <FormikTextInput
              disabled={isDisabled}
              isErrorMessageHidden
              isLight
              isUndefinedWhenDisabled
              label="IMO"
              name={`${path}.imo`}
            />
            <FormikTextInput
              data-cy="targetDetails[index]-form-controlledPersonIdentity"
              disabled={isDisabled}
              isErrorMessageHidden
              isLight
              isUndefinedWhenDisabled
              label="Nom du capitaine"
              name={`${path}.controlledPersonIdentity`}
            />
          </StyledVesselForm>
          <StyledVesselForm>
            <FormikTextInput
              data-cy="targetDetails[index]-form-registrationNumber"
              disabled={isDisabled}
              isErrorMessageHidden
              isLight
              isUndefinedWhenDisabled
              label="Immatriculation"
              name={`${path}.registrationNumber`}
            />
            <FormikNumberInput
              data-cy="targetDetails[index]-form-vessel-size"
              disabled={isDisabled}
              isErrorMessageHidden
              isLight
              isUndefinedWhenDisabled
              label="Taille"
              name={`${path}.vesselSize`}
            />
          </StyledVesselForm>
          <StyledVesselForm>
            <VesselTypeSelector
              disabled={isDisabled}
              isLight
              name={`${path}.vesselType`}
              style={{ flex: '0 1 48.5%' }}
            />
          </StyledVesselForm>
        </>
      )}
    </>
  )
}
