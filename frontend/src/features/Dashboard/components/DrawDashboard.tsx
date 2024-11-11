import { ValidateButton } from '@features/VigilanceArea/components/VigilanceAreaForm/style'
import { displayOrHideOtherLayers } from '@features/VigilanceArea/useCases/displayOrHideOtherLayers'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Accent, Button, FieldError, Icon, IconButton, OPENLAYERS_PROJECTION, THEME } from '@mtes-mct/monitor-ui'
import { InteractionType, OLGeometryType } from 'domain/entities/map/constants'
import { GeoJSON } from 'ol/format'
import { useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'

import { dashboardActions } from '../slice'
import { createDashboard } from '../useCases/createDashboard'
import { resetDrawing } from '../useCases/resetDrawing'

import type { Feature } from 'ol'
import type { Geometry, MultiPoint, MultiPolygon } from 'ol/geom'

export function DrawDashboard({ className, onCancel }: { className?: string; onCancel: () => void }) {
  const dispatch = useAppDispatch()
  const geometry = useAppSelector(state => state.dashboard.geometry)
  const interactionType = useAppSelector(state => state.dashboard.interactionType)
  const isGeometryValid = useAppSelector(state => state.dashboard.isGeometryValid)
  const initialGeometry = useAppSelector(state => state.dashboard.initialGeometry)

  const initialFeatureNumberRef = useRef<number | undefined>(undefined)

  const feature = useMemo(() => {
    if (!geometry) {
      return undefined
    }

    return new GeoJSON({
      featureProjection: OPENLAYERS_PROJECTION
    }).readFeature(geometry) as Feature<Geometry>
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
    dispatch(resetDrawing())
    dispatch(dashboardActions.setInteractionType(nextInteraction))
  }

  const handleValidate = () => {
    if (geometry) {
      dispatch(createDashboard(geometry))
    }
    dispatch(dashboardActions.setInitialGeometry(undefined))
    dispatch(displayOrHideOtherLayers({ display: true }))
  }

  const reset = () => {
    if (!initialGeometry) {
      dispatch(resetDrawing())

      return
    }
    dispatch(dashboardActions.setGeometry(initialGeometry))
  }

  const showErrorMessage = !isGeometryValid && geometry && 'coordinates' in geometry && geometry.coordinates.length > 0

  return (
    <div className={className}>
      <Header>
        <Title>Définition d&apos;une zone</Title>
        <IconButton accent={Accent.TERTIARY} color={THEME.color.white} Icon={Icon.Close} onClick={onCancel} />
      </Header>
      <Body>
        <Controls>
          <li>
            <IconButton
              className={interactionType === InteractionType.POLYGON ? '_active' : undefined}
              Icon={Icon.SelectPolygon}
              onClick={handleSelectInteraction(InteractionType.POLYGON)}
            />
          </li>
          <li>
            <IconButton
              className={interactionType === InteractionType.SQUARE ? '_active' : undefined}
              Icon={Icon.SelectRectangle}
              onClick={handleSelectInteraction(InteractionType.SQUARE)}
            />
          </li>
          <li>
            <IconButton
              className={interactionType === InteractionType.CIRCLE ? '_active' : undefined}
              Icon={Icon.SelectCircle}
              onClick={handleSelectInteraction(InteractionType.CIRCLE)}
            />
          </li>
          <ResetButton accent={Accent.SECONDARY} onClick={reset}>
            Réinitialiser
          </ResetButton>
        </Controls>

        <div>
          <CreateDashboardButton disabled={!isGeometryValid} onClick={handleValidate}>
            Créer le tableau
          </CreateDashboardButton>
          {showErrorMessage && <FieldError>Le tracé n&apos;est pas valide</FieldError>}
        </div>
      </Body>
    </div>
  )
}

const Controls = styled.ul`
  display: flex;
  gap: 16px;
  padding: 0;
  list-style: none;
`

const Header = styled.header`
  align-items: center;
  background: ${p => p.theme.color.charcoal};
  display: flex;
  justify-content: space-between;
  padding: 9px 16px 10px;
`
const Title = styled.h2`
  color: ${p => p.theme.color.white};
  font-size: 16px;
  font-weight: normal;
  line-height: 22px;
`

const Body = styled.div`
  background-color: ${p => p.theme.color.white};
  display: flex;
  flex-direction: column;
  padding: 16px;
`
const ResetButton = styled(Button)`
  height: 32px;
  margin-left: auto;
`

const CreateDashboardButton = styled(ValidateButton)`
  width: 100%;
`
