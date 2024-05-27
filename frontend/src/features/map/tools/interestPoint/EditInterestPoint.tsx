import { Accent, Button, Icon, MapMenuDialog, TextInput, Textarea } from '@mtes-mct/monitor-ui'
import { setDisplayedItems } from 'domain/shared_slices/Global'
import { boundingExtent } from 'ol/extent'
import { transform, transformExtent } from 'ol/proj'
import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import { CoordinatesFormat, OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../../domain/entities/map/constants'
import {
  addInterestPoint,
  deleteInterestPointBeingDrawed,
  drawInterestPoint,
  endInterestPointDraw,
  updateInterestPointKeyBeingDrawed
} from '../../../../domain/shared_slices/InterestPoint'
import { setFitToExtent } from '../../../../domain/shared_slices/Map'
import { saveInterestPointFeature } from '../../../../domain/use_cases/interestPoint/saveInterestPointFeature'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { coordinatesAreDistinct, getCoordinates } from '../../../../utils/coordinates'
import { SetCoordinates } from '../../../coordinates/SetCoordinates'

import type { Coordinate } from 'ol/coordinate'

// TODO Refactor this component
// - Move the state logic to the reducer
// - Use formik (or at least uncontrolled form components)
type EditInterestPointProps = {
  close: () => void
}
export function EditInterestPoint({ close }: EditInterestPointProps) {
  const dispatch = useAppDispatch()

  const { interestPointBeingDrawed, isEditing } = useAppSelector(state => state.interestPoint)
  const displayInterestPointLayer = useAppSelector(state => state.global.displayInterestPointLayer)

  const [localCoordinates, setLocalCoordinates] = useState<Coordinate>([0, 0])

  /** Coordinates formatted in DD [latitude, longitude] */
  const coordinates: number[] = useMemo(() => {
    if (!interestPointBeingDrawed?.coordinates?.length) {
      return []
    }

    const [latitude, longitude] = getCoordinates(
      interestPointBeingDrawed.coordinates,
      OPENLAYERS_PROJECTION,
      CoordinatesFormat.DECIMAL_DEGREES,
      false
    )
    if (!latitude || !longitude) {
      return []
    }

    return [parseFloat(latitude.replace(/°/g, '')), parseFloat(longitude.replace(/°/g, ''))]
  }, [interestPointBeingDrawed?.coordinates])

  const updateName = useCallback(
    name => {
      if (interestPointBeingDrawed?.name !== name) {
        dispatch(
          updateInterestPointKeyBeingDrawed({
            key: 'name',
            value: name
          })
        )
      }
    },
    [dispatch, interestPointBeingDrawed?.name]
  )

  const updateObservations = useCallback(
    observations => {
      if (interestPointBeingDrawed?.observations !== observations) {
        dispatch(
          updateInterestPointKeyBeingDrawed({
            key: 'observations',
            value: observations
          })
        )
      }
    },
    [dispatch, interestPointBeingDrawed?.observations]
  )

  /**
   * Compare with previous coordinates and update interest point coordinates
   * @param {Coordinate} nextCoordinates - Coordinates ([latitude, longitude]) to update, in decimal format.
   * @param {Coordinate} coordinates - Previous coordinates ([latitude, longitude]), in decimal format.
   */
  const updateCoordinates = useCallback(
    (nextCoordinates: Coordinate, previousCoordinates: Coordinate) => {
      if (nextCoordinates?.length) {
        if (!previousCoordinates?.length || coordinatesAreDistinct(nextCoordinates, previousCoordinates)) {
          const [latitude, longitude] = nextCoordinates
          if (!latitude || !longitude) {
            return
          }

          setLocalCoordinates(nextCoordinates)
          // Convert to [longitude, latitude] and OpenLayers projection
          const updatedCoordinates = transform([longitude, latitude], WSG84_PROJECTION, OPENLAYERS_PROJECTION)
          dispatch(
            updateInterestPointKeyBeingDrawed({
              key: 'coordinates',
              value: updatedCoordinates
            })
          )
        }
      }
    },
    [dispatch]
  )

  const saveInterestPoint = () => {
    if (coordinates?.length > 0) {
      dispatch(saveInterestPointFeature())
      dispatch(addInterestPoint())
      close()

      if (!isEditing) {
        const formattedCoordinates = [localCoordinates[1], localCoordinates[0]] as Coordinate
        const extent = transformExtent(boundingExtent([formattedCoordinates]), WSG84_PROJECTION, OPENLAYERS_PROJECTION)
        dispatch(setFitToExtent(extent))
      }
    }
  }

  const cancel = () => {
    close()
  }

  return (
    <MapMenuDialog.Container data-cy="save-interest-point">
      <MapMenuDialog.Header>
        <MapMenuDialog.CloseButton Icon={Icon.Close} onClick={close} />
        <MapMenuDialog.Title>Créer un point d&apos;intérêt</MapMenuDialog.Title>
        <MapMenuDialog.VisibilityButton
          accent={Accent.SECONDARY}
          data-cy="hide-all-interest-point"
          Icon={displayInterestPointLayer ? Icon.Display : Icon.Hide}
          onClick={() => {
            dispatch(setDisplayedItems({ displayInterestPointLayer: !displayInterestPointLayer }))
            if (displayInterestPointLayer) {
              dispatch(endInterestPointDraw())
              dispatch(deleteInterestPointBeingDrawed())
            } else {
              dispatch(drawInterestPoint())
            }
          }}
        />
      </MapMenuDialog.Header>
      <StyledDialogBody>
        <SetCoordinates coordinates={coordinates} updateCoordinates={updateCoordinates} />

        <TextInput
          data-cy="interest-point-name-input"
          label="Libellé du point"
          name="name"
          onChange={updateName}
          value={interestPointBeingDrawed?.name ?? ''}
        />

        <Textarea
          data-cy="interest-point-observations-input"
          label="Observations"
          name="observations"
          onChange={updateObservations}
          value={interestPointBeingDrawed?.observations ?? ''}
        />
      </StyledDialogBody>
      <MapMenuDialog.Footer>
        <Button data-cy="interest-point-save" onClick={saveInterestPoint}>
          Créer le point
        </Button>
        <Button accent={Accent.SECONDARY} disabled={isEditing} onClick={cancel}>
          Annuler
        </Button>
      </MapMenuDialog.Footer>
    </MapMenuDialog.Container>
  )
}

const StyledDialogBody = styled(MapMenuDialog.Body)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`
