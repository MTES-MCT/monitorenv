import { useAppDispatch } from '@hooks/useAppDispatch'
import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import { useCallback } from 'react'

import { dashboardActions } from '../slice'

export function EditTabName({ tabKey }: { tabKey: string }) {
  const dispatch = useAppDispatch()

  const editName = useCallback(() => {
    dispatch(dashboardActions.setIsEditingTabName({ isEditing: true, key: tabKey }))
  }, [dispatch, tabKey])

  return (
    <IconButton
      accent={Accent.TERTIARY}
      Icon={Icon.EditUnbordered}
      onClick={() => editName()}
      title="Modifier le nom du tableau de bord"
    />
  )
}
