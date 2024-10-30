import { vigilanceAreaActions } from '@features/VigilanceArea/slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Icon, IconButton, Size } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export function EditCell({ id }: { id: number }) {
  const dispatch = useAppDispatch()
  const editVigilanceArea = () => {
    dispatch(vigilanceAreaActions.setSelectedVigilanceAreaId(id))
  }

  return (
    <StyledIconButton
      aria-label="Editer"
      data-cy={`edit-mission-${id}`}
      Icon={Icon.Edit}
      onClick={editVigilanceArea}
      size={Size.SMALL}
    />
  )
}
const StyledIconButton = styled(IconButton)`
  display: inherit;
  margin: auto;
`
