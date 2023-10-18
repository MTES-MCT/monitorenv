import { Icon } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { ControlUnit } from '../../../../../domain/entities/controlUnit'

type PlaceholderProps = {
  type: ControlUnit.ControlUnitResourceType
}
export function Placeholder({ type }: PlaceholderProps) {
  const SelectedIcon = (() => {
    switch (type) {
      case ControlUnit.ControlUnitResourceType.CAR:
      case ControlUnit.ControlUnitResourceType.MOTORCYCLE:
        return Icon.Car

      case ControlUnit.ControlUnitResourceType.AIRPLANE:
      case ControlUnit.ControlUnitResourceType.DRONE:
      case ControlUnit.ControlUnitResourceType.HELICOPTER:
        return Icon.Plane

      case ControlUnit.ControlUnitResourceType.BARGE:
      case ControlUnit.ControlUnitResourceType.FAST_BOAT:
      case ControlUnit.ControlUnitResourceType.FRIGATE:
      case ControlUnit.ControlUnitResourceType.HYDROGRAPHIC_SHIP:
      case ControlUnit.ControlUnitResourceType.KAYAK:
      case ControlUnit.ControlUnitResourceType.LIGHT_FAST_BOAT:
      case ControlUnit.ControlUnitResourceType.NET_LIFTER:
      case ControlUnit.ControlUnitResourceType.PATROL_BOAT:
      case ControlUnit.ControlUnitResourceType.PIROGUE:
      case ControlUnit.ControlUnitResourceType.RIGID_HULL:
      case ControlUnit.ControlUnitResourceType.SEA_SCOOTER:
      case ControlUnit.ControlUnitResourceType.SEMI_RIGID:
      case ControlUnit.ControlUnitResourceType.SUPPORT_SHIP:
      case ControlUnit.ControlUnitResourceType.TRAINING_SHIP:
      case ControlUnit.ControlUnitResourceType.TUGBOAT:
        return Icon.FleetSegment

      case ControlUnit.ControlUnitResourceType.EQUESTRIAN:
      case ControlUnit.ControlUnitResourceType.MINE_DIVER:
      case ControlUnit.ControlUnitResourceType.NO_RESOURCE:
      case ControlUnit.ControlUnitResourceType.OTHER:
      case ControlUnit.ControlUnitResourceType.PEDESTRIAN:
      default:
        return undefined
    }
  })()

  return <Wrapper>{SelectedIcon && <SelectedIcon size={32} />}</Wrapper>
}

const Wrapper = styled.div`
  align-items: center;
  background-color: ${p => p.theme.color.lightGray};
  display: flex;
  height: 94px;
  justify-content: center;
  min-height: 94px;
  min-width: 116px;
  width: 116px;
`
