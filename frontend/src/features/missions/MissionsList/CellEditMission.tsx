import { Button, Icon, Size } from '@mtes-mct/monitor-ui'

import { editMissionInLocalStore } from '../../../domain/use_cases/missions/editMissionInLocalStore'
import { useAppDispatch } from '../../../hooks/useAppDispatch'

export function CellEditMission({ id }: { id: number }) {
  const dispatch = useAppDispatch()
  const setMission = () => dispatch(editMissionInLocalStore(id, 'sideWindow'))

  return (
    <Button data-cy={`edit-mission-${id}`} Icon={Icon.Edit} onClick={setMission} size={Size.SMALL}>
      Editer
    </Button>
  )
}
