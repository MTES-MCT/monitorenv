import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useEscapeKey } from '@hooks/useEscapeKey'
import { TextInput, useClickOutsideEffect, useNewWindow } from '@mtes-mct/monitor-ui'
import { useRef, useState } from 'react'
import styled from 'styled-components'

import { dashboardActions } from '../slice'

export function DashboardTab({ name, tabKey }: { name: string; tabKey: string }) {
  const dispatch = useAppDispatch()
  const isEditing = useAppSelector(state => state.dashboard.dashboards[tabKey]?.isEditingTabName)
  const ref = useRef<HTMLInputElement>(null)

  const [updatedName, setUpdatedName] = useState<string | undefined>(name)

  const validateName = () => {
    if (updatedName) {
      dispatch(dashboardActions.setName({ key: tabKey, name: updatedName }))
    }
    if (isEditing) {
      dispatch(dashboardActions.setIsEditingTabName({ isEditing: false, key: tabKey }))
    }
  }

  const { newWindowContainerRef } = useNewWindow()

  useClickOutsideEffect(
    ref,
    () => {
      if (isEditing) {
        validateName()
      }
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
        </Container>
      )}
    </>
  )
}

const Container = styled.div`
  display: flex;
  width: 89%;
`
const DashboardName = styled.span`
  margin-right: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
const StyledTextInput = styled(TextInput)`
  flex-grow: 0.8;
`
