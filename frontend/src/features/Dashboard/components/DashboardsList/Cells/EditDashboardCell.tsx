import { editDashboard } from '@features/Dashboard/useCases/editDashboard'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

export function EditDashboardCell({ id }: { id: number }) {
  const dispatch = useAppDispatch()
  const edit = () => {
    dispatch(editDashboard(id))
  }

  return (
    <StyledIconButton
      accent={Accent.TERTIARY}
      data-cy={`edit-dashboard-${id}`}
      Icon={Icon.Edit}
      onClick={edit}
      title="Éditer le tableau de bord"
    />
  )
}

const StyledIconButton = styled(IconButton)`
  display: inherit;
  margin: auto;
`
