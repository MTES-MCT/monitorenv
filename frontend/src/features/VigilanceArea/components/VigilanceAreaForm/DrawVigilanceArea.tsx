import { VigilanceAreaFormTypeOpen, vigilanceAreaActions } from '@features/VigilanceArea/slice'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Button, Icon, IconButton, OPENLAYERS_PROJECTION } from '@mtes-mct/monitor-ui'
import { InteractionType, OLGeometryType } from 'domain/entities/map/constants'
import { useFormikContext } from 'formik'
import { GeoJSON } from 'ol/format'
import { useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'

import type { MultiPoint, MultiPolygon } from 'ol/geom'

export function DrawVigilanceArea() {
  const dispatch = useAppDispatch()
  const geometry = useAppSelector(state => state.vigilanceArea.geometry)
  const interactionType = useAppSelector(state => state.vigilanceArea.interactionType)
  const isGeometryValid = useAppSelector(state => state.vigilanceArea.isGeometryValid)

  const { setFieldValue } = useFormikContext<VigilanceArea.VigilanceArea>()

  const initialFeatureNumberRef = useRef<number | undefined>(undefined)

  const feature = useMemo(() => {
    if (!geometry) {
      return undefined
    }

    return new GeoJSON({
      featureProjection: OPENLAYERS_PROJECTION
    }).readFeature(geometry)
  }, [geometry])

  useEffect(() => {
    if (initialFeatureNumberRef.current !== undefined) {
      return
    }

    if (!feature) {
      initialFeatureNumberRef.current = 0

      return
    }
    const geomType = feature.getGeometry()?.getType()
    switch (geomType) {
      case OLGeometryType.MULTIPOLYGON:
        initialFeatureNumberRef.current = (feature.getGeometry() as MultiPolygon).getPolygons().length
        break
      case OLGeometryType.MULTIPOINT:
        initialFeatureNumberRef.current = (feature.getGeometry() as MultiPoint).getPoints().length
        break
      default:
        initialFeatureNumberRef.current = 0
        break
    }
  }, [feature])

  const handleSelectInteraction = nextInteraction => () => {
    dispatch(vigilanceAreaActions.setInteractionType(nextInteraction))
  }

  const handleValidate = () => {
    setFieldValue('geom', geometry)
    dispatch(vigilanceAreaActions.setFormTypeOpen(VigilanceAreaFormTypeOpen.EDIT_FORM))
  }

  return (
    <>
      <Header>
        <Title>Ajout de tracés en cours...</Title>
      </Header>
      <Body>
        <HelpText>Dessinez ou sélectionnez un ou plusieurs tracés sur la carte</HelpText>
        <ButtonRow>
          <IconGroup>
            <IconButton
              className={interactionType === InteractionType.POLYGON ? '_active' : undefined}
              Icon={Icon.SelectPolygon}
              onClick={handleSelectInteraction(InteractionType.POLYGON)}
            />
            <IconButton
              className={interactionType === InteractionType.SQUARE ? '_active' : undefined}
              Icon={Icon.SelectRectangle}
              onClick={handleSelectInteraction(InteractionType.SQUARE)}
            />
            <IconButton
              className={interactionType === InteractionType.CIRCLE ? '_active' : undefined}
              Icon={Icon.SelectCircle}
              onClick={handleSelectInteraction(InteractionType.CIRCLE)}
            />
          </IconGroup>
        </ButtonRow>

        <ValidateButton disabled={!isGeometryValid} onClick={handleValidate}>
          Valider les tracés
        </ValidateButton>
      </Body>
    </>
  )
}

const IconGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
`
const Header = styled.header`
  align-items: center;
  background: ${p => p.theme.color.charcoal};
  display: flex;
  justify-content: space-between;
  padding: 9px 16px 10px 16px;
`

const Title = styled.h1`
  color: ${p => p.theme.color.white};
  font-size: 16px;
  font-weight: normal;
  line-height: 22px;
`

const HelpText = styled.span`
  font-style: italic;
  color: ${p => p.theme.color.gunMetal};
`

const ValidateButton = styled(Button)`
  align-self: flex-end;
  background: ${p => p.theme.color.mediumSeaGreen};
  border: 1px ${p => p.theme.color.mediumSeaGreen} solid;
  color: ${p => p.theme.color.white};
  &:hover {
    background: ${p => p.theme.color.mediumSeaGreen};
    border: 1px ${p => p.theme.color.mediumSeaGreen} solid;
  }
`
const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
`
const Body = styled.div`
  background-color: ${p => p.theme.color.white};
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 16px;
`
