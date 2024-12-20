import { Icon, IconButton, Size } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { editMissionInLocalStore } from '../../../domain/use_cases/missions/editMissionInLocalStore'
import { useAppDispatch } from '../../../hooks/useAppDispatch'

export function CellEditMission({ id }: { id: number }) {
  const dispatch = useAppDispatch()
  const setMission = () => dispatch(editMissionInLocalStore(id, 'sideWindow'))

  return (
    <StyledIconButton
      aria-label="Editer"
      data-cy={`edit-mission-${id}`}
      Icon={Icon.Edit}
      onClick={setMission}
      size={Size.SMALL}
    />
  )
}

const StyledIconButton = styled(IconButton)`
  margin: auto;
`
