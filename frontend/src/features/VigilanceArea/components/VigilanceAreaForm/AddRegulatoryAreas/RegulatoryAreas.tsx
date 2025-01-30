import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'

import { RegulatoryAreaItem } from './RegulatoryAreaItem'

type RegulatoryAreasProps = {
  isReadOnly?: boolean
  linkedRegulatoryAreas: number[] | undefined
}
export function RegulatoryAreas({ isReadOnly = false, linkedRegulatoryAreas }: RegulatoryAreasProps) {
  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()
  const regulatoryAreas = linkedRegulatoryAreas
    ?.map(regulatoryArea => regulatoryLayers?.entities[regulatoryArea])
    .filter(regulatoryArea => !!regulatoryArea)
    .sort((a, b) => a?.entityName.localeCompare(b?.entityName))

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
