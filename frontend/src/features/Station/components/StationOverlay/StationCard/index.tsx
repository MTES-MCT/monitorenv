import { getFilteredControlUnits } from '@features/ControlUnit/useCases/getFilteredControlUnits'
import { type ControlUnit, MapMenuDialog } from '@mtes-mct/monitor-ui'
import { isNotArchived } from '@utils/isNotArchived'
import { uniq } from 'lodash-es'
import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import { Item } from './Item'
import { controlUnitsAPI } from '../../../../../api/controlUnitsAPI'
import { OverlayCard } from '../../../../../components/OverlayCard'
import { useAppDispatch } from '../../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../../hooks/useAppSelector'
import { useHasMapInteraction } from '../../../../../hooks/useHasMapInteraction'
import { FrontendError } from '../../../../../libs/FrontendError'
import { stationActions } from '../../../slice'

import type { Station } from '../../../../../domain/entities/station'
import type { FeatureLike } from 'ol/Feature'

export function StationCard({ feature, selected = false }: { feature: FeatureLike; selected?: boolean }) {
  const [controlUnits, setControlUnits] = useState<ControlUnit.ControlUnit[]>([])

  const dispatch = useAppDispatch()
  const displayStationLayer = useAppSelector(state => state.global.layers.displayStationLayer)
  const mapControlUnitListDialog = useAppSelector(store => store.mapControlUnitListDialog)

  const hasMapInteraction = useHasMapInteraction()
  const missionCenteredControlUnitId = useAppSelector(state => state.missionForms.missionCenteredControlUnitId)
  const featureProperties = feature.getProperties() as {
    station: Station.Station
  }

  const close = () => {
    dispatch(stationActions.hightlightFeatureIds([]))
    dispatch(stationActions.selectFeatureId(undefined))
  }

  const updateControlUnits = useCallback(async () => {
    if (!featureProperties.station || !featureProperties.station.controlUnitResources) {
      setControlUnits([])

      return
    }

    const controlUnitIds = missionCenteredControlUnitId
      ? [missionCenteredControlUnitId]
      : uniq(
          featureProperties.station.controlUnitResources.map(controlUnitResource => controlUnitResource.controlUnitId)
        )

    const controlUnitsFromApi = await Promise.all(
      controlUnitIds.map(async controlUnitId => {
        const { data: controlUnit } = await dispatch(controlUnitsAPI.endpoints.getControlUnit.initiate(controlUnitId))
        if (!controlUnit) {
          throw new FrontendError('`controlUnit` is undefined.')
        }

        return controlUnit
      })
    )

    let filteredControlUnits: ControlUnit.ControlUnit[] = [...controlUnitsFromApi]
    if (missionCenteredControlUnitId) {
      filteredControlUnits = controlUnitsFromApi.filter(isNotArchived)
    } else {
      // Appliquer les filtres de mapControlUnitListDialog
      filteredControlUnits = getFilteredControlUnits(
        'MAP_CONTROL_UNIT_FOR_STATION',
        mapControlUnitListDialog.filtersState,
        controlUnitsFromApi ?? []
      )
    }
    setControlUnits(filteredControlUnits)
  }, [dispatch, featureProperties.station, mapControlUnitListDialog.filtersState, missionCenteredControlUnitId])

  useEffect(() => {
    updateControlUnits()
  }, [updateControlUnits, missionCenteredControlUnitId])

  if ((!displayStationLayer && !missionCenteredControlUnitId) || !featureProperties.station || hasMapInteraction) {
    return null
  }

  return (
    <OverlayCard
      data-cy="StationOverlay-card"
      isCloseButtonHidden={!selected}
      onClose={close}
      title={featureProperties.station.name}
    >
      <StyledMapMenuDialogBody>
        {controlUnits.map((controlUnit, index) => (
          <Item
            // eslint-disable-next-line react/no-array-index-key
            key={`${controlUnit.id}-${index}`}
            controlUnit={controlUnit}
            onClose={close}
            stationId={featureProperties.station.id}
          />
        ))}
      </StyledMapMenuDialogBody>
    </OverlayCard>
  )
}

const StyledMapMenuDialogBody = styled(MapMenuDialog.Body)`
  height: 294px;

  > div:not(:first-child) {
    margin-top: 8px;
  }
`
