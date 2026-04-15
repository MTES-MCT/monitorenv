import { editMissionInLocalStore } from '@features/Mission/useCases/editMissionInLocalStore'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export function EditMissionCell({ id }: { id: number }) {
  const dispatch = useAppDispatch()
  const setMission = () => dispatch(editMissionInLocalStore(id, 'sideWindow'))

  return (
    <StyledIconButton
      accent={Accent.TERTIARY}
      data-cy={`edit-mission-${id}`}
      Icon={Icon.Edit}
      onClick={setMission}
      title="Editer"
    />
  )
}

const StyledIconButton = styled(IconButton)`
  margin: auto;
`
