// import styled from 'styled-components'

import { Accent, Button, Icon } from '@mtes-mct/monitor-ui'
import { useCallback, useState } from 'react'
import styled from 'styled-components'

import { Form } from './Form'
import { Item } from './Item'
import { Section } from '../shared/Section'

import type { ControlUnitResourceFormValues } from './types'
import type { Base } from '../../../../domain/entities/Base/types'
import type { ControlUnit } from '../../../../domain/entities/ControlUnit/types'

export type ControlUnitResourceListProps = {
  controlUnitResources: Array<
    ControlUnit.ControlUnitResourceData & {
      base: Base.BaseData
    }
  >
}
export function ControlUnitResourceList({ controlUnitResources }: ControlUnitResourceListProps) {
  const [editedControlUnitResourceId, setEditedControlUnitResourceId] = useState<number | undefined>(undefined)
  const [isNewControlUnitResourceFormOpen, setIsNewControlUnitResourceFormOpen] = useState(false)

  const editedControlUnitResource = controlUnitResources.find(({ id }) => id === editedControlUnitResourceId)
  const isFormOpen = !!editedControlUnitResource || isNewControlUnitResourceFormOpen

  const closeForm = useCallback(() => {
    setEditedControlUnitResourceId(undefined)
    setIsNewControlUnitResourceFormOpen(false)
  }, [])

  const createOrUpdateControlUnitResource = useCallback(
    (controlUnitResourceFormValues: ControlUnitResourceFormValues) => {
      // eslint-disable-next-line no-console
      console.log(controlUnitResourceFormValues)

      setEditedControlUnitResourceId(undefined)
      setIsNewControlUnitResourceFormOpen(false)
    },
    []
  )

  const openForm = useCallback(() => {
    setIsNewControlUnitResourceFormOpen(true)
  }, [])

  return (
    <Section>
      <Section.Title>Moyens</Section.Title>
      <StyledSectionBody>
        {controlUnitResources.map(controlUnitResource => (
          <Item
            key={controlUnitResource.id}
            controlUnitResource={controlUnitResource}
            onEdit={setEditedControlUnitResourceId}
          />
        ))}

        {isFormOpen ? (
          <Form
            initialValues={editedControlUnitResource}
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

const StyledSectionBody = styled(Section.Body)`
  > div:not(:first-child) {
    margin-top: 8px;
  }
  > div:last-child {
    margin-top: 16px;
  }
`
