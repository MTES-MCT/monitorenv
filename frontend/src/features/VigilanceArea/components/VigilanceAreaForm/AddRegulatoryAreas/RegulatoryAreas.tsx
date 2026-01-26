import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { getRegulatoryAreaTitle } from '@utils/getRegulatoryAreaTitle'

import { RegulatoryAreaItem } from './RegulatoryAreaItem'

type RegulatoryAreasProps = {
  isReadOnly?: boolean
  linkedRegulatoryAreas: number[] | undefined
}

export function RegulatoryAreas({ isReadOnly = false, linkedRegulatoryAreas }: RegulatoryAreasProps) {
  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery({ withGeometry: false })
  const regulatoryAreas = linkedRegulatoryAreas
    ?.map(regulatoryArea => regulatoryLayers?.entities[regulatoryArea])
    .filter(regulatoryArea => !!regulatoryArea)
    .sort((a, b) =>
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
