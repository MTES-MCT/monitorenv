import { type ControlUnit, MapMenuDialog } from '@mtes-mct/monitor-ui'
import { uniq } from 'lodash/fp'
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
  const global = useAppSelector(state => state.global)
  const hasMapInteraction = useHasMapInteraction()

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

    const controlUnitIds = uniq(
      featureProperties.station.controlUnitResources.map(controlUnitResource => controlUnitResource.controlUnitId)
    )

    const controlUnitsFromApi = await Promise.all(
      controlUnitIds.map(async controlUnitResourceId => {
        const { data: controlUnit } = await dispatch(
          controlUnitsAPI.endpoints.getControlUnit.initiate(controlUnitResourceId)
        )
        if (!controlUnit) {
          throw new FrontendError('`controlUnit` is undefined.')
        }

        return controlUnit
      })
    )
    setControlUnits(controlUnitsFromApi)
  }, [dispatch, featureProperties.station])

  useEffect(() => {
    updateControlUnits()
  }, [updateControlUnits])

  if (!global.displayStationLayer || !featureProperties.station || hasMapInteraction) {
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
        {controlUnits.map(controlUnit => (
          <Item
            key={controlUnit.id}
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
