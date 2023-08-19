import { ControlUnit, getControlUnitsAsText } from '../../../domain/entities/legacyControlUnit'

export function getResourcesCell(controlUnits: ControlUnit[]) {
  const controlUnitsAsText = controlUnits && getControlUnitsAsText(controlUnits)

  return <span title={controlUnitsAsText}>{controlUnitsAsText}</span>
}
