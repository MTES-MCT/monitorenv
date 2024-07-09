import { useGetAMPsQuery } from '@api/ampsAPI'

import { AMPItem } from './AMPItem'

type AMPListProps = {
  deleteAMP?: (id: number) => void
  isReadOnly?: boolean
  linkedAMPs: Array<number> | undefined
}
export function AMPList({ deleteAMP, isReadOnly = false, linkedAMPs }: AMPListProps) {
  const { data: AMPLayers } = useGetAMPsQuery()
  const linkAMPLayers = linkedAMPs?.map(ampId => AMPLayers?.entities[ampId])

  return (
    <>
      {linkAMPLayers &&
        linkAMPLayers.length > 0 &&
        linkAMPLayers.map(amp => <AMPItem key={amp?.id} amp={amp} deleteAMP={deleteAMP} isReadOnly={isReadOnly} />)}
    </>
  )
}
