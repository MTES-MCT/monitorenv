import { VesselTypeSelector } from '@features/commonComponents/VesselTypeSelector'
import { StyledVesselForm } from '@features/Mission/components/MissionForm/ActionForm/ControlForm/InfractionForm/InfractionFormHeaderVehicle'
import { VesselSearchForm } from '@features/Vessel/components/MissionVesselForm/VesselSearchForm'
import { isVesselsEnabled } from '@features/Vessel/utils'
import { FormikNumberInput, FormikTextInput } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import { useState } from 'react'

import type { Infraction } from '../../../../domain/entities/missions'

type VesselFormProps = {
  envActionIndex: number
  isDisabled: boolean
  path: string
}

export function VesselForm({ envActionIndex, isDisabled, path }: VesselFormProps) {
  const [envActionId] = useField(`envActions.${envActionIndex}.id`)
  const [{ value: infraction }] = useField<Infraction>(path)
  const isUnknown =
    !infraction.vesselId &&
    !!(
      infraction.mmsi ||
      infraction.imo ||
      infraction.registrationNumber ||
      infraction.vesselSize ||
      infraction.vesselType ||
      infraction.controlledPersonIdentity
    )
  const [isUnknownVessel, setIsUnknownVessel] = useState(isUnknown)

  return (
    <>
      <VesselSearchForm
        envActionId={envActionId.value}
        isUnknown={isUnknownVessel}
        onIsUnknown={isChecked => setIsUnknownVessel(!!isChecked)}
        path={path}
        vesselId={infraction.vesselId}
      />
      {(isUnknownVessel || !isVesselsEnabled()) && (
        <>
          <StyledVesselForm>
            <FormikTextInput
              disabled={isDisabled}
              isErrorMessageHidden
              isUndefinedWhenDisabled
              label="MMSI"
              name={`${path}.mmsi`}
            />
            <FormikTextInput
              data-cy="infraction-form-vesselName"
              disabled={isDisabled}
              isErrorMessageHidden
              isUndefinedWhenDisabled
              label="Nom du navire"
              name={`${path}.vesselName`}
            />
          </StyledVesselForm>
          <StyledVesselForm>
            <FormikTextInput
              disabled={isDisabled}
              isErrorMessageHidden
              isUndefinedWhenDisabled
              label="IMO"
              name={`${path}.imo`}
            />
            <FormikTextInput
              data-cy="infraction-form-controlledPersonIdentity"
              disabled={isDisabled}
              isErrorMessageHidden
              isUndefinedWhenDisabled
              label="Nom du capitaine"
              name={`${path}.controlledPersonIdentity`}
            />
          </StyledVesselForm>
          <StyledVesselForm>
            <FormikTextInput
              data-cy="infraction-form-registrationNumber"
              disabled={isDisabled}
              isErrorMessageHidden
              isUndefinedWhenDisabled
              label="Immatriculation"
              name={`${path}.registrationNumber`}
            />
            <FormikNumberInput
              data-cy="infraction-form-vessel-size"
              disabled={isDisabled}
              isErrorMessageHidden
              isUndefinedWhenDisabled
              label="Taille"
              name={`${path}.vesselSize`}
            />
          </StyledVesselForm>
          <StyledVesselForm>
            <VesselTypeSelector disabled={isDisabled} name={`${path}.vesselType`} style={{ flex: '0 1 48.5%' }} />
          </StyledVesselForm>
        </>
      )}
    </>
  )
}
