// import styled from 'styled-components'

import { Accent, Button, Icon } from '@mtes-mct/monitor-ui'
import { useCallback, useState } from 'react'
import styled from 'styled-components'

import { INITIAL_CONTROL_UNIT_RESOURCE_FORM_VALUES } from './constants'
import { Form } from './Form'
import { Item } from './Item'
import {
  useCreateControlUnitResourceMutation,
  useUpdateControlUnitResourceMutation
} from '../../../../../api/controlUnitResourcesAPI'
import { ControlUnit } from '../../../../../domain/entities/controlUnit'
import { isEmptyish } from '../../../../../utils/isEmptyish'
import { isNotArchived } from '../../../../../utils/isNotArchived'
import { Section } from '../shared/Section'

import type { ControlUnitResourceFormValues } from './types'

type ControlUnitResourceListProps = {
  controlUnit: ControlUnit.ControlUnit
}
export function ControlUnitResourceList({ controlUnit }: ControlUnitResourceListProps) {
  const [createControlUnitResource] = useCreateControlUnitResourceMutation()
  const [updateControlUnitResource] = useUpdateControlUnitResourceMutation()

  const [editedControlUnitResourceId, setEditedControlUnitResourceId] = useState<number | undefined>(undefined)
  const [isNewControlUnitResourceFormOpen, setIsNewControlUnitResourceFormOpen] = useState(false)

  const { controlUnitResources } = controlUnit
  const activeControlUnitResources = controlUnitResources.filter(isNotArchived)
  const editedControlUnitResource = activeControlUnitResources.find(({ id }) => id === editedControlUnitResourceId) || {
    ...INITIAL_CONTROL_UNIT_RESOURCE_FORM_VALUES,
    controlUnitId: controlUnit.id
  }
  const isFormOpen = isNewControlUnitResourceFormOpen || !!editedControlUnitResourceId

  const closeForm = useCallback(() => {
    setEditedControlUnitResourceId(undefined)
    setIsNewControlUnitResourceFormOpen(false)
  }, [])

  const createOrUpdateControlUnitResource = useCallback(
    async (controlUnitResourceFormValues: ControlUnitResourceFormValues) => {
      const controlledControlUnitResourceFormValues = {
        ...controlUnitResourceFormValues,
        // We set the resource type as the resource name if no name has been provided by the user
        name: isEmptyish(controlUnitResourceFormValues.name)
          ? ControlUnit.ControlUnitResourceTypeLabel[controlUnitResourceFormValues.type as string]
          : controlUnitResourceFormValues.name
      }

      if (isNewControlUnitResourceFormOpen) {
        await createControlUnitResource(
          controlledControlUnitResourceFormValues as ControlUnit.NewControlUnitResourceData
        )
      } else {
        await updateControlUnitResource(controlledControlUnitResourceFormValues as ControlUnit.ControlUnitResourceData)
      }

      closeForm()
    },
    [closeForm, createControlUnitResource, isNewControlUnitResourceFormOpen, updateControlUnitResource]
  )

  const openForm = useCallback(() => {
    setIsNewControlUnitResourceFormOpen(true)
  }, [])

  return (
    <Section>
      <Section.Title>Moyens</Section.Title>
      <StyledSectionBody $isEmpty={!activeControlUnitResources.length}>
        {activeControlUnitResources.map(controlUnitResource => (
          <Item
            key={controlUnitResource.id}
            controlUnitResource={controlUnitResource}
            onEdit={setEditedControlUnitResourceId}
          />
        ))}

        {isFormOpen ? (
          <Form
            initialValues={editedControlUnitResource}
            isNew={isNewControlUnitResourceFormOpen}
            onCancel={closeForm}
            onSubmit={createOrUpdateControlUnitResource}
          />
        ) : (
          <div>
            <Button accent={Accent.SECONDARY} Icon={Icon.Plus} onClick={openForm}>
              Ajouter un moyen
            </Button>
          </div>
        )}
      </StyledSectionBody>
    </Section>
  )
}

const StyledSectionBody = styled(Section.Body)<{
  $isEmpty: boolean
}>`
  padding: 24px 32px;

  > div:not(:first-child) {
    margin-top: 8px;
  }
  > div:last-child {
    margin-top: ${p => (!p.$isEmpty ? 16 : 0)}px;
  }
`
