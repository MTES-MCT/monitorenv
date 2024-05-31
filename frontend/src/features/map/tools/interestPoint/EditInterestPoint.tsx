import { Accent, Button, Icon, MapMenuDialog, TextInput, Textarea } from '@mtes-mct/monitor-ui'
import { setDisplayedItems } from 'domain/shared_slices/Global'
import { transform } from 'ol/proj'
import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { CoordinatesFormat, OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../../domain/entities/map/constants'
import {
  addInterestPoint,
  endDrawingInterestPoint,
  startDrawingInterestPoint,
  updateCurrentInterestPointProperty
} from '../../../../domain/shared_slices/InterestPoint'
import { saveInterestPointFeature } from '../../../../domain/use_cases/interestPoint/saveInterestPointFeature'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { coordinatesAreDistinct, getCoordinates } from '../../../../utils/coordinates'
import { SetCoordinates } from '../../../coordinates/SetCoordinates'

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

  // TODO: Modifier monitor-ui pour changer le typage des children de string à ReactNode
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
    name => {
      if (currentInterestPoint?.name !== name) {
        dispatch(
          updateCurrentInterestPointProperty({
            key: 'name',
            value: name
          })
        )
      }
    },
    [dispatch, currentInterestPoint?.name]
  )

  const updateObservations = useCallback(
    observations => {
      if (currentInterestPoint?.observations !== observations) {
        dispatch(
          updateCurrentInterestPointProperty({
            key: 'observations',
            value: observations
          })
        )
      }
    },
    [dispatch, currentInterestPoint?.observations]
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
          dispatch(
            updateCurrentInterestPointProperty({
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
    }
  }

  const cancel = () => {
    close()
  }

  return (
    <MapMenuDialog.Container data-cy="save-interest-point">
      <MapMenuDialog.Header>
        <MapMenuDialog.CloseButton Icon={Icon.Close} onClick={close} />
        <MapMenuDialog.Title>{isEditing ? 'Éditer' : 'Créer'} un point d&apos;intérêt</MapMenuDialog.Title>
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
        <Button data-cy="interest-point-save" onClick={saveInterestPoint}>
          {textButton}
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
