import { useGetAMPsQuery } from '@api/ampsAPI'

import { AMPItem } from './AMPItem'

type AMPListProps = {
  isReadOnly?: boolean
  linkedAMPs: number[]
}

export function AMPList({ isReadOnly = false, linkedAMPs }: AMPListProps) {
  const { data: AMPLayers } = useGetAMPsQuery({ withGeometry: false })
  const linkAMPLayers = linkedAMPs
    .map(ampId => AMPLayers?.entities[ampId])
    .filter(amp => !!amp)
    .sort((a, b) => a?.name.localeCompare(b?.name))

  return (
    <>
      {linkAMPLayers &&
        linkAMPLayers.length > 0 &&
        linkAMPLayers.map(amp => <AMPItem key={amp?.id} amp={amp} isReadOnly={isReadOnly} />)}
    </>
  )
}
