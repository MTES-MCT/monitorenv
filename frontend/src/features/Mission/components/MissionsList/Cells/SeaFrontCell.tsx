import { SeaFrontLabel } from '../../../../../domain/entities/seaFrontType'

export function SeaFrontCell({ facade }: { facade: string }) {
  const label = facade ? SeaFrontLabel[facade] : '-'

  return <span title={label}>{label}</span>
}
