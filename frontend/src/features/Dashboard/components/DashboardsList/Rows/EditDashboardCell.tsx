import { editDashboard } from '@features/Dashboard/useCases/editDashboard'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Icon, IconButton, Size } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export function EditDashboardCell({ id }: { id: number }) {
  const dispatch = useAppDispatch()
  const edit = () => {
    dispatch(editDashboard(id))
  }

  return (
    <StyledIconButton
      data-cy={`edit-dashboard-${id}`}
      Icon={Icon.Edit}
      onClick={edit}
      size={Size.SMALL}
      title="Editer le dashboard"
    />
  )
}

const StyledIconButton = styled(IconButton)`
  display: inherit;
  margin: auto;
`
