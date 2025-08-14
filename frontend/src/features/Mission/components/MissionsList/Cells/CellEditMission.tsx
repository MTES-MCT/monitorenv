import { editMissionInLocalStore } from '@features/Mission/useCases/editMissionInLocalStore'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Icon, IconButton, Size } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export function CellEditMission({ id }: { id: number }) {
  const dispatch = useAppDispatch()
  const setMission = () => dispatch(editMissionInLocalStore(id, 'sideWindow'))

  return (
    <StyledIconButton
      data-cy={`edit-mission-${id}`}
      Icon={Icon.Edit}
      onClick={setMission}
      size={Size.SMALL}
      title="Editer"
    />
  )
}

const StyledIconButton = styled(IconButton)`
  margin: auto;
`
