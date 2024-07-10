import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'

import { RegulatoryAreaItem } from './RegulatoryAreaItem'

type RegulatoryAreasProps = {
  deleteRegulatoryArea?: (id: number) => void
  isReadOnly?: boolean
  linkedRegulatoryAreas: Array<number> | undefined
}
export function RegulatoryAreas({
  deleteRegulatoryArea,
  isReadOnly = false,
  linkedRegulatoryAreas
}: RegulatoryAreasProps) {
  const { data: regulatoryLayers } = useGetRegulatoryLayersQuery()
  const regulatoryAreas = linkedRegulatoryAreas?.map(regulatoryArea => regulatoryLayers?.entities[regulatoryArea])

  return (
    <>
      {regulatoryAreas &&
        regulatoryAreas.length > 0 &&
        regulatoryAreas.map(regulatoryArea => (
          <RegulatoryAreaItem
            key={regulatoryArea?.id}
            deleteRegulatoryArea={deleteRegulatoryArea}
            isReadOnly={isReadOnly}
            regulatoryArea={regulatoryArea}
          />
        ))}
    </>
  )
}
