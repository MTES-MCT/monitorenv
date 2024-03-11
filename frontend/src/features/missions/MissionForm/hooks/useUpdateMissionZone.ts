import { OPENLAYERS_PROJECTION, WSG84_PROJECTION, usePrevious } from '@mtes-mct/monitor-ui'
import { convertToGeoJSONGeometryObject } from 'domain/entities/layers'
import { ActionTypeEnum, type Mission } from 'domain/entities/missions'
import { useFormikContext } from 'formik'
import { isEqual } from 'lodash'
import { Feature } from 'ol'
import { MultiPolygon } from 'ol/geom'
import Polygon, { circular } from 'ol/geom/Polygon'
import { useEffect } from 'react'

export const useUpdateMissionZone = sortedActions => {
  const { setFieldValue, values } = useFormikContext<Mission>()
  const previousFirstAction = usePrevious(sortedActions[0])
  const previousActionCoordinates = usePrevious(sortedActions[0]?.geom?.coordinates)

  const firstAction = sortedActions[0]
  const firstActionCoordinates = firstAction?.geom?.coordinates

  useEffect(() => {
    if (isEqual(previousFirstAction, firstAction) && isEqual(previousActionCoordinates, firstActionCoordinates)) {
      return
    }

    if (!firstAction && values.isGeometryComputedFromControls) {
      setFieldValue('geom', undefined)
      setFieldValue('isGeometryComputedFromControls', false)

      return
    }

    setFieldValue('isGeometryComputedFromControls', true)

    if (firstAction.actionType === ActionTypeEnum.CONTROL) {
      if (!firstAction.geom) {
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

      return
    }
    if (
      firstAction.actionType === ActionTypeEnum.SURVEILLANCE &&
      firstAction.geom &&
      !isEqual(values.geom?.coordinates, firstAction.geom.coordinates)
    ) {
      setFieldValue('isGeometryComputedFromControls', true)
      setFieldValue('geom', firstAction.geom)
    }
  }, [
    values,
    setFieldValue,
    sortedActions,
    previousFirstAction,
    firstAction,
    previousActionCoordinates,
    firstActionCoordinates
  ])
}
