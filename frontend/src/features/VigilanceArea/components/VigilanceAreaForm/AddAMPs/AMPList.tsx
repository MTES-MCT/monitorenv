import { useGetAMPsByIdsQuery } from '@api/ampsAPI'

import { AMPItem } from './AMPItem'
import { Axis } from '../../../../../types'

type AMPListProps = {
  isReadOnly?: boolean
  linkedAMPs: number[]
}
export function AMPList({ isReadOnly = false, linkedAMPs }: AMPListProps) {
  const { data: amps } = useGetAMPsByIdsQuery({
    axis: Axis.NORTH_SOUTH,
    ids: linkedAMPs
  })
  const linkAMPLayers = [...(amps ?? [])].sort((a, b) => a?.name.localeCompare(b?.name))

  return (
    <>
      {linkAMPLayers &&
        linkAMPLayers.length > 0 &&
        linkAMPLayers.map(amp => <AMPItem key={amp?.id} amp={amp} isReadOnly={isReadOnly} />)}
    </>
  )
}
