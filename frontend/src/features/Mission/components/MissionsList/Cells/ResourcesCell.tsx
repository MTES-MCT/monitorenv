import { getControlUnitsAsText, type LegacyControlUnit } from 'domain/entities/legacyControlUnit'

export function ResourcesCell({ controlUnits }: { controlUnits: LegacyControlUnit[] }) {
  const controlUnitsAsText = controlUnits && getControlUnitsAsText(controlUnits)

  return <span title={controlUnitsAsText}>{controlUnitsAsText}</span>
}
