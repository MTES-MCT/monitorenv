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
  getCoordinates
} from '@mtes-mct/monitor-ui'
import { setDisplayedItems } from 'domain/shared_slices/Global'
import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import {
  cancelEditingInterestPoint,
  endDrawingInterestPoint,
  saveInterestPoint,
  startDrawingInterestPoint
} from '../slice'
import { saveInterestPointFeature } from '../useCases/saveInterestPointFeature'
import { updateCoordinatesAction } from '../useCases/updateCoordinates'
import { updateNameAction } from '../useCases/updateName'
import { updateObservationsAction } from '../useCases/updateObservations'

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
      dispatch(updateNameAction(name))
    },
    [dispatch]
  )

  const updateObservations = useCallback(
    (observations: string | undefined) => {
      dispatch(updateObservationsAction(observations))
    },
    [dispatch]
  )

  /**
   * Compare with previous coordinates and update interest point coordinates
   * @param {Coordinate} nextCoordinates - Coordinates ([latitude, longitude]) to update, in decimal format.
   * @param {Coordinate} coordinates - Previous coordinates ([latitude, longitude]), in decimal format.
   */
  const updateCoordinates = useCallback(
    (nextCoordinates, previousCoordinates) => {
      dispatch(updateCoordinatesAction(nextCoordinates, previousCoordinates))
    },
    [dispatch]
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
