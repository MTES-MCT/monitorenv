import { Accent, Button, Label, Icon } from '@mtes-mct/monitor-ui'
import { useField } from 'formik'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { InteractionListener } from '../../../../domain/entities/map/constants'
import { addControlPosition, addZone } from '../../../../domain/use_cases/missions/addZone'
import { StyledLocalizationContainer } from '../style'
import { PointPicker } from './PointPicker'
import { ZonePicker } from './ZonePicker'

export function Localization() {
  const dispatch = useDispatch()
  const [field] = useField('geom')
  const { value } = field

  const handleAddZone = useCallback(() => {
    dispatch(addZone(value, InteractionListener.REPORTING_ZONE))
  }, [dispatch, value])

  const handleAddPoint = useCallback(() => {
    dispatch(addControlPosition(value, InteractionListener.REPORTING_POINT))
  }, [dispatch, value])

  return (
    <div>
      <Label>Localisation</Label>
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
    </div>
  )
}
