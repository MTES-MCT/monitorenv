import { useGetVesselQuery, useLazyGetVesselQuery } from '@api/vesselApi'
import { LoadingIcon } from '@components/style'
import {
  StyledLinkButton,
  VesselSearchInputWrapper,
  VesselSearchWrapper
} from '@features/Mission/components/MissionForm/ActionForm/ControlForm/InfractionForm/InfractionFormHeaderVehicle'
import { HistoryOfInfractions } from '@features/Reportings/components/ReportingForm/FormComponents/Target/HistoryOfInfractions'
import { SearchVessel } from '@features/Vessel/SearchVessels'
import { vesselAction } from '@features/Vessel/slice'
import { isVesselsEnabled } from '@features/Vessel/utils'
import { VesselSearchDescription } from '@features/Vessel/VesselSearchDescription'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Checkbox } from '@mtes-mct/monitor-ui'
import { skipToken } from '@reduxjs/toolkit/query'
import { useField, useFormikContext } from 'formik'
import { useCallback, useEffect, useState } from 'react'

import type { Vessel } from '@features/Vessel/types'
import type { Mission } from 'domain/entities/missions'

type VesselSearchFormProps = {
  envActionId: string | undefined
  isUnknown: boolean | undefined
  onIsUnknown: (isUnknow: boolean | undefined) => void
  path: string
  vesselId: number | undefined
}

export function VesselSearchForm({ envActionId, isUnknown, onIsUnknown, path, vesselId }: VesselSearchFormProps) {
  const dispatch = useAppDispatch()
  const [mmsi] = useField(`${path}.mmsi`)
  const [selectedVessel, setSelectedVessel] = useState<Vessel.Vessel | undefined>()
  const [getVessel, { isLoading }] = useLazyGetVesselQuery()
  const { data: vessel } = useGetVesselQuery(vesselId === undefined ? skipToken : vesselId)
  const { setFieldValue } = useFormikContext<Mission>()

  useEffect(() => {
    if (vessel) {
      setSelectedVessel(vessel)
    }
  }, [vessel])

  const clear = useCallback(() => {
    setFieldValue(`${path}.vesselId`, undefined)
    setFieldValue(`${path}.mmsi`, undefined)
    setFieldValue(`${path}.imo`, undefined)
    setFieldValue(`${path}.vesselName`, undefined)
    setFieldValue(`${path}.registrationNumber`, undefined)
    setFieldValue(`${path}.vesselSize`, undefined)
    setFieldValue(`${path}.vesselType`, undefined)
    setFieldValue(`${path}.controlledPersonIdentity`, undefined)
  }, [setFieldValue, path])

  const handleVesselChange = useCallback(
    async (vesselIdentity: Vessel.Identity | undefined) => {
      setSelectedVessel(vesselIdentity)
      if (vesselIdentity) {
        await getVessel(vesselIdentity.id)
          .unwrap()
          .then(vesselFound => {
            setFieldValue(`${path}.vesselId`, vesselFound.id)
            setFieldValue(`${path}.mmsi`, vesselFound.mmsi)
            setFieldValue(`${path}.imo`, vesselFound.imo)
            setFieldValue(`${path}.vesselName`, vesselFound.shipName)
            setFieldValue(`${path}.registrationNumber`, vesselFound.immatriculation)
            setFieldValue(`${path}.vesselSize`, vesselFound.length)
            setFieldValue(`${path}.vesselType`, vesselFound.professionalType)
            setFieldValue(
              `${path}.controlledPersonIdentity`,
              [vesselFound.ownerLastName, vesselFound.ownerFirstName].filter(Boolean).join(' ')
            )
          })
      }
      if (!vesselIdentity && vesselId) {
        clear()
      }
    },
    [clear, getVessel, path, setFieldValue, vesselId]
  )

  const handleUnknownShip = (isChecked: boolean | undefined) => {
    onIsUnknown(isChecked)
    clear()
  }

  return (
    <>
      {isVesselsEnabled() && (
        <>
          <VesselSearchWrapper>
            <HistoryOfInfractions envActionId={envActionId} isReadOnly mmsi={mmsi.value} />
            <VesselSearchInputWrapper>
              <SearchVessel disabled={isUnknown} isLight={false} onChange={handleVesselChange} value={selectedVessel} />
              {selectedVessel && (
                <StyledLinkButton onClick={() => dispatch(vesselAction.setSelectedVesselId(selectedVessel?.id))}>
                  Voir la fiche navire
                </StyledLinkButton>
              )}
              {isLoading && <LoadingIcon />}
            </VesselSearchInputWrapper>
          </VesselSearchWrapper>
          {!selectedVessel && (
            <Checkbox
              checked={isUnknown}
              inline
              isLight={false}
              label="Navire absent de la base de données"
              name=""
              onChange={handleUnknownShip}
            />
          )}
        </>
      )}

      {selectedVessel && <VesselSearchDescription path={path} />}
    </>
  )
}
