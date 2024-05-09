import { Icon, IconButton, Size } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { editMissionInLocalStore } from '../../useCases/editMissionInLocalStore'

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
  display: inherit;
`
