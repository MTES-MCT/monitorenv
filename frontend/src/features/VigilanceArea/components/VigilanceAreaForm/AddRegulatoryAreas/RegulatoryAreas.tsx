import { useGetRegulatoryAreasByIdsQuery } from '@api/regulatoryAreasAPI'
import { getRegulatoryAreaTitle } from '@utils/getRegulatoryAreaTitle'
import { Axis } from 'types'

import { RegulatoryAreaItem } from './RegulatoryAreaItem'

type RegulatoryAreasProps = {
  isReadOnly?: boolean
  linkedRegulatoryAreas: number[] | undefined
}
export function RegulatoryAreas({ isReadOnly = false, linkedRegulatoryAreas }: RegulatoryAreasProps) {
  const { data: regulatoryLayers } = useGetRegulatoryAreasByIdsQuery(
    { axis: Axis.NORTH_SOUTH, ids: linkedRegulatoryAreas ?? [] },
    {
      skip: !linkedRegulatoryAreas || linkedRegulatoryAreas.length === 0
    }
  )

  if (!linkedRegulatoryAreas || linkedRegulatoryAreas.length === 0) {
    return null
  }

  const regulatoryAreas = [...(regulatoryLayers ?? [])].sort((a, b) =>
    (getRegulatoryAreaTitle(a?.polyName, a?.resume) ?? '').localeCompare(
      getRegulatoryAreaTitle(b?.polyName, b?.resume) ?? ''
    )
  )

  return (
    <>
      {regulatoryAreas &&
        regulatoryAreas.length > 0 &&
        regulatoryAreas.map(regulatoryArea => (
          <RegulatoryAreaItem key={regulatoryArea?.id} isReadOnly={isReadOnly} regulatoryArea={regulatoryArea} />
        ))}
    </>
  )
}
