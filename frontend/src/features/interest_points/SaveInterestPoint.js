import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled, { css } from 'styled-components'
import Radio from 'rsuite/Radio'
import RadioGroup from 'rsuite/RadioGroup'
import { transform } from 'ol/proj'

import { CoordinatesFormat, OPENLAYERS_PROJECTION, WSG84_PROJECTION } from '../../domain/entities/map'
import { interestPointType } from '../../domain/entities/interestPoints'
import { addInterestPoint, updateInterestPointKeyBeingDrawed } from '../../domain/shared_slices/InterestPoint'
import saveInterestPointFeature from '../../domain/use_cases/interestPoint/saveInterestPointFeature'
import { coordinatesAreDistinct, getCoordinates } from '../../utils/coordinates'
import SetCoordinates from '../coordinates/SetCoordinates'

import { MapComponentStyle } from '../commonStyles/MapComponent.style'
import { COLORS } from '../../constants/constants'

import { ReactComponent as ControlSVG } from '../../uiMonitor/icons/Label_controle.svg'
import { ReactComponent as VesselSVG } from '../../uiMonitor/icons/Label_segment_de_flotte.svg'
import { ReactComponent as OtherSVG } from '../../uiMonitor/icons/Point_interet_autre.svg'

const SaveInterestPoint = ({ isOpen, close }) => {
  const dispatch = useDispatch()

  const {
    /** @type {InterestPoint | null} interestPointBeingDrawed */
    interestPointBeingDrawed,
    isEditing
  } = useSelector(state => state.interestPoint)

  /** @type {number[]} coordinates - Coordinates formatted in DD [latitude, longitude] */
  const [coordinates, setCoordinates] = useState([])
  const [name, setName] = useState('')
  const [observations, setObservations] = useState('')
  const [type, setType] = useState(null)
  const [updateInterestPoint, setUpdateInterestPoint] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setName('')
      setObservations('')
      setType(interestPointType.FISHING_VESSEL)
      setCoordinates([])
      return
    }

    setUpdateInterestPoint(false)
    setName(interestPointBeingDrawed?.name || '')
    setObservations(interestPointBeingDrawed?.observations || '')
    setType(interestPointBeingDrawed?.type || interestPointType.FISHING_VESSEL)
  }, [interestPointBeingDrawed, isEditing, isOpen])

  useEffect(() => {
    if (type && !interestPointBeingDrawed?.type && !updateInterestPoint) {
      setUpdateInterestPoint(true)
    }
  }, [type, interestPointBeingDrawed, updateInterestPoint])

  useEffect(() => {
    if (isOpen) {
      if (!interestPointBeingDrawed?.coordinates?.length) {
        setCoordinates([])
        return
      }

      const ddCoordinates = getCoordinates(interestPointBeingDrawed.coordinates, OPENLAYERS_PROJECTION, CoordinatesFormat.DECIMAL_DEGREES, false)

      setCoordinates([
        parseFloat(ddCoordinates[0].replace(/°/g, '')),
        parseFloat(ddCoordinates[1].replace(/°/g, ''))
      ])
    }
  }, [interestPointBeingDrawed, isEditing, isOpen])

  useEffect(() => {
    if (name && interestPointBeingDrawed?.name !== name && updateInterestPoint) {
      dispatch(updateInterestPointKeyBeingDrawed({
        key: 'name',
        value: name
      }))
    }
  }, [name, interestPointBeingDrawed, updateInterestPoint])

  useEffect(() => {
    if (observations && interestPointBeingDrawed?.observations !== observations && updateInterestPoint) {
      dispatch(updateInterestPointKeyBeingDrawed({
        key: 'observations',
        value: observations
      }))
    }
  }, [observations, interestPointBeingDrawed, updateInterestPoint])

  useEffect(() => {
    if (type && interestPointBeingDrawed?.type !== type && updateInterestPoint && coordinates?.length) {
      dispatch(updateInterestPointKeyBeingDrawed({
        key: 'type',
        value: type
      }))
    }
  }, [type, interestPointBeingDrawed, updateInterestPoint, coordinates])

  /**
   * Compare with previous coordinates and update interest point coordinates
   * @param {number[]} nextCoordinates - Coordinates ([latitude, longitude]) to update, in decimal format.
   * @param {number[]} coordinates - Previous coordinates ([latitude, longitude]), in decimal format.
   */
  const updateCoordinates = (nextCoordinates, coordinates) => {
    if (nextCoordinates?.length) {
      if (!coordinates?.length || coordinatesAreDistinct(nextCoordinates, coordinates)) {
        // Convert to [longitude, latitude] and OpenLayers projection
        const updatedCoordinates = transform([nextCoordinates[1], nextCoordinates[0]], WSG84_PROJECTION, OPENLAYERS_PROJECTION)
        dispatch(updateInterestPointKeyBeingDrawed({
          key: 'coordinates',
          value: updatedCoordinates
        }))
      }
    }
  }

  const saveInterestPoint = () => {
    if (type && coordinates?.length) {
      dispatch(saveInterestPointFeature())
      dispatch(addInterestPoint())
      close()
    }
  }

  return (
    <Wrapper
      data-cy={'save-interest-point'}
      $isOpen={isOpen}
      >
      <Header>
        Créer un point d&apos;intérêt
      </Header>
      <Body>
        <p>Coordonnées</p>
        <SetCoordinates
          coordinates={coordinates}
          updateCoordinates={updateCoordinates}
        />
        <p>Type de point</p>
        <RadioWrapper>
          <RadioGroup
            name="interestTypeRadio"
            value={type}
            onChange={value => {
              setUpdateInterestPoint(true)
              setType(value)
            }}
          >
            <Radio
              value={interestPointType.CONTROL_ENTITY}
            >
              <Control/>
              Moyen de contrôle
            </Radio>
            <Radio
              value={interestPointType.FISHING_VESSEL}
            >
              <Vessel/>
              Navire de pêche
            </Radio>
            <Radio
              data-cy={'interest-point-type-radio-input'}
              value={interestPointType.OTHER}
            >
              <Other/>
              Autre point
            </Radio>
          </RadioGroup>
        </RadioWrapper>
        <p>Libellé du point</p>
        <Name
          data-cy={'interest-point-name-input'}
          type='text'
          onChange={e => {
            setUpdateInterestPoint(true)
            setName(e.target.value)
          }}
          value={name}
        />
        <p>Observations</p>
        <textarea
          data-cy={'interest-point-observations-input'}
          onChange={e => {
            setUpdateInterestPoint(true)
            setObservations(e.target.value)
          }}
          value={observations}
        />
        <OkButton
          data-cy={'interest-point-save'}
          onClick={saveInterestPoint}
        >
          OK
        </OkButton>
        <CancelButton
          disabled={isEditing}
          onClick={close}
        >
          Annuler
        </CancelButton>
      </Body>
    </Wrapper>
  )
}

const Wrapper = styled(MapComponentStyle)`
  width: 306px;
  background: ${COLORS.background};
  margin-bottom: ${props => props.$isOpen ? '8px' : '-520px'};
  opacity:  ${props => props.$isOpen ? '1' : '0'};
  position: absolute;
  bottom: 20px;
  left: 0;
  border-radius: 2px;
  display: inline-block;
  transition: all 0.5s;
`

const Name = styled.input`
  width: 100%;
`

const RadioWrapper = styled.div`
  margin-top: 10px;
`

const CancelButton = styled.button`
  border: 1px solid ${COLORS.lightGray};
  width: 130px;
  padding: 5px 12px;
  margin: 15px 0 0 15px;
  font-size: 13px;
  color: ${COLORS.gunMetal};
  
  :disabled {
    border: 1px solid ${COLORS.lightGray};
    color: ${COLORS.slateGray};
  }
`

const OkButton = styled.button`
  background: ${COLORS.charcoal};
  width: 130px;
  padding: 5px 12px;
  margin: 15px 0 0;
  font-size: 13px;
  color: ${COLORS.gainsboro};
  
  :hover, :focus {
    background: ${COLORS.charcoal};
  }
`

const Body = styled.div`
  text-align: left;
  font-size: 13px;
  color: ${COLORS.slateGray};
  margin: 10px 15px;
  
  p {
    margin: 0;
    font-size: 13px;
  }
  
  p:nth-of-type(2) {
    margin-top: 15px;
    font-size: 13px;
  }
  
  p:nth-of-type(3) {
    margin-top: 15px;
    font-size: 13px;
  }
  
  p:nth-of-type(4) {
    margin-top: 15px;
    font-size: 13px;
  }
  
  input {
    margin-top: 7px;
    color: ${COLORS.gunMetal};
    background: ${COLORS.gainsboro};
    border: none;
    height: 27px;
    padding-left: 8px;
  }
  
  textarea {
    color: ${COLORS.gunMetal};
    margin-top: 7px;
    background: ${COLORS.gainsboro};
    border: none;
    min-height: 50px;
    padding-left: 8px;
    padding-top: 3px;
    width: 100% !important;
    resize: vertical;
  }
`

const Header = styled.div`
  background: ${COLORS.charcoal};
  color: ${COLORS.gainsboro};
  padding: 9px 0 7px 15px;
  font-size: 16px;
  text-align: left;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
`

const iconStyle = css`
  vertical-align: sub;
  width: 14px;
  margin-left: 3px;
  margin-right: 7px;
`

const Control = styled(ControlSVG)`
  ${iconStyle}
`

const Vessel = styled(VesselSVG)`
  ${iconStyle}
`

const Other = styled(OtherSVG)`
  ${iconStyle}
`

export default SaveInterestPoint
