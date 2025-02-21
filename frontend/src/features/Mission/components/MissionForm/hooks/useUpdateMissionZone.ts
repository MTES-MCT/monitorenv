import { useAppSelector } from '@hooks/useAppSelector'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { convertToGeoJSONGeometryObject } from 'domain/entities/layers'
import { InteractionListener } from 'domain/entities/map/constants'
import {
  ActionSource,
  ActionTypeEnum,
  CIRCULAR_ZONE_RADIUS,
  type ActionsTypeForTimeLine,
  type ControlOrSurveillance,
  type Mission
} from 'domain/entities/missions'
import { useFormikContext } from 'formik'
import { isEqual } from 'lodash'
import { Feature } from 'ol'
import { MultiPolygon } from 'ol/geom'
import Polygon, { circular } from 'ol/geom/Polygon'
import { useCallback, useEffect, useMemo, useState } from 'react'

import type { GeoJSON } from 'domain/types/GeoJSON'

function computeCircleZone(coordinates) {
  const circleGeometry = new Feature({
    geometry: circular(coordinates, CIRCULAR_ZONE_RADIUS, 64).transform(WSG84_PROJECTION, OPENLAYERS_PROJECTION)
  }).getGeometry()

  return convertToGeoJSONGeometryObject(new MultiPolygon([circleGeometry as Polygon]))
}

export const useUpdateMissionZone = (sortedActions: Array<ActionsTypeForTimeLine>) => {
  const filteredEnvActions = useMemo(
    () =>
      sortedActions.filter(
        action =>
          action.actionSource === ActionSource.MONITORENV &&
          (action.actionType === ActionTypeEnum.SURVEILLANCE || action.actionType === ActionTypeEnum.CONTROL)
      ) as Array<ControlOrSurveillance>,
    [sortedActions]
  )

  const firstAction = filteredEnvActions[0]
  const firstActionWithDate = firstAction?.actionStartDateTimeUtc ? firstAction : undefined

  const listener = useAppSelector(state => state.draw.listener)
  const { setFieldValue, values } = useFormikContext<Mission>()
  const [actionGeom, setActionGeom] = useState<GeoJSON.MultiPolygon | GeoJSON.MultiPoint | undefined>(undefined)

  const updateMissionZoneGeometry = useCallback(() => {
    if (!firstActionWithDate?.geom || isEqual(firstActionWithDate.geom, actionGeom)) {
      return
    }

    // for control action we need to compute a circle for mission zone
    const updateGeometryForControlAction = () => {
      const { coordinates } = firstActionWithDate?.geom as GeoJSON.Polygon | GeoJSON.MultiPolygon

      if (coordinates.length === 0) {
        return
      }

      const circleZone = computeCircleZone(coordinates[0])
      if (!isEqual(values.geom, circleZone)) {
        setFieldValue('geom', circleZone)
      }
    }

    const updateGeometryForSurveillanceAction = () => {
      if (!isEqual(values.geom, firstActionWithDate?.geom)) {
        setFieldValue('geom', firstActionWithDate?.geom)
      }
    }

    // Handle geometry update based on action type
    switch (firstActionWithDate?.actionType) {
      case ActionTypeEnum.CONTROL:
        updateGeometryForControlAction()
        break
      case ActionTypeEnum.SURVEILLANCE:
        updateGeometryForSurveillanceAction()
        break
      default:
        break
    }

    if (!values.isGeometryComputedFromControls) {
      setFieldValue('isGeometryComputedFromControls', true)
    }
    setActionGeom(firstActionWithDate?.geom)
  }, [actionGeom, firstActionWithDate, setFieldValue, values.geom, values.isGeometryComputedFromControls])

  useEffect(() => {
    // if user has added a zone manually and deleted it
    const clearManualZoneIfDeleted = () => {
      if (!values.isGeometryComputedFromControls && actionGeom && values.geom?.coordinates.length === 0) {
        setActionGeom(undefined)
      }
    }

    // if no action in mission, we clean the mission zone if it was computed from actions
    const cleanMissionZoneIfNoActions = () => {
      if (filteredEnvActions.length === 0 && values.fishActions.length === 0 && values.isGeometryComputedFromControls) {
        setFieldValue('geom', undefined)
        setFieldValue('isGeometryComputedFromControls', false)
        setActionGeom(undefined)

        return true
      }

      return false
    }

    // As a action from Fish is newer, we do not update the mission location
    const skipIfFromMonitorFish = () => sortedActions[0]?.actionSource === ActionSource.MONITORFISH

    const skipIfNoCoordinates = () => firstActionWithDate?.geom?.coordinates.length === 0

    // no need to update geom if we are in mission zone listener or if user add manually a zone
    const skipIfNotListeningOrManual = () =>
      listener === InteractionListener.MISSION_ZONE ||
      (!values.isGeometryComputedFromControls && values.geom && values.geom.coordinates.length > 0)

    clearManualZoneIfDeleted()
    if (cleanMissionZoneIfNoActions()) {
      return
    }
    if (skipIfFromMonitorFish()) {
      return
    }
    if (skipIfNoCoordinates()) {
      return
    }
    if (skipIfNotListeningOrManual()) {
      return
    }
    updateMissionZoneGeometry()
  }, [
    values.isGeometryComputedFromControls,
    values.geom,
    setFieldValue,
    sortedActions,
    listener,
    firstAction,
    actionGeom,
    values.fishActions.length,
    filteredEnvActions.length,
    firstActionWithDate?.geom,
    firstActionWithDate?.actionType,
    firstActionWithDate,
    updateMissionZoneGeometry
  ])
}
