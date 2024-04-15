import { Accent, Button, Label, Icon } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import { useCallback } from 'react'

import { PointPicker } from './PointPicker'
import { ZonePicker } from './ZonePicker'
import { InteractionListener } from '../../../../../domain/entities/map/constants'
import { drawPoint, drawPolygon } from '../../../../../domain/use_cases/draw/drawGeometry'
import { useAppDispatch } from '../../../../../hooks/useAppDispatch'
import { StyledPositionContainer } from '../../../style'

export function Position() {
  const dispatch = useAppDispatch()
  const [field, meta] = useField('geom')
  const { value } = field

  const handleAddZone = useCallback(() => {
    dispatch(drawPolygon(value, InteractionListener.REPORTING_ZONE))
  }, [dispatch, value])

  const handleAddPoint = useCallback(() => {
    dispatch(drawPoint(value, InteractionListener.REPORTING_POINT))
  }, [dispatch, value])

  return (
    <div>
      <Label $isRequired>Localisation</Label>
      <StyledPositionContainer>
        <Button
          accent={meta.error ? Accent.ERROR : Accent.SECONDARY}
          disabled={field.value?.coordinates}
          Icon={Icon.Plus}
          isFullWidth
          onClick={handleAddZone}
        >
          Ajouter une zone
        </Button>
        <Button
          accent={meta.error ? Accent.ERROR : Accent.SECONDARY}
          disabled={field.value?.coordinates}
          Icon={Icon.Plus}
          isFullWidth
          onClick={handleAddPoint}
        >
          Ajouter un point
        </Button>
      </StyledPositionContainer>
      <ZonePicker />
      <PointPicker />
    </div>
  )
}
