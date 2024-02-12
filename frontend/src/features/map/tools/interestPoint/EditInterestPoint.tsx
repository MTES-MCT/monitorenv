import { Icon, Label, MultiRadio, type Option } from '@mtes-mct/monitor-ui'
import { boundingExtent } from 'ol/extent'
import { transform, transformExtent } from 'ol/proj'
import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import { interestPointType } from '../../../../domain/entities/interestPoints'
import { CoordinatesFormat, OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../../../domain/entities/map/constants'
import { addInterestPoint, updateInterestPointKeyBeingDrawed } from '../../../../domain/shared_slices/InterestPoint'
import { setFitToExtent } from '../../../../domain/shared_slices/Map'
import { saveInterestPointFeature } from '../../../../domain/use_cases/interestPoint/saveInterestPointFeature'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../../hooks/useAppSelector'
import { coordinatesAreDistinct, getCoordinates } from '../../../../utils/coordinates'
import { SetCoordinates } from '../../../coordinates/SetCoordinates'
import { MapToolBox } from '../MapToolBox'

import type { InterestPointOptionValueType } from '../../../InterestPoint/types'
import type { Coordinate } from 'ol/coordinate'

const INTEREST_POINT_OPTIONS: Array<Option<InterestPointOptionValueType>> = [
  {
    label: 'Moyen de contrôle',
    value: {
      icon: Icon.ControlUnit,
      value: interestPointType.CONTROL_ENTITY
    }
  },
  {
    label: 'Navire de pêche',
    value: {
      icon: Icon.FleetSegment,
      value: interestPointType.FISHING_VESSEL
    }
  },
  {
    label: 'Autre point',
    value: {
      icon: Icon.Info,
      value: interestPointType.OTHER
    }
  }
]

// TODO Refactor this component
// - Move the state logic to the reducer
// - Use formik (or at least uncontrolled form components)
type EditInterestPointProps = {
  close: () => void
  healthcheckTextWarning: string | undefined
  isOpen: boolean
}
export function EditInterestPoint({ close, healthcheckTextWarning, isOpen }: EditInterestPointProps) {
  const dispatch = useAppDispatch()

  const { interestPointBeingDrawed, isEditing } = useAppSelector(state => state.interestPoint)

  const [localCoordinates, setLocalCoordinates] = useState<Coordinate>([0, 0])

  const defaultType = interestPointBeingDrawed?.type
    ? INTEREST_POINT_OPTIONS.find(
        interestPointOption => interestPointOption.value.value === interestPointBeingDrawed.type
      )?.value
    : INTEREST_POINT_OPTIONS[2]?.value

  const [selectedOption, setSelectedOption] = useState()

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

  const updateType = useCallback(
    option => {
      setSelectedOption(option)
      const type = option.value
      if (option.value && interestPointBeingDrawed?.type !== type) {
        dispatch(
          updateInterestPointKeyBeingDrawed({
            key: 'type',
            value: option.value
          })
        )
      }
    },
    [dispatch, interestPointBeingDrawed?.type]
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

      // reset state
      setSelectedOption(undefined)
    }
  }

  const cancel = () => {
    close()
    // reset state
    setSelectedOption(undefined)
  }

  return (
    <Wrapper data-cy="save-interest-point" healthcheckTextWarning={!!healthcheckTextWarning} isOpen={isOpen}>
      {isOpen && (
        <>
          <Header>Créer un point d&apos;intérêt</Header>
          <Body>
            <div>
              <Label>Coordonnées</Label>
              <SetCoordinates coordinates={coordinates} updateCoordinates={updateCoordinates} />
            </div>

            <MultiRadio
              key={interestPointBeingDrawed?.uuid}
              data-cy="interest-point-type-radio"
              label="Type de point"
              name="interestPointTypeRadio"
              onChange={updateType}
              options={INTEREST_POINT_OPTIONS}
              optionValueKey="value"
              renderMenuItem={(label, value) => (
                <MultiRadioLabel>
                  <value.icon size={14} />
                  <span>{label}</span>
                </MultiRadioLabel>
              )}
              value={selectedOption ?? defaultType}
            />
            <div>
              <Label>Libellé du point</Label>
              <Name
                data-cy="interest-point-name-input"
                onChange={e => updateName(e.target.value)}
                type="text"
                value={interestPointBeingDrawed?.name ?? ''}
              />
            </div>

            <div>
              <Label>Observations</Label>
              <textarea
                data-cy="interest-point-observations-input"
                onChange={e => updateObservations(e.target.value)}
                value={interestPointBeingDrawed?.observations ?? ''}
              />
            </div>

            <ButtonContainer>
              <OkButton data-cy="interest-point-save" onClick={saveInterestPoint}>
                OK
              </OkButton>
              <CancelButton disabled={isEditing} onClick={cancel}>
                Annuler
              </CancelButton>
            </ButtonContainer>
          </Body>
        </>
      )}
    </Wrapper>
  )
}

const Name = styled.input`
  width: 100%;
`

const CancelButton = styled.button`
  border: 1px solid ${p => p.theme.color.lightGray};
  color: ${p => p.theme.color.gunMetal};
  font-size: 13px;
  margin: 15px 0 0 15px;
  padding: 5px 12px;
  width: 130px;

  :disabled {
    border: 1px solid ${p => p.theme.color.lightGray};
    color: ${p => p.theme.color.slateGray};
  }
`

const OkButton = styled.button`
  background: ${p => p.theme.color.charcoal};
  color: ${p => p.theme.color.gainsboro};
  font-size: 13px;
  margin: 15px 0 0;
  padding: 5px 12px;
  width: 130px;

  :hover,
  :focus {
    background: ${p => p.theme.color.charcoal};
  }
`

const Body = styled.div`
  color: ${p => p.theme.color.slateGray};
  font-size: 13px;
  margin: 10px 15px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 16px;

  input {
    background: ${p => p.theme.color.gainsboro};
    border: none;
    color: ${p => p.theme.color.gunMetal};
    height: 27px;
    padding-left: 8px;
  }

  textarea {
    background: ${p => p.theme.color.gainsboro};
    border: none;
    color: ${p => p.theme.color.gunMetal};
    min-height: 50px;
    padding-left: 8px;
    padding-top: 3px;
    resize: vertical;
    width: 100% !important;
  }
`
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const Header = styled.div`
  background: ${p => p.theme.color.charcoal};
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  color: ${p => p.theme.color.gainsboro};
  font-size: 16px;
  padding: 9px 0 7px 15px;
  text-align: left;
`

const Wrapper = styled(MapToolBox)`
  top: 0px;
  width: 306px;
`
const MultiRadioLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`
