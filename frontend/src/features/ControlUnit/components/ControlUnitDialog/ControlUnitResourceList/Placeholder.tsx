import styled from 'styled-components'

import { getIconFromControlUnitResourceType } from './utils'
import { ControlUnit } from '../../../../../domain/entities/controlUnit'

type PlaceholderProps = {
  type: ControlUnit.ControlUnitResourceType
}
export function Placeholder({ type }: PlaceholderProps) {
  const SelectedIcon = getIconFromControlUnitResourceType(type)

  return <Wrapper>{SelectedIcon && <SelectedIcon size={32} />}</Wrapper>
}

const Wrapper = styled.div`
  align-items: center;
  background-color: ${p => p.theme.color.lightGray};
  display: flex;
  flex-grow: 1;
  justify-content: center;
  max-width: 116px;
  min-width: 116px;
  width: 116px;
`
