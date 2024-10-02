import { Item } from '@features/ControlUnit/components/ControlUnitDialog/ControlUnitResourceList/Item'
import { isNotArchived } from '@utils/isNotArchived'
import styled from 'styled-components'

import type { ControlUnit } from '@mtes-mct/monitor-ui'

export function ResourcesDetails({
  controlUnitResources
}: {
  controlUnitResources: ControlUnit.ControlUnitResource[]
}) {
  const activeControlUnitResources = controlUnitResources.filter(isNotArchived)

  return (
    <Wrapper>
      {activeControlUnitResources.map(controlUnitResource => (
        <Item key={controlUnitResource.id} controlUnitResource={controlUnitResource} />
      ))}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
`
