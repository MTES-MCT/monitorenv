import { useGetAMPsQuery } from '@api/ampsAPI'

import { AMPItem } from './AMPItem'

type AMPListProps = {
  isReadOnly?: boolean
  linkedAMPs: number[]
}
export function AMPList({ isReadOnly = false, linkedAMPs }: AMPListProps) {
  const { data: AMPLayers } = useGetAMPsQuery()
  const linkAMPLayers = linkedAMPs.map(ampId => AMPLayers?.entities[ampId])

  return (
    <>
      {linkAMPLayers &&
        linkAMPLayers.length > 0 &&
        linkAMPLayers.map(amp => <AMPItem key={amp?.id} amp={amp} isReadOnly={isReadOnly} />)}
    </>
  )
}
