import { useGetRegulatoryAreasByIdsQuery } from '@api/regulatoryAreasAPI'
import { getRegulatoryAreaTitle } from '@utils/getRegulatoryAreaTitle'

import { RegulatoryAreaItem } from './RegulatoryAreaItem'

type RegulatoryAreasProps = {
  isReadOnly?: boolean
  linkedRegulatoryAreas: number[] | undefined
}
export function RegulatoryAreas({ isReadOnly = false, linkedRegulatoryAreas }: RegulatoryAreasProps) {
  const { data: regulatoryLayers } = useGetRegulatoryAreasByIdsQuery(linkedRegulatoryAreas ?? [], {
    skip: !linkedRegulatoryAreas || linkedRegulatoryAreas.length === 0
  })

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
