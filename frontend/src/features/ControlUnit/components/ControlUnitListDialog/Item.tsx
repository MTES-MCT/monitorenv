import { Accent, type ControlUnit, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { closeAllOverlays } from 'domain/use_cases/map/closeAllOverlays'
import { property, uniqBy } from 'lodash/fp'
import { createEmpty, extend } from 'ol/extent'
import { fromLonLat } from 'ol/proj'
import styled from 'styled-components'

import { addBufferToExtent, displayBaseNamesFromControlUnit, displayControlUnitResourcesFromControlUnit } from './utils'
import { Layers } from '../../../../domain/entities/layers/constants'
import { globalActions } from '../../../../domain/shared_slices/Global'
import { mapActions } from '../../../../domain/shared_slices/Map'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { FrontendError } from '../../../../libs/FrontendError'
import { mainWindowActions } from '../../../MainWindow/slice'
import { stationActions } from '../../../Station/slice'
import { controlUnitDialogActions } from '../ControlUnitDialog/slice'

export type ItemProps = {
  controlUnit: ControlUnit.ControlUnit
}
export function Item({ controlUnit }: ItemProps) {
  const dispatch = useAppDispatch()
  const displayBaseLayer = useAppSelector(store => store.global.displayStationLayer)

  const center = () => {
    const highlightedStations = uniqBy(
      property('id'),
      controlUnit.controlUnitResources.map(({ station }) => station)
    )

    const highlightedStationFeatureIds = highlightedStations.map(station => `${Layers.STATIONS.code}:${station.id}`)

    if (highlightedStations.length === 1) {
      const station = highlightedStations[0]
      if (!station) {
        throw new FrontendError('`station` is undefined.')
      }

      const baseCoordinate = fromLonLat([station.longitude, station.latitude])

      dispatch(mapActions.setZoomToCenter(baseCoordinate))
    } else {
      const highlightedStationsExtent = createEmpty()
      highlightedStations.forEach(station => {
        const stationCoordinate = fromLonLat([station.longitude, station.latitude])
        const stationExtent = [
          stationCoordinate[0],
          stationCoordinate[1],
          stationCoordinate[0],
          stationCoordinate[1]
        ] as number[]

        extend(highlightedStationsExtent, stationExtent)
      })

      const bufferedHighlightedStationsExtent = addBufferToExtent(highlightedStationsExtent, 0.5)

      dispatch(mapActions.setFitToExtent(bufferedHighlightedStationsExtent))
    }

    dispatch(stationActions.hightlightFeatureIds(highlightedStationFeatureIds))
  }

  const edit = () => {
    dispatch(controlUnitDialogActions.setControlUnitId(controlUnit.id))
    dispatch(
      globalActions.setDisplayedItems({
        isControlUnitDialogVisible: true,
        isControlUnitListDialogVisible: false
      })
    )
    dispatch(mainWindowActions.setHasFullHeightRightDialogOpen(true))
    dispatch(closeAllOverlays())
  }

  return (
    <Wrapper data-cy="ControlUnitListDialog-control-unit" data-id={controlUnit.id} onClick={edit}>
      <Head>
        <NameText>{controlUnit.name}</NameText>
        {displayBaseLayer && (
          <IconButton
            accent={Accent.TERTIARY}
            disabled={!controlUnit.controlUnitResources.length}
            Icon={Icon.FocusZones}
            iconSize={18}
            isCompact
            onClick={center}
            withUnpropagatedClick
          />
        )}
      </Head>
      <AdministrationText>{controlUnit.administration.name}</AdministrationText>
      <ResourcesAndPortsText>{displayControlUnitResourcesFromControlUnit(controlUnit)}</ResourcesAndPortsText>
      <ResourcesAndPortsText>{displayBaseNamesFromControlUnit(controlUnit)}</ResourcesAndPortsText>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background-color: ${p => p.theme.color.gainsboro};
  cursor: pointer;
  margin-top: 8px;
  padding: 8px 8px 8px 12px;

  &:hover {
    background-color: ${p => p.theme.color.lightGray};
  }
`

const Head = styled.div`
  display: flex;
  justify-content: space-between;
`

const NameText = styled.div`
  color: ${p => p.theme.color.gunMetal};
  font-weight: bold;
  line-height: 18px;
`

const AdministrationText = styled.div`
  color: ${p => p.theme.color.gunMetal};
  line-height: 18px;
  margin: 2px 0 8px;
`

const ResourcesAndPortsText = styled.div`
  color: ${p => p.theme.color.slateGray};
  line-height: 18px;
`
