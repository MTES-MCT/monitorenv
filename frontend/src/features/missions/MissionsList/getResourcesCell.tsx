import { ControlUnit, getControlUnitsAsText } from '../../../domain/entities/controlUnit'

export function getResourcesCell(controlUnits: ControlUnit[]) {
  const controlUnitsAsText = controlUnits && getControlUnitsAsText(controlUnits)

  return <span title={controlUnitsAsText}>{controlUnitsAsText}</span>
}
