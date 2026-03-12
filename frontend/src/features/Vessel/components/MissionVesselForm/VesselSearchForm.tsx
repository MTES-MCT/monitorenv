import { useGetVesselQuery, useLazyGetVesselQuery } from '@api/vesselsApi'
import { LoadingIcon } from '@components/style'
import {
  StyledLinkButton,
  VesselSearchInputWrapper,
  VesselSearchWrapper
} from '@features/Mission/components/MissionForm/ActionForm/ControlForm/InfractionForm/InfractionFormHeaderVehicle'
import { HistoryOfInfractions } from '@features/Reportings/components/ReportingForm/FormComponents/Target/HistoryOfInfractions'
import { SearchVessel } from '@features/Vessel/components/VesselSearch'
import { VesselSearchDescription } from '@features/Vessel/components/VesselSearch/VesselSearchDescription'
import { vesselAction } from '@features/Vessel/slice'
import { isVesselsEnabled } from '@features/Vessel/utils'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Checkbox } from '@mtes-mct/monitor-ui'
import { skipToken } from '@reduxjs/toolkit/query'
import { useField, useFormikContext } from 'formik'
import { useCallback, useEffect, useState } from 'react'

import type { Mission } from '../../../../domain/entities/missions'
import type { Vessel } from '@features/Vessel/types'

type VesselSearchFormProps = {
  batchId: number | undefined
  envActionId: string | undefined
  isUnknown: boolean | undefined
  onIsUnknown: (isUnknow: boolean | undefined) => void
  path: string
  rowNumber: number | undefined
  shipId: number | undefined
}

export function VesselSearchForm({
  batchId,
  envActionId,
  isUnknown,
  onIsUnknown,
  path,
  rowNumber,
  shipId
}: VesselSearchFormProps) {
  const dispatch = useAppDispatch()
  const [mmsi] = useField(`${path}.mmsi`)
  const [selectedVessel, setSelectedVessel] = useState<Vessel.Vessel | undefined>()
  const [getVessel, { isLoading }] = useLazyGetVesselQuery()
  const { data: vessel } = useGetVesselQuery(shipId ? { batchId, rowNumber, shipId } : skipToken)
  const { setFieldValue } = useFormikContext<Mission>()

  useEffect(() => {
    if (vessel) {
      setSelectedVessel(vessel)
    }
  }, [vessel])

  const clear = useCallback(() => {
    setFieldValue(`${path}.shipId`, undefined)
    setFieldValue(`${path}.batchId`, undefined)
    setFieldValue(`${path}.rowNumber`, undefined)
    setFieldValue(`${path}.mmsi`, undefined)
    setFieldValue(`${path}.imo`, undefined)
    setFieldValue(`${path}.vesselName`, undefined)
    setFieldValue(`${path}.registrationNumber`, undefined)
    setFieldValue(`${path}.vesselSize`, undefined)
    setFieldValue(`${path}.vesselType`, undefined)
    setFieldValue(`${path}.controlledPersonIdentity`, undefined)
  }, [setFieldValue, path])

  const handleVesselChange = async (vesselIdentity: Vessel.Identity | undefined) => {
    setSelectedVessel(vesselIdentity)
    if (vesselIdentity) {
      await getVessel({
        batchId: vesselIdentity.batchId,
        rowNumber: vesselIdentity.rowNumber,
        shipId: vesselIdentity.shipId
      })
        .unwrap()
        .then(vesselFound => {
          const controlledPersonIdentity = [vesselFound.ownerLastName, vesselFound.ownerFirstName].filter(Boolean)
          setFieldValue(`${path}.shipId`, vesselFound.shipId)
          setFieldValue(`${path}.batchId`, vesselFound.batchId)
          setFieldValue(`${path}.rowNumber`, vesselFound.rowNumber)
          setFieldValue(`${path}.vesselName`, vesselFound.shipName)
          setFieldValue(`${path}.registrationNumber`, vesselFound.immatriculation)
          setFieldValue(`${path}.vesselSize`, vesselFound.length)
          setFieldValue(
            `${path}.vesselType`,
            vessel?.category === 'PLA' ? vesselFound.leisureType : vesselFound.professionalType
          )
          setFieldValue(
            `${path}.controlledPersonIdentity`,
            controlledPersonIdentity.length > 0 ? controlledPersonIdentity.join(' ') : undefined
          )
        })
    }
    if (!vesselIdentity && shipId) {
      clear()
    }
  }

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
              <SearchVessel
                disabled={isUnknown}
                isLight={false}
                isSideWindow
                onChange={handleVesselChange}
                value={selectedVessel}
              />
              {selectedVessel && (
                <StyledLinkButton
                  onClick={() =>
                    dispatch(
                      vesselAction.setSelectedVesselId({
                        batchId: selectedVessel.batchId,
                        rowNumber: selectedVessel.rowNumber,
                        shipId: selectedVessel?.shipId
                      })
                    )
                  }
                >
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

      {selectedVessel && <VesselSearchDescription category={selectedVessel.category} path={path} />}
    </>
  )
}
