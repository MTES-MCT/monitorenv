import { useGetVesselQuery } from '@api/vesselsApi'
import { LastPositionResume } from '@features/Vessel/components/VesselResume/LastPositionResume'
import { Owner } from '@features/Vessel/components/VesselResume/Owner'
import { Summary } from '@features/Vessel/components/VesselResume/Summary'
import { Tabs } from '@features/Vessel/components/VesselResume/Tabs'
import { vesselAction } from '@features/Vessel/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Icon, IconButton, MapMenuDialog, OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import countries from 'i18n-iso-countries'
import { boundingExtent } from 'ol/extent'
import { transformExtent } from 'ol/proj'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import { setFitToExtent } from '../../../../domain/shared_slices/Map'
import { Flag } from '../VesselSearch/VesselSearchItem'

import type { Vessel } from '@features/Vessel/types'
import type { Coordinate } from 'ol/coordinate'

export type VesselResumePages = 'RESUME' | 'OWNER'

export const UNKNOWN = '-'

type VesselResumeProps = {
  id: number
}

export function VesselResume({ id }: VesselResumeProps) {
  const dispatch = useAppDispatch()
  const { data: vessel } = useGetVesselQuery(id)
  const [page, setPage] = useState<VesselResumePages>('RESUME')

  const focusVessel = useCallback(
    (lastPosition: Vessel.LastPosition | undefined) => {
      if (lastPosition?.geom) {
        const vesselCoordinates = [lastPosition.geom.coordinates[0], lastPosition.geom.coordinates[1]] as Coordinate
        if (vesselCoordinates) {
          const extent = transformExtent(boundingExtent([vesselCoordinates]), WSG84_PROJECTION, OPENLAYERS_PROJECTION)
          dispatch(setFitToExtent(extent))
        }
      }
    },
    [dispatch]
  )

  useEffect(() => {
    focusVessel(vessel?.lastPositions?.[0])
  }, [focusVessel, vessel?.lastPositions])

  if (!vessel) {
    return null
  }
  const countryName = vessel.flag ? countries.getName(vessel.flag.substring(0, 2).toLowerCase(), 'fr') : UNKNOWN

  return (
    <DialogWrapper>
      {vessel.lastPositions && vessel.lastPositions.length > 0 && (
        <ButtonsWrapper>
          <li>
            <IconButton
              Icon={Icon.FocusVessel}
              onClick={() => {
                focusVessel(vessel.lastPositions?.[0])
              }}
              title="Centrer sur le navire"
            />
          </li>
        </ButtonsWrapper>
      )}

      <StyledMapMenuDialogContainer data-cy={`vessel-resume-${vessel.shipName}`}>
        <MapMenuDialog.Header>
          <MapMenuDialog.Title>
            <TitleWrapper>
              <Flag
                rel="preload"
                src={`/flags/${vessel.flag ? `${vessel.flag.substring(0, 2).toLowerCase()}.svg` : 'unknown.png'}`}
                title={countryName}
              />
              {vessel.shipName}
            </TitleWrapper>
          </MapMenuDialog.Title>
          <MapMenuDialog.CloseButton
            Icon={Icon.Close}
            onClick={() => {
              dispatch(vesselAction.setSelectedVesselId(undefined))
            }}
            title="Fermer la fiche navire"
          />
        </MapMenuDialog.Header>
        {vessel.lastPositions && vessel.lastPositions.length > 0 ? (
          <>
            <Tabs
              onTabChange={tab => {
                setPage(tab)
              }}
            />
            <MapMenuDialog.Body>
              {page === 'RESUME' && (
                <>
                  {vessel.lastPositions && vessel.lastPositions.length > 0 && (
                    <LastPositionResume lastPositions={vessel.lastPositions} />
                  )}
                  <Summary vessel={vessel} />
                </>
              )}
              {page === 'OWNER' && <Owner vessel={vessel} />}
            </MapMenuDialog.Body>
          </>
        ) : (
          <MapMenuDialog.Body>
            <AisInformationMessage>
              <Icon.AttentionFilled />
              Navire non rattaché à l’AIS
            </AisInformationMessage>
            <Summary vessel={vessel} />
            <Owner vessel={vessel} />
          </MapMenuDialog.Body>
        )}
      </StyledMapMenuDialogContainer>
    </DialogWrapper>
  )
}

const TitleWrapper = styled.span`
  display: flex;
  font-size: 22px;
  gap: 8px;
`

const DialogWrapper = styled.div`
  display: flex;
  position: absolute;
  right: 50px;
  top: 55px;
`

const ButtonsWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 4px;
  left: 0;
  padding: 4px;
  position: relative;
  top: 110px;
`

const StyledMapMenuDialogContainer = styled(MapMenuDialog.Container)`
  background-color: ${p => p.theme.color.gainsboro};
  display: flex;
  max-height: calc(100% - 64px);
  overflow: auto;
  position: relative;
  right: 0;
  top: 0;
  width: 500px;
`

export const AisInformationMessage = styled.div`
  align-items: center;
  background-color: ${p => p.theme.color.blueGray25};
  border-color: ${p => p.theme.color.blueGrayBorder};
  color: ${p => p.theme.color.blueYonder};
  display: flex;
  font-weight: bold;
  gap: 8px;
  margin-bottom: 10px;
  padding: 16px 20px;
`
