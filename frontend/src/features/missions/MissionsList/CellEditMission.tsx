import { Button, Icon, Size } from '@mtes-mct/monitor-ui'
import { useDispatch } from 'react-redux'

import { editMissionInLocalStore } from '../../../domain/use_cases/missions/editMissionInLocalStore'

export function CellEditMission({ id }: { id: number }) {
  const dispatch = useDispatch()
  const setMission = () => dispatch(editMissionInLocalStore(id))

  return (
    <Button data-cy={`edit-mission-${id}`} Icon={Icon.Edit} onClick={setMission} size={Size.SMALL}>
      Editer
    </Button>
  )
}
