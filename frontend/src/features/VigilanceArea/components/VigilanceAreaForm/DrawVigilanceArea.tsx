import { VigilanceAreaFormTypeOpen, vigilanceAreaActions } from '@features/VigilanceArea/slice'
import { VigilanceArea } from '@features/VigilanceArea/types'
import { displayOrHideOtherLayers } from '@features/VigilanceArea/useCases/displayOrHideOtherLayers'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Button, FieldError, Icon, IconButton, OPENLAYERS_PROJECTION, THEME } from '@mtes-mct/monitor-ui'
import { InteractionType, OLGeometryType } from 'domain/entities/map/constants'
import { useFormikContext } from 'formik'
import { GeoJSON } from 'ol/format'
import { useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'

import { SubFormBody, SubFormHeader, SubFormHelpText, SubFormTitle, ValidateButton } from './style'

import type { MultiPoint, MultiPolygon } from 'ol/geom'

export function DrawVigilanceArea({ onCancel }: { onCancel: () => void }) {
  const dispatch = useAppDispatch()
  const geometry = useAppSelector(state => state.vigilanceArea.geometry)
  const interactionType = useAppSelector(state => state.vigilanceArea.interactionType)
  const isGeometryValid = useAppSelector(state => state.vigilanceArea.isGeometryValid)
  const initialGeometry = useAppSelector(state => state.vigilanceArea.initialGeometry)

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

  const handleSelectInteraction = (nextInteraction: InteractionType) => () => {
    dispatch(vigilanceAreaActions.setInteractionType(nextInteraction))
  }

  const handleValidate = () => {
    setFieldValue('geom', geometry)
    dispatch(vigilanceAreaActions.setFormTypeOpen(VigilanceAreaFormTypeOpen.FORM))
    dispatch(vigilanceAreaActions.setInitialGeometry(undefined))
    dispatch(displayOrHideOtherLayers({ display: true }))
  }

  const reinitialize = () => {
    if (!initialGeometry) {
      dispatch(
        vigilanceAreaActions.setGeometry({
          coordinates: [],
          type: 'MultiPolygon'
        })
      )

      return
    }
    dispatch(vigilanceAreaActions.setGeometry(initialGeometry))
  }

  return (
    <>
      <SubFormHeader>
        <SubFormTitle>Ajout de tracés en cours...</SubFormTitle>
        <IconButton accent={Accent.TERTIARY} color={THEME.color.white} Icon={Icon.Close} onClick={onCancel} />
      </SubFormHeader>
      <SubFormBody>
        <SubFormHelpText>Dessinez ou sélectionnez un ou plusieurs tracés sur la carte</SubFormHelpText>
        <DrawButtonRow>
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
        </DrawButtonRow>

        <ValidateButtonContainer>
          <ValidateButtonRow>
            <Button accent={Accent.SECONDARY} onClick={reinitialize}>
              Réinitialiser les tracés
            </Button>
            <ValidateButton disabled={!isGeometryValid} onClick={handleValidate}>
              Valider les tracés
            </ValidateButton>
          </ValidateButtonRow>
          {!isGeometryValid && <FieldError>Le tracé n&apos;est pas valide</FieldError>}
        </ValidateButtonContainer>
      </SubFormBody>
    </>
  )
}

const IconGroup = styled.div`
  display: flex;
  gap: 16px;
`

const DrawButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
`
const ValidateButtonContainer = styled.div`
  align-self: end;
  display: flex;
  flex-direction: column;
`

const ValidateButtonRow = styled.div`
  align-self: end;
  display: flex;
  gap: 8px;
`
