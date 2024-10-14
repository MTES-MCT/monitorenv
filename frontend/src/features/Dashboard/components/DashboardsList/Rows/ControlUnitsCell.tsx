import { useGetControlUnitsQuery } from '@api/controlUnitsAPI'

export function ControlUnitsCell({ controlUnitIds }: { controlUnitIds: number[] }) {
  const { data: controlUnits } = useGetControlUnitsQuery()

  const filteredControlUnits = controlUnits?.filter(controlUnit => controlUnitIds.includes(controlUnit.id)) ?? []

  const controlUnitsAsText = filteredControlUnits
    .map(controlUnit => `${controlUnit.name} (${controlUnit.administration.name})`)
    .join(' / ')

  return <span title={controlUnitsAsText}>{controlUnitsAsText}</span>
}
