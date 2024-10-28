import { useAppDispatch } from '@hooks/useAppDispatch'
import { Icon } from '@mtes-mct/monitor-ui'
import { useState } from 'react'
import styled from 'styled-components'

import { dashboardActions } from '../slice'
import { TabNameInput } from './TabNameInput'

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

  const [updatedName, setUpdatedName] = useState<string | undefined>(name)

  const validateName = () => {
    if (updatedName) {
      dispatch(dashboardActions.setName({ key: tabKey, name: updatedName }))
    }
    onEdit(false)
  }

  const editName = e => {
    e.stopPropagation()
    e.preventDefault()
    setUpdatedName(name)
    onEdit(true)
  }

  return (
    <>
      {isEditing ? (
        <TabNameInput onChange={setUpdatedName} validate={validateName} value={updatedName} />
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
