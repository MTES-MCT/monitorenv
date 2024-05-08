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
import { useEffect, useMemo, useState } from 'react'

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
  const [actionGeom, setActionGeom] = useState(
    values.geom && firstActionWithDate?.geom ? firstActionWithDate?.geom : undefined
  )

  useEffect(() => {
    // if user has added a zone manually and deleted it
    if (!values.isGeometryComputedFromControls && actionGeom && values.geom?.coordinates.length === 0) {
      setActionGeom(undefined)
    }

    // if no action in mission, we clean the mission zone if it was computed from actions
    if (filteredEnvActions.length === 0 && values.fishActions.length === 0 && values.isGeometryComputedFromControls) {
      setFieldValue('geom', undefined)
      setFieldValue('isGeometryComputedFromControls', false)
      setActionGeom(undefined)

      return
    }
    // As a action from Fish is newer, we do not update the mission location
    if (sortedActions[0]?.actionSource === ActionSource.MONITORFISH) {
      return
    }

    if (firstActionWithDate?.geom?.coordinates.length === 0) {
      return
    }

    // no need to update geom if we are in mission zone listener or if user add manually a zone
    if (
      listener === InteractionListener.MISSION_ZONE ||
      (!values.isGeometryComputedFromControls && values.geom && values.geom.coordinates.length > 0)
    ) {
      return
    }

    if (firstActionWithDate?.geom && !isEqual(firstActionWithDate.geom, actionGeom)) {
      // for control action we need to compute a circle for mission zone
      if (firstActionWithDate.actionType === ActionTypeEnum.CONTROL) {
        const { coordinates } = firstActionWithDate.geom
        if (coordinates.length === 0) {
          return
        }
        const circleZone = computeCircleZone(coordinates[0])
        setFieldValue('geom', circleZone)
      }

      if (firstActionWithDate.actionType === ActionTypeEnum.SURVEILLANCE) {
        setFieldValue('geom', firstActionWithDate.geom)
      }

      if (!values.isGeometryComputedFromControls) {
        setFieldValue('isGeometryComputedFromControls', true)
      }
      setActionGeom(firstActionWithDate.geom)
    }
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
    firstActionWithDate?.actionType
  ])
}
