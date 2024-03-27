import { useAppSelector } from '@hooks/useAppSelector'
import { OPENLAYERS_PROJECTION, WSG84_PROJECTION, usePrevious } from '@mtes-mct/monitor-ui'
import { convertToGeoJSONGeometryObject } from 'domain/entities/layers'
import { InteractionListener } from 'domain/entities/map/constants'
import { ActionSource, ActionTypeEnum, type Mission } from 'domain/entities/missions'
import { useFormikContext } from 'formik'
import { isEqual } from 'lodash'
import { Feature } from 'ol'
import { MultiPolygon } from 'ol/geom'
import Polygon, { circular } from 'ol/geom/Polygon'
import { useEffect, useMemo } from 'react'

export const useUpdateMissionZone = sortedActions => {
  const listener = useAppSelector(state => state.draw.listener)
  const { setFieldValue, values } = useFormikContext<Mission>()
  const previousFirstAction = usePrevious(sortedActions[0])
  const previousActionCoordinates = usePrevious(
    sortedActions[0].actionSource === ActionSource.MONITORENV
      ? sortedActions[0]?.geom?.coordinates
      : [sortedActions[0].latitude, sortedActions[0].longitude]
  )

  const firstAction = sortedActions[0]
  const firstActionCoordinates = useMemo(
    () =>
      sortedActions[0].actionSource === ActionSource.MONITORENV
        ? sortedActions[0]?.geom?.coordinates
        : [sortedActions[0].latitude, sortedActions[0].longitude],
    [sortedActions]
  )

  useEffect(() => {
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

    if (firstAction.actionSource === ActionSource.MONITORFISH && firstAction.latitude && firstAction.longitude) {
      // on form mounted
      if (!previousFirstAction || !previousActionCoordinates) {
        return
      }
      if (
        isEqual(previousFirstAction, firstAction) &&
        isEqual(previousActionCoordinates, firstActionCoordinates) &&
        values.geom &&
        values.geom.coordinates?.length > 0
      ) {
        return
      }
      const circleGeometry = new Feature({
        geometry: circular([firstAction.longitude, firstAction.latitude], 4000, 64).transform(
          WSG84_PROJECTION,
          OPENLAYERS_PROJECTION
        )
      }).getGeometry()
      setFieldValue('geom', convertToGeoJSONGeometryObject(new MultiPolygon([circleGeometry as Polygon])))
      if (!values.isGeometryComputedFromControls) {
        setFieldValue('isGeometryComputedFromControls', true)
      }
    }

    if (firstAction?.actionType === ActionTypeEnum.CONTROL && firstAction?.geom) {
      // on form mounted
      if (!previousFirstAction || !previousActionCoordinates) {
        return
      }
      if (
        previousFirstAction &&
        previousActionCoordinates &&
        isEqual(previousFirstAction, firstAction) &&
        isEqual(previousActionCoordinates, firstActionCoordinates) &&
        values.geom &&
        values.geom.coordinates?.length > 0
      ) {
        return
      }
      const radius = 4000
      const { coordinates } = firstAction.geom
      if (coordinates.length === 0) {
        return
      }

      const circleGeometry = new Feature({
        geometry: circular(coordinates[0], radius, 64).transform(WSG84_PROJECTION, OPENLAYERS_PROJECTION)
      }).getGeometry()

      setFieldValue('geom', convertToGeoJSONGeometryObject(new MultiPolygon([circleGeometry as Polygon])))
      if (!values.isGeometryComputedFromControls) {
        setFieldValue('isGeometryComputedFromControls', true)
      }

      return
    }
    if (
      firstAction?.actionType === ActionTypeEnum.SURVEILLANCE &&
      firstAction?.geom &&
      !isEqual(values.geom?.coordinates, firstAction.geom.coordinates)
    ) {
      setFieldValue('geom', firstAction.geom)
      if (!values.isGeometryComputedFromControls) {
        setFieldValue('isGeometryComputedFromControls', true)
      }
    }
  }, [
    values.isGeometryComputedFromControls,
    values.geom,
    setFieldValue,
    sortedActions,
    previousFirstAction,
    firstAction,
    previousActionCoordinates,
    firstActionCoordinates,
    listener
  ])
}
