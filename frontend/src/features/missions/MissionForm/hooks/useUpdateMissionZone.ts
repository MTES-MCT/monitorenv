import { useAppSelector } from '@hooks/useAppSelector'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '@mtes-mct/monitor-ui'
import { convertToGeoJSONGeometryObject } from 'domain/entities/layers'
import { InteractionListener } from 'domain/entities/map/constants'
import { ActionSource, ActionTypeEnum, CIRCULAR_ZONE_RADIUS, type Mission } from 'domain/entities/missions'
import { useFormikContext } from 'formik'
import { isEqual } from 'lodash'
import { Feature } from 'ol'
import { MultiPolygon } from 'ol/geom'
import Polygon, { circular } from 'ol/geom/Polygon'
import { useEffect, useState } from 'react'

function computeCircleZone(coordinates) {
  const circleGeometry = new Feature({
    geometry: circular(coordinates, CIRCULAR_ZONE_RADIUS, 64).transform(WSG84_PROJECTION, OPENLAYERS_PROJECTION)
  }).getGeometry()

  return convertToGeoJSONGeometryObject(new MultiPolygon([circleGeometry as Polygon]))
}

export const useUpdateMissionZone = sortedActions => {
  const firstAction = sortedActions[0]
  const listener = useAppSelector(state => state.draw.listener)
  const { setFieldValue, values } = useFormikContext<Mission>()
  const [actionGeom, setActionGeom] = useState(values.geom && firstAction?.geom ? firstAction?.geom : undefined)

  useEffect(() => {
    // if user has added a zone manually and deleted it
    if (!values.isGeometryComputedFromControls && actionGeom && values.geom?.coordinates.length === 0) {
      setActionGeom(undefined)
    }
    // no need to update geom if we are in mission zone listener or if user add manually a zone
    if (
      listener === InteractionListener.MISSION_ZONE ||
      (!values.isGeometryComputedFromControls && values.geom && values.geom.coordinates.length > 0)
    ) {
      return
    }

    // if action has been deleted
    if ((!firstAction || firstAction.geom?.coordinates.length === 0) && values.isGeometryComputedFromControls) {
      setFieldValue('geom', undefined)
      setFieldValue('isGeometryComputedFromControls', false)

      return
    }

    // EnvActions
    if (
      firstAction?.actionSource === ActionSource.MONITORENV &&
      firstAction?.geom &&
      !isEqual(firstAction.geom, actionGeom)
    ) {
      // for control action we need to compute a circle for mission zone
      if (firstAction?.actionType === ActionTypeEnum.CONTROL) {
        const { coordinates } = firstAction.geom
        if (coordinates.length === 0) {
          setFieldValue('geom', undefined)
          setActionGeom(undefined)

          return
        }
        const circleZone = computeCircleZone(coordinates[0])

        setFieldValue('geom', circleZone)
      }

      if (firstAction?.actionType === ActionTypeEnum.SURVEILLANCE) {
        setFieldValue('geom', firstAction.geom)
      }

      if (
        !values.isGeometryComputedFromControls &&
        (firstAction?.actionType === ActionTypeEnum.CONTROL || firstAction?.actionType === ActionTypeEnum.SURVEILLANCE)
      ) {
        setFieldValue('isGeometryComputedFromControls', true)
      }

      setActionGeom(firstAction.geom)
    }

    // FishActions
    if (
      firstAction?.actionSource === ActionSource.MONITORFISH &&
      !isEqual([firstAction.latitude, firstAction.longitude], actionGeom)
    ) {
      if (!firstAction.latitude || !firstAction.longitude) {
        setFieldValue('geom', undefined)
        setFieldValue('isGeometryComputedFromControls', false)
        setActionGeom(undefined)

        return
      }
      const circleZone = computeCircleZone([firstAction.longitude, firstAction.latitude])

      setFieldValue('geom', circleZone)
      if (!values.isGeometryComputedFromControls) {
        setFieldValue('isGeometryComputedFromControls', true)
      }

      setActionGeom([firstAction.latitude, firstAction.longitude])
    }
  }, [
    values.isGeometryComputedFromControls,
    values.geom,
    setFieldValue,
    sortedActions,
    listener,
    firstAction,
    actionGeom
  ])
}
