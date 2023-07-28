import { Button, Icon, Size } from '@mtes-mct/monitor-ui'

import { openReporting } from '../../../domain/use_cases/reportings/openReporting'
import { useAppDispatch } from '../../../hooks/useAppDispatch'

export function CellEditReporting({ id }: { id: number }) {
  const dispatch = useAppDispatch()

  const handleEdit = () => {
    dispatch(openReporting(id))
  }

  return (
    <Button data-cy="edit-reporting" Icon={Icon.Edit} onClick={handleEdit} size={Size.SMALL}>
      Editer
    </Button>
  )
}
