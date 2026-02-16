import { useGetReportingsByMmsiQuery } from '@api/reportingsAPI'
import { useGetVesselQuery } from '@api/vesselsApi'
import { Bold } from '@components/style'
import {
  type HistoryOfInfractionsProps,
  initialHistory,
  useGetHistoryOfInfractions
} from '@features/Reportings/components/ReportingForm/hooks/useGetHistoryOfInfractions'
import { History } from '@features/Vessel/components/VesselResume/History/History'
import { Owner } from '@features/Vessel/components/VesselResume/Owner'
import { LastPosition } from '@features/Vessel/components/VesselResume/Resume/LastPosition'
import { Summary } from '@features/Vessel/components/VesselResume/Resume/Summary'
import { Tabs } from '@features/Vessel/components/VesselResume/Tabs'
import { UNKNOWN } from '@features/Vessel/components/VesselResume/utils'
import { vesselAction } from '@features/Vessel/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import {
  customDayjs,
  Icon,
  IconButton,
  MapMenuDialog,
  OPENLAYERS_PROJECTION,
  pluralize,
  WSG84_PROJECTION
} from '@mtes-mct/monitor-ui'
import { skipToken } from '@reduxjs/toolkit/query'
import countries from 'i18n-iso-countries'
import { boundingExtent } from 'ol/extent'
import { transformExtent } from 'ol/proj'
import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { VisibilityState } from '../../../../domain/shared_slices/Global'
import { setFitToExtent } from '../../../../domain/shared_slices/Map'
import { Flag } from '../VesselSearch/VesselSearchItem'

import type { Vessel } from '@features/Vessel/types'
import type { Coordinate } from 'ol/coordinate'

export type VesselResumePages = 'RESUME' | 'OWNER' | 'HISTORY'

type VesselResumeProps = {
  id: number
}

export function VesselResume({ id }: VesselResumeProps) {
  const dispatch = useAppDispatch()
  const { visibility } = useAppSelector(state => state.global.visibility.reportingFormVisibility)
  const isRightMenuOpened = useAppSelector(state => state.mainWindow.isRightMenuOpened)
  const { data: vessel } = useGetVesselQuery(id)
  const [page, setPage] = useState<VesselResumePages>('RESUME')
  const [allHistory, setAllHistory] = useState<HistoryOfInfractionsProps | undefined>(undefined)

  const getHistory = useGetHistoryOfInfractions(false)
  const { data: allReportings } = useGetReportingsByMmsiQuery(vessel?.mmsi || skipToken)

  useEffect(() => {
    const fetchHistory = async () => {
      if (!vessel?.mmsi) {
        return initialHistory
      }

      return getHistory({ mmsi: vessel?.mmsi })
    }

    fetchHistory().then(result => setAllHistory(result))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vessel?.mmsi])

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

  const currentNbReportings = useMemo(
    () =>
      Object.values(allReportings?.entities ?? []).filter(
        reporting => customDayjs(reporting.createdAt).isBefore(customDayjs()) && !reporting.isArchived
      ).length,
    [allReportings?.entities]
  )

  if (!vessel) {
    return null
  }

  const countryName = vessel.flag ? countries.getName(vessel.flag.substring(0, 2).toLowerCase(), 'fr') : UNKNOWN

  return (
    <DialogWrapper $isRightMenuOpened={isRightMenuOpened} $visibility={visibility}>
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
                  {currentNbReportings > 0 && (
                    <CurrentReportingBanner>
                      <Icon.AttentionFilled />
                      <Bold>
                        {currentNbReportings} {pluralize('signalement', currentNbReportings)} en cours
                      </Bold>
                    </CurrentReportingBanner>
                  )}

                  {vessel.lastPositions && vessel.lastPositions.length > 0 && (
                    <LastPosition lastPositions={vessel.lastPositions} />
                  )}
                  <Summary vessel={vessel} />
                </>
              )}
              {page === 'OWNER' && <Owner vessel={vessel} />}
              {page === 'HISTORY' && (
                <History
                  envActions={allHistory?.envActions ?? []}
                  mmsi={vessel.mmsi}
                  reportings={Object.values(allReportings?.entities ?? [])}
                />
              )}
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

const DialogWrapper = styled.div<{ $isRightMenuOpened: boolean; $visibility: VisibilityState }>`
  display: flex;
  position: absolute;
  right: 50px;
  top: 55px;
  ${p => p.$visibility === VisibilityState.VISIBLE && `transform: translateX(-457px);`}
  ${p => p.$isRightMenuOpened && `transform: translateX(calc(-100% + 42px));`}
    transition: 0.3s transform;
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
  max-height: calc(100vh - 64px);
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

const CurrentReportingBanner = styled.div`
  background-color: ${p => p.theme.color.maximumRed15};
  border: 1px solid #ebacb0;
  color: ${p => p.theme.color.maximumRed};
  display: flex;
  gap: 8px;
  padding: 10px 20px;
  margin-bottom: 10px;
`
