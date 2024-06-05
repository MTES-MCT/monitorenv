import { SetCoordinates } from '@features/coordinates/SetCoordinates'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import {
  Accent,
  Button,
  CoordinatesFormat,
  Icon,
  MapMenuDialog,
  OPENLAYERS_PROJECTION,
  TextInput,
  Textarea,
  WSG84_PROJECTION,
  coordinatesAreDistinct,
  getCoordinates
} from '@mtes-mct/monitor-ui'
import { setDisplayedItems } from 'domain/shared_slices/Global'
import { transform } from 'ol/proj'
import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import {
  saveInterestPoint,
  endDrawingInterestPoint,
  startDrawingInterestPoint,
  cancelEditingInterestPoint,
  updateCurrentInterestPoint
} from '../slice'
import { saveInterestPointFeature } from '../useCases/saveInterestPointFeature'

import type { Coordinate } from 'ol/coordinate'

// TODO Refactor this component
// - Move the state logic to the reducer
type EditInterestPointProps = {
  close: () => void
}
export function EditInterestPoint({ close }: EditInterestPointProps) {
  const dispatch = useAppDispatch()

  const currentInterestPoint = useAppSelector(state => state.interestPoint.currentInterestPoint)

  const isEditing = useAppSelector(state => state.interestPoint.isEditing)

  const [isEyeOpen, setIsEyeOpen] = useState(true)

  useEffect(() => {
    dispatch(setDisplayedItems({ displayInterestPointLayer: isEyeOpen }))
    if (isEyeOpen) {
      dispatch(startDrawingInterestPoint())
    } else {
      dispatch(endDrawingInterestPoint())
    }
  }, [dispatch, isEyeOpen])

  // TODO: Modifier monitor-ui pour changer le typage des children de  undefined à ReactNode
  const textButton = `${isEditing ? 'Enregistrer' : 'Créer'} le point`

  /** Coordinates formatted in DD [latitude, longitude] */
  const coordinates: number[] = useMemo(() => {
    if (!currentInterestPoint?.coordinates?.length) {
      return []
    }

    const [latitude, longitude] = getCoordinates(
      currentInterestPoint.coordinates,
      OPENLAYERS_PROJECTION,
      CoordinatesFormat.DECIMAL_DEGREES,
      false
    )
    if (!latitude || !longitude) {
      return []
    }

    return [parseFloat(latitude.replace(/°/g, '')), parseFloat(longitude.replace(/°/g, ''))]
  }, [currentInterestPoint?.coordinates])

  const updateName = useCallback(
    (name: string | undefined) => {
      if (currentInterestPoint?.name !== name) {
        const updatedName = name === undefined ? null : name

        const { name: currentName, ...currentInterestPointWithoutName } = currentInterestPoint

        dispatch(updateCurrentInterestPoint({ name: updatedName, ...currentInterestPointWithoutName }))
      }
    },
    [currentInterestPoint, dispatch]
  )

  const updateObservations = useCallback(
    (observations: string | undefined) => {
      if (currentInterestPoint?.observations !== observations) {
        const updatedObservations = observations === undefined ? null : observations
        const { observations: currentObservations, ...currentInterestPointWithoutObservations } = currentInterestPoint

        dispatch(
          updateCurrentInterestPoint({ observations: updatedObservations, ...currentInterestPointWithoutObservations })
        )
      }
    },
    [currentInterestPoint, dispatch]
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

          // Convert to [longitude, latitude] and OpenLayers projection
          const updatedCoordinates = transform([longitude, latitude], WSG84_PROJECTION, OPENLAYERS_PROJECTION)
          const { coordinates: currentCoordinates, ...currentInterestPointWithoutCoordinates } = currentInterestPoint

          dispatch(
            updateCurrentInterestPoint({ coordinates: updatedCoordinates, ...currentInterestPointWithoutCoordinates })
          )
        }
      }
    },
    [currentInterestPoint, dispatch]
  )
  const save = () => {
    dispatch(saveInterestPointFeature())
    dispatch(saveInterestPoint())
    close()
  }

  const cancel = () => {
    dispatch(cancelEditingInterestPoint())
    close()
  }

  return (
    <MapMenuDialog.Container data-cy="save-interest-point">
      <MapMenuDialog.Header>
        <MapMenuDialog.CloseButton Icon={Icon.Close} onClick={close} />
        <MapMenuDialog.Title data-cy="interest-point-title">
          {isEditing ? 'Éditer' : 'Créer'} un point d&apos;intérêt
        </MapMenuDialog.Title>
        <MapMenuDialog.VisibilityButton
          accent={Accent.SECONDARY}
          data-cy="hide-all-interest-point"
          Icon={isEyeOpen ? Icon.Display : Icon.Hide}
          onClick={() => {
            setIsEyeOpen(!isEyeOpen)
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
          value={currentInterestPoint?.name ?? ''}
        />

        <Textarea
          data-cy="interest-point-observations-input"
          label="Observations"
          name="observations"
          onChange={updateObservations}
          value={currentInterestPoint?.observations ?? ''}
        />
      </StyledDialogBody>
      <MapMenuDialog.Footer>
        <Button data-cy="interest-point-save" disabled={coordinates.length === 0} onClick={save}>
          {textButton}
        </Button>
        <Button accent={Accent.SECONDARY} data-cy="interest-point-cancel" onClick={cancel}>
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
