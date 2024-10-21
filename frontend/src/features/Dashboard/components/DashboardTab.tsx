import { useAppDispatch } from '@hooks/useAppDispatch'
import { useEscapeKey } from '@hooks/useEscapeKey'
import { Icon, TextInput, useClickOutsideEffect, useNewWindow } from '@mtes-mct/monitor-ui'
import { useRef, useState } from 'react'
import styled from 'styled-components'

import { dashboardActions } from '../slice'

export function DashboardTab({
  isEditing,
  name,
  onEdit,
  tabKey
}: {
  isEditing: boolean
  name: string
  onEdit: (isEditing: boolean) => void
  tabKey: string
}) {
  const dispatch = useAppDispatch()

  const ref = useRef<HTMLDivElement>(null)
  const { newWindowContainerRef } = useNewWindow()

  const [updatedName, setUpdatedName] = useState<string | undefined>()

  const validateName = () => {
    if (updatedName) {
      dispatch(dashboardActions.setName({ key: tabKey, name: updatedName }))
      setUpdatedName(undefined)
    }
    onEdit(false)
  }

  useClickOutsideEffect(
    ref,
    () => {
      validateName()
    },
    newWindowContainerRef.current
  )
  useEscapeKey({ onEnter: () => validateName(), ref })

  const editName = e => {
    e.stopPropagation()
    e.preventDefault()
    setUpdatedName(name)
    onEdit(true)
  }

  return (
    <>
      {isEditing ? (
        <StyledTextInput
          inputRef={ref}
          isLabelHidden
          isTransparent
          label="Nom du tableau de bord"
          name="name"
          onChange={value => setUpdatedName(value)}
          value={updatedName}
        />
      ) : (
        <Container>
          <DashboardName>{name}</DashboardName>
          <Icon.EditUnbordered onClick={e => editName(e)} />
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
  max-width: 50%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
const StyledTextInput = styled(TextInput)`
  flex-grow: 1;
`
