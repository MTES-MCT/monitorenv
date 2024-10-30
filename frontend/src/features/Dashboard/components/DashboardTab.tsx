import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useEscapeKey } from '@hooks/useEscapeKey'
import {
  Accent,
  Icon,
  IconButton,
  Size,
  TextInput,
  THEME,
  useClickOutsideEffect,
  useNewWindow
} from '@mtes-mct/monitor-ui'
import { useCallback, useRef, useState, type MouseEventHandler } from 'react'
import styled from 'styled-components'

import { dashboardActions } from '../slice'

export function DashboardTab({
  close,
  name,
  tabKey
}: {
  close: MouseEventHandler<HTMLButtonElement>
  name: string
  tabKey: string
}) {
  const dispatch = useAppDispatch()
  const isEditing = useAppSelector(state => state.dashboard.dashboards[tabKey]?.isEditingTabName)
  const ref = useRef<HTMLInputElement>(null)

  const [updatedName, setUpdatedName] = useState<string | undefined>(name)

  const validateName = () => {
    if (updatedName) {
      dispatch(dashboardActions.setName({ key: tabKey, name: updatedName }))
    }
    dispatch(dashboardActions.setisEditingTabName({ isEditing: false, key: tabKey }))
  }

  const editName = useCallback(() => {
    setUpdatedName(name)
    dispatch(dashboardActions.setisEditingTabName({ isEditing: true, key: tabKey }))
  }, [dispatch, name, tabKey])

  const { newWindowContainerRef } = useNewWindow()

  useClickOutsideEffect(
    ref,
    () => {
      validateName()
    },
    newWindowContainerRef.current
  )

  useEscapeKey({ onEnter: () => validateName(), ref })

  return (
    <>
      {isEditing ? (
        <StyledTextInput
          autoFocus
          inputRef={ref}
          isLabelHidden
          isTransparent
          label="Nom du tableau de bord"
          name="name"
          onChange={setUpdatedName}
          value={updatedName}
        />
      ) : (
        <Container>
          <DashboardName title={name}>{name}</DashboardName>
          <Icon.EditUnbordered onClick={() => editName()} />
        </Container>
      )}
      <IconButton
        accent={Accent.TERTIARY}
        color={THEME.color.slateGray}
        Icon={Icon.Close}
        onClick={close}
        size={Size.SMALL}
        title={`Fermer ${name}`}
      />
    </>
  )
}

const Container = styled.div`
  display: flex;
  width: 89%;
`
const DashboardName = styled.span`
  margin-right: 16px;
  max-width: 50%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
const StyledTextInput = styled(TextInput)`
  flex-grow: 1;
`
