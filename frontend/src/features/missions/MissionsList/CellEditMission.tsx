import { Button, Icon, Size } from '@mtes-mct/monitor-ui'
import { useDispatch } from 'react-redux'

import { editMission } from '../../../domain/use_cases/missions/editMission'

export function CellEditMission({ id }: { id: number }) {
  const dispatch = useDispatch()
  const setMission = () => dispatch(editMission(id))

  return (
    <Button Icon={Icon.Edit} onClick={setMission} size={Size.SMALL}>
      Editer
    </Button>
  )
}
