import { type LegacyControlUnit, getControlUnitsAsText } from 'domain/entities/legacyControlUnit'

export function getResourcesCell(controlUnits: LegacyControlUnit[]) {
  const controlUnitsAsText = controlUnits && getControlUnitsAsText(controlUnits)

  return <span title={controlUnitsAsText}>{controlUnitsAsText}</span>
}
