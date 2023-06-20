import { Button, Icon, Size } from '@mtes-mct/monitor-ui'
import { useDispatch } from 'react-redux'

import { editMission } from '../../../domain/use_cases/missions/editMission'

import type { Mission } from '../../../domain/entities/missions'

export function CellEditMission({ row }: { row: Partial<Mission> }) {
  const dispatch = useDispatch()
  const setMission = () => dispatch(editMission(row))

  return (
    <Button data-cy="edit-mission" Icon={Icon.Edit} onClick={setMission} size={Size.SMALL}>
      Editer
    </Button>
  )
}
