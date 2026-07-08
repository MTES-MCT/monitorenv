export function SeaFrontCell({ facade }: { facade: string }) {
  const label = facade ?? '-'

  return <span title={label}>{label}</span>
}
