import { Accent, Button, Label, Icon, FieldError } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { PointPicker } from './PointPicker'
import { ZonePicker } from './ZonePicker'
import { InteractionListener } from '../../../../domain/entities/map/constants'
import { addControlPosition, addZone } from '../../../../domain/use_cases/missions/addZone'
import { StyledLocalizationContainer } from '../style'

export function Localization() {
  const dispatch = useDispatch()
  const [field, meta] = useField('geom')
  const { value } = field

  const handleAddZone = useCallback(() => {
    dispatch(addZone(value, InteractionListener.REPORTING_ZONE))
  }, [dispatch, value])

  const handleAddPoint = useCallback(() => {
    dispatch(addControlPosition(value, InteractionListener.REPORTING_POINT))
  }, [dispatch, value])

  return (
    <div>
      <Label hasError={!!meta.error}>Localisation</Label>
      <StyledLocalizationContainer>
        <Button
          accent={Accent.SECONDARY}
          disabled={field.value?.coordinates}
          Icon={Icon.Plus}
          isFullWidth
          onClick={handleAddZone}
        >
          Ajouter une zone
        </Button>
        <Button
          accent={Accent.SECONDARY}
          disabled={field.value?.coordinates}
          Icon={Icon.Plus}
          isFullWidth
          onClick={handleAddPoint}
        >
          Ajouter un point
        </Button>
      </StyledLocalizationContainer>
      <ZonePicker />
      <PointPicker />
      {meta.error && <FieldError>{meta.error}</FieldError>}
    </div>
  )
}
