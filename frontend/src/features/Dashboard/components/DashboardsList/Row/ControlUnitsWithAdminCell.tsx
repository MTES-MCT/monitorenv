import { useGetControlUnitsQuery } from '@api/controlUnitsAPI'
import { ExpandedRowLabel, ExpandedRowList, ExpandedRowValue } from '@components/Table/TableWithSelectableRows/style'

export function ControlUnitsWithAdminCell({ controlUnitIds }: { controlUnitIds: number[] }) {
  const { data: controlUnits } = useGetControlUnitsQuery()

  const filteredControlUnits = controlUnits?.filter(controlUnit => controlUnitIds.includes(controlUnit.id)) ?? []

  return (
    <ExpandedRowList>
      {filteredControlUnits.map(controlUnit => (
        <li key={controlUnit.id}>
          <ExpandedRowLabel>{controlUnit.administration.name}</ExpandedRowLabel>
          <ExpandedRowValue>{controlUnit.name}</ExpandedRowValue>
        </li>
      ))}
    </ExpandedRowList>
  )
}
